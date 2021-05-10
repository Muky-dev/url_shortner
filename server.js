import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
const app = express();
dotenv.config();

// Basic Configuration
const port = process.env.PORT || 3000;

const __dirname = path.dirname('/');

// App "configs"
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use('/public', express.static(__dirname + '/public'))

import mongoose from 'mongoose';
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => {
    console.log("Database connected successfully");
});

// First route;
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

import routes from './routes/router.js';
app.use('/', routes);

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
