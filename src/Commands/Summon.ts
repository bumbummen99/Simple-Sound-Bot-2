import { CacheType, CommandInteraction, GuildChannel, GuildMember } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import ConnectionManager from "../Player/ConnectionManager";
import container from "../IoC/Container";
import PlayerManager from "../Player/PlayerManager";
import { sleep } from "../Util";

export default class Summon extends Command {
    constructor() {
        super(
            'summon',
            'Summon the bot in the current channel.'
        );
    }

    async exec(interaction: CommandInteraction<CacheType>) {
        if (! interaction.guild || ! interaction.member || ! (interaction.member instanceof GuildMember) || ! await Summon.isGuildInteraction(interaction)) {
            return;
        }
        
        /* Join the members voice channel */
        if (! interaction.member.voice.channel) {
            await interaction.editReply('You have to be in a voice channel to do that.');
            return;
        }

        /* Get the guilds player */
        const player = container.get<PlayerManager>(IoCTypes.PlayerManager).get(interaction.guild);

        /* Join the guild player to the channel */
        player.player.connect(interaction.member.voice.channel.id)

        await sleep(3000);

        /* Notify the user */
        if (player.player.connected) {
            interaction.editReply(`Joined channel "${interaction.member.voice.channel.name}"`);
        } else {
            interaction.editReply(`Player is not connected`);
        }

        
    }
}