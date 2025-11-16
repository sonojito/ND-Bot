# Database Setup

## Installazione

### 1. Installa MySQL

**Windows:**
```
1. Scarica MySQL Installer: https://dev.mysql.com/downloads/installer/
2. Oppure installa XAMPP: https://www.apachefriends.org/
```

**Linux:**
```bash
sudo apt update
sudo apt install mysql-server
```

**macOS:**
```bash
brew install mysql
```

### 2. Avvia MySQL

**Windows (MySQL):**
```
Cerca "MySQL Command Line Client" nel menu Start
```

**Windows (XAMPP):**
```
Apri XAMPP Control Panel
Clicca "Start" su MySQL
Apri browser: http://localhost/phpmyadmin
```

**Linux/macOS:**
```bash
sudo service mysql start  # Linux
brew services start mysql # macOS
```

### 3. Crea il database

**Metodo 1 - Da file SQL (Consigliato):**
```bash
# Dalla cartella principale del progetto
mysql -u root -p < database/schema.sql
```

**Metodo 2 - Manualmente:**
```bash
# Accedi a MySQL
mysql -u root -p

# Poi esegui:
CREATE DATABASE discord_bot;
USE discord_bot;

# Copia e incolla il contenuto di schema.sql
```

**Metodo 3 - Con phpMyAdmin (XAMPP):**
```
1. Apri: http://localhost/phpmyadmin
2. Clicca "Nuovo" nella barra laterale
3. Nome database: discord_bot
4. Clicca "SQL" in alto
5. Copia e incolla il contenuto di schema.sql
6. Clicca "Esegui"
```

### 4. Verifica installazione

```bash
mysql -u root -p -e "USE discord_bot; SHOW TABLES;"

# Dovresti vedere:
# +------------------------+
# | Tables_in_discord_bot  |
# +------------------------+
# | feedback               |
# | tickets                |
# | verifications          |
# | warnings               |
# +------------------------+
```

## Tabelle

### tickets
Gestione sistema ticket con claim/unclaim
- `id`: ID univoco ticket
- `guild_id`: ID del server Discord
- `channel_id`: ID del canale ticket
- `user_id`: ID dell'utente che ha aperto il ticket
- `ticket_number`: Numero progressivo ticket
- `claimed`: Ticket preso in carico (true/false)
- `claimed_by`: ID dello staff che ha preso in carico
- `closed`: Ticket chiuso (true/false)
- `closed_at`: Data chiusura
- `created_at`: Data creazione

### warnings
Sistema avvisi utenti
- `id`: ID univoco avviso
- `guild_id`: ID del server Discord
- `user_id`: ID dell'utente avvisato
- `moderator_id`: ID del moderatore
- `reason`: Motivo dell'avviso
- `created_at`: Data avviso

### feedback
Feedback utenti
- `id`: ID univoco feedback
- `guild_id`: ID del server Discord
- `user_id`: ID dell'utente
- `content`: Contenuto del feedback
- `created_at`: Data invio

### verifications
Sistema verifiche utenti
- `id`: ID univoco verifica
- `guild_id`: ID del server Discord
- `user_id`: ID dell'utente verificato
- `role_id`: ID del ruolo assegnato
- `verified_at`: Data verifica

## Configurazione

### Crea utente dedicato (Consigliato)

```sql
mysql -u root -p

CREATE USER 'ndbot'@'localhost' IDENTIFIED BY 'password_sicura_qui';
GRANT ALL PRIVILEGES ON discord_bot.* TO 'ndbot'@'localhost';
FLUSH PRIVILEGES;
```

Poi in `.env`:
```env
DB_USER=ndbot
DB_PASSWORD=password_sicura_qui
```

## Backup e Ripristino

### Backup
```bash
# Backup completo
mysqldump -u root -p discord_bot > backup_$(date +%Y%m%d).sql

# Backup solo struttura
mysqldump -u root -p --no-data discord_bot > structure.sql

# Backup solo dati
mysqldump -u root -p --no-create-info discord_bot > data.sql
```

### Ripristino
```bash
mysql -u root -p discord_bot < backup_20251116.sql
```

## Manutenzione

### Pulisci vecchi dati
```sql
USE discord_bot;

-- Elimina ticket chiusi oltre 30 giorni fa
DELETE FROM tickets 
WHERE closed = TRUE 
AND closed_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Elimina warning oltre 6 mesi
DELETE FROM warnings 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);

-- Elimina feedback oltre 3 mesi
DELETE FROM feedback 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 3 MONTH);
```

### Ottimizza tabelle
```sql
USE discord_bot;

OPTIMIZE TABLE tickets;
OPTIMIZE TABLE warnings;
OPTIMIZE TABLE feedback;
OPTIMIZE TABLE verifications;
```

## Troubleshooting

### Errore: Access Denied
```bash
# Reimposta password root
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'nuova_password';
FLUSH PRIVILEGES;
```

### Errore: Can't connect to MySQL
```bash
# Verifica che MySQL sia avviato
sudo service mysql status

# Avvia se necessario
sudo service mysql start
```

### Tabella già esistente
```sql
-- Elimina tabella e ricrea
DROP TABLE IF EXISTS nome_tabella;

-- Poi riesegui lo schema
```