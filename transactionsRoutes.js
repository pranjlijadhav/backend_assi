const express = require('express');
// const transactionsController = require('../controllers/transactionsController');



const {initializeDatabase,  getStatistics, getBarChart, getPieChart, combinedData } = require('../controllers/transactionsController');
const router = express.Router();

router.get('/init-db', initializeDatabase);
// router.get('/your-route', yourControllerFunction);

// router.get('/transactions', listTransactions);
router.get('/statistics', getStatistics);
router.get('/price-range', getBarChart);
router.get('/categories', getPieChart);
router.get('/combined', combinedData);

module.exports = router;
