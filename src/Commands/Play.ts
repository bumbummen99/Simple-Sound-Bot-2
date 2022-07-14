import { CacheType, CommandInteraction, Guild } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import PlayerManager from "../Player/PlayerManager";
import container from "../IoC/Container";
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
        /* Retrieve the search input */
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
            
            await interaction.editReply('There is no playback to resume');
            return
        }

        /* Search tracks for input */
        const result = await container.get<Cluster>(IoCTypes.Lavalink).rest?.loadTracks(input);

        /* Check if Lavalink found any tracks */
        if (result?.tracks.length) {
            /* Play the track */
            container.get<PlayerManager>(IoCTypes.PlayerManager)
                     .get(interaction.guild as Guild)
                     .play(result.tracks[0]);

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