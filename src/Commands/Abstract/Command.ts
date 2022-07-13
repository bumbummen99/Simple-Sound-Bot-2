import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction, GuildMember, Interaction } from "discord.js";
import ChannelRestrictionError from "../../Errors/ChannelRestrictionError";
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
        /* Check access to the command first */
        await this.check(interaction)

        /* Ececute the command logic */
        await this.exec(interaction);
    }

    async check(interaction: CommandInteraction<CacheType>): Promise<void>
    {
        /* Make sure that we are in a guild channel and we have a guild member */
        if (! interaction.inGuild() || ! (interaction.member instanceof GuildMember)) {
            throw new ChannelRestrictionError('This command can only be run in a guild channel');
        }
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