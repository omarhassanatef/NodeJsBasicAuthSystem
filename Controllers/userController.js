const _ = require('lodash');
const {ObjectID} = require('mongodb');
var {User} = require('../Models/user');
var mongoose = require('../Database/mongoose');


exports.register = function(req, res) {



    var body = _.pick(req.body, ['fullName','email', 'phoneNumber','password','isAdmin','confirmed','blocked']);
    user = new User( body );
    

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('access-token', token).send(user);
        res.status(200);
    }).catch((e) => {
        res.status(400).send(e);
    });
};

exports.login = function(req, res){
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
        res.status(201).header('access-token', token).send({user, token});
        });
    }).catch((e) => {
        res.status(400).send();
    });
};

exports.myprofile = function(req, res){
    user = new User(req.user);
    res.send(user);
};

exports.updateProfile = function(req, res){
        var id = req.user._id;
        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }
        var body = _.pick(req.body, ['fullName','email', 'phoneNumber','password','isAdmin','confirmed','blocked']);
    
        User.findOneAndUpdate({_id: id}, {$set: body}, {new: true, runValidators: true})
        .then(doc => {
            if (!doc) {
                return res.status(404).send();
            }
            res.send(doc);
        })
        .catch(e => res.status(400).send(e) );
};

exports.logout = function(req, res){
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
};

exports.userList = function(req, res) {  
    User.find({}).then( doc => res.send(doc))
                    .catch( e => {
                    res.status(400);
                    res.send(e);
                });
};



exports.deleteUser = function (req, res) {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    User.findOneAndRemove({ _id: id }).then((doc) => {
        if (!doc) {
            return res.status(404).send();
        }

        res.send(doc);
    }).catch((e) => {
        res.status(400).send();
    });
}


exports.getUser = function (req,res){
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    User.findOne({ _id: id })
        .then(doc => {
            if (!doc) {
                return res.status(404).send();
            }
            res.send(doc);
        })
        .catch(e => {
            res.status(404);
            res.send(e);
        });

}



