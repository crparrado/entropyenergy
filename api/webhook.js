// API Endpoint: /api/webhook
// Recibe notificaciones de Mercado Pago sobre el estado de los pagos

const mercadopago = require('mercadopago');

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
        const { type, data } = req.body;

        // Mercado Pago envía notificaciones de tipo "payment"
        if (type === 'payment') {
            const paymentId = data.id;

            // Obtener información del pago
            const payment = await mercadopago.payment.get(paymentId);

            console.log('Payment notification received:', {
                id: payment.body.id,
                status: payment.body.status,
                external_reference: payment.body.external_reference,
                transaction_amount: payment.body.transaction_amount
            });

            // Aquí puedes guardar el pago en una base de datos
            // o enviar un email de confirmación

            // Por ahora solo logueamos
            if (payment.body.status === 'approved') {
                console.log('✅ Payment approved:', paymentId);
            } else if (payment.body.status === 'rejected') {
                console.log('❌ Payment rejected:', paymentId);
            }
        }

        // Siempre responder 200 OK para que MP no reintente
        res.status(200).json({ received: true });

    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(200).json({ received: true }); // Aún así responder OK
    }
};
