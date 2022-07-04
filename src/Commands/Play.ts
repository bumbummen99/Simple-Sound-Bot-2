import { CacheType, CommandInteraction } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import ConnectionManager from "../Player/ConnectionManager";
import QueueManager from "../Player/QueueManager";
import { createAudioResource } from "@discordjs/voice";
import PlayerManager from "../Player/PlayerManager";
import container from "../IoC/Container";
import YouTube from "../YouTube";
import md5 from 'md5';

export default class Play extends Command {
    constructor() {
        super(
            'play',
            'play the provided url.',
            [
                {
                    type: 'string',
                    name: 'url',
                    description: 'The YouTube URL you want to play',
                    required: true
                }
            ]
        );
    }

    async exec(interaction: CommandInteraction<CacheType>) {
        if (! interaction.guild) {
            return;
        }

        const url = interaction.options.getString('url');

        const player = container.get<PlayerManager>(IoCTypes.PlayerManager).get(interaction.guild);

        /* Check if an URL was provided */
        if (! url) {
            /* Nothing provided, resume playback (if there was one) */
            player.unpause()
            return;
        }

        /* Download the video as mp3 and get the information */
        const info = await YouTube.download(url);

        /* Create an audio resource for the song */
        const resource = createAudioResource(YouTube.getCachePath(`${md5(info.id)}.mp3`), {
            inlineVolume: true, // Allow to adjust the volume on the fly
        });

        /* Replace the first queue item for the guild with the new resource */
        container.get<QueueManager>(IoCTypes.QueueManager).replace(interaction.guild, resource);

        /* Get the bots current VoiceConnection */
        const voiceConnection = await container.get<ConnectionManager>(IoCTypes.ConnectionManager).get(interaction.guild);
        if (! voiceConnection){
            return interaction.reply('The bot is not connected to any voice channel.');
        }

        /* Subscribe the connection to the player */
        voiceConnection.subscribe(player);

        /* Play the resource */
        player.play(resource);

        /* Inform the user what is playing now */
        await interaction.reply({
            embeds: [
                {
                    image: {
                        url: info.thumbnail
                    },
                    title: `Now playing: ${info.title}`,
                    description: info.description,
                }
            ]
        })
    }
}