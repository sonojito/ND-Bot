const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('links')
        .setDescription('Mostra link utili del server'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle('🔗 Link Utili')
            .setDescription('Ecco i link più importanti del nostro server!')
            .addFields(
                { name: '🌐 Sito Web', value: '[Visita il sito](https://www.neondevs.com)', inline: false },
                { name: '🐛 GitHub', value: '[Repository GitHub](https://github.com/sonojito/ND-Bot)', inline: false },
                { name: '👤 Supporto', value: 'Apri un ticket con `/create`', inline: false },
                { name: '💬 Discord', value: 'Sei già qui! 😄', inline: false },
                { name: '💙 Donazioni', value: 'Usa `/donate` per info', inline: false }
            )
            .setFooter({ text: 'Grazie per il tuo supporto!' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};