const logger = require('../utils/logger');
const { getPool } = require('../utils/database');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        // Gestisci solo i bottoni di verifica
        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith('verify_')) return;

        const roleId = interaction.customId.replace('verify_', '');
        const role = await interaction.guild.roles.fetch(roleId).catch(() => null);

        if (!role) {
            return interaction.reply({
                content: '❌ Errore: Ruolo non trovato. Contatta un amministratore.',
                ephemeral: true
            });
        }

        const member = interaction.member;

        // Verifica se ha già il ruolo
        if (member.roles.cache.has(roleId)) {
            return interaction.reply({
                content: `ℹ️ Hai già il ruolo ${role}!`,
                ephemeral: true
            });
        }

        try {
            // Assegna il ruolo
            await member.roles.add(role);

            // Salva nel database
            const pool = getPool();
            await pool.query(
                'INSERT INTO verifications (guild_id, user_id, role_id, verified_at) VALUES (?, ?, ?, NOW())',
                [interaction.guild.id, interaction.user.id, roleId]
            ).catch(() => {
                // Ignora errore se la tabella non esiste ancora
            });

            // Risposta all'utente
            await interaction.reply({
                embeds: [{
                    color: 0x2ecc71,
                    title: '✅ Verifica Completata!',
                    description: `Hai ricevuto il ruolo ${role}!\n\nOra puoi accedere a tutti i canali del server.`,
                    timestamp: new Date().toISOString()
                }],
                ephemeral: true
            });

            // Log
            await logger.logToDiscord(client, 'success', '✅ Utente Verificato', `${interaction.user.tag} si è verificato`, [
                { name: 'Utente', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                { name: 'Ruolo', value: role.name, inline: true },
                { name: 'Canale', value: interaction.channel.name, inline: true }
            ]);

            logger.info(`Utente verificato: ${interaction.user.tag} nel server ${interaction.guild.name}`);

        } catch (error) {
            logger.error('Errore assegnazione ruolo verifica:', error);
            
            await interaction.reply({
                content: '❌ Errore durante l\'assegnazione del ruolo. Contatta un amministratore.',
                ephemeral: true
            }).catch(() => {});

            // Log errore
            await logger.logToDiscord(client, 'error', '❌ Errore Verifica', `Errore durante la verifica di ${interaction.user.tag}`, [
                { name: 'Errore', value: error.message, inline: false }
            ]);
        }
    }
};