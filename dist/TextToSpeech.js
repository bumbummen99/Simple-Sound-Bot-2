"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const md5_1 = __importDefault(require("md5"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Util_1 = require("./Util");
class TextToSpeech {
    static async generate(input) {
        const path = TextToSpeech.getCachePath(input);
        /* Generate and download the TTS audio if it does not already exist */
        if (!fs_1.default.existsSync(path)) {
            await (0, Util_1.download)(await TextToSpeech._generator(input), path);
        }
        return path;
    }
    static _generator(input) {
        return new Promise((resolve, reject) => {
            try {
                /* Initialize Polly and Signer & set contents */
                const signer = new aws_sdk_1.Polly.Presigner();
                /* Create presigned URL of synthesized speech file */
                signer.getSynthesizeSpeechUrl({
                    OutputFormat: 'mp3',
                    SampleRate: '22050',
                    Text: input,
                    TextType: 'text',
                    VoiceId: 'Hans'
                }, function (error, url) {
                    if (error) {
                        /* Reject the Promise with the received error */
                        reject(error);
                    }
                    else {
                        /* Resolve the Promise */
                        resolve(url);
                    }
                });
            }
            catch (e) {
                reject(e.message);
            }
        });
    }
    static getCachePath(input) {
        return path_1.default.resolve(process.cwd() + '/storage/tts/' + (0, md5_1.default)(input) + '.mp3');
    }
}
exports.default = TextToSpeech;
