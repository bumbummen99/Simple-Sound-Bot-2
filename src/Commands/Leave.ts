import { CacheType, CommandInteraction } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import ConnectionManager from "../Player/ConnectionManager";
import container from "../IoC/Container";

export default class Leave extends Command {
    constructor() {
        super(
            'leave',
            'Leave the current channel.'
        );
    }

    async exec(interaction: CommandInteraction<CacheType>) {
        if (interaction.guild) {
            await container.get<ConnectionManager>(IoCTypes.ConnectionManager).leave(interaction.guild);
        }
    }
}