import { createWriteStream } from 'node:fs';
import axios from 'axios';

export function ucfirst(input: string) {
    return input[0].toUpperCase() + input.slice(1);
}

export async function download(url: string, file: string): Promise<boolean>
{
    const writer = createWriteStream(file);
  
    return axios({
      method: 'get',
      url: url,
      responseType: 'stream',
    }).then(response => {  
        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error: null|Error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (! error) {
                    resolve(true);
                }
            });
        });
    });
  }