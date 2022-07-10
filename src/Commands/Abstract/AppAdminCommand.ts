import { CacheType, CommandInteraction } from "discord.js";
import Command from "./Command";

export default abstract class AppAdminCommand extends Command
{
    async check(interaction: CommandInteraction<CacheType>): Promise<boolean>
    {
        if (! interaction.guild || ! interaction.member || ! process.env.APP_ADMINS) {
            return false;
        }
        return await super.check(interaction) && process.env.APP_ADMINS.split(',').includes(interaction.member.user.id);
    }
}