const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Cancella messaggi da un canale')
        .addIntegerOption(option =>
            option.setName('quantita')
                .setDescription('Numero di messaggi da cancellare (1-100)')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true))
        .addUserOption(option =>
            option.setName('utente')
                .setDescription('Cancella solo i messaggi di questo utente')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client) {
        const amount = interaction.options.getInteger('quantita');
        const targetUser = interaction.options.getUser('utente');

        await interaction.deferReply({ ephemeral: true });

        const messages = await interaction.channel.messages.fetch({ limit: 100 });
        
        let toDelete = messages.filter(msg => {
            const isRecent = Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000;
            if (!isRecent) return false;
            if (targetUser) return msg.author.id === targetUser.id;
            return true;
        }).first(amount);

        const deleted = await interaction.channel.bulkDelete(toDelete, true);

        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle('✅ Messaggi Cancellati')
            .setDescription(`Cancellati **${deleted.size}** messaggi${targetUser ? ` di ${targetUser.tag}` : ''}`)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

        // Log
        await logger.logToDiscord(client, 'info', '🗑️ Clear Eseguito', `${deleted.size} messaggi cancellati in ${interaction.channel.name}`, [
            { name: 'Moderatore', value: interaction.user.tag, inline: true },
            { name: 'Canale', value: interaction.channel.name, inline: true },
            { name: 'Utente target', value: targetUser ? targetUser.tag : 'Tutti', inline: true }
        ]);

        // Elimina il messaggio di conferma dopo 5 secondi
        setTimeout(() => {
            interaction.deleteReply().catch(() => {});
        }, 5000);
    }
};