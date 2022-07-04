"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
const Leave_1 = __importDefault(require("./Leave"));
const Pause_1 = __importDefault(require("./Pause"));
const Ping_1 = __importDefault(require("./Ping"));
const Play_1 = __importDefault(require("./Play"));
const Queue_1 = __importDefault(require("./Queue"));
const Stop_1 = __importDefault(require("./Stop"));
const Summon_1 = __importDefault(require("./Summon"));
exports.Commands = [
    Leave_1.default,
    Pause_1.default,
    Ping_1.default,
    Play_1.default,
    Queue_1.default,
    Stop_1.default,
    Summon_1.default,
];
