const express = require('express');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products/:productId', shopController.getProductDetails);
router.get('/products', shopController.getProducts);
router.get('/products/delete');

router.get('/cart', shopController.getCart);
router.post('/add-to-cart', shopController.addCart);
router.post('/cart-delete-product', shopController.deleteCartProduct);
router.post('/create-order', shopController.createOrder);
router.get('/orders', shopController.getOrders);
router.get('/checkout', shopController.getCheckout);

module.exports = router;

