import { loadCatalog } from './catalog.js';

const grid = document.getElementById('allProducts');

async function loadProducts() {
  if (!grid) return;
  try {
    const products = await loadCatalog();
    renderProducts(products);
  } catch (error) {
    console.error('No se pudo cargar el catálogo', error);
    grid.innerHTML = '<p class="products__empty">No pudimos cargar los productos. Intenta nuevamente.</p>';
  }
}

function renderProducts(products) {
  if (!Array.isArray(products) || products.length === 0) {
    grid.innerHTML = '<p class="products__empty">Aún no hay productos configurados.</p>';
    return;
  }
  const fragment = document.createDocumentFragment();
  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const image = (product.images && product.images[0]) || 'assets/kit-go-front.png';
    const priceLabel = typeof product.price_clp === 'number'
      ? formatCurrency(product.price_clp)
      : 'Pide tu cotización';
    card.innerHTML = `
      <img src="${image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="product-card__price">${priceLabel}</p>
    `;
    card.addEventListener('click', () => {
      const url = `${window.location.origin}/product-detail.html?id=${encodeURIComponent(product.id)}&v=1`;
      window.location.href = url;
    });
    fragment.appendChild(card);
  });
  grid.innerHTML = '';
  grid.appendChild(fragment);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);
}

loadProducts();
