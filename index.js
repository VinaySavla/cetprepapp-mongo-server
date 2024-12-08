const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes'); // Adjust the path to your routes file

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://cetprepapp:cetprepapp@cetprepapp.4qm9k.mongodb.net/?retryWrites=true&w=majority&appName=cetprepapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Check connection
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
}).on('error', (error) => {
    console.log('Connection error:', error);
});

// Use the routes
app.use('/api', routes); // Mount the routes at /api

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});