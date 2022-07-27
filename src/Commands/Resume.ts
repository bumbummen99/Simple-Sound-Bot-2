import { CacheType, ChatInputCommandInteraction, Guild } from "discord.js";
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

    async exec(interaction: ChatInputCommandInteraction<CacheType>) {
        /* Stop the playback */
        const player = container.get<PlayerManager>(IoCTypes.PlayerManager).get(interaction.guild as Guild);
        player.player.resume();

        await interaction.editReply('Playback resumed.');
    }
}