// Mercado Pago Checkout - Frontend Integration
// Reemplaza la función processCheckout en cart.js

async function processCheckout() {
    const activeItems = state.items.filter(item => item.quantity > 0);

    if (activeItems.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    // Deshabilitar botón mientras procesa
    elements.checkoutLink.disabled = true;
    elements.checkoutLink.textContent = 'Redirigiendo...';

    try {
        // Preparar items para Mercado Pago
        const items = activeItems.map(item => ({
            title: item.name,
            unit_price: item.unitPrice,
            quantity: item.quantity,
            currency_id: 'CLP'
        }));

        // Calcular total
        const total = activeItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

        // Crear preferencia usando el SDK de Mercado Pago (frontend)
        const mp = new MercadoPago('APP_USR-4c098929-1ea8-4762-965e-a3e7a2c75a90', {
            locale: 'es-CL'
        });

        const preference = {
            items: items,
            back_urls: {
                success: 'https://www.entropyenergy.cl/payment-success.html',
                failure: 'https://www.entropyenergy.cl/payment-failure.html',
                pending: 'https://www.entropyenergy.cl/payment-success.html'
            },
            auto_return: 'approved',
            statement_descriptor: 'ENTROPYENERGY',
            external_reference: `ORDER-${Date.now()}`
        };

        // Crear checkout
        const checkout = mp.checkout({
            preference: preference
        });

        // Abrir modal de pago
        checkout.open();

    } catch (error) {
        console.error('Error al procesar el pago:', error);
        alert('Hubo un error al procesar el pago. Por favor intenta nuevamente.');
        elements.checkoutLink.disabled = false;
        elements.checkoutLink.textContent = 'Pagar con Mercado Pago';
    }
}
