
CREATE DATABASE inventory_management_system;
USE inventory_management_system;


CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT
);


CREATE TABLE suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20)
);


CREATE TABLE locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT
);


CREATE TABLE items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INT,
    supplier_id INT,
    location_id INT,
    quantity INT DEFAULT 0,
    unit_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (location_id) REFERENCES locations(id)
);


INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic components and devices'),
('Office Supplies', 'General office materials');

INSERT INTO suppliers (name, contact_person, email, phone) VALUES
('Tech Supplies Co', 'John Doe', 'john@techsupplies.com', '555-0100'),
('Office Plus', 'Jane Smith', 'jane@officeplus.com', '555-0200');

INSERT INTO locations (name, description) VALUES
('Warehouse A', 'Main storage facility'),
('Office Storage', 'Office storage room');