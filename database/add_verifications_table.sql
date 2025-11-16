-- Aggiungi questa tabella al database esistente
-- Esegui questo comando: mysql -u root -p discord_bot < database/add_verifications_table.sql

USE discord_bot;

-- Tabella verificazioni
CREATE TABLE IF NOT EXISTS verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guild_id VARCHAR(20) NOT NULL,
    user_id VARCHAR(20) NOT NULL,
    role_id VARCHAR(20) NOT NULL,
    verified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_guild (guild_id),
    INDEX idx_user (user_id),
    INDEX idx_guild_user (guild_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Verifica creazione
SHOW TABLES;
DESCRIBE verifications;