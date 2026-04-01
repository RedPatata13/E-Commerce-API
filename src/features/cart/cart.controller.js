const Cart = require('./cart.model');

exports.getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(cart || { items: [] });
};

exports.createCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    if(!cart) cart = await Cart.create({ user: req.user.id, items: [] });

    const existing = cart.items.find(i => i.product.toString() === productId);
    if(existing){
        existing.quantity += quantity;
    } else {
        cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart);
};

exports.deleteCartItem = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
};