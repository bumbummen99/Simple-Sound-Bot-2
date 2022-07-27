import { CacheType, ChatInputCommandInteraction, DiscordAPIError } from "discord.js";
import AppAdminCommand from "./Abstract/AppAdminCommand";

export default class Name extends AppAdminCommand {
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

    async exec(interaction: ChatInputCommandInteraction<CacheType>) {
        const name = interaction.options.getString('name');

        if (name) {
            try {
                await interaction.guild?.client.user?.setUsername(name);
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