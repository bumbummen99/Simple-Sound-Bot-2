import { CacheType, CommandInteraction } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import PlayerManager from "../Player/PlayerManager";
import container from "../IoC/Container";
import TextToSpeech from '../TextToSpeech';
import { Cluster } from "lavaclient";

export default class TTS extends Command {
    constructor() {
        super(
            'say',
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
        if (! interaction.guild || ! await TTS.isGuildInteraction(interaction)) {
            return;
        }

        /* Download the video as mp3 and get the information */
        const url = await TextToSpeech.generate(interaction.options.getString('text'));

        const result = await container.get<Cluster>(IoCTypes.Lavalink).rest?.loadTracks(url);
        
        if (result?.tracks.length) {
            /* Get the guild player instance */
            const player = container.get<PlayerManager>(IoCTypes.PlayerManager).get(interaction.guild);

            /* Play the tts */
            player.playTTS(result.tracks[0]);

            /* Inform the user that we are playing now */
            await interaction.editReply('As you demand.');
        } else {
            /* Inform the user that we could not load the TTS */
            await interaction.editReply('Could not load TTS.');
        }
    }
}