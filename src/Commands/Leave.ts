import { CacheType, CommandInteraction } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import container from "../IoC/Container";
import PlayerManager from "../Player/PlayerManager";

export default class Leave extends Command {
    constructor() {
        super(
            'leave',
            'Leave the current channel.'
        );
    }

    async exec(interaction: CommandInteraction<CacheType>) {
        if (! interaction.guild || ! await Leave.isGuildInteraction(interaction)) {
            return;
        }
        
        /* Disconnect the guilds player */
        container.get<PlayerManager>(IoCTypes.PlayerManager)
                 .get(interaction.guild)
                 .player.disconnect();

        interaction.editReply('Bye');
    }
}