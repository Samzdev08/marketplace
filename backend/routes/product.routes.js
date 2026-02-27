const router = require('express').Router();
const productController = require('../controllers/product.controller');

router.get('/all', productController.getAllProducts);

module.exports = router;