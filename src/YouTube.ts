import md5 from 'md5';
import fs from 'fs';
import path from 'path';
import ytsr, { Video } from 'ytsr';
import { download } from './Util';
import getLatestRelease from './GitHub';
import { info as ytdlInfo, download as ytdl, YtResponse } from './YouTubeDL/YouTubeDl';

export default class YouTube {

    static async search(input: string): Promise<string|null>
    {
        /* Not an URL, search YouTube */
        const results = await ytsr(input, {
            limit: 1,
            gl: process.env.YOUTUBE_COUNTRY ?? 'US',
            hl: process.env.YOUTUBE_LANGUAGE ?? 'en',
        });

        const videos: Video[] = results.items.filter(item => item.type === 'video') as Video[];

        /* Return nothing if we found nothing */
        if (! videos.length) {
            return null;
        }

        return videos[0].url;
    }

    static async download(url: string): Promise<YtResponse>
    {
        /* Get the videoId and check that we have a valid URL */
        const id = YouTube.getIdFromURL(url);
        if (! id) {
            throw new Error(`The provided URL is not a YouTube video. URL: ${url}`) 
        }

        if (fs.existsSync(`${YouTube.getCachePath(id)}.json`)) {
            return JSON.parse(fs.readFileSync(`${YouTube.getCachePath(id)}.json`).toString()) as YtResponse;
        } else {
            /* Try to find the video information */
            const info = await ytdlInfo(url, { dumpSingleJson: true });

            /* Save info to storage */
            fs.writeFileSync(`${YouTube.getCachePath(info.id)}.json`, JSON.stringify(info));

            /* Download video */
            await ytdl(url, `${this.getCachePath(info.id)}.mp3`, {
                loadInfoJson: `${YouTube.getCachePath(info.id)}.json`,
                extractAudio: true,
                audioFormat: 'mp3'
            });

            console.info(`Downloaded YouTube video ${info.id}`);

            return info;
        }
    }

    static async install(): Promise<boolean>
    {
        /* Set the correct YOUTUBE_DL_DIR */
        process.env.YOUTUBE_DL_PATH = path.resolve(path.join(__dirname, '../bin/youtube-dl'));

        if (! fs.existsSync(path.join(process.env.YOUTUBE_DL_PATH))) {
            const url = await getLatestRelease('yt-dlp/yt-dlp', 'yt-dlp');  
            if (url) {
                await download(url, process.env.YOUTUBE_DL_PATH);

                fs.chmodSync(process.env.YOUTUBE_DL_PATH, 0o775);

                return true;
            }      
        }

        return false;
    }

    static getCachePath(id: string): string
    {
        return path.resolve(process.cwd() + '/storage/youtube/' + md5(id));
    }

    public static getIdFromURL(url) {
        if (url != undefined || url != '') {
            /* Try to get the ID from the YouTube URL */
            const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/);
            
            if (match && match[2].length == 11) {
                return match[2];
            }
        }

        return null;
    }
}