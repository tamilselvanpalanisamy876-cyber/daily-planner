const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/moods', require('./routes/moodRoutes'));
app.use('/api/focus', require('./routes/focusRoutes'));

app.get('/', (req, res) => {
  res.send('Daily Planner API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
