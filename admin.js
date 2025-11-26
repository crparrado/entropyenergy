// Admin Panel JavaScript
import { loadCatalog, saveCatalog, clearCatalogOverride } from './catalog.js';

// Password protection
const ADMIN_PASSWORD = 'entropy2024'; // Cambia esto por tu contraseña

const elements = {
    loginScreen: document.getElementById('loginScreen'),
    adminPanel: document.getElementById('adminPanel'),
    loginForm: document.getElementById('loginForm'),
    passwordInput: document.getElementById('passwordInput'),
    loginError: document.getElementById('loginError'),
    logoutBtn: document.getElementById('logoutBtn'),
    productsGrid: document.getElementById('productsGrid'),
    saveIndicator: document.getElementById('saveIndicator')
};

let products = [];
let isAuthenticated = false;

// Check if already logged in
function checkAuth() {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
        isAuthenticated = true;
        showAdminPanel();
    }
}

// Login handler
elements.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = elements.passwordInput.value;

    if (password === ADMIN_PASSWORD) {
        isAuthenticated = true;
        sessionStorage.setItem('admin_auth', 'true');
        elements.loginError.textContent = '';
        showAdminPanel();
    } else {
        elements.loginError.textContent = '❌ Contraseña incorrecta';
        elements.passwordInput.value = '';
    }
});

// Logout handler
elements.logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('admin_auth');
    isAuthenticated = false;
    elements.adminPanel.classList.remove('active');
    elements.loginScreen.style.display = 'flex';
});

function showAdminPanel() {
    elements.loginScreen.style.display = 'none';
    elements.adminPanel.classList.add('active');
    init();
}

// Load and render products
async function init() {
    try {
        products = await loadCatalog();
        renderProducts();
    } catch (error) {
        console.error('Error loading catalog:', error);
        alert('Error al cargar el catálogo');
    }
}

function renderProducts() {
    elements.productsGrid.innerHTML = '';

    products.forEach((product, index) => {
        const card = createProductCard(product, index);
        elements.productsGrid.appendChild(card);
    });
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.index = index;

    const image = product.images && product.images[0]
        ? product.images[0]
        : 'images/bg/600w1.png';

    card.innerHTML = `
    <img src="${image}" alt="${product.name}" class="product-image">
    <div class="product-info">
      <h3>${product.name || 'Sin nombre'}</h3>
      
      <div class="form-group">
        <label>Stock disponible</label>
        <input type="number" class="stock-input" value="${product.stock ?? 0}" min="0">
      </div>
      
      <div class="form-group">
        <label>Precio (CLP)</label>
        <input type="number" class="price-input" value="${product.price_clp ?? 0}" min="0">
      </div>
      
      <div class="form-group">
        <label>Categoría</label>
        <select class="category-input">
          <option value="baterias" ${product.category === 'baterias' ? 'selected' : ''}>Baterías</option>
          <option value="paneles" ${product.category === 'paneles' ? 'selected' : ''}>Paneles</option>
          <option value="accesorios" ${product.category === 'accesorios' ? 'selected' : ''}>Accesorios</option>
        </select>
      </div>
      
      <div class="product-actions">
        <button class="btn-save" onclick="saveProduct(${index})">Guardar cambios</button>
        <button class="btn-cancel" onclick="resetProduct(${index})">Cancelar</button>
      </div>
    </div>
  `;

    return card;
}

// Save individual product
window.saveProduct = function (index) {
    const card = document.querySelector(`[data-index="${index}"]`);
    const stockInput = card.querySelector('.stock-input');
    const priceInput = card.querySelector('.price-input');
    const categoryInput = card.querySelector('.category-input');

    products[index].stock = parseInt(stockInput.value) || 0;
    products[index].price_clp = parseInt(priceInput.value) || 0;
    products[index].category = categoryInput.value;

    try {
        saveCatalog(products);
        showSaveIndicator();
    } catch (error) {
        console.error('Error saving:', error);
        alert('Error al guardar los cambios');
    }
};

// Reset product to original values
window.resetProduct = function (index) {
    renderProducts();
};

// Show save indicator
function showSaveIndicator() {
    elements.saveIndicator.classList.add('show');
    setTimeout(() => {
        elements.saveIndicator.classList.remove('show');
    }, 2000);
}

// Tab Switching
const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked
        tab.classList.add('active');
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');

        if (tab.dataset.tab === 'orders') {
            loadOrders();
        }
    });
});

import { db, collection, getDocs, query, orderBy } from './firebase.js';

// Load Orders from Firebase
async function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '<p style="text-align: center; color: var(--muted);">Cargando órdenes...</p>';

    try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            ordersList.innerHTML = '<p style="text-align: center; color: var(--muted);">No hay órdenes registradas aún.</p>';
            return;
        }

        ordersList.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const order = doc.data();
            const date = order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString('es-CL') : 'Fecha desconocida';

            const card = document.createElement('div');
            card.className = 'order-card';
            card.innerHTML = `
        <div class="order-header">
          <span class="order-id">ID: ${doc.id}</span>
          <span class="order-date">${date}</span>
        </div>
        <div class="order-details">
          <div class="order-customer">
            <h4>Cliente</h4>
            <p>
              <strong>${order.customer.firstName} ${order.customer.lastName}</strong><br>
              ${order.customer.email}<br>
              ${order.customer.phone}<br>
              ${order.customer.address}, ${order.customer.city}<br>
              ${order.customer.region}
            </p>
          </div>
          <div class="order-items">
            <h4>Items</h4>
            <ul>
              ${order.items.map(item => `
                <li>
                  <span>${item.quantity}x ${item.name}</span>
                  <span>$${(item.total || 0).toLocaleString('es-CL')}</span>
                </li>
              `).join('')}
            </ul>
            <div class="order-total">
              Total: $${(order.total || 0).toLocaleString('es-CL')}
            </div>
            <div style="margin-top: 0.5rem; text-align: right;">
              <span style="
                background: ${order.status === 'paid' ? 'rgba(0, 216, 180, 0.2)' : 'rgba(255, 193, 7, 0.2)'}; 
                color: ${order.status === 'paid' ? '#00d8b4' : '#ffc107'}; 
                padding: 0.2rem 0.6rem; 
                border-radius: 4px; 
                font-size: 0.85rem; 
                font-weight: 600;">
                ${order.status === 'paid' ? 'PAGADO' : 'PENDIENTE'}
              </span>
            </div>
          </div>
        </div>
      `;
            ordersList.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading orders:", error);
        ordersList.innerHTML = `<p style="text-align: center; color: red;">Error al cargar órdenes: ${error.message}</p>`;
    }
}

// Initialize
try {
    checkAuth();
} catch (error) {
    console.error('Error during initialization:', error);
    document.body.innerHTML += `<div style="color: red; padding: 20px;">Error crítico al iniciar: ${error.message}</div>`;
}

window.addEventListener('error', (event) => {
    document.body.innerHTML += `<div style="color: red; padding: 20px;">Error de script: ${event.message}</div>`;
});
