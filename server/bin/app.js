const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const initRoute = require('../routes/initRoute');
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const cors = require('cors');

app.use(cors());
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')));

const dotenv = require('dotenv');
dotenv.config();

app.get("/", (req, res) => {res.send("Hello World User Management Micro Service")});

app.use(express.json());

initRoute(app);

module.exports = app;