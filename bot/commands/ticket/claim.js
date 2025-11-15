const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getPool } = require('../../utils/database');
const { STAFF_ROLE_ID } = require('../../config');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('claim')
        .setDescription('Prendi in carico questo ticket')
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

        if (ticket.claimed) {
            const claimer = await client.users.fetch(ticket.claimed_by).catch(() => ({ tag: 'Sconosciuto' }));
            return interaction.reply({
                content: `❌ Questo ticket è già stato preso in carico da ${claimer.tag}!`,
                ephemeral: true
            });
        }

        // Aggiorna database
        await pool.query(
            'UPDATE tickets SET claimed = TRUE, claimed_by = ? WHERE id = ?',
            [interaction.user.id, ticket.id]
        );

        const embed = new EmbedBuilder()
            .setColor(0xf39c12)
            .setTitle('👤 Ticket Preso in Carico')
            .setDescription(`${interaction.user} ha preso in carico questo ticket.`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // Log
        await logger.logToDiscord(client, 'info', '👤 Ticket Claimed', `Ticket #${ticket.ticket_number} preso in carico`, [
            { name: 'Staff', value: interaction.user.tag, inline: true },
            { name: 'Canale', value: interaction.channel.name, inline: true }
        ]);
    }
};