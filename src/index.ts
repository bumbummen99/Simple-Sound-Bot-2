import fs from 'node:fs'
import path from 'node:path'
import { Client, Intents } from "discord.js";
import deployCommands from "./deploy-commands";
import container from "./IoC/Container";
import { IoCTypes } from "./IoC/IoCTypes";
import * as dotenv from 'dotenv';
import { Commands } from "./Commands";
import YouTube from './YouTube';

(async () => {
    dotenv.config()

    fs.mkdirSync(path.resolve('bin'), { recursive: true });
    fs.mkdirSync(path.resolve('storage/youtube'), { recursive: true });
    fs.mkdirSync(path.resolve('storage/tts'), { recursive: true });
    fs.mkdirSync(path.resolve('storage/seek'), { recursive: true });

    await YouTube.install();

    /* Initialize the Client */
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,            // Allow the bot to interact with the guild
            Intents.FLAGS.GUILD_MEMBERS,     // Allow the bot to access members
            Intents.FLAGS.GUILD_MESSAGES,    // Allow the bot to access messages
            Intents.FLAGS.GUILD_VOICE_STATES // Allow the bot to talk
        ]
    });

    /* Bind client to the IoC */
    container.bind<Client>(IoCTypes.Client).toConstantValue(client);

    /* Login */
    client.login(process.env.DISCORD_TOKEN);

    /* Deploy the commands */
    await deployCommands();

    /* React to Commands */
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;

        const command = Commands.find(command => new command().command === commandName);

        if (command) {
            try {
                await interaction.reply('As you demand.');
                await new command().exec(interaction);
            } catch(e) {
                console.error(e);

                await interaction.reply('Sorry, something went wrong.');
            }
        }
    });

    if (process.env.DEBUG) {
        client.on('debug', console.log);
    }

    /* Give a notice once we are ready */
    client.once('ready', () => {
        console.log('Ready!');
    });
})()