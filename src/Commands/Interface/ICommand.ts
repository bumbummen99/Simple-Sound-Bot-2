import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";

export default interface ICommand {
    slashCommand(): SlashCommandBuilder;

    execute(interaction: CommandInteraction<CacheType>): Promise<void>;

    exec(interaction: CommandInteraction<CacheType>): Promise<any>;
}