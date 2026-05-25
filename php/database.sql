-- ============================================
-- EcoWarm - Database Schema
-- Created by: Aditya Kumar Sah
-- ============================================

CREATE DATABASE IF NOT EXISTS ecowarm_db;
USE ecowarm_db;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image VARCHAR(500),
    badge VARCHAR(50),
    stock INT DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Sample Products Data
INSERT INTO products (name, description, price, category, badge) VALUES
('Bamboo Throw Blanket', 'Ultra-soft organic bamboo fiber blanket, naturally hypoallergenic', 49.99, 'home', 'Bestseller'),
('Organic Skincare Set', '100% natural ingredients, zero chemicals, plastic-free packaging', 34.99, 'personal', 'New'),
('Reusable Coffee Cup', 'Handcrafted ceramic cup with cork sleeve, dishwasher safe', 24.99, 'kitchen', NULL),
('Hemp Canvas Tote', 'Durable hemp tote bag, perfect for everyday sustainable shopping', 19.99, 'lifestyle', '-20%'),
('Recycled Cotton Cushion', 'Made from 100% recycled cotton, naturally dyed with plant pigments', 29.99, 'home', NULL),
('Natural Shampoo Bar', 'Zero-waste solid shampoo with essential oils, lasts 80+ washes', 14.99, 'personal', 'Popular'),
('Bamboo Cutlery Set', 'Portable bamboo cutlery with carry case, replace single-use plastic', 16.99, 'kitchen', NULL),
('Stainless Steel Bottle', 'Double-wall insulated, keeps drinks cold 24h or hot 12h', 32.99, 'lifestyle', 'New');
