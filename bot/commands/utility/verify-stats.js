const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getPool } = require('../../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify-stats')
        .setDescription('Mostra statistiche delle verifiche')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const pool = getPool();
            
            // Statistiche totali
            const [totalResult] = await pool.query(
                'SELECT COUNT(*) as count FROM verifications WHERE guild_id = ?',
                [interaction.guild.id]
            );

            // Verifiche ultime 24h
            const [recentResult] = await pool.query(
                'SELECT COUNT(*) as count FROM verifications WHERE guild_id = ? AND verified_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)',
                [interaction.guild.id]
            );

            // Verifiche ultime 7 giorni
            const [weekResult] = await pool.query(
                'SELECT COUNT(*) as count FROM verifications WHERE guild_id = ? AND verified_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)',
                [interaction.guild.id]
            );

            // Ultime 10 verifiche
            const [recentVerifications] = await pool.query(
                'SELECT user_id, verified_at FROM verifications WHERE guild_id = ? ORDER BY verified_at DESC LIMIT 10',
                [interaction.guild.id]
            );

            const recentList = await Promise.all(
                recentVerifications.map(async (v) => {
                    const user = await client.users.fetch(v.user_id).catch(() => ({ tag: 'Sconosciuto' }));
                    return `• ${user.tag} - <t:${Math.floor(new Date(v.verified_at).getTime() / 1000)}:R>`;
                })
            );

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('📊 Statistiche Verifiche')
                .addFields(
                    { name: '📈 Totale Verifiche', value: `${totalResult[0].count}`, inline: true },
                    { name: '🕐 Ultime 24h', value: `${recentResult[0].count}`, inline: true },
                    { name: '📅 Ultimi 7 giorni', value: `${weekResult[0].count}`, inline: true }
                )
                .setTimestamp();

            if (recentList.length > 0) {
                embed.addFields({
                    name: '🔄 Ultime Verifiche',
                    value: recentList.join('\n') || 'Nessuna verifica recente',
                    inline: false
                });
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            // Se la tabella non esiste, informazioni base
            const embed = new EmbedBuilder()
                .setColor(0xf39c12)
                .setTitle('📊 Statistiche Verifiche')
                .setDescription('ℹ️ Nessuna verifica registrata ancora o tabella non creata.\n\nLe statistiche saranno disponibili dopo la prima verifica.');

            await interaction.editReply({ embeds: [embed] });
        }
    }
};