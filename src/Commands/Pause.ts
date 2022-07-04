import { CacheType, CommandInteraction } from "discord.js";
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
        if (interaction.guild) {
            /* Stop the playback */
            const player = container.get<PlayerManager>(IoCTypes.PlayerManager).get(interaction.guild);
            player.pause();
        }        
    }
}