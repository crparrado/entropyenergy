import { loadCatalog } from './catalog.js';
import { db, collection, addDoc, Timestamp } from './firebase.js';

// Mercado Pago Public Key
const MP_PUBLIC_KEY = 'APP_USR-8cbfa09f-d330-4422-9a0d-cd3b9920c0f4'; // Clave pública correcta

const regions = [
    "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
    "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío",
    "Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes"
];

const elements = {
    form: document.getElementById('checkoutForm'),
    payButton: document.getElementById('payButton'),
    summaryItems: document.getElementById('summaryItems'),
    summarySubtotal: document.getElementById('summarySubtotal'),
    summaryTotal: document.getElementById('summaryTotal'),
    regionSelect: document.getElementById('regionSelect'),
    walletContainer: document.getElementById('wallet_container')
};

let cart = [];
let catalog = [];
let mp = null;

async function init() {
    // Load catalog and cart
    try {
        catalog = await loadCatalog();
        loadCart();

        if (cart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        renderSummary();
        populateRegions();
        setupFormValidation();

        // Initialize Mercado Pago
        mp = new MercadoPago(MP_PUBLIC_KEY, {
            locale: 'es-CL'
        });

    } catch (error) {
        console.error('Error initializing checkout:', error);
    }
}

function loadCart() {
    const savedCart = localStorage.getItem('entropy_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function populateRegions() {
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        elements.regionSelect.appendChild(option);
    });
}

function renderSummary() {
    elements.summaryItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const product = catalog.find(p => p.id === item.productId);
        if (!product) return;

        const price = product.price_clp || 0;
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;

        const div = document.createElement('div');
        div.className = 'summary-item';
        div.innerHTML = `
      <span>${item.quantity}x ${product.name}</span>
      <span>$${itemTotal.toLocaleString('es-CL')}</span>
    `;
        elements.summaryItems.appendChild(div);
    });

    elements.summarySubtotal.textContent = `$${subtotal.toLocaleString('es-CL')}`;
    elements.summaryTotal.textContent = `$${subtotal.toLocaleString('es-CL')}`;
}

function setupFormValidation() {
    const inputs = elements.form.querySelectorAll('input, select');

    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('change', validateForm);
    });
}

function validateForm() {
    const isValid = elements.form.checkValidity();
    elements.payButton.disabled = !isValid;
    return isValid;
}

// Handle Payment
elements.payButton.addEventListener('click', async () => {
    if (!validateForm()) return;

    elements.payButton.textContent = 'Guardando pedido...';
    elements.payButton.disabled = true;

    const formData = new FormData(elements.form);
    const customerData = Object.fromEntries(formData.entries());

    // Prepare Order Data for Firestore
    const orderItems = cart.map(item => {
        const product = catalog.find(p => p.id === item.productId);
        return {
            id: item.productId,
            name: product.name,
            quantity: item.quantity,
            price: product.price_clp,
            total: product.price_clp * item.quantity
        };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);

    const orderData = {
        customer: customerData,
        items: orderItems,
        total: totalAmount,
        status: 'pending', // pending, paid, shipped
        createdAt: Timestamp.now(),
        paymentMethod: 'mercadopago'
    };

    try {
        // 1. Save to Firestore
        const docRef = await addDoc(collection(db, "orders"), orderData);
        const orderId = docRef.id;
        console.log("Order written with ID: ", orderId);

        // 1.5 Update Local Stock (Optimistic - for demo/local admin)
        updateLocalStock(cart);

        elements.payButton.textContent = 'Redirigiendo a pago...';

        // 2. Create Preference (Mercado Pago)
        const mpItems = orderItems.map(item => ({
            title: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: 'CLP'
        }));

        const preferenceData = {
            items: mpItems,
            payer: {
                name: customerData.firstName,
                surname: customerData.lastName,
                email: customerData.email,
                phone: {
                    area_code: '56',
                    number: customerData.phone
                },
                address: {
                    street_name: customerData.address,
                    zip_code: '',
                    street_number: ''
                }
            },
            metadata: {
                order_id: orderId, // Link MP payment to Firestore Order
                ...customerData
            },
            back_urls: {
                success: window.location.origin + `/payment-success.html?orderId=${orderId}`,
                failure: window.location.origin + '/payment-failure.html',
                pending: window.location.origin + '/payment-failure.html'
            },
            auto_return: 'approved',
            external_reference: orderId
        };

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer APP_USR-8416067423475798-112320-ecf32d3613bef2d14123461789d5c8d7-156125574', // Access Token Correcto
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preferenceData)
        });

        const preference = await response.json();

        if (preference.id) {
            mp.checkout({
                preference: {
                    id: preference.id
                },
                autoOpen: true
            });
        } else {
            throw new Error('No se pudo crear la preferencia');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al procesar el pedido. Intenta nuevamente.');
        elements.payButton.disabled = false;
        elements.payButton.textContent = 'Ir a Pagar';
    }
});

function updateLocalStock(cartItems) {
    try {
        const savedCatalog = localStorage.getItem('entropy_catalog_v2');
        if (savedCatalog) {
            const catalog = JSON.parse(savedCatalog);
            let updated = false;

            cartItems.forEach(item => {
                const productIndex = catalog.findIndex(p => p.id === item.productId);
                if (productIndex !== -1 && typeof catalog[productIndex].stock === 'number') {
                    catalog[productIndex].stock = Math.max(0, catalog[productIndex].stock - item.quantity);
                    updated = true;
                }
            });

            if (updated) {
                localStorage.setItem('entropy_catalog_v2', JSON.stringify(catalog));
            }
        }
    } catch (e) {
        console.error("Error updating local stock:", e);
    }
}

init();
