"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const voice_1 = require("@discordjs/voice");
class ConnectionManager {
    clients;
    /**
     * Join the provided channel and store the VoiceConnection internally.
     *
     * @param channel
     */
    join(channel) {
        return new Promise((resolve, reject) => {
            const failed = () => {
                this.leave(channel.guild);
                reject();
            };
            this.clients[channel.guild.id] = (0, voice_1.joinVoiceChannel)({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
            });
            /* Timeout if we are not connected fast enough */
            const timeout = setTimeout(failed, 1000 * 3);
            /* Attach listeners to decide when connection is read or broken */
            this.clients[channel.guild.id]
                .once('error', failed)
                .once(voice_1.VoiceConnectionStatus.Ready, () => {
                clearTimeout(timeout);
                resolve(this.clients[channel.guild.id]);
            });
        });
    }
    get(guild) {
        return this.clients[guild.id] ?? null;
    }
    /**
     * Leave any channel for that guild and destroy the client gracefully.
     *
     * @param guild
     */
    leave(guild) {
        /* Destroy gracefully */
        this.clients[guild.id].destroy();
        /* Remove the VoiceConnection competely */
        delete this.clients[guild.id];
    }
}
exports.default = ConnectionManager;
