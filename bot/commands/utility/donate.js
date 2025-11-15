const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donate')
        .setDescription('Informazioni sulle donazioni'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0xf39c12)
            .setTitle('💛 Supporta ND-Bot')
            .setDescription('Grazie per il tuo interesse nel supportare il nostro progetto!\n\n' +
                          'Il tuo contributo ci aiuta a mantenere il bot online e a sviluppare nuove funzionalità.')
            .addFields(
                {
                    name: '🌟 Perché donare?',
                    value: '• Server e hosting\n' +
                           '• Sviluppo di nuove funzionalità\n' +
                           '• Manutenzione e supporto\n' +
                           '• Miglioramenti continui',
                    inline: false
                },
                {
                    name: '🎁 Vantaggi',
                    value: '• Ruolo donatore esclusivo\n' +
                           '• Badge speciale\n' +
                           '• Supporto prioritario\n' +
                           '• Accesso anticipato a nuove funzioni',
                    inline: false
                },
                {
                    name: '💳 Come donare',
                    value: 'Usa i pulsanti qui sotto per accedere alle piattaforme di donazione!',
                    inline: false
                }
            )
            .setFooter({ text: 'Ogni contributo è apprezzato! ❤️' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('PayPal')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://paypal.me/yourusername')
                    .setEmoji('💵'),
                new ButtonBuilder()
                    .setLabel('Ko-fi')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://ko-fi.com/yourusername')
                    .setEmoji('☕'),
                new ButtonBuilder()
                    .setLabel('GitHub Sponsor')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://github.com/sponsors/sonojito')
                    .setEmoji('⭐')
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    }
};