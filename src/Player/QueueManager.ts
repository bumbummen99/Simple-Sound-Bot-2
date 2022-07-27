import { Guild, Snowflake } from "discord.js";
import { injectable } from "inversify";
import { Track } from '@lavaclient/types';

@injectable()
export default class QueueManager {
    queues: {[key: Snowflake]: Track[] } = {};

    /**
     * Add a resource to the guilds queue.
     * 
     * @param guild
     * @param resource 
     */
    queue(guild: Guild, track: Track, prepend: boolean = false): void
    {
        /* Make sure the guilds queue is initialized */
        this._initQueue(guild);

        /* Add the resource to the end of the guilds queue */
        if (prepend) {
            this.queues[guild.id].unshift(track); 
        } else {
            this.queues[guild.id].push(track);
        }

        console.debug(`Queue length is ${this.queues[guild.id].length}`);
    }

    /**
     * Replaces the current resource for the given queue.
     * 
     * @param guild
     * @param resource 
     */
    replace(guild: Guild, track: Track): void
    {
        this._initQueue(guild);

        this.queues[guild.id].shift();

        this.queue(guild, track, true);
    }

    /**
     * Get the curent resource.
     * 
     * @param guild
     * @returns 
     */
    get(guild: Guild): Track|null
    {
        /* Make sure the guilds queue is initialized */
        this._initQueue(guild);

        console.debug(`Queue length is ${this.queues[guild.id].length}`);

        return this.queues[guild.id][0] ?? null;
    }

    /**
     * Remove the current resource and return the next/current resource.
     * 
     * @param guild 
     * @returns 
     */
    next(guild: Guild): Track|null
    {
        /* Make sure the guilds queue is initialized */
        this._initQueue(guild);

        console.debug(`Queue length before shift is ${this.queues[guild.id].length}`);

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

    private _initQueue(guild: Guild): void
    {
        if (! this.queues[guild.id]) {
            this.clear(guild);
        }
    }
}
