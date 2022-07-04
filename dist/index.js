"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const deploy_commands_1 = __importDefault(require("./deploy-commands"));
const Container_1 = __importDefault(require("./IoC/Container"));
const IoCTypes_1 = require("./IoC/IoCTypes");
const dotenv = __importStar(require("dotenv"));
const Commands_1 = require("./Commands");
(async () => {
    dotenv.config();
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
    await (0, deploy_commands_1.default)();
    /* React to Commands */
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand())
            return;
        const { commandName } = interaction;
        const command = Commands_1.Commands.find(command => new command().command === commandName);
        if (command) {
            await new command().exec(interaction);
        }
    });
    /* Give a notice once we are ready */
    client.once('ready', () => {
        console.log('Ready!');
    });
})();
