import { AudioResource } from "@discordjs/voice";
import container from "./IoC/Container";
import { IoCTypes } from "./IoC/IoCTypes";
import { Guild } from "discord.js";
import { Metadata } from "./Metadata";
import { Cluster, ClusterNode, Player as LavalinkPlayer } from "lavaclient";

export default class Player
{
    guild: Guild

    player: LavalinkPlayer<ClusterNode>;
    tts: null|AudioResource<Metadata> = null

    constructor(guild: Guild) {
        /* Create unique identifier for this player (Snowflake, Radio-URL, whatever) */
        this.guild = guild;

        /* Create new player instance and subscribe */
        this.player = container.get<Cluster>(IoCTypes.Lavalink).createPlayer(this.guild.id);
    }
}