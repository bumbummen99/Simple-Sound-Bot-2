import { CacheType, CommandInteraction } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import QueueManager from "../Player/QueueManager";
import container from "../IoC/Container";

export default class Volume extends Command {
    constructor() {
        super(
            'volume',
            'Adjust the volume of the playback.',
            [
                {
                    type: 'number',
                    name: 'volume',
                    description: 'The volume you want to set the bot to.',
                    required: true
                }
            ]
        );
    }

    async exec(interaction: CommandInteraction<CacheType>) {
        if (! interaction.guild || ! await Volume.isGuildInteraction(interaction)) {
            return;
        }

        const volume = interaction.options.getNumber('volume');

        if (! volume) {
            await interaction.editReply('You have to provide a valid volume.');
            return;
        }

        /* Update the volume */
        container.get<QueueManager>(IoCTypes.QueueManager).setVolume(interaction.guild, volume);

        /* Inform the user about the new volume */
        await interaction.editReply(`Set bot volume to ${volume}`);
    }
}