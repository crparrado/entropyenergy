import { loadCatalog, getProductById } from './catalog.js';

const PANEL_PRODUCT_ID = 'panel-200w';
let panelProduct = { id: PANEL_PRODUCT_ID, name: 'Panel plegable 200 W', price: 200000 };
const MAX_PANEL_QTY = 6;

const elements = {
  itemsContainer: document.getElementById('cartItems'),
  totalNode: document.getElementById('cartTotal'),
  checkoutLink: document.getElementById('cartCheckout')
};

const state = {
  items: [],
  kit: null,
  useCase: 'residential',
  suggestedPanels: 0
};

function syncPanelFromCatalog(catalog) {
  const product = getProductById(catalog, PANEL_PRODUCT_ID);
  if (product) {
    panelProduct = {
      id: product.id,
      name: product.name || panelProduct.name,
      price: typeof product.price_clp === 'number' ? product.price_clp : panelProduct.price
    };
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function formatPanelLabel(count) {
  if (count <= 0) return 'panel plegable de 200 W';
  const plural = count === 1 ? 'panel plegable' : 'paneles plegables';
  return `${count} ${plural} de 200 W`;
}

function adjustItemQuantity(id, nextQuantity) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item || item.locked) return;
  const parsed = parseInt(nextQuantity, 10);
  const safeQuantity = clamp(Number.isNaN(parsed) ? item.quantity : parsed, 0, item.max ?? MAX_PANEL_QTY);
  item.quantity = safeQuantity;
  if (item.type === 'kit' && safeQuantity === 0) {
    const panelItem = state.items.find((entry) => entry.type === 'panel');
    if (panelItem) {
      panelItem.quantity = 0;
    }
  }
  renderCart();
}

function buildCartItems(kit, panels) {
  const clampedPanels = clamp(panels, 0, MAX_PANEL_QTY);
  state.items = [
    {
      id: kit.id,
      name: kit.name,
      unitPrice: kit.price,
      quantity: 1,
      locked: false,
      max: 1,
      type: 'kit'
    },
    {
      id: panelProduct.id,
      name: panelProduct.name,
      unitPrice: panelProduct.price,
      quantity: clampedPanels,
      locked: false,
      max: MAX_PANEL_QTY,
      type: 'panel'
    }
  ];
}

function renderCartItems() {
  elements.itemsContainer.innerHTML = '';
  let activeItems = 0;

  state.items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    if (item.quantity === 0 && !item.locked) {
      row.classList.add('cart-item--inactive');
    }

    if (item.quantity > 0) {
      activeItems += 1;
    }

    const info = document.createElement('div');
    info.className = 'cart-item__info';
    const title = document.createElement('strong');
    title.textContent = item.name;
    info.appendChild(title);

    if (item.type === 'panel') {
      const note = document.createElement('small');
      note.className = 'cart-item__note';
      if (item.quantity === 0) {
        note.textContent = state.suggestedPanels > 0
          ? `Sugerido: ${formatPanelLabel(state.suggestedPanels)}`
          : 'Opcional: agrega paneles plegables para acelerar la recarga solar';
      } else {
        note.textContent = `${formatCurrency(item.unitPrice)} c/u · ajusta la cantidad según lo que necesites`;
      }
      info.appendChild(note);
    }

    row.appendChild(info);

    const actions = document.createElement('div');
    actions.className = 'cart-item__actions';

    const controls = document.createElement('div');
    controls.className = 'cart-item__controls';

    const qtyWrapper = document.createElement('div');
    qtyWrapper.className = 'cart-item__qty';

    const minus = document.createElement('button');
    minus.type = 'button';
    minus.textContent = '-';
    minus.disabled = item.locked || item.quantity <= 0;
    minus.addEventListener('click', () => adjustItemQuantity(item.id, item.quantity - 1));
    qtyWrapper.appendChild(minus);

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = '0';
    qtyInput.max = String(item.max ?? MAX_PANEL_QTY);
    qtyInput.value = item.quantity;
    qtyInput.readOnly = item.locked;
    qtyInput.disabled = item.locked;
    if (item.locked) {
      qtyInput.classList.add('cart-item__qty-input--locked');
    }
    qtyInput.addEventListener('change', (event) => {
      adjustItemQuantity(item.id, event.target.value);
    });
    qtyWrapper.appendChild(qtyInput);

    const plus = document.createElement('button');
    plus.type = 'button';
    plus.textContent = '+';
    plus.disabled = item.locked || item.quantity >= (item.max ?? MAX_PANEL_QTY);
    plus.addEventListener('click', () => adjustItemQuantity(item.id, item.quantity + 1));
    qtyWrapper.appendChild(plus);

    controls.appendChild(qtyWrapper);

    if (!item.locked) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'cart-item__remove';
      remove.textContent = 'Eliminar';
      remove.addEventListener('click', () => adjustItemQuantity(item.id, 0));
      controls.appendChild(remove);
    }

    actions.appendChild(controls);

    const price = document.createElement('span');
    price.className = 'cart-item__price';
    const total = item.unitPrice * item.quantity;
    if (item.quantity > 0) {
      price.textContent = formatCurrency(total);
    } else {
      price.textContent = '—';
      price.classList.add('cart-item__price--muted');
    }
    actions.appendChild(price);

    row.appendChild(actions);
    elements.itemsContainer.appendChild(row);
  });

  if (activeItems === 0) {
    const empty = document.createElement('p');
    empty.className = 'cart-empty';
    empty.textContent = 'Tu carrito está vacío. Usa "Editar configuración" para seleccionar un kit.';
    elements.itemsContainer.appendChild(empty);
  }
}

