import { CacheType, CommandInteraction } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import QueueManager from "../Player/QueueManager";
import { createAudioResource } from "@discordjs/voice";
import container from "../IoC/Container";
import YouTube from "../YouTube";
import md5 from 'md5';


export default class Queue extends Command {
    constructor() {
        super(
            'queue',
            'Queue the provided url.',
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

        if (! url) {
            await interaction.reply('You have to provide an URL.');
            return;
        }

        /* Download the video as mp3 and get the information */
        const info = await YouTube.download(url);

        /* Create an audio resource for the song */
        const resource = createAudioResource(YouTube.getCachePath(`${md5(info.id)}.mp3`), {
            inlineVolume: true, // Allow to adjust the volume on the fly
        });

        /* Replace the first queue item for the guild with the new resource */
        container.get<QueueManager>(IoCTypes.QueueManager)
                 .replace(interaction.guild, resource);

        /* Replace the first queue item for the guild with the new resource */
        container.get<QueueManager>(IoCTypes.QueueManager)
                 .queue(interaction.guild, resource);

        /* Inform the user what is playing now */
        await interaction.reply({
            embeds: [
                {
                    image: {
                        url: info.thumbnail
                    },
                    title: `Queued: ${info.title}`,
                    description: info.description,
                }
            ]
        })
    }
}