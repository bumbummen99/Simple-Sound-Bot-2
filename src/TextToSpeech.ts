import { Polly } from 'aws-sdk';
import md5 from 'md5';
import fs from'fs';
import path from'path';
import { download } from './Util';

export default class TextToSpeech {
    static async generate(input): Promise<string> 
    {
        const path = TextToSpeech.getCachePath(input);

        /* Generate and download the TTS audio if it does not already exist */
        if (!fs.existsSync(path)) {
            await download(await TextToSpeech._generator(input), path);
        }

        return path;
    }

    private static _generator(input): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                /* Initialize Polly and Signer & set contents */
                const signer = new Polly.Presigner();
                
                /* Create presigned URL of synthesized speech file */
                signer.getSynthesizeSpeechUrl({
                    OutputFormat: 'mp3',
                    SampleRate: '22050',
                    Text: input,
                    TextType: 'text',
                    Engine: 'neural',
                    VoiceId: 'Daniel'
                }, function(error, url) {
                    if (error) {
                        /* Reject the Promise with the received error */
                        reject(error);
                    } else {
                        /* Resolve the Promise */
                        resolve(url);
                    }
                });
            } catch (e) {
                reject(e.message);
            }
        });
    }

    static getCachePath(input) {
        return path.resolve(process.cwd() + '/storage/tts/' + md5(input) + '.mp3');
    }
}