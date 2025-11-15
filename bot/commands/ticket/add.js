const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getPool } = require('../../utils/database');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Aggiungi un utente al ticket')
        .addUserOption(option =>
            option.setName('utente')
                .setDescription('Utente da aggiungere')
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

        const user = interaction.options.getUser('utente');
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({
                content: '❌ Utente non trovato nel server!',
                ephemeral: true
            });
        }

        // Aggiungi permessi
        await interaction.channel.permissionOverwrites.create(user.id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true
        });

        await interaction.reply(`✅ ${user} aggiunto al ticket!`);

        // Log
        await logger.logToDiscord(client, 'info', '➕ Utente Aggiunto al Ticket', `${user.tag} aggiunto al ticket`, [
            { name: 'Aggiunto da', value: interaction.user.tag, inline: true },
            { name: 'Canale', value: interaction.channel.name, inline: true }
        ]);
    }
};