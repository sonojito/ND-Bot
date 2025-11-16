# ND-Bot

Bot Discord multipurpose con sistema ticket, moderazione, utility, verifica e pannello Next.js.

## Funzionalità

### Info (3 comandi)
- `/info` - Informazioni sul bot
- `/links` - Link utili
- `/members` - Conteggio membri

### Moderazione (9 comandi)
- `/ban` - Banna un utente
- `/banlist` - Lista utenti bannati
- `/clear` - Cancella messaggi
- `/kick` - Espelli un utente
- `/timeout` - Timeout utente
- `/unban` - Rimuovi ban
- `/warn` - Avvisa un utente
- `/unwarn` - Rimuovi avviso
- `/warnlist` - Lista avvisi

### Utility (8 comandi)
- `/announce` - Annuncio personalizzato
- `/changelog` - Changelog bot
- `/donate` - Info donazioni
- `/feedback` - Invia feedback
- `/listfeedback` - Lista feedback
- `/restart` - Riavvia bot
- `/verify-panel` - **NUOVO** Crea pannello di verifica
- `/verify-stats` - **NUOVO** Statistiche verifiche

### Ticket (11 comandi)
- `/create` - Crea ticket
- `/close` - Chiudi ticket
- `/closeall` - Chiudi tutti i ticket
- `/add` - Aggiungi utente
- `/remove` - Rimuovi utente
- `/claim` - Prendi in carico
- `/unclaim` - Rilascia ticket
- `/rename` - Rinomina ticket
- `/transcript` - Trascrizione HTML
- `/list` - Lista ticket
- `/delete` - Elimina ticket

## ✨ Sistema di Verifica

Il bot include un sistema di verifica con bottone interattivo:

### Come funziona
1. Un admin crea il pannello con `/verify-panel`
2. Gli utenti cliccano il bottone ✅ per verificarsi
3. Il bot assegna automaticamente il ruolo configurato
4. Tutte le verifiche vengono loggate

### Comandi
```bash
# Crea pannello di verifica
/verify-panel canale:#verifica ruolo:@Verified

# Personalizza pannello
/verify-panel canale:#verifica ruolo:@Member titolo:"Benvenuto!" descrizione:"Clicca per accedere"

# Visualizza statistiche
/verify-stats
```

### Caratteristiche
- ✅ Bottone interattivo
- 📋 Logging automatico
- 📊 Statistiche dettagliate
- 🔒 Controllo duplicati
- 💾 Salvataggio in database

## Installazione

### Requisiti
- Node.js 18+
- MySQL 8.0+
- Account Discord Bot

### Setup Rapido

```bash
# 1. Clona repository
git clone https://github.com/sonojito/ND-Bot.git
cd ND-Bot

# 2. Installa dipendenze
npm install

# 3. Configura ambiente
cp .env.example .env
# Modifica .env con i tuoi dati

# 4. Crea database MySQL
mysql -u root -p < database/schema.sql

# 5. Avvia bot
npm start
```

### Configurazione .env

```env
# Discord
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_client_id

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=discord_bot
DB_PORT=3306

# Canali
LOG_CHANNEL_ID=your_log_channel_id
WELCOME_CHANNEL_ID=your_welcome_channel_id
TICKET_CATEGORY_ID=your_ticket_category_id

# Ruoli
STAFF_ROLE_ID=your_staff_role_id
ADMIN_ROLE_ID=your_admin_role_id
```

## Dashboard Next.js

```bash
cd dashboard
npm install
npm run dev
```

Dashboard disponibile su http://localhost:3000

### Funzionalità Dashboard
- 🏠 **Home**: Statistiche in tempo reale
- 🎫 **Ticket**: Gestione ticket aperti
- 📄 **Logs**: Visualizzazione log sistema
- ⚠️ **Warnings**: Monitor avvisi utenti
- 💬 **Feedback**: Lettura feedback

## Database

Il bot utilizza MySQL con 4 tabelle:

- **tickets**: Gestione ticket con claim/unclaim
- **warnings**: Sistema avvisi utenti
- **feedback**: Feedback utenti
- **verifications**: Registro verifiche utenti

Per maggiori dettagli: [database/README.md](database/README.md)

## Caratteristiche

- ✅ **31 comandi totali** organizzati in 4 categorie
- ✅ **Sistema di verifica** con bottone interattivo
- ✅ **Logging completo** su Discord e file
- ✅ **Gestione errori avanzata** - bot sempre online
- ✅ **Database MySQL** con connection pooling
- ✅ **Sistema ticket professionale** con trascrizioni
- ✅ **Dashboard Next.js** moderna e responsive
- ✅ **Gestione permessi** Discord integrata
- ✅ **Documentazione completa** inclusa

## Struttura Progetto

```
ND-Bot/
├── bot/                    # Bot Discord
│   ├── commands/           # 31 comandi
│   │   ├── info/          # 3 comandi
│   │   ├── moderation/    # 9 comandi
│   │   ├── utility/       # 8 comandi (include verifica)
│   │   └── ticket/        # 11 comandi
│   ├── events/            # Event handlers
│   ├── utils/             # Utilities
│   └── index.js           # Entry point
├── dashboard/             # Dashboard Next.js
│   ├── app/              # Pagine
│   └── lib/              # MySQL connection
├── database/             # Schema SQL e docs
├── package.json
├── .env.example
└── README.md
```

## Supporto

- 🐛 **Issues**: [GitHub Issues](https://github.com/sonojito/ND-Bot/issues)
- 📚 **Documentazione**: [Wiki](https://github.com/sonojito/ND-Bot/wiki)
- 💙 **Donazioni**: Usa `/donate` nel bot

## License

MIT License - vedi [LICENSE](LICENSE) per dettagli

---

**Sviluppato con ❤️ da [NeonDevs](https://www.neondevs.com)**