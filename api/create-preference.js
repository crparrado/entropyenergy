// API Endpoint: /api/create-preference
// Crea una preferencia de pago en Mercado Pago

const mercadopago = require('mercadopago');

// Configurar credenciales según el entorno
const accessToken = process.env.NODE_ENV === 'production'
    ? process.env.MP_ACCESS_TOKEN
    : process.env.MP_TEST_ACCESS_TOKEN;

mercadopago.configure({
    access_token: accessToken
});

module.exports = async (req, res) => {
    // Solo permitir POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { items, payer } = req.body;

        // Validar datos
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Items are required' });
        }

        // Crear preferencia de pago
        const preference = {
            items: items.map(item => ({
                title: item.title,
                unit_price: Number(item.unit_price),
                quantity: Number(item.quantity),
                currency_id: 'CLP'
            })),
            payer: payer || {},
            back_urls: {
                success: `${process.env.SITE_URL}/payment-success.html`,
                failure: `${process.env.SITE_URL}/payment-failure.html`,
                pending: `${process.env.SITE_URL}/payment-pending.html`
            },
            auto_return: 'approved',
            notification_url: `${process.env.SITE_URL}/api/webhook`,
            statement_descriptor: 'ENTROPYENERGY',
            external_reference: `ORDER-${Date.now()}`
        };

        const response = await mercadopago.preferences.create(preference);

        res.status(200).json({
            id: response.body.id,
            init_point: response.body.init_point,
            sandbox_init_point: response.body.sandbox_init_point
        });

    } catch (error) {
        console.error('Error creating preference:', error);
        res.status(500).json({
            error: 'Error creating payment preference',
            details: error.message
        });
    }
};
