import { CacheType, CommandInteraction } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import PlayerManager from "../Player/PlayerManager";
import container from "../IoC/Container";

export default class Resume extends Command {
    constructor() {
        super(
            'resume',
            'Resume the current plöyback.'
        );
    }

    async exec(interaction: CommandInteraction<CacheType>) {
        if (! interaction.guild) {
            return;
        }

        /* Stop the playback */
        const player = container.get<PlayerManager>(IoCTypes.PlayerManager).get(interaction.guild);
        player.unpause();

        await interaction.editReply('Playback resumed.');
    }
}