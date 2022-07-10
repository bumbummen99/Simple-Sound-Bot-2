import { CacheType, CommandInteraction } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import container from "../IoC/Container";
import PlayerManager from "../Player/PlayerManager";


export default class Skip extends Command {
    constructor() {
        super(
            'skip',
            'Skip the current playback.'
        );
    }

    async exec(interaction: CommandInteraction<CacheType>) {
        if (! interaction.guild || ! await Skip.isGuildInteraction(interaction)) {
            return;
        }

        container.get<PlayerManager>(IoCTypes.PlayerManager)
                 .get(interaction.guild)
                 .skip();

        await interaction.editReply('Skipped current track.');
    }
}