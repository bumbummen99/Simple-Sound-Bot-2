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
const md5_1 = __importDefault(require("md5"));
class Play extends Command_1.default {
    constructor() {
        super('play', 'play the provided url.', [
            {
                type: 'string',
                name: 'url',
                description: 'The YouTube URL you want to play',
                required: true
            }
        ]);
    }
    async exec(interaction) {
        if (!interaction.guild) {
            return;
        }
        const url = interaction.options.getString('url');
        const player = Container_1.default.get(IoCTypes_1.IoCTypes.PlayerManager).get(interaction.guild);
        /* Check if an URL was provided */
        if (!url) {
            /* Nothing provided, resume playback (if there was one) */
            player.unpause();
            return;
        }
        /* Download the video as mp3 and get the information */
        const info = await YouTube_1.default.download(url);
        /* Create an audio resource for the song */
        const resource = (0, voice_1.createAudioResource)(YouTube_1.default.getCachePath(`${(0, md5_1.default)(info.id)}.mp3`), {
            inlineVolume: true, // Allow to adjust the volume on the fly
        });
        /* Replace the first queue item for the guild with the new resource */
        Container_1.default.get(IoCTypes_1.IoCTypes.QueueManager).replace(interaction.guild, resource);
        /* Get the bots current VoiceConnection */
        const voiceConnection = await Container_1.default.get(IoCTypes_1.IoCTypes.ConnectionManager).get(interaction.guild);
        if (!voiceConnection) {
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
        });
    }
}
exports.default = Play;
