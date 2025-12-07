// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('express').json;
const authRoutes = require('./src/routes/auth');
const profileRoutes = require('./src/routes/profile');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // you can restrict origin to your frontend
app.use(bodyParser());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
