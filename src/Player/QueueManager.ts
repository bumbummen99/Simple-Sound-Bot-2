import { AudioResource } from "@discordjs/voice";
import { Guild, Snowflake } from "discord.js";
import { injectable } from "inversify";
import { Metadata } from "../Metadata";

@injectable()
export default class QueueManager {
    queues: {[key: Snowflake]: AudioResource<Metadata>[] } = {};
    volumes: {[key: Snowflake]: number} = {};

    /**
     * Add a resource to the guilds queue.
     * 
     * @param guild
     * @param resource 
     */
    queue(guild: Guild, resource: AudioResource<Metadata>, prepend: boolean = false): void
    {
        /* Make sure the guilds queue is initialized */
        this._initQueue(guild);

        resource.volume?.setVolume(this.volumes[guild.id] ?? 1);

        /* Add the resource to the end of the guilds queue */
        if (prepend) {
            this.queues[guild.id].unshift(resource); 
        } else {
            this.queues[guild.id].push(resource);
        }
    }

    /**
     * Replaces the current resource for the given queue.
     * 
     * @param guild
     * @param resource 
     */
    replace(guild: Guild, resource: AudioResource<Metadata>): void
    {
        this._initQueue(guild);

        this.queues[guild.id].shift();

        this.queue(guild, resource, true);
    }

    /**
     * Get the curent resource.
     * 
     * @param guild
     * @returns 
     */
    get(guild: Guild): AudioResource<Metadata>|null
    {
        /* Make sure the guilds queue is initialized */
        this._initQueue(guild);

        console.log(`Queue lenght is ${this.queues[guild.id].length}`);

        if (this.queues[guild.id][0]) {
            console.log(`Queue resource is already ended? ${this.queues[guild.id][0].ended}`);
        }

        return this.queues[guild.id][0] ?? null;
    }

    /**
     * Remove the current resource and return the next/current resource.
     * 
     * @param guild 
     * @returns 
     */
    next(guild: Guild): AudioResource<Metadata>|null
    {
        /* Make sure the guilds queue is initialized */
        this._initQueue(guild);

        /* Remove the first resource from the queue */
        this.queues[guild.id].shift();

        return this.get(guild);
    }

    /**
     * Clear the queue of the provided guild.
     * 
     * @param guild 
     */
    clear(guild: Guild): void
    {
        this.queues[guild.id] = [];
    }

    setVolume(guild: Guild, volume: number): void
    {
        this._initQueue(guild);

        for (const resource of this.queues[guild.id]) {
            resource.volume?.setVolume(volume);
        }

        this.volumes[guild.id] = volume;
    }

    private _initQueue(guild: Guild): void
    {
        if (! this.queues[guild.id]) {
            this.clear(guild);
        }
    }
}
