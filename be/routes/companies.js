const express = require('express');

const router = express.Router();

const companyController = require('../controllers/companiesController');

//Get Company info
router.get('/products/:id', companyController.get_companies_products)

module.exports = router;
