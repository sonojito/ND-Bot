const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getPool } = require('../../utils/database');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Rimuovi un utente dal ticket')
        .addUserOption(option =>
            option.setName('utente')
                .setDescription('Utente da rimuovere')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
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
        const user = interaction.options.getUser('utente');

        if (user.id === ticket.user_id) {
            return interaction.reply({
                content: '❌ Non puoi rimuovere il creatore del ticket!',
                ephemeral: true
            });
        }

        // Rimuovi permessi
        await interaction.channel.permissionOverwrites.delete(user.id);

        await interaction.reply(`✅ ${user} rimosso dal ticket!`);

        // Log
        await logger.logToDiscord(client, 'info', '➖ Utente Rimosso dal Ticket', `${user.tag} rimosso dal ticket`, [
            { name: 'Rimosso da', value: interaction.user.tag, inline: true },
            { name: 'Canale', value: interaction.channel.name, inline: true }
        ]);
    }
};