const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getPool } = require('../../utils/database');
const { TICKET_CATEGORY_ID, STAFF_ROLE_ID } = require('../../config');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('Crea un nuovo ticket')
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo del ticket')
                .setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const pool = getPool();
        
        // Verifica ticket esistenti
        const [existing] = await pool.query(
            'SELECT * FROM tickets WHERE guild_id = ? AND user_id = ? AND closed = FALSE',
            [interaction.guild.id, interaction.user.id]
        );

        if (existing.length > 0) {
            return interaction.editReply('❌ Hai già un ticket aperto!');
        }

        const reason = interaction.options.getString('motivo');

        // Conta ticket totali per numero
        const [countResult] = await pool.query(
            'SELECT COUNT(*) as count FROM tickets WHERE guild_id = ?',
            [interaction.guild.id]
        );
        const ticketNumber = countResult[0].count + 1;

        // Crea canale ticket
        const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${ticketNumber}`,
            type: ChannelType.GuildText,
            parent: TICKET_CATEGORY_ID,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                },
                {
                    id: STAFF_ROLE_ID,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                }
            ]
        });

        // Salva nel database
        await pool.query(
            'INSERT INTO tickets (guild_id, channel_id, user_id, ticket_number) VALUES (?, ?, ?, ?)',
            [interaction.guild.id, ticketChannel.id, interaction.user.id, ticketNumber]
        );

        // Messaggio iniziale
        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle(`🎫 Ticket #${ticketNumber}`)
            .setDescription(`**Motivo:** ${reason}\n\nUn membro dello staff ti assisterà a breve.\nPer chiudere il ticket usa \`/close\``)
            .addFields(
                { name: 'Aperto da', value: `${interaction.user}`, inline: true },
                { name: 'Data', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
            )
            .setFooter({ text: 'Rispondi in questo canale per comunicare con lo staff' });

        await ticketChannel.send({ content: `${interaction.user} <@&${STAFF_ROLE_ID}>`, embeds: [embed] });
        await interaction.editReply(`✅ Ticket creato: ${ticketChannel}`);

        // Log
        await logger.logToDiscord(client, 'info', '🎫 Ticket Creato', `Ticket #${ticketNumber} creato`, [
            { name: 'Utente', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
            { name: 'Canale', value: ticketChannel.name, inline: true },
            { name: 'Motivo', value: reason, inline: false }
        ]);
    }
};