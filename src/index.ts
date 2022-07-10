import { Client, Intents } from "discord.js";
import "@lavaclient/queue/register";
import  { Cluster } from 'lavaclient';
import deployCommands from "./deploy-commands";
import container from "./IoC/Container";
import { IoCTypes } from "./IoC/IoCTypes";
import * as dotenv from 'dotenv';
import { Commands } from "./Commands";
import YouTube from './YouTube';

(async () => {
    dotenv.config()

    /* Initialize the Client */
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,            // Allow the bot to interact with the guild
            Intents.FLAGS.GUILD_MEMBERS,     // Allow the bot to access members
            Intents.FLAGS.GUILD_MESSAGES,    // Allow the bot to access messages
            Intents.FLAGS.GUILD_VOICE_STATES // Allow the bot to talk
        ]
    });

    container.bind<Cluster>(IoCTypes.Lavalink).toConstantValue(new Cluster({
        nodes: [
            {
                id: 'main',
                host: 'lavalink',
                port: 2333,
                password: 'youshallnotpass'
            }
        ],
        sendGatewayPayload: (id, payload) => {
            console.debug('Sending payload...');
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        }
    }));

    if (process.env.DEBUG) {
        container.get<Cluster>(IoCTypes.Lavalink)
        .on('nodeDebug', (node, message) => console.debug(message))
        .on('nodeError', (node, error) => console.error(error.message))
    }

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
                await interaction.deferReply();
                await new command().exec(interaction);
            } catch(e) {
                console.error(e);

                await interaction.reply('Sorry, something went wrong.');
            }
        }
    });

    /* Send raw voice data to Lavalink */
    client.ws.on("VOICE_SERVER_UPDATE", data => container.get<Cluster>(IoCTypes.Lavalink).handleVoiceUpdate(data));
    client.ws.on("VOICE_STATE_UPDATE", data => container.get<Cluster>(IoCTypes.Lavalink).handleVoiceUpdate(data));

    if (process.env.DEBUG) {
        client.on('debug', console.log);
    }

    /* Give a notice once we are ready */
    client.once('ready', () => {
        console.log('Ready!');

        /* Login Lvalink or fail if no user is available */
        if (client.user) {
            console.debug('Connecting nodes');
            container.get<Cluster>(IoCTypes.Lavalink).connect(client.user);
        }
    });

    process.on('SIGTERM', client.destroy);
    process.on('SIGINT', client.destroy);
})()