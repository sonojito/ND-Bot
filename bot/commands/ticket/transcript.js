const { SlashCommandBuilder, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');
const { getPool } = require('../../utils/database');
const discordTranscripts = require('discord-html-transcripts');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transcript')
        .setDescription('Genera una trascrizione del ticket')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client) {
        const pool = getPool();
        
        // Verifica che sia un canale ticket
        const [tickets] = await pool.query(
            'SELECT * FROM tickets WHERE channel_id = ?',
            [interaction.channel.id]
        );

        if (tickets.length === 0) {
            return interaction.reply({
                content: '❌ Questo non è un canale ticket!',
                ephemeral: true
            });
        }

        await interaction.reply('\u23f3 Generazione trascrizione in corso...');

        try {
            const ticket = tickets[0];
            const attachment = await discordTranscripts.createTranscript(interaction.channel, {
                limit: -1,
                returnType: 'attachment',
                filename: `transcript-${ticket.ticket_number}.html`,
                saveImages: true,
                poweredBy: false
            });

            await interaction.editReply({
                content: `✅ Trascrizione generata per il ticket #${ticket.ticket_number}`,
                files: [attachment]
            });

            // Log
            await logger.logToDiscord(client, 'info', '📄 Trascrizione Generata', `Trascrizione ticket #${ticket.ticket_number}`, [
                { name: 'Generata da', value: interaction.user.tag, inline: true },
                { name: 'Canale', value: interaction.channel.name, inline: true }
            ]);
        } catch (error) {
            logger.error('Errore generazione transcript:', error);
            await interaction.editReply('❌ Errore durante la generazione della trascrizione.');
        }
    }
};