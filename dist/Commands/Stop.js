"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("./Abstract/Command"));
const IoCTypes_1 = require("../IoC/IoCTypes");
const Container_1 = __importDefault(require("../IoC/Container"));
class Stop extends Command_1.default {
    constructor() {
        super('stop', 'stop the current plöyback.');
    }
    async exec(interaction) {
        if (!interaction.guild) {
            return;
        }
        /* Stop the playback */
        const playerManager = Container_1.default.get(IoCTypes_1.IoCTypes.PlayerManager);
        const player = playerManager.get(interaction.guild);
        player.stop();
        /* Remove from queue */
        const queueManager = Container_1.default.get(IoCTypes_1.IoCTypes.QueueManager);
        queueManager.next(interaction.guild);
    }
}
exports.default = Stop;
