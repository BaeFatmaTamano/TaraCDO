// server.js
const express = require('express');
const mongoose = require('mongoose');

// Define Establishment Schema
const establishmentSchema = new mongoose.Schema({
    name: String,
    category: String,
    rating: Number,
    description: String,
    lat: Number,
    lng: Number
});

const Establishment = mongoose.model('Establishment', establishmentSchema);
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// MongoDB connection URI
const uri = 'mongodb://localhost:27017/taraCDO'; // replace with your DB name

// Connect to MongoDB using Mongoose
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB with Mongoose'))
  .catch(err => console.error('Failed to connect to MongoDB with Mongoose', err));

app.post('/api/establishments', async (req, res) => {
  try {
    const newEstablishment = new Establishment(req.body);
    await newEstablishment.save();
    res.status(201).json(newEstablishment);
  } catch (err) {
    console.error('Error adding new establishment:', err);
    res.status(400).json({ error: err.message });
  }
});

// Serve static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get establishments
app.get('/api/establishments', async (req, res) => {
  try {
    const establishments = await Establishment.find({});
    res.json(establishments);
  } catch (err) {
    console.error('Error fetching establishments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
