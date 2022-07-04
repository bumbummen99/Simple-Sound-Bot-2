import { CacheType, CommandInteraction } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import QueueManager from "../Player/QueueManager";
import PlayerManager from "../Player/PlayerManager";
import container from "../IoC/Container";

export default class Stop extends Command {
    constructor() {
        super(
            'stop',
            'stop the current plöyback.'
        );
    }

    async exec(interaction: CommandInteraction<CacheType>) {
        if (! interaction.guild) {
            return;
        }
        
        /* Stop the playback */
        const playerManager = container.get<PlayerManager>(IoCTypes.PlayerManager);
        const player = playerManager.get(interaction.guild);
        player.stop();

        /* Remove from queue */
        const queueManager = container.get<QueueManager>(IoCTypes.QueueManager);
        queueManager.next(interaction.guild);
    }
}