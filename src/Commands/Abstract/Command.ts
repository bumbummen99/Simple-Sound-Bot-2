import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction, GuildMember, Interaction } from "discord.js";
import container from "../../IoC/Container";
import { IoCTypes } from "../../IoC/IoCTypes";
import { ucfirst } from "../../Util";

declare type Option = {
    type: 'attachment' | 'boolean' | 'channel' | 'mentionable' | 'number' | 'role' | 'string' | 'user',
    name: string,
    description: string,
    required?: boolean
}

export default abstract class Command {
    command: string;
    description: string;
    options: Option[]

    client: Client

    constructor(command: string, description: string, options: Option[] = []) {
        this.command = command;
        this.description = description;
        this.options = options;

        if (options.length > 25) {
            throw new Error('Commands can have a maximum of 25 options!');
        }

        this.client = container.get<Client>(IoCTypes.Client);
    }

    slashCommand(): SlashCommandBuilder
    {
        /* Configure the command */
        const builder = new SlashCommandBuilder()
            .setName(this.command)
            .setDescription(this.description);

        /* Add slash command options */
        for (const option of this.options) {
            builder[`add${ucfirst(option.type)}Option`]((o: SlashCommandStringOption) =>
                o.setName(option.name)
                 .setDescription(option.description)
                 .setRequired(option.required ?? false)
            );
        }

        return builder;
    }

    async execute(interaction: CommandInteraction<CacheType>): Promise<void>
    {
        /* Make sure we are in a guild cannel */
        if (interaction.inGuild() && interaction.member instanceof GuildMember) {
            try {

                if (await this.check(interaction)) {
                    await this.exec(interaction);
                }
            } catch (e) {
                /* Inform user that an error did occur */
                await interaction.reply('Sorry, omething went wrong.');

                /* Re-throw the exception */
                throw e;
            }
        }

        /* Only join guild channels, inform user */
        return interaction.reply('Sorry, i can only do that a guild channel.');
    }

    async check(interaction: CommandInteraction<CacheType>): Promise<boolean>
    {
        /* Make sure we are in a guild cannel */
        if (interaction.inGuild() && interaction.member instanceof GuildMember) {
            await interaction.reply('Sorry, omething went wrong.');
            return true;
        }

        /* Only join guild channels, inform user */
        await interaction.reply('Sorry, i can only do that a guild channel.');
        return false;
    }

    abstract exec(interaction: CommandInteraction<CacheType>): Promise<any>;

    static async isGuildInteraction(interaction: CommandInteraction<CacheType>): Promise<boolean>
    {
        if (interaction.inGuild() || interaction.member instanceof GuildMember || interaction.guild || interaction.member) {
            return true;
        }

        await interaction.editReply('You have to be in a guild channel to do that.');

        return false;
    }
}