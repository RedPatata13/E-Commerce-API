const axios = require('axios');
const Order = require('./orders.model');
const Product = require('../products/products.model');
const Cart = require('../cart/cart.model');
const { protect } = require('../../middleware/auth.middleware');

const PAYMONGO_AUTH = Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64');

exports.checkout = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if(!cart || cart.items.length === 0)
        return res.status(400).json({ message: 'Cart is empty' });

    const items = cart.items.map(i => ({
        product: i.product._id,
        quantity: i.quantity,
        price: i.product.price
    }));

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const paymongoRes = await axios.post(
        `https://api.paymongo.com/v1/links`,
        {
            data: {
                attributes: {
                    amount: totalAmount * 100, // paymongo uses cents by default so amount * 100,
                    description: `Order by user ${req.user.id}`,
                    currency: 'PHP',
                    payment_method_types: ['card', 'qrph']
                }
            }
        },
        { headers: { Authorization: `Basic ${PAYMONGO_AUTH}`, 'Content-Type': 'application/json' } }
    );

    const link = paymongoRes.data.data;

    const order = await Order.create({
        user: req.user.id,
        items,
        totalAmount,
        paymentLinkId: link.id,
        paymentLinkUrl: link.attributes.checkout_url
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
        message: 'Order created',
        orderId: order._id,
        paymentUrl: link.attributes.checkout_url
    });
};

exports.userOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.json(orders);
};

exports.cancelOrder = async (req, res) => {
    try {
        const PAYMONGO_AUTH = Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64');
        
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.user.toString() !== req.user.id)
            return res.status(403).json({ message: 'Unauthorized' });
        if (order.status === 'cancelled')
            return res.status(400).json({ message: 'Order is already cancelled' });

        await axios.post(
            `https://api.paymongo.com/v1/links/${order.paymentLinkId}/archive`,
            {},
            { headers: { Authorization: `Basic ${PAYMONGO_AUTH}` } }
        );

        order.status = 'cancelled';
        await order.save();

        res.json({ message: 'Order cancelled' });
    } catch (err) {
        console.log(err.response.data); // ← check your terminal for this
        return res.status(400).json(err.response.data);
    }
};