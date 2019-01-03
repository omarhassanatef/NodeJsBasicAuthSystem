const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required: 'Please enter your name',
        minlength:10
        
    },
    email:{
        type:String,
        required: 'Please enter your email',
        unique:true
    },
    password:{
        type:String,
        required:'Please enter your password',
        minlength:7
        
    },
    confirmed:{
        type: Boolean,
        default:false
    },
    blocked:{
        type:Boolean,
        default:false
    },
    phoneNumber:{
        type:String,
        minlength:10,
        maxlength:10
    },
tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }],

isAdmin:{
  type:Boolean ,default:false
}

});


UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'fullName', 'isAdmin','email', 'confirmed', 'blocked', 'phoneNumber']);
  };
  
  UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var userInfo = _.pick(user.toObject(), ['fullName', 'email']);
    var token = jwt.sign({_id: user._id.toHexString(), access, userInfo}, process.env.JWT_SECRET).toString();
    user.tokens.push({access, token});
    return user.save().then(() => {
      return token;
    });
  };

  UserSchema.methods.removeToken = function (token) {
    var user = this;
    return user.update({
      $pull: {
        tokens: {token}
      }
    });
  };

  UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return Promise.reject();
    }
    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
  };
  
  UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    return User.findOne({email}).then((user) => {
      if (!user) {
        return Promise.reject();
      }
      return new Promise((resolve, reject) => {
        // Using bcrypt.compare to compare input password and user.password
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    });
  };
  
  UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
        });
      });
    } else {
      next();
    }
  });


UserSchema.index({"$**": 'text'});

var User = mongoose.model('User', UserSchema);

module.exports = { User };

