import { Polly } from 'aws-sdk';

export default class TextToSpeech {
    static async generate(input): Promise<string> 
    {
        return await TextToSpeech._generator(input);
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
}