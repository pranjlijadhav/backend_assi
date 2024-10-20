const Transaction = require('../models/Transaction');
// const axios = require('axios');
const axios = require('axios');


// Initialize database with data from the third-party API
const initializeDatabase = async (req, res) => {
   try {
       const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
       const transactions = response.data;
       
       // Remove old data if necessary
       await Transaction.deleteMany({});
       
       // Seed new data
       await Transaction.insertMany(transactions);
       res.status(200).send("Database initialized successfully with seed data.");
   } catch (error) {
       res.status(500).send("Error initializing database.");
   }
};

// const listTransactions = async (req, res) => {
//   try {
//       const { search = '', page = 1, perPage = 10 } = req.query;
//       const searchQuery = search ? {
//           $or: [
//               { title: new RegExp(search, 'i') },
//               { description: new RegExp(search, 'i') },
//               { price: { $eq: search } }
//           ]
//       } : {};

//       const transactions = await Transaction.find(searchQuery)
//           .skip((page - 1) * perPage)
//           .limit(parseInt(perPage));
//       res.status(200).json(transactions);
//   } catch (error) {
//       res.status(500).send("Error fetching transactions.");
//   }
// };


const getStatistics = async (req, res) => {
  const { month } = req.query;

  try {
      const startDate = new Date(`2023-${month}-01`);
      const endDate = new Date(`2023-${month}-31`);

      const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lte: endDate } });

      const totalSale = transactions.reduce((acc, curr) => curr.sold ? acc + curr.price : acc, 0);
      const totalSoldItems = transactions.filter(t => t.sold).length;
      const totalNotSoldItems = transactions.filter(t => !t.sold).length;

      res.status(200).json({ totalSale, totalSoldItems, totalNotSoldItems });
  } catch (error) {
      res.status(500).send("Error fetching statistics.");
  }
};


const getBarChartData = async (req, res) => {
  const { month } = req.query;

  try {
      const startDate = new Date(`2023-${month}-01`);
      const endDate = new Date(`2023-${month}-31`);
      
      const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lte: endDate } });
      
      const priceRanges = {
          '0-100': 0, '101-200': 0, '201-300': 0, '301-400': 0, '401-500': 0,
          '501-600': 0, '601-700': 0, '701-800': 0, '801-900': 0, '901-above': 0
      };
      
      transactions.forEach((transaction) => {
          const price = transaction.price;
          if (price <= 100) priceRanges['0-100']++;
          else if (price <= 200) priceRanges['101-200']++;
          else if (price <= 300) priceRanges['201-300']++;
          else if (price <= 400) priceRanges['301-400']++;
          else if (price <= 500) priceRanges['401-500']++;
          else if (price <= 600) priceRanges['501-600']++;
          else if (price <= 700) priceRanges['601-700']++;
          else if (price <= 800) priceRanges['701-800']++;
          else if (price <= 900) priceRanges['801-900']++;
          else priceRanges['901-above']++;
      });

      res.status(200).json(priceRanges);
  } catch (error) {
      res.status(500).send("Error fetching bar chart data.");
  }
};


const getPieChartData = async (req, res) => {
  const { month } = req.query;

  try {
      const startDate = new Date(`2023-${month}-01`);
      const endDate = new Date(`2023-${month}-31`);

      const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lte: endDate } });

      const categoryDistribution = {};

      transactions.forEach((transaction) => {
          categoryDistribution[transaction.category] = (categoryDistribution[transaction.category] || 0) + 1;
      });

      res.status(200).json(categoryDistribution);
  } catch (error) {
      res.status(500).send("Error fetching pie chart data.");
  }
};

const getCombinedData = async (req, res) => {
  const { month } = req.query;

  try {
      const statistics = await getStatistics(req, res);
      const barChartData = await getBarChartData(req, res);
      const pieChartData = await getPieChartData(req, res);

      res.status(200).json({
          statistics: statistics.data,
          barChartData: barChartData.data,
          pieChartData: pieChartData.data
      });
  } catch (error) {
      res.status(500).send("Error fetching combined data.");
  }
};


module.exports = { initializeDatabase,  getStatistics, getBarChartData, getPieChartData,  getCombinedData };
