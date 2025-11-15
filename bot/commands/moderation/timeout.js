const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Metti un utente in timeout')
        .addUserOption(option =>
            option.setName('utente')
                .setDescription('Utente da mettere in timeout')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('durata')
                .setDescription('Durata in minuti (1-40320 = 28 giorni)')
                .setMinValue(1)
                .setMaxValue(40320)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo del timeout')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction, client) {
        const target = interaction.options.getUser('utente');
        const duration = interaction.options.getInteger('durata');
        const reason = interaction.options.getString('motivo') || 'Nessun motivo specificato';

        const member = await interaction.guild.members.fetch(target.id).catch(() => null);
        
        if (!member) {
            return interaction.reply({
                content: '❌ Utente non trovato nel server!',
                ephemeral: true
            });
        }

        if (!member.moderatable) {
            return interaction.reply({
                content: '❌ Non posso mettere in timeout questo utente (ruolo superiore o permessi insufficienti)',
                ephemeral: true
            });
        }

        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: '❌ Non puoi mettere te stesso in timeout!',
                ephemeral: true
            });
        }

        await member.timeout(duration * 60 * 1000, `${interaction.user.tag}: ${reason}`);

        const embed = new EmbedBuilder()
            .setColor(0xf39c12)
            .setTitle('⏱️ Timeout Applicato')
            .addFields(
                { name: 'Utente', value: `${target.tag} (${target.id})`, inline: true },
                { name: 'Moderatore', value: `${interaction.user.tag}`, inline: true },
                { name: 'Durata', value: `${duration} minuti`, inline: true },
                { name: 'Scade', value: `<t:${Math.floor((Date.now() + duration * 60 * 1000) / 1000)}:R>`, inline: true },
                { name: 'Motivo', value: reason, inline: false }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // Log
        await logger.logToDiscord(client, 'warning', '⏱️ Timeout Applicato', `${target.tag} in timeout per ${duration} minuti`, [
            { name: 'Moderatore', value: interaction.user.tag, inline: true },
            { name: 'Motivo', value: reason, inline: true }
        ]);
    }
};