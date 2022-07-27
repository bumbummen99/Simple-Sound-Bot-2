import { CacheType, ChatInputCommandInteraction } from "discord.js";
import AuthorizationError from "../../Errors/AuthorizationError";
import ChannelRestrictionError from "../../Errors/ChannelRestrictionError";
import Command from "./Command";

export default abstract class AppAdminCommand extends Command
{
    async check(interaction: ChatInputCommandInteraction<CacheType>): Promise<void>
    {
        /* Always check the super first */
        await super.check(interaction);

        if (! interaction.guild || ! interaction.member || ! process.env.APP_ADMINS) {
            throw new ChannelRestrictionError('This command can only be run in a guild channel');
        }

        if (! process.env.APP_ADMINS.split(',').includes(interaction.member.user.id)) {
            throw new AuthorizationError('Access to this command is restricted to bot administrators.');
        }
    }
}