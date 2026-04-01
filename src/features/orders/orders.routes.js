const router = require('express').Router();
const { protect } = require('../../middleware/auth.middleware');
const controller = require('./orders.controller');

router.get('/', protect, controller.userOrders);
router.post('/checkout', protect, controller.checkout);
router.post('/:id/cancel', protect, controller.cancelOrder);

module.exports = router;