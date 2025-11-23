import { loadCatalog, getProductById } from './catalog.js';

const detailContainer = document.getElementById('productDetail');

async function loadProduct() {
  if (!detailContainer) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    detailContainer.innerHTML = '<p>No se indicó un producto.</p>';
    return;
  }
  try {
    const products = await loadCatalog();
    const product = getProductById(products, id);
    if (!product) {
      detailContainer.innerHTML = '<p>Producto no encontrado.</p>';
      return;
    }
    renderProduct(product);
  } catch (error) {
    console.error('No se pudo cargar el producto', error);
    detailContainer.innerHTML = '<p>No pudimos cargar la información. Intenta nuevamente.</p>';
  }
}

function renderProduct(product) {
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['assets/kit-go-front.png'];
  const includesList = Array.isArray(product.includes)
    ? product.includes.map((item) => `<li>${item}</li>`).join('')
    : '';
  const hasPrice = typeof product.price_clp === 'number';
  const priceLabel = hasPrice ? formatCurrency(product.price_clp) : 'Pedir cotización';
  const stockLabel = typeof product.stock === 'number'
    ? `${product.stock} unidades disponibles`
    : 'Stock bajo pedido';
  const whatsappLink = 'https://wa.me/56900000000';
  detailContainer.innerHTML = `
    <div class="product-media">
      <div class="product-media__main">
        <img id="productMainImage" src="${images[0]}" alt="${product.name}">
      </div>
      <div class="product-media__thumbs">
        ${images.map((src, index) => `<img data-index="${index}" src="${src}" alt="${product.name}" class="${index === 0 ? 'active' : ''}">`).join('')}
      </div>
    </div>
    <div class="product-info">
      <span class="eyebrow">${product.category === 'paneles' ? 'Panel solar' : 'Batería portátil'}</span>
      <h1>${product.name}</h1>
      <p>${product.summary || ''}</p>
      <div class="product-info__meta">
        <span>Potencia: <strong>${formatPower(product.power_w)}</strong></span>
        <span>Energía: <strong>${formatEnergy(product.capacity_wh)}</strong></span>
        <span>${stockLabel}</span>
      </div>
      ${hasPrice ? `<p class="product-info__price">${priceLabel}</p>` : ''}
      ${includesList ? `<h3>Características clave</h3><ul>${includesList}</ul>` : ''}
      <div class="product-info__cta">
        ${hasPrice ? `<button class="primary" id="addToCartBtn" type="button">Agregar al carrito</button>` : ''}
        <a class="ghost" href="${whatsappLink}" target="_blank" rel="noopener">Contactar por WhatsApp</a>
        ${product.datasheet ? `<a class="ghost" href="${product.datasheet}" target="_blank" rel="noopener">Descargar ficha</a>` : ''}
      </div>
    </div>
  `;
  setupDetailGallery(images);
  if (hasPrice) {
    const btn = document.getElementById('addToCartBtn');
    btn?.addEventListener('click', () => openCartWithKit(product.id));
  }
}

function setupDetailGallery(images) {
  const main = document.getElementById('productMainImage');
  const thumbs = document.querySelectorAll('.product-media__thumbs img');
  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const index = Number(thumb.dataset.index);
      main.src = images[index];
      thumbs.forEach((img) => img.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

function formatPower(value) {
  if (!Number.isFinite(value)) return 'N/A';
  return value >= 1000 ? `${(value / 1000).toFixed(1)} kW` : `${value} W`;
}

function formatEnergy(value) {
  if (!Number.isFinite(value)) return 'N/A';
  return value >= 1000 ? `${(value / 1000).toFixed(2)} kWh` : `${value} Wh`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);
}

function openCartWithKit(kitId) {
  if (!kitId) return;
  const url = new URL('cart.html', window.location.href);
  url.searchParams.set('kitId', kitId);
  url.searchParams.set('panels', '0');
  url.searchParams.set('useCase', 'residential');
  window.location.href = url.toString();
}

loadProduct();
