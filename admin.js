// Admin Panel JavaScript
import { loadCatalog, saveCatalog, clearCatalogOverride } from './catalog.js';
import { db, collection, getDocs, query, orderBy, onSnapshot, limit, where, addDoc, Timestamp } from './firebase.js';

// Password protection
const ADMIN_PASSWORD = 'entropy2024'; // Cambia esto por tu contraseña
const N8N_WEBHOOK_URL = 'https://automations.entropyenergy.cl/webhook/send-message'; // URL de Producción

const elements = {
  loginScreen: document.getElementById('loginScreen'),
  adminPanel: document.getElementById('adminPanel'),
  loginForm: document.getElementById('loginForm'),
  passwordInput: document.getElementById('passwordInput'),
  loginError: document.getElementById('loginError'),
  logoutBtn: document.getElementById('logoutBtn'),
  productsGrid: document.getElementById('productsGrid'),
  saveIndicator: document.getElementById('saveIndicator'),
  // Chat Elements
  chatList: document.getElementById('chatList'),
  chatHeader: document.getElementById('chatHeader'),
  chatMessages: document.getElementById('chatMessages'),
  chatInput: document.getElementById('chatInput'),
  sendBtn: document.getElementById('sendBtn')
};

let products = [];
let isAuthenticated = false;
let activeChatId = null;
let conversations = {};
let unsubscribeChat = null;

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
  const password = elements.passwordInput.value.trim(); // Added trim()

  console.log('Input Password:', password); // Debug
  console.log('Expected Password:', ADMIN_PASSWORD); // Debug

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
  if (unsubscribeChat) unsubscribeChat();
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
    } else if (tab.dataset.tab === 'messages') {
      initChat();
    }
  });
});

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

// ==========================================
// CHAT LOGIC
// ==========================================

function initChat() {
  if (unsubscribeChat) return; // Already listening

  const q = query(collection(db, "chats"), orderBy("timestamp", "desc"), limit(500));

  unsubscribeChat = onSnapshot(q, (snapshot) => {
    conversations = {}; // Reset and rebuild
    const allMessages = [];

    snapshot.forEach((doc) => {
      const msg = doc.data();
      console.log("📩 Mensaje recibido:", msg); // Debug log
      msg.id = doc.id;
      allMessages.push(msg);

      // Determine Conversation ID (Phone Number)
      const phone = msg.direction === 'inbound' ? msg.from : msg.to;

      if (!phone) return; // Skip if no phone

      if (!conversations[phone]) {
        conversations[phone] = {
          phone: phone,
          messages: [],
          lastMessage: msg,
          unread: 0
        };
      }
      conversations[phone].messages.push(msg);
    });

    // Helper to handle both Firestore Timestamp and String dates
    const getDate = (ts) => {
      if (!ts) return new Date(0);
      if (ts.toDate) return ts.toDate(); // Firestore Timestamp
      return new Date(ts); // String or Date object
    };

    // Sort messages within each conversation (oldest first)
    Object.values(conversations).forEach(conv => {
      conv.messages.sort((a, b) => getDate(a.timestamp) - getDate(b.timestamp));
      // Update last message to be the actual last one after sort
      conv.lastMessage = conv.messages[conv.messages.length - 1];
    });

    renderChatList();
    if (activeChatId) {
      renderChatMessages(activeChatId);
    }
  }, (error) => {
    console.error("❌ Error cargando chats:", error);
    if (error.message.includes("index")) {
      alert("⚠️ Faltan índices en Firebase. Abre la consola (F12) y haz clic en el enlace largo que aparece para crearlos.");
    } else {
      alert("Error cargando mensajes: " + error.message);
    }
  });
}

function renderChatList() {
  elements.chatList.innerHTML = '';

  // Helper for date
  const getDate = (ts) => {
    if (!ts) return new Date(0);
    if (ts.toDate) return ts.toDate();
    return new Date(ts);
  };

  const sortedPhones = Object.keys(conversations).sort((a, b) => {
    const timeA = getDate(conversations[a].lastMessage.timestamp);
    const timeB = getDate(conversations[b].lastMessage.timestamp);
    return timeB - timeA; // Newest first
  });

  if (sortedPhones.length === 0) {
    elements.chatList.innerHTML = '<p style="color: var(--muted); text-align: center; padding: 1rem;">No hay mensajes aún.</p>';
    return;
  }

  sortedPhones.forEach(phone => {
    const conv = conversations[phone];
    const lastMsg = conv.lastMessage;
    const dateObj = getDate(lastMsg.timestamp);
    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const div = document.createElement('div');
    div.className = `conversation-item ${activeChatId === phone ? 'active' : ''}`;
    div.onclick = () => selectChat(phone);
    div.innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <h4>${phone}</h4>
                <span style="font-size: 0.75rem; color: var(--muted);">${time}</span>
            </div>
            <p>${lastMsg.text || 'Imagen/Audio'}</p>
        `;
    elements.chatList.appendChild(div);
  });
}

function selectChat(phone) {
  activeChatId = phone;
  renderChatList(); // Update active class
  renderChatMessages(phone);
  elements.chatHeader.textContent = `Chat con ${phone}`;
  elements.chatInput.disabled = false;
  elements.sendBtn.disabled = false;
  elements.chatInput.focus();
}

function renderChatMessages(phone) {
  elements.chatMessages.innerHTML = '';
  const conv = conversations[phone];
  if (!conv) return;

  conv.messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = `message ${msg.direction === 'inbound' ? 'received' : 'sent'}`;
    div.textContent = msg.text;
    elements.chatMessages.appendChild(div);
  });

  // Scroll to bottom
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

// Send Message Handler
elements.sendBtn.addEventListener('click', sendMessage);
elements.chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const text = elements.chatInput.value.trim();
  if (!text || !activeChatId) return;

  elements.chatInput.value = '';
  elements.chatInput.disabled = true;
  elements.sendBtn.disabled = true;

  try {
    // 1. Send via n8n Webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: activeChatId,
        text: text
      })
    });

    if (!response.ok) throw new Error('Error enviando mensaje');

    // 2. Optimistic UI update (optional, but Firebase listener will handle it)
    // We rely on n8n to save the outbound message to Firebase, which will trigger the listener

  } catch (error) {
    console.error('Error sending message:', error);
    alert('Error al enviar mensaje. Revisa la consola.');
  } finally {
    elements.chatInput.disabled = false;
    elements.sendBtn.disabled = false;
    elements.chatInput.focus();
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
