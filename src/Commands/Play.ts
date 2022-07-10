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
import { Cluster } from "lavaclient";

export default class Play extends Command {
    constructor() {
        super(
            'play',
            'play the provided url.',
            [
                {
                    type: 'string',
                    name: 'input',
                    description: 'The YouTube URL you want to play',
                }
            ]
        );
    }

    async exec(interaction: CommandInteraction<CacheType>) {
        if (! interaction.guild || ! await Play.isGuildInteraction(interaction)) {
            return;
        }

        /* Retrieve the search input */
        const input = interaction.options.getString('input');

        /* Get the guilds player instance */
        const player = container.get<PlayerManager>(IoCTypes.PlayerManager).get(interaction.guild);

        /* Check if no search input was provided */
        if (! input) {
            /* Check if the guilds player is paused */
            if (player.player.paused) {
                /* Try to resume the guilds player */
                player.player.resume();
            }
            
            return;
        }

        /* Search tracks for input */
        const result = await container.get<Cluster>(IoCTypes.Lavalink).rest?.loadTracks(input);

        /* Check if Lavalink found any tracks */
        if (result?.tracks.length) {
            /* Play the track */
            container.get<PlayerManager>(IoCTypes.PlayerManager)
                     .get(interaction.guild)
                     .player.play(result.tracks[0]);

            /* Inform the user what is playing now */
            await interaction.editReply({
                embeds: [
                    {
                        title: `Now playing: ${result.tracks[0].info.title}`
                    }
                ]
            })
        } else {
            await interaction.editReply('Could not find any tracks.');
        }
    }
}