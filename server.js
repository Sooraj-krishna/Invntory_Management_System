const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API Endpoints

// Get all categories
app.get('/api/categories', (req, res) => {
    const query = 'SELECT * FROM categories';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

// Get all suppliers
app.get('/api/suppliers', (req, res) => {
    const query = 'SELECT * FROM suppliers';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching suppliers:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

// Get all locations
app.get('/api/locations', (req, res) => {
    const query = 'SELECT * FROM locations';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching locations:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

// Get all inventory items with related information
app.get('/api/items', (req, res) => {
    const query = `
        SELECT 
            i.*,
            c.name as category_name,
            s.name as supplier_name,
            l.name as location_name
        FROM items i
        LEFT JOIN categories c ON i.category_id = c.id
        LEFT JOIN suppliers s ON i.supplier_id = s.id
        LEFT JOIN locations l ON i.location_id = l.id
        ORDER BY i.created_at DESC
    `;
    
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching items:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

// Add new inventory item
app.post('/api/items', (req, res) => {
    const { 
        name, 
        description, 
        category_id, 
        supplier_id, 
        location_id, 
        quantity, 
        unit_price 
    } = req.body;

    const query = `
        INSERT INTO items 
        (name, description, category_id, supplier_id, location_id, quantity, unit_price)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [name, description, category_id, supplier_id, location_id, quantity, unit_price],
        (error, results) => {
            if (error) {
                console.error('Error adding item:', error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.status(201).json({ 
                message: 'Item added successfully', 
                id: results.insertId 
            });
        }
    );
});

// Update item quantity
app.patch('/api/items/:id/quantity', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    const query = 'UPDATE items SET quantity = ? WHERE id = ?';
    
    db.query(query, [quantity, id], (error, results) => {
        if (error) {
            console.error('Error updating quantity:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        
        if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }
        
        res.json({ message: 'Quantity updated successfully' });
    });
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM items WHERE id = ?';
    
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error deleting item:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        
        if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }
        
        res.json({ message: 'Item deleted successfully' });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});