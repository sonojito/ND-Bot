const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getPool } = require('../../utils/database');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rename')
        .setDescription('Rinomina il canale ticket')
        .addStringOption(option =>
            option.setName('nome')
                .setDescription('Nuovo nome del canale')
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(50))
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

        const newName = interaction.options.getString('nome');
        const oldName = interaction.channel.name;

        await interaction.channel.setName(newName);
        await interaction.reply(`✅ Canale rinominato da \`${oldName}\` a \`${newName}\``);

        // Log
        await logger.logToDiscord(client, 'info', '✏️ Ticket Rinominato', `Ticket rinominato`, [
            { name: 'Vecchio nome', value: oldName, inline: true },
            { name: 'Nuovo nome', value: newName, inline: true },
            { name: 'Modificato da', value: interaction.user.tag, inline: true }
        ]);
    }
};