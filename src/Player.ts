import { AudioPlayer, AudioPlayerState, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, PlayerSubscription } from "@discordjs/voice";
import container from "./IoC/Container";
import { IoCTypes } from "./IoC/IoCTypes";
import QueueManager from "./Player/QueueManager";
import { Guild } from "discord.js";
import Ffmpeg from 'fluent-ffmpeg';
import { Metadata } from "./Metadata";
import path from 'path';
import fs from 'fs';

export default class Player
{
    guild: Guild

    player: AudioPlayer;
    tts: null|AudioResource<Metadata> = null

    constructor(guild: Guild) {
        /* Create unique identifier for this player (Snowflake, Radio-URL, whatever) */
        this.guild = guild;

        /* Create new player instance and subscribe */
        this.player = createAudioPlayer();
        this.player.on('stateChange', this._onStateChanged);
        this.player.on('subscribe', this._onScubscribed);
        this.player.on('unsubscribe', this._onUnsubscribed);
        process.env.DEBUG && this.player.on('debug', console.debug);
    }

    private _onScubscribed = (subscription: PlayerSubscription) => {
        // TODO
        console.debug(`[Player] Connection subscribed to Player for guild ${this.guild.id}`);
    }

    private _onUnsubscribed = (subscription: PlayerSubscription) => {
        // TODO
        console.debug(`[Player] Connection unsubscribed from Player for guild ${this.guild.id}`);
    }

    private _onStateChanged = async (oldState: AudioPlayerState, newState: AudioPlayerState) => {
        /* Case: Playback finished */
        if (oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle) {
            /* Get the current (if tts was set) or next music resource */
            let resource;

            /* Check if TTS resource is set, that does mean that previous playback was TTS */
            if (this.tts) {
                /* Reset the TTS resource as it has finished */
                this.tts = null;
                resource = container.get<QueueManager>(IoCTypes.QueueManager).get(this.guild);
            } else {
                resource = container.get<QueueManager>(IoCTypes.QueueManager).next(this.guild)
            }

            /* Play the resource (if there is one) */
            if (resource instanceof AudioResource<Metadata>) {
                this.player.play(resource);
            }
        }
    }

    async playTTS(resource: AudioResource<Metadata>): Promise<void>
    {
        /* Pause playback (if there was any) */
        this.player.pause();
        
        /* Get current playback and replace it */
        const currentResource = container.get<QueueManager>(IoCTypes.QueueManager).get(this.guild);
        if (currentResource) {
            let file = currentResource.metadata.file;

            /* Move the old seek file */
            if (file === this.getSeekPath()) {
                file = this.getSeekPath() + 'old.mp3';
                fs.renameSync(this.getSeekPath(), file);
            }
            
            /* Seek the current playback file and save it to the guilds seek path */
            await new Promise((resolve, reject) => {
                console.log(`Input file for FFMPEG is ${file}`)
                console.log(`Output file for FFMPEG is ${this.getSeekPath()}`)
                Ffmpeg(file, {
                    logger: console
                })
                    .inputFormat('mp3')
                    .setStartTime(currentResource.playbackDuration / 1000)
                    .outputFormat('mp3')
                    .on('start', e => console.log('Started: ' + JSON.stringify(e)))
                    .on('progress', e => console.log('Progress: ' + JSON.stringify(e)))
                    .on('error', reject)
                    .on('end', resolve)
                    .save(this.getSeekPath())
                    .run();

                /* Remove the old seek file */
                if (file.endsWith('old.mp3')) {
                    fs.rmSync(file);
                }
            });
            

            /* Create a new (seeked) resource and queue it to the guild */
            container.get<QueueManager>(IoCTypes.QueueManager).replace(this.guild, Player.createAudioResource({
                file: this.getSeekPath()
            }))
        }

        /* Update the TTS resource */
        this.tts = resource;

        /* Play the TTS resource */
        this.player.play(this.tts);
    }

    skip(): void
    {
        /* Stop current playback */
        this.player.stop()

        /* Get next track from queue */
        const resource = container.get<QueueManager>(IoCTypes.QueueManager).next(this.guild);

        /* Play the track (if there is one) */
        if (resource) {
            this.player.play(resource);   
        }
    }

    static createAudioResource(metadata: Metadata): AudioResource<Metadata>
    {
        return createAudioResource<Metadata>(metadata.file, {
            inlineVolume: true, // Allow to change volume
            metadata: metadata, // Add our metadata to access later on
        });
    }

    getSeekPath() {
        return path.resolve(path.join(process.cwd(), `storage/tts/${this.guild.id}.mp3`));
    }
}