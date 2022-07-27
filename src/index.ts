import { ApplicationCommand, Client, GatewayDispatchEvents, GatewayIntentBits, InteractionType } from "discord.js";
import "@lavaclient/queue/register";
import  { Cluster } from 'lavaclient';
import deployCommands from "./deploy-commands";
import container from "./IoC/Container";
import { IoCTypes } from "./IoC/IoCTypes";
import * as dotenv from 'dotenv';
import { Commands } from "./Commands";
import ErrorHandler from "./ErrorHandler";

(async () => {
    /* Load .env configuration and overwrite ENV */
    dotenv.config();

    /* Initialize the ErrorHandler before everything else */
    container.bind<ErrorHandler>(IoCTypes.ErrorHandler).toConstantValue(new ErrorHandler());

    /* Initialize the Client */
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,            // Allow the bot to interact with the guild
            GatewayIntentBits.GuildMembers,     // Allow the bot to access members
            GatewayIntentBits.GuildMessages,    // Allow the bot to access messages
            GatewayIntentBits.GuildVoiceStates // Allow the bot to talk
        ]
    });

    /* Write DiscordJS errors to the log */
    client.on('error', error => container.get<ErrorHandler>(IoCTypes.ErrorHandler).render(error));

    /* Bind client to the IoC */
    container.bind<Client>(IoCTypes.Client).toConstantValue(client);

    /* Initialize and bind Lavalink Client */
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

    /* Write Lavalink errors to the log */
    container.get<Cluster>(IoCTypes.Lavalink).on('nodeError', (node, error) => container.get<ErrorHandler>(IoCTypes.ErrorHandler).render(error))
    if (process.env.DEBUG) {
        /* Alos log debug if enabled */
        container.get<Cluster>(IoCTypes.Lavalink).on('nodeDebug', (node, message) => console.debug(message))
    }

    /* Login to the Discord API */
    client.login(process.env.DISCORD_TOKEN);

    /* Deploy the commands */
    await deployCommands();

    /* React to Commands */
    client.on('interactionCreate', async interaction => {
        /* Make sure this is an command interaction */
        if (! interaction.isChatInputCommand()) return;
        
        try {
            /* Get the command name from the interaction object */
            const { commandName } = interaction;

            /* Try to find the command in the internal register */
            const command = Commands.find(command => new command().command === commandName);
    
            /* Check if any command does match the request */
            if (command) {
                /* Make sure the reply does not timeout */
                await interaction.deferReply();

                /* Execute the desired command */
                await new command().execute(interaction);
            }
        } catch (error) {
            /* Log the fatal error */ 
            container.get<ErrorHandler>(IoCTypes.ErrorHandler).render(error);
                
            /* Notify the user of the 500 */
            await interaction.editReply(error.message ?? 'Sorry, something went wrong.');
        }
        
    });

    /* Send raw voice data to Lavalink */
    client.ws.on(GatewayDispatchEvents.VoiceServerUpdate, data => container.get<Cluster>(IoCTypes.Lavalink).handleVoiceUpdate(data));
    client.ws.on(GatewayDispatchEvents.VoiceStateUpdate, data => container.get<Cluster>(IoCTypes.Lavalink).handleVoiceUpdate(data));

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