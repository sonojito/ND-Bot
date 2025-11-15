const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getPool } = require('../../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Mostra tutti i ticket aperti')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const pool = getPool();
        
        const [tickets] = await pool.query(
            'SELECT * FROM tickets WHERE guild_id = ? AND closed = FALSE ORDER BY created_at DESC',
            [interaction.guild.id]
        );

        if (tickets.length === 0) {
            return interaction.editReply('✅ Nessun ticket aperto!');
        }

        const ticketList = await Promise.all(tickets.slice(0, 10).map(async (ticket) => {
            const user = await client.users.fetch(ticket.user_id).catch(() => ({ tag: 'Sconosciuto' }));
            const claimed = ticket.claimed ? '👤 Assegnato' : '⏳ In attesa';
            const date = new Date(ticket.created_at);
            return `**#${ticket.ticket_number}** - ${user.tag}\n` +
                   `   <#${ticket.channel_id}> | ${claimed} | <t:${Math.floor(date.getTime() / 1000)}:R>`;
        }));

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle(`🎫 Ticket Aperti (${tickets.length})`)
            .setDescription(ticketList.join('\n\n'))
            .setFooter({ text: tickets.length > 10 ? 'Mostrando i primi 10 ticket' : `Totale: ${tickets.length}` })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};