import { CacheType, CommandInteraction, DiscordAPIError } from "discord.js";
import Command from "./Abstract/Command";

export default class Name extends Command {
    constructor() {
        super(
            'name',
            'Change the bot name.',
            [
                {
                    type: 'string',
                    name: 'name',
                    description: 'New name for the bot.',
                    required: true
                }
            ]
        );
    }

    async exec(interaction: CommandInteraction<CacheType>) {
        if (! interaction.guild || ! await Name.isGuildInteraction(interaction)) {
            return;
        }

        const name = interaction.options.getString('name');

        if (name) {
            try {
                await interaction.guild.client.user?.setUsername(name);
            } catch (error) {
                if (error instanceof DiscordAPIError) {
                    await interaction.editReply(`Could not set name. Error: ${error.message}.`);
                    return;
                }
            }
        }

        await interaction.editReply('As you demand.');
    }
}