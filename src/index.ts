import { Client, Intents } from "discord.js";
import deployCommands from "./deploy-commands";
import container from "./IoC/Container";
import { IoCTypes } from "./IoC/IoCTypes";

(async () => {
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

        if (commandName === 'ping') {
            await interaction.reply('Pong!');
        } else if (commandName === 'server') {
            await interaction.reply('Server info.');
        } else if (commandName === 'user') {
            await interaction.reply('User info.');
        }
    });

    /* Give a notice once we are ready */
    client.once('ready', () => {
        console.log('Ready!');
    });
})()