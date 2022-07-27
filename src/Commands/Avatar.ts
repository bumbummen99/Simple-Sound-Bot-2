import { CacheType, ChatInputCommandInteraction } from "discord.js";
import AppAdminCommand from "./Abstract/AppAdminCommand";

export default class Avatar extends AppAdminCommand {
    constructor() {
        super(
            'avatar',
            'Change the bot avatar.',
            [
                {
                    type: 'string',
                    name: 'url',
                    description: 'Url to the avatar image.',
                    required: true
                }
            ]
        );
    }

    async exec(interaction: ChatInputCommandInteraction<CacheType>) {
        const url = interaction.options.getString('url');

        interaction.guild?.client.user?.setAvatar(url);

        await interaction.editReply('As you demand.');
    }
}