'use strict';
require('./config/config');


const express = require('express');
const bodyParser = require('body-parser');
const { routerApi } = require('./Routes/api');
const { CORS } = require('./Middlewares/CORS')
const mongoose = require('mongoose'); 
const app = express();
app.use(bodyParser.json());
app.use('/api', routerApi);
app.use('/api',CORS);




const port = 3000;
app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});  


module.exports = { app };