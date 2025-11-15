const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getPool } = require('../../utils/database');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Invia un feedback agli sviluppatori')
        .addStringOption(option =>
            option.setName('messaggio')
                .setDescription('Il tuo feedback')
                .setRequired(true)
                .setMinLength(10)
                .setMaxLength(1000)),
    async execute(interaction, client) {
        const content = interaction.options.getString('messaggio');

        const pool = getPool();
        
        // Salva feedback nel database
        await pool.query(
            'INSERT INTO feedback (guild_id, user_id, content) VALUES (?, ?, ?)',
            [interaction.guild.id, interaction.user.id, content]
        );

        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle('✅ Feedback Inviato')
            .setDescription('Grazie per il tuo feedback! Gli sviluppatori lo riceveranno al più presto.')
            .addFields(
                { name: 'Il tuo messaggio', value: content }
            )
            .setFooter({ text: 'Il tuo feedback è importante per noi!' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });

        // Log
        await logger.logToDiscord(client, 'info', '💬 Nuovo Feedback', `Feedback ricevuto da ${interaction.user.tag}`, [
            { name: 'Utente', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
            { name: 'Server', value: interaction.guild.name, inline: true },
            { name: 'Messaggio', value: content.substring(0, 1000), inline: false }
        ]);
    }
};