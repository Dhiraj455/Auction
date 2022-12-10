const express = require('express');

const initRoute = (app) =>{
    app.use(require("./adminRouter"))
    app.use(require("./auctionRouter"))
    app.use(require("./userRouter"))
}

module.exports = initRoute;