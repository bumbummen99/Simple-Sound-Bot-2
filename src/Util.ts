import http from 'http';
import https from 'https';
import fs from 'fs';

export function ucfirst(input: string) {
    return input[0].toUpperCase() + input.slice(1);
}

export function download(URL: string, dest: string): Promise<void>
{
    return new Promise((resolve, reject) => {
        let handler = URL.startsWith('https') ? https : http;

        const file = fs.createWriteStream(dest);
        try {
            handler.get(URL, (response) => {
                response.pipe(file);
                file.once('finish', () => {
                    file.close();
                    resolve();
                });
            });
        } catch (e) {
            reject(e);
        }           
    });
}