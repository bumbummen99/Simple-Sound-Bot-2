import { CacheType, CommandInteraction, Guild } from "discord.js";
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
        container.get<PlayerManager>(IoCTypes.PlayerManager)
                 .get(interaction.guild as Guild)
                 .skip();

        await interaction.editReply('Skipped current track.');
    }
}