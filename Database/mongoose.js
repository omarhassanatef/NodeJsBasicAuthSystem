var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/authdb", { useNewUrlParser: true }).catch((e)=>{
    console.log(e);
    
});

mongoose.plugin(schema => { schema.options.usePushEach = true });

module.exports = { mongoose };
