const express = require('express');
require('./config/db');
const app = express();
const cookieParser = require('cookie-parser')
const initRoute = require('./routes/initRoute.js');
const path = require('path');

const cors = require('cors');

app.use(cors());
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')));

const dotenv = require('dotenv');
dotenv.config();

app.get("/", (req, res) => {res.send("Hello World Auction Micro Service")});

app.use(express.json());

initRoute(app);

app.listen(process.env.PORT, () => {
    console.log('Server is running on port', process.env.PORT);
});

module.exports = app;


