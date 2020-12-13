const express = require('express');

const router = express.Router();

const transactionsController = require('../controllers/transactionsController');

router.get('/orders', transactionsController.get_company_purchased_orders);
router.get('/salesitems', transactionsController.get_companies_products);

module.exports = router;