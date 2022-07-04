"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const Container_1 = __importDefault(require("../../IoC/Container"));
const IoCTypes_1 = require("../../IoC/IoCTypes");
const Util_1 = require("../../Util");
class Command {
    command;
    description;
    options;
    client;
    constructor(command, description, options = []) {
        this.command = command;
        this.description = description;
        this.options = options;
        if (options.length > 25) {
            throw new Error('Commands can have a maximum of 25 options!');
        }
        this.client = Container_1.default.get(IoCTypes_1.IoCTypes.Client);
    }
    slashCommand() {
        /* Configure the command */
        const builder = new builders_1.SlashCommandBuilder()
            .setName(this.command)
            .setDescription(this.description);
        /* Add slash command options */
        for (const option of this.options) {
            builder[`add${(0, Util_1.ucfirst)(option.type)}Option`]((o) => o.setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false));
        }
        return builder;
    }
    async execute(interaction) {
        /* Make sure we are in a guild cannel */
        if (interaction.inGuild() && interaction.member instanceof discord_js_1.GuildMember) {
            try {
                this.exec(interaction);
            }
            catch (e) {
                /* Inform user that an error did occur */
                await interaction.reply('Sorry, omething went wrong.');
                /* Re-throw the exception */
                throw e;
            }
        }
        /* Only join guild channels, inform user */
        return interaction.reply('Sorry, i can only do that a guild channel.');
    }
}
exports.default = Command;
