import { CacheType, ChatInputCommandInteraction, Guild } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import container from "../IoC/Container";
import PlayerManager from "../Player/PlayerManager";

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

    async exec(interaction: ChatInputCommandInteraction<CacheType>) {
        const volume = interaction.options.getNumber('volume') as number;

        /* Update the volume */
        container.get<PlayerManager>(IoCTypes.PlayerManager)
                 .get(interaction.guild as Guild)
                 .player.setVolume(volume);

        /* Inform the user about the new volume */
        await interaction.editReply(`Set bot volume to ${volume}`);
    }
}