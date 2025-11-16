-- Schema database completo per ND-Bot
-- Esegui questo file per creare il database e tutte le tabelle

CREATE DATABASE IF NOT EXISTS discord_bot;
USE discord_bot;

-- Tabella tickets
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guild_id VARCHAR(20) NOT NULL,
    channel_id VARCHAR(20) NOT NULL UNIQUE,
    user_id VARCHAR(20) NOT NULL,
    ticket_number INT NOT NULL,
    claimed BOOLEAN DEFAULT FALSE,
    claimed_by VARCHAR(20) DEFAULT NULL,
    closed BOOLEAN DEFAULT FALSE,
    closed_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_guild_user (guild_id, user_id),
    INDEX idx_closed (closed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabella warnings
CREATE TABLE IF NOT EXISTS warnings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guild_id VARCHAR(20) NOT NULL,
    user_id VARCHAR(20) NOT NULL,
    moderator_id VARCHAR(20) NOT NULL,
    reason TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_guild_user (guild_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabella feedback
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guild_id VARCHAR(20) NOT NULL,
    user_id VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_guild (guild_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabella verifications (NUOVO)
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

-- Visualizza tabelle create
SHOW TABLES;

-- Mostra struttura tabelle
DESCRIBE tickets;
DESCRIBE warnings;
DESCRIBE feedback;
DESCRIBE verifications;