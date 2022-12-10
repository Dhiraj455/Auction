const express = require('express');

const initRoute = (app) =>{
    app.use(require("./adminRouter"))
}

module.exports = initRoute;