const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/db'); // Connect to MariaDB using Sequelize
const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const productRoutes = require('./routes/productRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');

const app = express();

// Connect to MariaDB
sequelize.authenticate()
  .then(() => {
    console.log('Connected to MariaDB');
    return sequelize.sync();
  })
  .catch(error => {
    console.error('Unable to connect to MariaDB:', error);
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));// Routes
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api', productRoutes);
app.use('/', purchaseRoutes);


// Serve frontend (index.html) for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/Menu.html', (req, res) => {
  res.sendFile(path.join(buildPath, 'Menu.html'));
});
app.get('/addProduct.html', (req, res) => {
  res.sendFile(path.join(buildPath, 'addProduct.html'));
});
app.get('/maksu.html', (req, res) => {
  res.sendFile(path.join(buildPath, 'maksu.html'));
});
// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Server error', error: err.message });
});
app.use('/docs', express.static('docs'));
// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
