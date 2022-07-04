"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("./Abstract/Command"));
const IoCTypes_1 = require("../IoC/IoCTypes");
const Container_1 = __importDefault(require("../IoC/Container"));
class Summon extends Command_1.default {
    constructor() {
        super('summon', 'Summon the bot in the current channel.');
    }
    async exec(interaction) {
        if (!interaction.guild || !interaction.member || !(interaction.member instanceof discord_js_1.GuildMember)) {
            return;
        }
        /* Join the members voice channel */
        const connectionManager = Container_1.default.get(IoCTypes_1.IoCTypes.ConnectionManager);
        await connectionManager.join(interaction.member.voice.channel);
    }
}
exports.default = Summon;
