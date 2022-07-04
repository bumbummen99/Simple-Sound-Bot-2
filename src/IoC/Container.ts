import 'reflect-metadata';
import { Container } from "inversify";
import { IoCTypes } from "./IoCTypes";
import ConnectionManager from "../Player/ConnectionManager";
import QueueManager from "../Player/QueueManager";
import PlayerManager from "../Player/PlayerManager";

const container = new Container();

container.bind<ConnectionManager>(IoCTypes.ConnectionManager).to(ConnectionManager).inSingletonScope();
container.bind<QueueManager>(IoCTypes.QueueManager).to(QueueManager).inSingletonScope();
container.bind<PlayerManager>(IoCTypes.PlayerManager).to(PlayerManager).inSingletonScope();

export default container;