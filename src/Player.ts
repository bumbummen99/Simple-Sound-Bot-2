import { Track, TrackEndReason } from '@lavaclient/types/v3';
import container from "./IoC/Container";
import { IoCTypes } from "./IoC/IoCTypes";
import { Guild } from "discord.js";
import { Cluster, ClusterNode, Player as LavalinkPlayer } from "lavaclient";
import QueueManager from "./Player/QueueManager";

export default class Player
{
    /**
     * Guild this player is playing on
     */
    guild: Guild

    /**
     * Instance of the player
     */
    player: LavalinkPlayer<ClusterNode>;

    /**
     * Track to resume (after tts)
     */
    currentTrack: Track|null = null;

    /**
     * Position to resume currentTrack at (after tts)
     */
    resume: number|null = null;

    repeat: boolean = false;

    constructor(guild: Guild) {
        /* Create unique identifier for this player (Snowflake, Radio-URL, whatever) */
        this.guild = guild;

        /* Create new player instance and subscribe */
        this.player = container.get<Cluster>(IoCTypes.Lavalink).createPlayer(this.guild.id);

        /* Attach event listeners */
        this.player.on('trackEnd', this._onTrackEnd);
    }

    private _onTrackEnd = async (track: null | string, reason: TrackEndReason) => {
        /* Previous track has finished */
        if (reason === TrackEndReason.Finished) {
            if (this.currentTrack && this.resume) {
                /* Continue resume track */
                await this.play(this.currentTrack);

                await this.player.seek(this.resume);

                /* Null resume so that we dont resume again */
                this.resume = null;
            } else {
                /* Check if we should repeat */
                if (this.repeat) {
                    console.debug('Repeat is on, checking availability of track...');

                    /* Repoeat current track if there is one */
                    if (this.currentTrack) {
                        await this.play(this.currentTrack);
                        console.debug('Repeated current track.');

                        return;
                    } else {
                        console.debug('No track available, continue as usual...');
                    }
                }
                
                /* Skip to next track in queue (If it has one) */
                this.skip();
            }
        }
    }

    async play(track: Track): Promise<void>
    {
        /* Play the track */
        await this.player.play(track);
        
        /* Update the current track */
        this.currentTrack = track;
    }

    playTTS(track: Track): void
    {
        /* Check if there already is playback */
        if (this.player.playing) {
            /* Pause the current playback */
            this.player.pause();

            /* Set resume position if it is available */
            if (this.currentTrack && this.player.accuratePosition) {
                this.resume = this.player.accuratePosition;
            }
        }

        /* Play tts track directly */
        this.player.play(track);
    }

    skip() {
        const track = container.get<QueueManager>(IoCTypes.QueueManager)
                               .next(this.guild);

        this.player.stop();

        if (track) {
            this.play(track);
        } else {
            console.debug('No track queued');
        }
    }

    toggleRepeat(repeat: boolean = !this.repeat): boolean
    {
        this.repeat = repeat;
        return this.repeat;
    }
}