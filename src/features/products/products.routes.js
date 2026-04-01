const router = require('express').Router();
const { protect, adminOnly } = require('../../middleware/auth.middleware');
const controller = require('./products.controller');

router.get('/', controller.getProducts);
router.get('/:id', controller.getProductById);
router.post('/', protect, adminOnly, controller.createProduct);
router.put('/:id', protect, adminOnly, controller.updateProduct);
router.delete('/:id', protect, adminOnly, controller.deleteProduct);

module.exports = router;