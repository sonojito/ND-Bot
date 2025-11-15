const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getPool } = require('../../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnlist')
        .setDescription('Mostra gli avvisi di un utente')
        .addUserOption(option =>
            option.setName('utente')
                .setDescription('Utente di cui vedere gli avvisi')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction, client) {
        const target = interaction.options.getUser('utente');

        await interaction.deferReply();

        const pool = getPool();
        
        const [warnings] = await pool.query(
            'SELECT * FROM warnings WHERE guild_id = ? AND user_id = ? ORDER BY created_at DESC',
            [interaction.guild.id, target.id]
        );

        if (warnings.length === 0) {
            return interaction.editReply(`✅ ${target.tag} non ha avvisi!`);
        }

        const warnList = await Promise.all(warnings.slice(0, 10).map(async (warn, index) => {
            const moderator = await client.users.fetch(warn.moderator_id).catch(() => ({ tag: 'Sconosciuto' }));
            const date = new Date(warn.created_at);
            return `**${warn.id}.** <t:${Math.floor(date.getTime() / 1000)}:R>\n` +
                   `   Moderatore: ${moderator.tag}\n` +
                   `   Motivo: ${warn.reason}`;
        }));

        const embed = new EmbedBuilder()
            .setColor(0xf39c12)
            .setTitle(`⚠️ Avvisi di ${target.tag}`)
            .setDescription(warnList.join('\n\n'))
            .setFooter({ text: `Totale: ${warnings.length} avvisi` })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};