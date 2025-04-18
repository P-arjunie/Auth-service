require ('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

//routes
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

//test route
app.get('/', (req, res) => {
    res.send('Auth service is running');
});

//routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`)
})
