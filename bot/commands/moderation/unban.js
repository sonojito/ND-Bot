const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Rimuovi il ban da un utente')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('ID dell\'utente da sbannare')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo dello sban')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('motivo') || 'Nessun motivo specificato';

        await interaction.deferReply();

        try {
            const ban = await interaction.guild.bans.fetch(userId).catch(() => null);
            
            if (!ban) {
                return interaction.editReply('❌ Questo utente non è bannato!');
            }

            await interaction.guild.bans.remove(userId, `${interaction.user.tag}: ${reason}`);

            const embed = new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('✅ Utente Sbannato')
                .addFields(
                    { name: 'Utente', value: `${ban.user.tag} (${ban.user.id})`, inline: true },
                    { name: 'Moderatore', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Motivo', value: reason, inline: false }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

            // Log
            await logger.logToDiscord(client, 'success', '✅ Unban Eseguito', `${ban.user.tag} è stato sbannato`, [
                { name: 'Moderatore', value: interaction.user.tag, inline: true },
                { name: 'Motivo', value: reason, inline: true }
            ]);
        } catch (error) {
            await interaction.editReply('❌ Errore durante lo sban. Verifica che l\'ID sia corretto.');
        }
    }
};