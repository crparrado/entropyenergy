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

// Initialize
checkAuth();
