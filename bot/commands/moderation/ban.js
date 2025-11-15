const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banna un utente dal server')
        .addUserOption(option =>
            option.setName('utente')
                .setDescription('Utente da bannare')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo del ban')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('giorni')
                .setDescription('Giorni di messaggi da eliminare (0-7)')
                .setMinValue(0)
                .setMaxValue(7)
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        const target = interaction.options.getUser('utente');
        const reason = interaction.options.getString('motivo') || 'Nessun motivo specificato';
        const days = interaction.options.getInteger('giorni') || 0;

        const member = await interaction.guild.members.fetch(target.id).catch(() => null);
        
        if (member && !member.bannable) {
            return interaction.reply({
                content: '❌ Non posso bannare questo utente (ruolo superiore o permessi insufficienti)',
                ephemeral: true
            });
        }

        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: '❌ Non puoi bannare te stesso!',
                ephemeral: true
            });
        }

        await interaction.guild.members.ban(target, {
            deleteMessageSeconds: days * 24 * 60 * 60,
            reason: `${interaction.user.tag}: ${reason}`
        });

        const embed = new EmbedBuilder()
            .setColor(0xe74c3c)
            .setTitle('🔨 Utente Bannato')
            .addFields(
                { name: 'Utente', value: `${target.tag} (${target.id})`, inline: true },
                { name: 'Moderatore', value: `${interaction.user.tag}`, inline: true },
                { name: 'Motivo', value: reason, inline: false },
                { name: 'Messaggi eliminati', value: `Ultimi ${days} giorni`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // Log
        await logger.logToDiscord(client, 'warning', '🔨 Ban Eseguito', `${target.tag} è stato bannato`, [
            { name: 'Moderatore', value: interaction.user.tag, inline: true },
            { name: 'Motivo', value: reason, inline: true }
        ]);
    }
};