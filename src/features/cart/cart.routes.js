const router = require('express').Router();
const controller = require('./cart.controller');
const { protect } = require('../../middleware/auth.middleware');

router.get('/', protect, controller.getCart);
router.post('/', protect, controller.createCart);
router.delete('/:productId', protect, controller.deleteCartItem);

module.exports = router;