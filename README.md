# Complete Setup Guide for Inventory Management System

## 1. Environment Setup

### 1.1 Install Node.js
1. Go to https://nodejs.org
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### 1.2 Install MySQL Workbench
1. Go to https://dev.mysql.com/downloads/workbench/
2. Download MySQL Workbench for your operating system
3. Install MySQL Server during the setup if not already installed
4. Note down these important details during installation:
   - Root password
   - Port number (default is 3306)

### 1.3 Create Project Directory
```bash
# Create project directory
mkdir inventory-management
cd inventory-management

# Initialize Node.js project
npm init -y

# Create required directories
mkdir config public views
mkdir public/css public/js
```

## 2. Install Dependencies

```bash
# Install all required packages
npm install express mysql2 cors body-parser

# Optional: Install nodemon for development
npm install --save-dev nodemon
```

Add this to package.json scripts:
```json
"scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
}
```

## 3. MySQL Workbench Setup

### 3.1 Connect to MySQL Workbench
1. Open MySQL Workbench
2. Click on 'Local Instance MySQL' or create a new connection:
   - Connection Name: inventory_system
   - Hostname: localhost
   - Port: 3306
   - Username: root
   - Password: [your-password]

### 3.2 Create Database and Tables
1. Open a new query tab
2. Copy and paste the database schema (from database.sql)
3. Execute the script:
   ```sql
   -- First create the database
   CREATE DATABASE inventory_management;
   USE inventory_management;
   
   -- Then create tables...
   [rest of the SQL code from database.sql]
   ```

### 3.3 Verify Database Setup
```sql
-- Check if tables were created
SHOW TABLES;

-- Verify sample data
SELECT * FROM categories;
SELECT * FROM suppliers;
SELECT * FROM locations;
```

## 4. Project Configuration

### 4.1 Database Configuration
Create config/db.js:
```javascript
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_mysql_password', // Replace with your password
    database: 'inventory_management',
    port: 3306
});

connection.connect(error => {
    if (error) {
        console.error('Error connecting to MySQL:', error);
        return;
    }
    console.log('Successfully connected to MySQL database');
});

module.exports = connection;
```

### 4.2 File Organization
Copy the provided files to their respective locations:
- views/index.html
- public/css/style.css
- public/js/main.js
- server.js (in root directory)

## 5. Testing the Connection

1. Start MySQL Server:
   - Windows: Check Services app, ensure MySQL service is running
   - Mac/Linux: `sudo service mysql start`

2. Test database connection:
```javascript
// Add this to server.js temporarily
app.get('/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.json({ 
            message: 'Database connected successfully',
            result: results[0].solution 
        });
    });
});
```

## 6. Running the Application

1. Start the server:
```bash
# Development mode with nodemon
npm run dev

# OR Production mode
npm start
```

2. Access the application:
   - Open browser: http://localhost:3000
   - Test database connection: http://localhost:3000/test-db

## 7. Troubleshooting Common Issues

### 7.1 MySQL Connection Issues
```bash
# Check if MySQL is running
# Windows
sc query MySQL80

# Mac/Linux
sudo service mysql status

# Verify MySQL credentials
mysql -u root -p
```

### 7.2 Port Conflicts
If port 3000 is in use:
1. Change the port in server.js:
```javascript
const PORT = process.env.PORT || 3001;
```
2. Or kill the process using port 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### 7.3 Database Access Issues
1. Check MySQL user permissions:
```sql
SELECT user, host FROM mysql.user;
SHOW GRANTS FOR 'root'@'localhost';
```

2. Reset MySQL root password if needed:
   - Windows: Use MySQL Installer
   - Mac/Linux: Use mysqladmin

## 8. Security Best Practices

1. Use environment variables for sensitive data:
```bash
npm install dotenv
```

Create .env file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=inventory_management
PORT=3000
```

Update db.js:
```javascript
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
```

2. Add .env to .gitignore:
```bash
echo ".env" >> .gitignore
```

## 9. Testing the Implementation

1. Test all CRUD operations:
```bash
# Using curl or Postman
# Get all items
curl http://localhost:3000/api/items

# Add new item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","quantity":10,"price":99.99}'
```

2. Monitor MySQL queries:
```sql
-- In MySQL Workbench
SHOW PROCESSLIST;
```

## 10. Deployment Considerations

1. Update production database configuration
2. Set up proper logging
3. Implement rate limiting
4. Add SSL/TLS for security
5. Set up proper backup procedures