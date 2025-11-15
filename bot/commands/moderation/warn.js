const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getPool } = require('../../utils/database');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Avvisa un utente')
        .addUserOption(option =>
            option.setName('utente')
                .setDescription('Utente da avvisare')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo dell\'avviso')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction, client) {
        const target = interaction.options.getUser('utente');
        const reason = interaction.options.getString('motivo');

        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: '❌ Non puoi avvisare te stesso!',
                ephemeral: true
            });
        }

        const pool = getPool();
        
        // Aggiungi warning al database
        await pool.query(
            'INSERT INTO warnings (guild_id, user_id, moderator_id, reason) VALUES (?, ?, ?, ?)',
            [interaction.guild.id, target.id, interaction.user.id, reason]
        );

        // Conta warnings totali
        const [rows] = await pool.query(
            'SELECT COUNT(*) as count FROM warnings WHERE guild_id = ? AND user_id = ?',
            [interaction.guild.id, target.id]
        );
        const warnCount = rows[0].count;

        const embed = new EmbedBuilder()
            .setColor(0xf39c12)
            .setTitle('⚠️ Avviso Emesso')
            .addFields(
                { name: 'Utente', value: `${target.tag} (${target.id})`, inline: true },
                { name: 'Moderatore', value: `${interaction.user.tag}`, inline: true },
                { name: 'Avvisi totali', value: `${warnCount}`, inline: true },
                { name: 'Motivo', value: reason, inline: false }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // Invia DM all'utente
        try {
            await target.send({
                embeds: [new EmbedBuilder()
                    .setColor(0xf39c12)
                    .setTitle(`⚠️ Hai ricevuto un avviso in ${interaction.guild.name}`)
                    .setDescription(`**Motivo:** ${reason}`)
                    .addFields({ name: 'Avvisi totali', value: `${warnCount}` })
                    .setTimestamp()
                ]
            });
        } catch (error) {
            // Utente ha DM disabilitati
        }

        // Log
        await logger.logToDiscord(client, 'warning', '⚠️ Warning Emesso', `${target.tag} ha ricevuto un avviso (${warnCount} totali)`, [
            { name: 'Moderatore', value: interaction.user.tag, inline: true },
            { name: 'Motivo', value: reason, inline: true }
        ]);
    }
};