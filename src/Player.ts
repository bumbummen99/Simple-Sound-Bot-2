import { Track, TrackEndReason } from '@lavaclient/types';
import container from "./IoC/Container";
import { IoCTypes } from "./IoC/IoCTypes";
import { Guild } from "discord.js";
import { Cluster, ClusterNode, Player as LavalinkPlayer } from "lavaclient";
import QueueManager from "./Player/QueueManager";

export default class Player
{
    guild: Guild

    player: LavalinkPlayer<ClusterNode>;
    resume: Track|null = null;

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
            if (this.resume) {
                /* Continue resume track */
                await this.player.play(this.resume);

                await this.player.seek(this.resume.info.position);

                /* Null resume so that we dont resume again */
                this.resume = null;
            } else {
                /* Skip to next track in queue (If it has one) */
                this.skip();
            }
        }
    }

    playTTS(track: Track): void
    {
        /* Check if there already is playback */
        if (this.player.playing) {
            /* Pause the current playback */
            this.player.pause();

            /* Set resume track (if player has track set) */
            if (this.player.track && this.player.trackData) {
                console.log(`Track pos: ${this.player.accuratePosition ?? 0}, Track playedSince: ${this.player.playingSince}`);
                this.resume = {
                    track: this.player.track,
                    info: this.player.trackData
                };

                this.resume.info.position = this.player.accuratePosition ?? 0;
            }
        }

        this.player.play(track);
    }

    skip() {
        const track = container.get<QueueManager>(IoCTypes.QueueManager)
                               .next(this.guild);

        this.player.stop();

        if (track) {
            this.player.play(track);
        } else {
            console.debug('No track queued');
        }
    }
}