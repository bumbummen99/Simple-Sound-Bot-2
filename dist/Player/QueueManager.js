"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueueManager {
    queues;
    /**
     * Add a resource to the guilds queue.
     *
     * @param guild
     * @param resource
     */
    queue(guild, resource, prepend = false) {
        /* Make sure the guilds queue is initialized */
        this._initQueue(guild);
        /* Add the resource to the end of the guilds queue */
        if (prepend) {
            this.queues[guild.id].unshift(resource);
        }
        else {
            this.queues[guild.id].push(resource);
        }
    }
    /**
     * Replaces the current resource for the given queue.
     *
     * @param guild
     * @param resource
     */
    replace(guild, resource) {
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
    get(guild) {
        /* Make sure the guilds queue is initialized */
        this._initQueue(guild);
        return this.queues[guild.id][0] ?? null;
    }
    /**
     * Remove the current resource and return the next/current resource.
     *
     * @param guild
     * @returns
     */
    next(guild) {
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
    clear(guild) {
        this.queues[guild.id] = [];
    }
    _initQueue(guild) {
        if (!this.queues[guild.id]) {
            this.clear(guild);
        }
    }
}
exports.default = QueueManager;
