const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getPool } = require('../../utils/database');
const { STAFF_ROLE_ID } = require('../../config');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Chiudi il ticket corrente')
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo della chiusura')
                .setRequired(false)),
    async execute(interaction, client) {
        const pool = getPool();
        
        // Verifica che sia un canale ticket
        const [tickets] = await pool.query(
            'SELECT * FROM tickets WHERE channel_id = ? AND closed = FALSE',
            [interaction.channel.id]
        );

        if (tickets.length === 0) {
            return interaction.reply({
                content: '❌ Questo non è un canale ticket o è già chiuso!',
                ephemeral: true
            });
        }

        const ticket = tickets[0];
        const reason = interaction.options.getString('motivo') || 'Nessun motivo specificato';

        // Verifica permessi
        const isOwner = interaction.user.id === ticket.user_id;
        const isStaff = interaction.member.roles.cache.has(STAFF_ROLE_ID);

        if (!isOwner && !isStaff) {
            return interaction.reply({
                content: '❌ Non hai i permessi per chiudere questo ticket!',
                ephemeral: true
            });
        }

        await interaction.reply('\u23f3 Chiusura ticket in corso...');

        // Aggiorna database
        await pool.query(
            'UPDATE tickets SET closed = TRUE, closed_at = NOW() WHERE id = ?',
            [ticket.id]
        );

        const embed = new EmbedBuilder()
            .setColor(0xe74c3c)
            .setTitle('🔒 Ticket Chiuso')
            .setDescription(`Il ticket #${ticket.ticket_number} è stato chiuso.`)
            .addFields(
                { name: 'Chiuso da', value: `${interaction.user.tag}`, inline: true },
                { name: 'Motivo', value: reason, inline: true },
                { name: 'Azione', value: 'Il canale verrà eliminato tra 10 secondi', inline: false }
            )
            .setTimestamp();

        await interaction.channel.send({ embeds: [embed] });

        // Log
        await logger.logToDiscord(client, 'info', '🔒 Ticket Chiuso', `Ticket #${ticket.ticket_number} chiuso`, [
            { name: 'Chiuso da', value: `${interaction.user.tag}`, inline: true },
            { name: 'Motivo', value: reason, inline: true }
        ]);

        // Elimina canale dopo 10 secondi
        setTimeout(async () => {
            await interaction.channel.delete().catch(() => {});
        }, 10000);
    }
};