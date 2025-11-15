const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changelog')
        .setDescription('Mostra le ultime modifiche al bot'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle('📝 Changelog')
            .setDescription('Ecco le ultime novità del bot!')
            .addFields(
                {
                    name: '🆕 Versione 1.0.0 - 15/11/2025',
                    value: '```diff\n' +
                           '+ Sistema ticket completo\n' +
                           '+ Comandi di moderazione\n' +
                           '+ Sistema warning con database MySQL\n' +
                           '+ Logging automatico\n' +
                           '+ Gestione errori avanzata\n' +
                           '+ Dashboard Next.js\n' +
                           '```',
                    inline: false
                },
                {
                    name: '🔧 Funzionalità Principali',
                    value: '• **Info:** info, links, members\n' +
                           '• **Moderazione:** ban, kick, warn, timeout\n' +
                           '• **Utility:** announce, feedback, donate\n' +
                           '• **Ticket:** sistema completo di ticketing',
                    inline: false
                },
                {
                    name: '🔗 Link Utili',
                    value: '[GitHub Repository](https://github.com/sonojito/ND-Bot)\n' +
                           '[Documentazione](https://github.com/sonojito/ND-Bot#readme)',
                    inline: false
                }
            )
            .setFooter({ text: 'ND-Bot by NeonDevs' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};