import { CacheType, CommandInteraction } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import ConnectionManager from "../Player/ConnectionManager";
import QueueManager from "../Player/QueueManager";
import { createAudioResource, VoiceConnection } from "@discordjs/voice";
import PlayerManager from "../Player/PlayerManager";
import container from "../IoC/Container";
import YouTube from "../YouTube";
import md5 from 'md5';
import TextToSpeech from '../TextToSpeech';

export default class TTS extends Command {
    constructor() {
        super(
            'tts',
            'Read out the provided text.',
            [
                {
                    type: 'string',
                    name: 'text',
                    description: 'The text the bot should read out loud.',
                    required: true
                }
            ]
        );
    }

    async exec(interaction: CommandInteraction<CacheType>) {
        if (! interaction.guild) {
            return;
        }

        /* Pause the (music) player */
        container.get<PlayerManager>(IoCTypes.PlayerManager).get(interaction.guild).pause();

        /* Get the TTS player */
        const player = container.get<PlayerManager>(IoCTypes.PlayerManager).get(interaction.guild, 'tts');

        /* Download the video as mp3 and get the information */
        const path = await TextToSpeech.generate(interaction.options.getString('text'));

        /* Create an audio resource for the song */
        const resource = createAudioResource(YouTube.getCachePath(path), {
            inlineVolume: true, // Allow to adjust the volume on the fly
        });

        /* Get the VoiceConnection of the bot */
        const voiceConnection = await container.get<ConnectionManager>(IoCTypes.ConnectionManager).get(interaction.guild);
        if (! voiceConnection) {
            return interaction.reply('The bot is not connected to any voice channel.');
        }

        /* Subscribe the connection to the player */
        voiceConnection.subscribe(player);

        /* Start playback of the TTS resource */
        player.play(resource); 
        
        /* Inform the user that we are playing now */
        await interaction.reply('As you demand.');
    }
}