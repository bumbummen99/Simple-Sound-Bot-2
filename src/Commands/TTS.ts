import { CacheType, CommandInteraction, Guild, Interaction, VoiceState } from "discord.js";
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

        this.client.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
            /* Check if user joined our channel */
            if (
                newState.member?.id !== this.client.guilds.cache.get(newState.guild.id)?.me?.id &&             // Ignore the Bot itself
                (oldState.channelId !== newState.channelId) &&                                                 // Only greet on channel changed
                (newState.channelId ===  this.client.guilds.cache.get(newState.guild.id)?.me?.voice.channelId) // Only greet if new channel is bot channel
            ) {
                await this.say(newState.guild, `Hallo ${newState.member?.displayName}`);
            }
        })
    }

    async exec(interaction: CommandInteraction<CacheType>) {
        const text = interaction.options.getString('text');

        switch (await this.say(interaction.guild as Guild, text as string)) {
            case true:
                await interaction.editReply('As you demand.');
                return;
            case false:
                await interaction.editReply('There is already something playing.');
                return
            case null:
                await interaction.editReply('Could not load TTS.');
                return
        }
    }

    private async say(guild: Guild, input: string): Promise<boolean|null>
    {
        /* Download the video as mp3 and get the information */
        const url = await TextToSpeech.generate(input);

        const result = await container.get<Cluster>(IoCTypes.Lavalink).rest?.loadTracks(url);

        if (result?.tracks.length) {
            /* Get the guild player instance */
            const player = container.get<PlayerManager>(IoCTypes.PlayerManager).get(guild);

            if (player.player.playing) {
                return false;
            }

            /* Play the tts */
            player.playTTS(result.tracks[0]);

            return true;
        }

        return null;
    }
}