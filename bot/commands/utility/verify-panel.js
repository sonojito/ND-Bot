const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify-panel')
        .setDescription('Crea un pannello di verifica')
        .addChannelOption(option =>
            option.setName('canale')
                .setDescription('Canale dove inviare il pannello')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('ruolo')
                .setDescription('Ruolo da assegnare dopo la verifica')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('titolo')
                .setDescription('Titolo del pannello')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('descrizione')
                .setDescription('Descrizione del pannello')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const channel = interaction.options.getChannel('canale');
        const role = interaction.options.getRole('ruolo');
        const title = interaction.options.getString('titolo') || '✅ Verifica Account';
        const description = interaction.options.getString('descrizione') || 
            'Benvenuto nel server!\n\nPer accedere a tutti i canali, clicca il pulsante qui sotto per verificare il tuo account.';

        // Verifica che il ruolo sia sotto il ruolo del bot
        const botMember = await interaction.guild.members.fetch(client.user.id);
        const botHighestRole = botMember.roles.highest;
        
        if (role.position >= botHighestRole.position) {
            return interaction.reply({
                content: '❌ Il ruolo selezionato è uguale o superiore al mio ruolo più alto! Non posso assegnarlo.',
                ephemeral: true
            });
        }

        // Crea embed
        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle(title)
            .setDescription(description)
            .addFields(
                { name: '📋 Ruolo assegnato', value: `${role}`, inline: true },
                { name: '✨ Come funziona', value: 'Clicca il pulsante per ottenere il ruolo verificato', inline: true }
            )
            .setFooter({ text: 'ND-Bot Verification System' })
            .setTimestamp();

        // Crea bottone
        const button = new ButtonBuilder()
            .setCustomId(`verify_${role.id}`)
            .setLabel('✅ Verificati')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅');

        const row = new ActionRowBuilder().addComponents(button);

        // Invia pannello
        try {
            await channel.send({ embeds: [embed], components: [row] });
            
            await interaction.reply({
                content: `✅ Pannello di verifica inviato in ${channel}!`,
                ephemeral: true
            });

            // Log
            await logger.logToDiscord(client, 'success', '✅ Pannello Verifica Creato', `Pannello di verifica creato`, [
                { name: 'Creato da', value: interaction.user.tag, inline: true },
                { name: 'Canale', value: channel.name, inline: true },
                { name: 'Ruolo', value: role.name, inline: true }
            ]);
        } catch (error) {
            logger.error('Errore invio pannello verifica:', error);
            await interaction.reply({
                content: '❌ Errore durante l\'invio del pannello. Verifica i miei permessi nel canale.',
                ephemeral: true
            });
        }
    }
};