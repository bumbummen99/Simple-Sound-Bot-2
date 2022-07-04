"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("./Abstract/Command"));
const IoCTypes_1 = require("../IoC/IoCTypes");
const Container_1 = __importDefault(require("../IoC/Container"));
class Pause extends Command_1.default {
    constructor() {
        super('pause', 'pause the current plöyback.');
    }
    async exec(interaction) {
        if (interaction.guild) {
            /* Stop the playback */
            const player = Container_1.default.get(IoCTypes_1.IoCTypes.PlayerManager).get(interaction.guild);
            player.pause();
        }
    }
}
exports.default = Pause;
