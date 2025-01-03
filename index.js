const express = require('express');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

// Database connection
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Models
const Entry = require('./models/Entry');
const EntryRelation = require('./models/EntryRelation');
const EntryParticipant = require('./models/EntryParticipant');
const MetricLog = require('./models/MetricLog');

// Routes
app.use('/api/entries', require('./routes/entries'));
app.use('/api/relations', require('./routes/relations'));
app.use('/api/participants', require('./routes/participants'));
app.use('/api/metrics', require('./routes/metrics'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