function updateSummary() {
  const total = state.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const summaryLines = state.items
    .filter((item) => item.quantity > 0)
    .map((item) => `• ${item.name} x${item.quantity}: ${formatCurrency(item.unitPrice * item.quantity)}`);

  const hasItems = summaryLines.length > 0;

  if (!hasItems) {
    elements.totalNode.textContent = 'Total a pagar: -';
    elements.checkoutLink.href = '#';
    elements.checkoutLink.classList.add('disabled');
    return;
  }

  elements.totalNode.textContent = `Total a pagar: ${formatCurrency(total)}`;

  const panelItem = state.items.find((item) => item.id === panelProduct.id);
  const optionalLine = panelItem && panelItem.quantity === 0
    ? `• ${panelProduct.name}: no incluido (opcional)`
    : null;

  const bodyLines = optionalLine ? [...summaryLines, optionalLine] : summaryLines;
  const body = bodyLines.join('\n');

  const message = encodeURIComponent('Hola! tengo algunas preguntas sobre una bateria que vi en la página web. Me podrían ayudar?');
  elements.checkoutLink.href = `https://wa.me/56995049268?text=${message}`;
  elements.checkoutLink.classList.remove('disabled');
}

function renderCart() {
  renderCartItems();
  updateSummary();
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const kitId = params.get('kitId');
  const panels = parseInt(params.get('panels') || '0', 10);
  const suggestedPanels = parseInt(params.get('suggestedPanels') || '0', 10);
  const useCase = params.get('useCase') || 'residential';

  try {
    const catalog = await loadCatalog();
    syncPanelFromCatalog(catalog);
    const product = getProductById(catalog, kitId);
    if (!product) {
      elements.itemsContainer.innerHTML = '<p>No pudimos encontrar el kit seleccionado. Regresa para intentarlo nuevamente.</p>';
      elements.totalNode.textContent = 'Total: -';
      return;
    }
    if (typeof product.price_clp !== 'number') {
      elements.itemsContainer.innerHTML = '<p>Este kit requiere cotización directa. Regresa y elige la opción "Pedir cotización".</p>';
      elements.totalNode.textContent = 'Total: -';
      return;
    }
    const kit = {
      id: product.id,
      name: product.name,
      price: product.price_clp
    };
    state.kit = kit;
    state.useCase = useCase;
    state.suggestedPanels = Number.isFinite(suggestedPanels) && suggestedPanels > 0 ? suggestedPanels : 0;

    buildCartItems(kit, panels);
    renderCart();
  } catch (error) {
    console.error('No se pudo cargar el catálogo para el carrito', error);
    elements.itemsContainer.innerHTML = '<p>No pudimos cargar el catálogo. Refresca la página o vuelve más tarde.</p>';
    elements.totalNode.textContent = 'Total: -';
  }
}

init().catch((error) => {
  console.error('Error inesperado al iniciar el carrito', error);
});

// Checkout Redirection
async function processCheckout() {
  const activeItems = state.items.filter(item => item.quantity > 0);

  if (activeItems.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  // Prepare cart data for checkout page
  const cartData = activeItems.map(item => ({
    productId: item.id,
    quantity: item.quantity
  }));

  // Save to localStorage
  localStorage.setItem('entropy_cart', JSON.stringify(cartData));

  // Redirect to checkout page
  window.location.href = 'checkout.html';
}

// Event listener para el botón de checkout
if (elements.checkoutLink) {
  elements.checkoutLink.textContent = 'Ir a Pagar';
  elements.checkoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    processCheckout();
  });
}
