const express = require('express');

const router = express.Router();

const companyController = require('../controllers/companiesController');

//Get Company info
router.get('/products/:id', companyController.get_companies_products);
router.get('/products/purchased/:id', companyController.get_companies_purchased_products);
router.get('/companiesInfo',  companyController.get_companies_info);
router.get('/warehouses/:id', companyController.get_warehouses);

module.exports = router;
