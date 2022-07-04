"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("./Abstract/Command"));
const IoCTypes_1 = require("../IoC/IoCTypes");
const voice_1 = require("@discordjs/voice");
const Container_1 = __importDefault(require("../IoC/Container"));
const YouTube_1 = __importDefault(require("../YouTube"));
const TextToSpeech_1 = __importDefault(require("../TextToSpeech"));
class TTS extends Command_1.default {
    constructor() {
        super('tts', 'Read out the provided text.', [
            {
                type: 'string',
                name: 'text',
                description: 'The text the bot should read out loud.',
                required: true
            }
        ]);
    }
    async exec(interaction) {
        if (!interaction.guild) {
            return;
        }
        /* Pause the (music) player */
        Container_1.default.get(IoCTypes_1.IoCTypes.PlayerManager).get(interaction.guild).pause();
        /* Get the TTS player */
        const player = Container_1.default.get(IoCTypes_1.IoCTypes.PlayerManager).get(interaction.guild, 'tts');
        /* Download the video as mp3 and get the information */
        const path = await TextToSpeech_1.default.generate(interaction.options.getString('text'));
        /* Create an audio resource for the song */
        const resource = (0, voice_1.createAudioResource)(YouTube_1.default.getCachePath(path), {
            inlineVolume: true, // Allow to adjust the volume on the fly
        });
        /* Get the VoiceConnection of the bot */
        const voiceConnection = await Container_1.default.get(IoCTypes_1.IoCTypes.ConnectionManager).get(interaction.guild);
        if (!voiceConnection) {
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
exports.default = TTS;
