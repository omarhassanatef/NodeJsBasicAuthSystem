const routerApi = require('express').Router();
var mongoose = require('mongoose');
var userController = require("../Controllers/userController")
var { authenticate } = require("../Middlewares/authenticate")





//User ( Client ) APIs 

routerApi.post('/register',userController.register);
routerApi.post('/login',userController.login);
routerApi.patch('/update-profile',authenticate, userController.updateProfile);
routerApi.get('/user/me',authenticate ,userController.myprofile);
routerApi.delete('/logout',authenticate, userController.logout);
routerApi.get('/getsystemusers',userController.userList)
routerApi.delete('/deleteuser/:id',userController.deleteUser)
routerApi.get('/finduser/:id',userController.getUser);
routerApi.get('/home',(req,res)=>{
    res.send("Hello User!")
});


routerApi.get('*', (req, res) => {
    res.status(404);
    res.send({message: 'Invalid URL!'});
});

module.exports = { routerApi };