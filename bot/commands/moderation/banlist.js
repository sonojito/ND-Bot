const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banlist')
        .setDescription('Mostra la lista degli utenti bannati')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        await interaction.deferReply();

        const bans = await interaction.guild.bans.fetch();

        if (bans.size === 0) {
            return interaction.editReply('✅ Nessun utente bannato!');
        }

        const banList = bans.map((ban, index) => {
            const reason = ban.reason || 'Nessun motivo';
            return `${index + 1}. **${ban.user.tag}** (${ban.user.id})\n   Motivo: ${reason}`;
        }).slice(0, 10).join('\n\n');

        const embed = new EmbedBuilder()
            .setColor(0xe74c3c)
            .setTitle(`🚫 Lista Ban (${bans.size} totali)`)
            .setDescription(banList)
            .setFooter({ text: `Mostrando i primi 10 ban` })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};