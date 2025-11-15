const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Invia un annuncio in un canale')
        .addChannelOption(option =>
            option.setName('canale')
                .setDescription('Canale dove inviare l\'annuncio')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('titolo')
                .setDescription('Titolo dell\'annuncio')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('messaggio')
                .setDescription('Contenuto dell\'annuncio')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('colore')
                .setDescription('Colore dell\'embed')
                .addChoices(
                    { name: 'Blu', value: '3498db' },
                    { name: 'Verde', value: '2ecc71' },
                    { name: 'Rosso', value: 'e74c3c' },
                    { name: 'Giallo', value: 'f39c12' },
                    { name: 'Viola', value: '9b59b6' }
                )
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('ping')
                .setDescription('Menziona @everyone')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client) {
        const channel = interaction.options.getChannel('canale');
        const title = interaction.options.getString('titolo');
        const message = interaction.options.getString('messaggio');
        const color = parseInt(interaction.options.getString('colore') || '3498db', 16);
        const ping = interaction.options.getBoolean('ping') || false;

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(`📢 ${title}`)
            .setDescription(message)
            .setFooter({ text: `Annuncio di ${interaction.user.tag}` })
            .setTimestamp();

        const content = ping ? '@everyone' : null;
        await channel.send({ content, embeds: [embed] });

        await interaction.reply({
            content: `✅ Annuncio inviato in ${channel}!`,
            ephemeral: true
        });

        // Log
        await logger.logToDiscord(client, 'info', '📢 Annuncio Inviato', `Annuncio inviato in ${channel.name}`, [
            { name: 'Autore', value: interaction.user.tag, inline: true },
            { name: 'Titolo', value: title, inline: true },
            { name: 'Ping', value: ping ? 'Sì' : 'No', inline: true }
        ]);
    }
};