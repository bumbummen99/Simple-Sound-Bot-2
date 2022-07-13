import { CacheType, CommandInteraction } from "discord.js";
import Command from "./Command";

export default abstract class AppAdminCommand extends Command
{
    async check(interaction: CommandInteraction<CacheType>): Promise<boolean>
    {
        if (! interaction.guild || ! interaction.member || ! process.env.APP_ADMINS) {
            return false;
        }

        if (! await super.check(interaction)) {
            return false;
        }

        if (! process.env.APP_ADMINS.split(',').includes(interaction.member.user.id)) {
            interaction.editReply('You are not allowed to use this command.');

            return false;
        }

        return true;
    }
}