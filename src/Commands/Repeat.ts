import { CacheType, ChatInputCommandInteraction, Guild } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import PlayerManager from "../Player/PlayerManager";
import container from "../IoC/Container";

export default class Repeat extends Command {
    constructor() {
        super(
            'repeat',
            'Repeat the current playback.'
        );
    }

    async exec(interaction: ChatInputCommandInteraction<CacheType>) {
        /* Stop the playback */
        const state = container.get<PlayerManager>(IoCTypes.PlayerManager)
                 .get(interaction.guild as Guild)
                 .toggleRepeat();

        await interaction.editReply(`Toggled repeat ${state ? 'on' : 'off'}.`);
    }
}