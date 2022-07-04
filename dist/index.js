"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const deploy_commands_1 = require("./deploy-commands");
const Container_1 = __importDefault(require("./IoC/Container"));
const IoCTypes_1 = require("./IoC/IoCTypes");
(async () => {
    /* Initialize the Client */
    const client = new discord_js_1.Client({
        intents: [
            discord_js_1.Intents.FLAGS.GUILDS,
            discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
            discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
            discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES // Allow the bot to talk
        ]
    });
    /* Bind client to the IoC */
    Container_1.default.bind(IoCTypes_1.IoCTypes.Client).toConstantValue(client);
    /* Login */
    client.login(process.env.DISCORD_TOKEN);
    /* Deploy the commands */
    await (0, deploy_commands_1.deployCommands)();
    /* React to Commands */
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand())
            return;
        const { commandName } = interaction;
        if (commandName === 'ping') {
            await interaction.reply('Pong!');
        }
        else if (commandName === 'server') {
            await interaction.reply('Server info.');
        }
        else if (commandName === 'user') {
            await interaction.reply('User info.');
        }
    });
    /* Give a notice once we are ready */
    client.once('ready', () => {
        console.log('Ready!');
    });
})();
