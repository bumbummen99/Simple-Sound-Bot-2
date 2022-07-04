"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voice_1 = require("@discordjs/voice");
const Container_1 = __importDefault(require("../IoC/Container"));
const IoCTypes_1 = require("../IoC/IoCTypes");
class PlayerManager {
    music;
    tts;
    get(guild, type = 'music') {
        if (!this[type][guild.id]) {
            const player = (0, voice_1.createAudioPlayer)();
            player.on('stateChange', e => {
                if (e.status === voice_1.AudioPlayerStatus.Idle) {
                    /* Get next track from queue */
                    const next = Container_1.default.get(IoCTypes_1.IoCTypes.QueueManager).next(guild);
                    /* Play the next track if there is one */
                    if (next) {
                        /* Get the (music) player */
                        const player = Container_1.default.get(IoCTypes_1.IoCTypes.PlayerManager).get(guild);
                        /* Subscribe the guild VoiceConnection to the player */
                        const voiceConnection = Container_1.default.get(IoCTypes_1.IoCTypes.ConnectionManager).get(guild);
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
exports.default = PlayerManager;
