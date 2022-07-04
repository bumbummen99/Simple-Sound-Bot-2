"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const IoCTypes_1 = require("./IoCTypes");
const ConnectionManager_1 = __importDefault(require("../Player/ConnectionManager"));
const QueueManager_1 = __importDefault(require("../Player/QueueManager"));
const PlayerManager_1 = __importDefault(require("../Player/PlayerManager"));
const container = new inversify_1.Container();
container.bind(IoCTypes_1.IoCTypes.ConnectionManager).to(ConnectionManager_1.default).inSingletonScope();
container.bind(IoCTypes_1.IoCTypes.QueueManager).to(QueueManager_1.default).inSingletonScope();
container.bind(IoCTypes_1.IoCTypes.PlayerManager).to(PlayerManager_1.default).inSingletonScope();
exports.default = container;
