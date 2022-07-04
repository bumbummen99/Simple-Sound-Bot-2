"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("./Abstract/Command"));
const IoCTypes_1 = require("../IoC/IoCTypes");
const Container_1 = __importDefault(require("../IoC/Container"));
class Leave extends Command_1.default {
    constructor() {
        super('leave', 'Leave the current channel.');
    }
    async exec(interaction) {
        if (interaction.guild) {
            await Container_1.default.get(IoCTypes_1.IoCTypes.ConnectionManager).leave(interaction.guild);
        }
    }
}
exports.default = Leave;
