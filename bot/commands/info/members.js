const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('members')
        .setDescription('Mostra statistiche membri del server'),
    async execute(interaction, client) {
        const guild = interaction.guild;
        
        await guild.members.fetch();
        
        const totalMembers = guild.memberCount;
        const humans = guild.members.cache.filter(member => !member.user.bot).size;
        const bots = guild.members.cache.filter(member => member.user.bot).size;
        const online = guild.members.cache.filter(member => member.presence?.status === 'online').size;
        const idle = guild.members.cache.filter(member => member.presence?.status === 'idle').size;
        const dnd = guild.members.cache.filter(member => member.presence?.status === 'dnd').size;
        const offline = totalMembers - online - idle - dnd;

        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle('👥 Statistiche Membri')
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: '📊 Totale Membri', value: `${totalMembers}`, inline: true },
                { name: '👤 Umani', value: `${humans}`, inline: true },
                { name: '🤖 Bot', value: `${bots}`, inline: true },
                { name: '🟢 Online', value: `${online}`, inline: true },
                { name: '🟡 Assente', value: `${idle}`, inline: true },
                { name: '🔴 Non Disturbare', value: `${dnd}`, inline: true },
                { name: '⚫ Offline', value: `${offline}`, inline: true },
                { name: '📅 Server creato', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '👑 Proprietario', value: `<@${guild.ownerId}>`, inline: true }
            )
            .setFooter({ text: guild.name })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};