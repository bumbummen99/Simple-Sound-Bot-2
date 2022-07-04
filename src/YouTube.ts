import md5 from 'md5';
import ytdl from 'youtube-dl-exec';
import exec from 'youtube-dl-exec';
import { YtResponse } from 'youtube-dl-exec';
import fs from 'fs';
import path from 'path';
import ytsr, { Video } from 'ytsr';

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
        /* Try to find the video information */
        const info = await ytdl(url, { dumpSingleJson: true });

        /* Save info to storage */
        fs.writeFileSync(`${YouTube.getCachePath(info.id)}.json`, JSON.stringify(info));

        /* Download video */
        await exec(url, {
            loadInfoJson: `${YouTube.getCachePath(info.id)}.json`,
            output: path.resolve(`${YouTube.getCachePath(info.id)}.mp3`)
        });

        return info;
    }

    static getCachePath(id: string): string
    {
        return path.resolve(process.cwd() + '/storage/youtube/' + md5(id));
    }
}