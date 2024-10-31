// DOM Elements
const addNewItemBtn = document.getElementById('addNewItem');
const addItemModal = document.getElementById('addItemModal');
const addItemForm = document.getElementById('addItemForm');
const inventoryList = document.getElementById('inventoryList');

// Event Listeners
addNewItemBtn.addEventListener('click', openModal);
addItemForm.addEventListener('submit', handleAddItem);

// Functions
function openModal() {
    addItemModal.style.display = 'block';
    loadDropdownData();
}

function closeModal() {
    addItemModal.style.display = 'none';
    addItemForm.reset();
}

async function loadDropdownData() {
    try {
        const [categories, suppliers, locations] = await Promise.all([
            fetch('/api/categories').then(res => res.json()),
            fetch('/api/suppliers').then(res => res.json()),
            fetch('/api/locations').then(res => res.json())
        ]);

        populateDropdown('category', categories);
        populateDropdown('supplier', suppliers);
        populateDropdown('location', locations);
    } catch (error) {
        console.error('Error loading dropdown data:', error);
    }
}

function populateDropdown(id, items) {
    const select = document.getElementById(id);
    select.innerHTML = '<option value="">Select...</option>';
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        select.appendChild(option);
    });
}

async function handleAddItem(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        category_id: document.getElementById('category').value,
        supplier_id: document.getElementById('supplier').value,
        location_id: document.getElementById('location').value,
        quantity: document.getElementById('quantity').value,
        unit_price: document.getElementById('unitPrice').value
    };

    try {
        const response = await fetch('/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            closeModal();
            loadInventoryItems();
        }
    } catch (error) {
        console.error('Error adding item:', error);
    }
}

async function loadInventoryItems() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        
        inventoryList.innerHTML = items.map(item => `
            <div class="inventory-item">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p>Quantity: ${item.quantity} | Price: $${item.unit_price}</p>
                </div>
                <div class="item-actions">
                    <div class="quantity-update">
                        <input type="number" min="0" value="${item.quantity}" 
                               id="quantity-${item.id}">
                        <button onclick="updateQuantity(${item.id})" 
                                class="btn-secondary">Update</button>
                    </div>
                    <button onclick="deleteItem(${item.id})" 
                            class="btn-secondary">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading inventory items:', error);
    }
}

async function updateQuantity(itemId) {
    const newQuantity = document.getElementById(`quantity-${itemId}`).value;
    
    try {
        const response = await fetch(`/api/items/${itemId}/quantity`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: newQuantity })
        });

        if (response.ok) {
            loadInventoryItems();
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}

async function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
        const response = await fetch(`/api/items/${itemId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadInventoryItems();
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

// Initial load
loadInventoryItems();