"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const Commands_1 = require("./Commands");
async function deployCommands() {
    const commands = Commands_1.Commands.map(command => new command().slashCommand().toJSON());
    const rest = new rest_1.REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
    /* Publish / Sync the commands */
    await rest.put(v9_1.Routes.applicationCommands(process.env.DISCORD_APP_ID), { body: commands });
}
exports.default = deployCommands;
