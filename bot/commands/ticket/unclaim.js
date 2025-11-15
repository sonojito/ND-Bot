const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getPool } = require('../../utils/database');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unclaim')
        .setDescription('Rilascia questo ticket')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client) {
        const pool = getPool();
        
        // Verifica che sia un canale ticket
        const [tickets] = await pool.query(
            'SELECT * FROM tickets WHERE channel_id = ? AND closed = FALSE',
            [interaction.channel.id]
        );

        if (tickets.length === 0) {
            return interaction.reply({
                content: '❌ Questo non è un canale ticket!',
                ephemeral: true
            });
        }

        const ticket = tickets[0];

        if (!ticket.claimed) {
            return interaction.reply({
                content: '❌ Questo ticket non è stato preso in carico!',
                ephemeral: true
            });
        }

        if (ticket.claimed_by !== interaction.user.id && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ Solo chi ha preso in carico il ticket può rilasciarlo!',
                ephemeral: true
            });
        }

        // Aggiorna database
        await pool.query(
            'UPDATE tickets SET claimed = FALSE, claimed_by = NULL WHERE id = ?',
            [ticket.id]
        );

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('🔓 Ticket Rilasciato')
            .setDescription(`${interaction.user} ha rilasciato questo ticket.\nUno staff member può prenderlo in carico.`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // Log
        await logger.logToDiscord(client, 'info', '🔓 Ticket Unclaimed', `Ticket #${ticket.ticket_number} rilasciato`, [
            { name: 'Staff', value: interaction.user.tag, inline: true },
            { name: 'Canale', value: interaction.channel.name, inline: true }
        ]);
    }
};