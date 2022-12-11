const express = require('express');
require('./config/db');
const app = require('./bin/app');

app.listen(process.env.PORT, () => {
    console.log('Server is running on port', process.env.PORT);
});

module.exports = app;


