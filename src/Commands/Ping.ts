import { CacheType, ChatInputCommandInteraction, Message } from "discord.js";
import Command from "./Abstract/Command";

export default class Ping extends Command {
    constructor() {
        super(
            'ping',
            'Shows the ping of the client.'
        );
    }

    async exec(interaction: ChatInputCommandInteraction<CacheType>) {
        const sent = await interaction.editReply({
            content: 'Pong!',
        }) as Message;
        
        await interaction.editReply({
            content: `Pong!\nBot Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms, \nWebsocket Latency: ${this.client.ws.ping}ms`
        });
    }
}
