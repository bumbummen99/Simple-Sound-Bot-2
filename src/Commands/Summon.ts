import { CacheType, ChatInputCommandInteraction, Guild, GuildMember } from "discord.js";
import Command from "./Abstract/Command";
import { IoCTypes } from "../IoC/IoCTypes";
import container from "../IoC/Container";
import PlayerManager from "../Player/PlayerManager";
import { sleep } from "../Util";
import ChannelRestrictionError from "../Errors/ChannelRestrictionError";

export default class Summon extends Command {
    constructor() {
        super(
            'summon',
            'Summon the bot in the current channel.'
        );
    }

    async exec(interaction: ChatInputCommandInteraction<CacheType>) {     
        /* Get the users voice channel */
        const channel = (interaction.member as GuildMember).voice.channel;

        /* Check if the user is part of a voice channel */
        if (! channel) {
            throw new ChannelRestrictionError('This command can only be used in a voice channel');
        }

        /* Get the guilds player */
        const player = container.get<PlayerManager>(IoCTypes.PlayerManager).get(interaction.guild as Guild);

        /* Join the guild player to the channel */
        player.player.connect(channel.id)

        await sleep(3000);

        /* Notify the user */
        if (player.player.connected) {
            interaction.editReply(`Joined channel "${channel.name}"`);
        } else {
            interaction.editReply(`Player is not connected`);
        }
    }
}