import { ApplicationCommand, CacheType, ChatInputCommandInteraction, Guild } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import QueueManager from "../Player/QueueManager";
import container from "../IoC/Container";
import PlayerManager from "../Player/PlayerManager";
import { Cluster } from "lavaclient";


export default class Queue extends Command {
    constructor() {
        super(
            'queue',
            'Queue the provided input.',
            [
                {
                    type: 'string',
                    name: 'input',
                    description: 'The YouTube URL you want to play',
                    required: true
                }
            ]
        );
    }

    async exec(interaction: ChatInputCommandInteraction) {
        const input = interaction.options.getString('input');

        /* Get the guilds player instance */
        const player = container.get<PlayerManager>(IoCTypes.PlayerManager).get(interaction.guild as Guild);

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
            /* Queue the track */
            container.get<QueueManager>(IoCTypes.QueueManager)
                    .queue(interaction.guild as Guild, result.tracks[0]);

            /* Inform the user what is playing now */
            await interaction.editReply({
                embeds: [
                    {
                        title: `Queued track: ${result.tracks[0].info.title}`
                    }
                ]
            })
        } else {
            await interaction.editReply('Could not find any tracks.');
        }
    }
}