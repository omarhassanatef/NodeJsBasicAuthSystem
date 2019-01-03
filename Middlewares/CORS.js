
var CORS = function(req, res, next){
 
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE,PUT');
    res.header('Access-Control-Allow-Headers','Content-Type,access-token');
    next();
};

module.exports = { CORS }