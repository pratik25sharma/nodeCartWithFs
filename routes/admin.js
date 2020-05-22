const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.addNewProducts);

router.get('/product-list', adminController.getProducts);
router.post('/delete-product/:productId', adminController.deleteProduct);

router.post('/edit-product', adminController.postEditProduct);
router.get('/edit-product/:productId', adminController.editProducts)


module.exports = router;

