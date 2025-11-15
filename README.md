# ND-Bot

Bot Discord multipurpose con sistema ticket, moderazione, utility e pannello Next.js.

## Funzionalità

### Info
- `/info` - Informazioni sul bot
- `/links` - Link utili
- `/members` - Conteggio membri

### Moderazione
- `/ban` - Banna un utente
- `/banlist` - Lista utenti bannati
- `/clear` - Cancella messaggi
- `/kick` - Espelli un utente
- `/timeout` - Timeout utente
- `/unban` - Rimuovi ban
- `/warn` - Avvisa un utente
- `/unwarn` - Rimuovi avviso
- `/warnlist` - Lista avvisi

### Utility
- `/announce` - Annuncio
- `/changelog` - Changelog bot
- `/donate` - Info donazioni
- `/feedback` - Invia feedback
- `/listfeedback` - Lista feedback
- `/restart` - Riavvia bot

### Ticket
- `/create` - Crea ticket
- `/close` - Chiudi ticket
- `/closeall` - Chiudi tutti i ticket
- `/add` - Aggiungi utente
- `/remove` - Rimuovi utente
- `/claim` - Prendi in carico
- `/unclaim` - Rilascia ticket
- `/rename` - Rinomina ticket
- `/transcript` - Trascrizione
- `/list` - Lista ticket
- `/delete` - Elimina ticket

## Installazione

```bash
# Clona repository
git clone https://github.com/sonojito/ND-Bot.git
cd ND-Bot

# Installa dipendenze
npm install

# Configura .env
cp .env.example .env
# Modifica .env con i tuoi dati

# Crea database MySQL
mysql -u root -p
CREATE DATABASE discord_bot;

# Avvia bot
npm start
```

## Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Dashboard disponibile su http://localhost:3000

## Caratteristiche

- ✅ Sistema logging completo
- ✅ Gestione errori robustaErrori non causano crash
- ✅ Database MySQL
- ✅ Sistema ticket avanzato
- ✅ Pannello web Next.js
- ✅ Tutti i comandi organizzati per categoria

## License

MIT