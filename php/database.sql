-- ==========================================
-- EcoWarm | Premium Exotic Pet Store
-- Database Schema
-- Created by: Aditya Kumar Sah
-- ==========================================

CREATE DATABASE IF NOT EXISTS ecowarm_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecowarm_db;

-- ===== Admin Users =====
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin','admin','editor') DEFAULT 'admin',
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== Categories =====
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(80) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL,
    icon VARCHAR(20),
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== Products =====
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latin_name VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    care_notes TEXT,
    feeding TEXT,
    temperament ENUM('docile','semi-aggressive','aggressive') DEFAULT 'docile',
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    category_id INT,
    emoji VARCHAR(10) DEFAULT '🌿',
    badge VARCHAR(50),
    image VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ===== Orders =====
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    shipping_address TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===== Order Items =====
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ===== Contact Messages =====
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== Newsletter =====
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL
);

-- ==========================================
-- Seed Data
-- ==========================================

INSERT INTO admin_users (username, email, password_hash, role) VALUES
('admin', 'admin@ecowarm.co', '$2y$10$abcdefghij1234567890abcdefghij1234567890abcdefghij12', 'super_admin');
-- Default password: admin123 (replace hash in production with password_hash('admin123', PASSWORD_DEFAULT))

INSERT INTO categories (slug, name, icon, description, sort_order) VALUES
('tarantulas', 'Tarantulas', '🕷️', 'Premium tarantula species, from beginner-friendly to expert-only.', 1),
('scorpions', 'Scorpions', '🦂', 'Dramatic scorpion species for the experienced keeper.', 2),
('reptiles', 'Reptiles', '🦎', 'Geckos, tortoises, and exotic reptiles.', 3),
('centipedes', 'Centipedes', '🐛', 'Rare and impressive centipede species.', 4);

INSERT INTO products (name, latin_name, slug, description, feeding, temperament, price, stock, category_id, emoji, badge) VALUES
('Mexican Redknee Tarantula', 'Brachypelma smithi', 'mexican-redknee', 'Iconic and docile species known for striking coloration and long lifespan. Perfect for beginners.', 'Crickets or Roaches twice a week', 'docile', 249.00, 12, 1, '🕷️', 'Featured'),
('Greenbottle Blue Tarantula', 'Chromatopelma cyaneopubescens', 'greenbottle-blue', 'Vibrant blue legs and green carapace. A heavy webber and stunning display tarantula.', 'Crickets once a week', 'semi-aggressive', 320.00, 8, 1, '🕸️', 'Featured'),
('Deathstalker Scorpion', 'Leiurus quinquestriatus', 'deathstalker', 'Extremely dangerous and highly venomous. Only for the most experienced and careful keepers.', 'Crickets, mealworms', 'aggressive', 480.00, 5, 2, '🦂', 'Expert Only'),
('Amazonian Giant Centipede', 'Scolopendra gigantea', 'giant-centipede', 'The largest centipede in the world. Exceptionally fast, aggressive, and a true monster invertebrate.', 'Large insects, occasional pinky mice', 'aggressive', 650.00, 2, 4, '🐛', 'Expert Only'),
('Crested Gecko', 'Correlophus ciliatus', 'crested-gecko', 'Friendly, low-maintenance gecko with eyelash-like crests. Ideal for first-time reptile keepers.', 'Crested gecko diet, occasional insects', 'docile', 180.00, 24, 3, '🦎', 'New'),
('Russian Tortoise', 'Testudo horsfieldii', 'russian-tortoise', 'Hardy, sociable tortoise with a 50+ year lifespan. A lifelong companion for the patient keeper.', 'Leafy greens, vegetables', 'docile', 295.00, 18, 3, '🐢', 'Bestseller'),
('Cobalt Blue Tarantula', 'Cyriopagopus lividus', 'cobalt-blue', 'Stunning electric-blue legs and a feisty temperament. A jewel for the experienced collector.', 'Crickets weekly', 'aggressive', 420.00, 0, 1, '🕷️', 'New'),
('Emperor Scorpion', 'Pandinus imperator', 'emperor-scorpion', 'One of the largest scorpions, with mild venom. A gentle giant perfect for beginners.', 'Crickets, mealworms', 'docile', 220.00, 32, 2, '🦂', 'Bestseller');
