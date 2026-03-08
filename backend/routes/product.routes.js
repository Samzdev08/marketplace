const router = require('express').Router();
const productController = require('../controllers/product.controller');

router.get('/search', productController.searchProduct);

module.exports = router;