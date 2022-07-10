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
import Player from "../Player";

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
                }
            ]
        );
    }

    async exec(interaction: CommandInteraction<CacheType>) {
        if (! interaction.guild || ! await Play.isGuildInteraction(interaction)) {
            return;
        }

        const url = interaction.options.getString('url');

        const player = container.get<PlayerManager>(IoCTypes.PlayerManager).get(interaction.guild);

        /* Check if an URL was provided */
        if (! url) {
            /* Nothing provided, resume playback (if there was one) */
            player.player.unpause();
            return;
        } else if (! YouTube.getIdFromURL(url)) {
            interaction.editReply(`You must provide a valid YouTube URL, "${url}" is not valid.`);
        }

        await interaction.editReply('Downloading video...');

        /* Download the video as mp3 and get the information */
        const info = await YouTube.download(url);

        /* Create an audio resource for the song */
        const resource = Player.createAudioResource({
            file: `${YouTube.getCachePath(info.id)}.mp3`,
            url: url,

            title: info.title,
            description: info.description,
            thumbnail: info.thumbnail

        });

        /* Replace the first queue item for the guild with the new resource */
        container.get<QueueManager>(IoCTypes.QueueManager).replace(interaction.guild, resource);

        /* Play the resource */
        player.player.play(resource);

        /* Inform the user what is playing now */
        await interaction.editReply({
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