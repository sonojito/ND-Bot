const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getPool } = require('../../utils/database');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription('Rimuovi un avviso da un utente')
        .addUserOption(option =>
            option.setName('utente')
                .setDescription('Utente da cui rimuovere l\'avviso')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('id')
                .setDescription('ID dell\'avviso da rimuovere (usa /warnlist per vedere)')
                .setRequired(true)
                .setMinValue(1))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction, client) {
        const target = interaction.options.getUser('utente');
        const warnId = interaction.options.getInteger('id');

        const pool = getPool();
        
        // Verifica che il warning esista
        const [warnings] = await pool.query(
            'SELECT * FROM warnings WHERE guild_id = ? AND user_id = ? AND id = ?',
            [interaction.guild.id, target.id, warnId]
        );

        if (warnings.length === 0) {
            return interaction.reply({
                content: '❌ Avviso non trovato!',
                ephemeral: true
            });
        }

        // Rimuovi warning
        await pool.query(
            'DELETE FROM warnings WHERE id = ?',
            [warnId]
        );

        // Conta warnings rimanenti
        const [rows] = await pool.query(
            'SELECT COUNT(*) as count FROM warnings WHERE guild_id = ? AND user_id = ?',
            [interaction.guild.id, target.id]
        );
        const remainingWarns = rows[0].count;

        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle('✅ Avviso Rimosso')
            .addFields(
                { name: 'Utente', value: `${target.tag} (${target.id})`, inline: true },
                { name: 'Moderatore', value: `${interaction.user.tag}`, inline: true },
                { name: 'ID Avviso', value: `${warnId}`, inline: true },
                { name: 'Avvisi rimanenti', value: `${remainingWarns}`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // Log
        await logger.logToDiscord(client, 'success', '✅ Warning Rimosso', `Avviso #${warnId} rimosso da ${target.tag}`, [
            { name: 'Moderatore', value: interaction.user.tag, inline: true },
            { name: 'Avvisi rimanenti', value: `${remainingWarns}`, inline: true }
        ]);
    }
};