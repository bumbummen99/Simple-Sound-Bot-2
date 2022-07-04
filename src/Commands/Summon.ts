import { CacheType, CommandInteraction, GuildChannel, GuildMember } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import ConnectionManager from "../Player/ConnectionManager";
import container from "../IoC/Container";

export default class Summon extends Command {
    constructor() {
        super(
            'summon',
            'Summon the bot in the current channel.'
        );
    }

    async exec(interaction: CommandInteraction<CacheType>) {
        if (! interaction.guild || ! interaction.member || ! (interaction.member instanceof GuildMember)) {
            return;
        }
        
        /* Join the members voice channel */
        const connectionManager = container.get<ConnectionManager>(IoCTypes.ConnectionManager);
        if (! interaction.member.voice.channel) {
            await interaction.reply('You have to be in a voice channel to do that.');
            return;
        }

        await connectionManager.join(interaction.member.voice.channel as  GuildChannel);

        interaction.reply(`Joined channel "${interaction.member.voice.channel.name}"`)
    }
}