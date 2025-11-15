const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getPool } = require('../../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listfeedback')
        .setDescription('Mostra i feedback ricevuti')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const pool = getPool();
        
        const [feedbacks] = await pool.query(
            'SELECT * FROM feedback WHERE guild_id = ? ORDER BY created_at DESC LIMIT 10',
            [interaction.guild.id]
        );

        if (feedbacks.length === 0) {
            return interaction.editReply('📦 Nessun feedback ricevuto!');
        }

        const feedbackList = await Promise.all(feedbacks.map(async (fb, index) => {
            const user = await client.users.fetch(fb.user_id).catch(() => ({ tag: 'Sconosciuto' }));
            const date = new Date(fb.created_at);
            return `**${index + 1}.** ${user.tag} - <t:${Math.floor(date.getTime() / 1000)}:R>\n` +
                   `   ${fb.content.substring(0, 100)}${fb.content.length > 100 ? '...' : ''}`;
        }));

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('💬 Lista Feedback')
            .setDescription(feedbackList.join('\n\n'))
            .setFooter({ text: `Ultimi ${feedbacks.length} feedback` })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};