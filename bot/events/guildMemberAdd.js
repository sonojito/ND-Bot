const { EmbedBuilder } = require('discord.js');
const { WELCOME_CHANNEL_ID } = require('../config');
const logger = require('../utils/logger');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        try {
            if (!WELCOME_CHANNEL_ID) return;
            
            const welcomeChannel = await client.channels.fetch(WELCOME_CHANNEL_ID).catch(() => null);
            if (!welcomeChannel) return;

            const embed = new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('👋 Benvenuto!')
                .setDescription(`Benvenuto ${member} nel server!\n\nLeggi le regole e divertiti!`)
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: 'Membro', value: `#${member.guild.memberCount}`, inline: true },
                    { name: 'Account creato', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
                )
                .setTimestamp();

            await welcomeChannel.send({ embeds: [embed] });

            // Log
            await logger.logToDiscord(client, 'info', '👤 Nuovo Membro', `${member.user.tag} è entrato nel server`, [
                { name: 'ID', value: member.id, inline: true },
                { name: 'Totale membri', value: `${member.guild.memberCount}`, inline: true }
            ]);
        } catch (error) {
            logger.error('Errore evento welcome:', error);
        }
    }
};