import { Guild, Snowflake } from "discord.js";
import { injectable } from "inversify";
import Player from "../Player";

@injectable()
export default class PlayerManager {
    players: {[key: Snowflake]: Player} = {};

    get(guild: Guild): Player
    {
        if (! this.players[guild.id]) {
            this.players[guild.id] = new Player(guild);
        }

        return this.players[guild.id];
    }
}
