const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getPool } = require('../../utils/database');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('closeall')
        .setDescription('Chiudi tutti i ticket aperti')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        await interaction.deferReply();

        const pool = getPool();
        
        // Ottieni tutti i ticket aperti
        const [tickets] = await pool.query(
            'SELECT * FROM tickets WHERE guild_id = ? AND closed = FALSE',
            [interaction.guild.id]
        );

        if (tickets.length === 0) {
            return interaction.editReply('✅ Nessun ticket aperto da chiudere!');
        }

        let closed = 0;
        let errors = 0;

        for (const ticket of tickets) {
            try {
                const channel = await interaction.guild.channels.fetch(ticket.channel_id).catch(() => null);
                
                if (channel) {
                    const embed = new EmbedBuilder()
                        .setColor(0xe74c3c)
                        .setTitle('🔒 Ticket Chiuso Automaticamente')
                        .setDescription('Questo ticket è stato chiuso da un amministratore.\nIl canale verrà eliminato tra 5 secondi.')
                        .setTimestamp();

                    await channel.send({ embeds: [embed] });
                    
                    setTimeout(async () => {
                        await channel.delete().catch(() => {});
                    }, 5000);
                }

                // Aggiorna database
                await pool.query(
                    'UPDATE tickets SET closed = TRUE, closed_at = NOW() WHERE id = ?',
                    [ticket.id]
                );

                closed++;
            } catch (error) {
                errors++;
                logger.error(`Errore chiusura ticket ${ticket.id}:`, error);
            }
        }

        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle('✅ Operazione Completata')
            .addFields(
                { name: 'Ticket chiusi', value: `${closed}`, inline: true },
                { name: 'Errori', value: `${errors}`, inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

        // Log
        await logger.logToDiscord(client, 'warning', '🔒 Closeall Eseguito', `${closed} ticket chiusi`, [
            { name: 'Eseguito da', value: interaction.user.tag, inline: true },
            { name: 'Errori', value: `${errors}`, inline: true }
        ]);
    }
};