const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Mostra informazioni sul bot'),
    async execute(interaction, client) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime % 60);

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('ℹ️ Informazioni Bot')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: '📊 Server', value: `${client.guilds.cache.size}`, inline: true },
                { name: '👥 Utenti', value: `${client.users.cache.size}`, inline: true },
                { name: '📝 Comandi', value: `${client.commands.size}`, inline: true },
                { name: '⏰ Uptime', value: `${days}d ${hours}h ${minutes}m ${seconds}s`, inline: true },
                { name: '💾 Memoria', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
                { name: '🟢 Ping', value: `${client.ws.ping}ms`, inline: true },
                { name: '📚 Libreria', value: `Discord.js v${require('discord.js').version}`, inline: true },
                { name: '🔧 Node.js', value: process.version, inline: true },
                { name: '🖥️ Sistema', value: `${os.platform()} ${os.arch()}`, inline: true }
            )
            .setFooter({ text: 'ND-Bot by NeonDevs' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};