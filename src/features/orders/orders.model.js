const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: { type: String, enum: ['pending', 'paid', 'failed', 'cancelled'], default: 'pending' },
  paymentLinkId: String,   // PayMongo payment link ID
  paymentLinkUrl: String,  // URL to redirect user to pay
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);