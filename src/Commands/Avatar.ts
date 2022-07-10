import { CacheType, CommandInteraction } from "discord.js";
import Command from "./Abstract/Command";

export default class Avatar extends Command {
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

    async exec(interaction: CommandInteraction<CacheType>) {
        if (! interaction.guild || ! await Avatar.isGuildInteraction(interaction)) {
            return;
        }

        const url = interaction.options.getString('url');

        interaction.guild.client.user?.setAvatar(url);

        await interaction.editReply('As you demand.');
    }
}