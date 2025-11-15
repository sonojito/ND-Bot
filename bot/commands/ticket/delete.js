const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getPool } = require('../../utils/database');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Elimina immediatamente il ticket')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction, client) {
        const pool = getPool();
        
        // Verifica che sia un canale ticket
        const [tickets] = await pool.query(
            'SELECT * FROM tickets WHERE channel_id = ?',
            [interaction.channel.id]
        );

        if (tickets.length === 0) {
            return interaction.reply({
                content: '❌ Questo non è un canale ticket!',
                ephemeral: true
            });
        }

        const ticket = tickets[0];

        await interaction.reply('❌ Il ticket verrà eliminato tra 3 secondi...');

        // Aggiorna database
        await pool.query(
            'UPDATE tickets SET closed = TRUE, closed_at = NOW() WHERE id = ?',
            [ticket.id]
        );

        // Log
        await logger.logToDiscord(client, 'warning', '🗑️ Ticket Eliminato', `Ticket #${ticket.ticket_number} eliminato`, [
            { name: 'Eliminato da', value: interaction.user.tag, inline: true },
            { name: 'Canale', value: interaction.channel.name, inline: true }
        ]);

        // Elimina canale
        setTimeout(async () => {
            await interaction.channel.delete().catch(() => {});
        }, 3000);
    }
};