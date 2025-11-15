const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Espelli un utente dal server')
        .addUserOption(option =>
            option.setName('utente')
                .setDescription('Utente da espellere')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo dell\'espulsione')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction, client) {
        const target = interaction.options.getUser('utente');
        const reason = interaction.options.getString('motivo') || 'Nessun motivo specificato';

        const member = await interaction.guild.members.fetch(target.id).catch(() => null);
        
        if (!member) {
            return interaction.reply({
                content: '❌ Utente non trovato nel server!',
                ephemeral: true
            });
        }

        if (!member.kickable) {
            return interaction.reply({
                content: '❌ Non posso espellere questo utente (ruolo superiore o permessi insufficienti)',
                ephemeral: true
            });
        }

        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: '❌ Non puoi espellere te stesso!',
                ephemeral: true
            });
        }

        await member.kick(`${interaction.user.tag}: ${reason}`);

        const embed = new EmbedBuilder()
            .setColor(0xf39c12)
            .setTitle('👢 Utente Espulso')
            .addFields(
                { name: 'Utente', value: `${target.tag} (${target.id})`, inline: true },
                { name: 'Moderatore', value: `${interaction.user.tag}`, inline: true },
                { name: 'Motivo', value: reason, inline: false }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // Log
        await logger.logToDiscord(client, 'warning', '👢 Kick Eseguito', `${target.tag} è stato espulso`, [
            { name: 'Moderatore', value: interaction.user.tag, inline: true },
            { name: 'Motivo', value: reason, inline: true }
        ]);
    }
};