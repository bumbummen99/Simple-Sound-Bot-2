import { joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { Guild, GuildChannel, Snowflake } from "discord.js";
import { injectable } from "inversify";

@injectable()
export default class ConnectionManager {
    clients: {[key: Snowflake]: VoiceConnection} = {};

    /**
     * Join the provided channel and store the VoiceConnection internally.
     * 
     * @param channel
     */
    join(channel: GuildChannel): Promise<VoiceConnection> {
        return new Promise<VoiceConnection>((resolve, reject) => {
            const failed = () => {
                this.leave(channel.guild);
                reject()
            };

            this.clients[channel.guild.id] = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: false, // Undeaf as default
                selfMute: false  // Unmute as default
            });

            /* Timeout if we are not connected fast enough */
            const timeout = setTimeout(failed, 1000 * 3);

            /* Attach listeners to decide when connection is read or broken */
            this.clients[channel.guild.id]
            .once('error', failed)
            .once(VoiceConnectionStatus.Ready, () => {
                console.info(`Joined channel ${channel.id} in guild ${channel.guild.id}`)
                clearTimeout(timeout);
                resolve(this.clients[channel.guild.id]);
            });
        });
    }

    get(guild: Guild): VoiceConnection|null
    {
        return this.clients[guild.id] ?? null;
    }

    /**
     * Leave any channel for that guild and destroy the client gracefully.
     * 
     * @param guild 
     */
    leave(guild: Guild) {
        /* Destroy gracefully */
        this.clients[guild.id].destroy();

        /* Remove the VoiceConnection competely */
        delete this.clients[guild.id];
    }
}
