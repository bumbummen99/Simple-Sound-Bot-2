import { AudioPlayer, AudioPlayerStatus, createAudioPlayer } from "@discordjs/voice";
import { Guild, Snowflake } from "discord.js";
import { injectable } from "inversify";
import container from "../IoC/Container";
import { IoCTypes } from "../IoC/IoCTypes";
import ConnectionManager from "./ConnectionManager";
import QueueManager from "./QueueManager";

@injectable()
export default class PlayerManager {
    music: {[key: Snowflake]: AudioPlayer} = {};
    tts: {[key: Snowflake]: AudioPlayer} = {};

    get(guild: Guild, type: 'music' | 'tts' = 'music'): AudioPlayer
    {
        if (! this[type][guild.id]) {
            const player = createAudioPlayer();

            player.on('stateChange', e => {
                if (e.status === AudioPlayerStatus.Idle) {
                    /* Get next track from queue */
                    const next = container.get<QueueManager>(IoCTypes.QueueManager).next(guild);

                    /* Play the next track if there is one */
                    if (next) {
                        /* Get the (music) player */
                        const player = container.get<PlayerManager>(IoCTypes.PlayerManager).get(guild);

                        /* Subscribe the guild VoiceConnection to the player */
                        const voiceConnection = container.get<ConnectionManager>(IoCTypes.ConnectionManager).get(guild);
                        if (voiceConnection) {
                            voiceConnection.subscribe(player);
                            player.play(next);
                        }                      
                    }
                }
            });

            this[type][guild.id] = player;
        }

        return this[type][guild.id];
    }
}
