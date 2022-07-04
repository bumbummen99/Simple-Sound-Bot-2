import { REST } from "@discordjs/rest";
import { Routes } from 'discord-api-types/v9';
import { Commands } from "./Commands";

export default async function deployCommands() {
    const commands = Commands.map(command => new command().slashCommand().toJSON());
    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string);
    
    /* Publish / Sync the commands */
    await rest.put(Routes.applicationCommands(process.env.DISCORD_APP_ID as string), { body: commands });
}