import { CacheType, CommandInteraction } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import PlayerManager from "../Player/PlayerManager";
import container from "../IoC/Container";
import TextToSpeech from '../TextToSpeech';
import Player from "../Player";

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
        const path = await TextToSpeech.generate(interaction.options.getString('text'));

        const resource = Player.createAudioResource({
            file: path,
        });

        /* Get the guild player instance */
        const player = container.get<PlayerManager>(IoCTypes.PlayerManager).get(interaction.guild);

        /* Start playback of the TTS resource */
        await player.playTTS(resource); 
        
        /* Inform the user that we are playing now */
        await interaction.editReply('As you demand.');
    }
}