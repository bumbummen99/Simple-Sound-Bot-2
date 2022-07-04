"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = exports.ucfirst = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
function ucfirst(input) {
    return input[0].toUpperCase() + input.slice(1);
}
exports.ucfirst = ucfirst;
function download(URL, dest) {
    return new Promise((resolve, reject) => {
        let handler = URL.startsWith('https') ? https_1.default : http_1.default;
        const file = fs_1.default.createWriteStream(dest);
        try {
            handler.get(URL, (response) => {
                response.pipe(file);
                file.once('finish', () => {
                    file.close();
                    resolve();
                });
            });
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.download = download;
