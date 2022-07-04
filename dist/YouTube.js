"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const md5_1 = __importDefault(require("md5"));
const youtube_dl_exec_1 = __importDefault(require("youtube-dl-exec"));
const youtube_dl_exec_2 = __importDefault(require("youtube-dl-exec"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ytsr_1 = __importDefault(require("ytsr"));
class YouTube {
    static async search(input) {
        /* Not an URL, search YouTube */
        const results = await (0, ytsr_1.default)(input, {
            limit: 1,
            gl: process.env.YOUTUBE_COUNTRY ?? 'US',
            hl: process.env.YOUTUBE_LANGUAGE ?? 'en',
        });
        const videos = results.items.filter(item => item.type === 'video');
        /* Return nothing if we found nothing */
        if (!videos.length) {
            return null;
        }
        return videos[0].url;
    }
    static async download(url) {
        /* Try to find the video information */
        const info = await (0, youtube_dl_exec_1.default)(url, { dumpSingleJson: true });
        /* Save info to storage */
        fs_1.default.writeFileSync(`${YouTube.getCachePath(info.id)}.json`, JSON.stringify(info));
        /* Download video */
        await (0, youtube_dl_exec_2.default)(url, {
            loadInfoJson: `${YouTube.getCachePath(info.id)}.json`,
            output: path_1.default.resolve(`${YouTube.getCachePath(info.id)}.mp3`)
        });
        return info;
    }
    static getCachePath(id) {
        return path_1.default.resolve(process.cwd() + '/storage/youtube/' + (0, md5_1.default)(id));
    }
}
exports.default = YouTube;
