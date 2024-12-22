-- Drop the database if it already exists
DROP DATABASE IF EXISTS HEALTHYSUPP;

-- Create a new database
CREATE DATABASE HEALTHYSUPP;
USE HEALTHYSUPP;

-- Table for storing products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(5, 2) DEFAULT 0,  -- Lisätty alennus kenttä
    description TEXT,   -- Yksi kuvauskenttä riittää
    image VARCHAR(255),         -- Lisätty kuva kenttä
    category VARCHAR(255) NOT NULL,  -- Lisätty kategoria kenttä
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for storing users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, -- Ensuring email is unique
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



-- Optional: Verify that the tables are created successfully
SHOW TABLES;
