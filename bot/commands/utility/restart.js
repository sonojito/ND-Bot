const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Riavvia il bot (solo owner)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        // Verifica che sia l'owner del server
        if (interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({
                content: '❌ Solo il proprietario del server può riavviare il bot!',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0xf39c12)
            .setTitle('🔄 Riavvio Bot')
            .setDescription('Il bot si sta riavviando...\nSarà online tra pochi istanti.')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // Log
        await logger.logToDiscord(client, 'warning', '🔄 Bot Riavviato', `Il bot è stato riavviato da ${interaction.user.tag}`);

        // Attendi 2 secondi prima di riavviare
        setTimeout(() => {
            process.exit(0);
        }, 2000);
    }
};