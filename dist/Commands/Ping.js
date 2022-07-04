"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("./Abstract/Command"));
class Ping extends Command_1.default {
    constructor() {
        super('ping', 'Shows the ping of the client.');
    }
    async exec(interaction) {
        const sent = await interaction.reply({
            content: 'Pong!',
            fetchReply: true
        });
        await interaction.editReply({
            content: `Pong!\nBot Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms, \nWebsocket Latency: ${this.client.ws.ping}ms`
        });
    }
}
exports.default = Ping;
