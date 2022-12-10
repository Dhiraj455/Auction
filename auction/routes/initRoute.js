const express = require('express');

const initRoute = (app) =>{
    app.use(require("./adminRouter"))
    app.use(require("./auctionRouter"))
}

module.exports = initRoute;