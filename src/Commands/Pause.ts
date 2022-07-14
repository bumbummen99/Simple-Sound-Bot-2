import { CacheType, CommandInteraction, Guild } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import PlayerManager from "../Player/PlayerManager";
import container from "../IoC/Container";

export default class Pause extends Command {
    constructor() {
        super(
            'pause',
            'pause the current plöyback.'
        );
    }

    async exec(interaction: CommandInteraction<CacheType>) {
        /* Stop the playback */
        container.get<PlayerManager>(IoCTypes.PlayerManager)
                 .get(interaction.guild as Guild)
                 .player.pause();

        await interaction.editReply('Playback paused.');
    }
}