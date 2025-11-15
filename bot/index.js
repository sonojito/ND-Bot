const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { TOKEN } = require('./config');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const { initDatabase } = require('./utils/database');
const errorHandler = require('./utils/errorHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,
    ],
    partials: [Partials.Channel]
});

client.commands = new Collection();

// Carica comandi
const commandFolders = ['info', 'moderation', 'utility', 'ticket'];
for (const folder of commandFolders) {
    const commandPath = path.join(__dirname, 'commands', folder);
    if (!fs.existsSync(commandPath)) continue;
    
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
}

// Carica eventi
const eventPath = path.join(__dirname, 'events');
if (fs.existsSync(eventPath)) {
    const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
}

// Gestione errori globale
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled promise rejection:', error);
    errorHandler.handleError(error, client);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error);
    errorHandler.handleError(error, client);
});

// Inizializza database
initDatabase().then(() => {
    // Login
    client.login(TOKEN).catch(error => {
        logger.error('Errore durante il login:', error);
        process.exit(1);
    });
}).catch(error => {
    logger.error('Errore inizializzazione database:', error);
    process.exit(1);
});