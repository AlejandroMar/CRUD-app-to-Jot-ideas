const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load user Model
const UserModel = require('../models/User');



module.exports = function (passport) {
    //here comes the strategy and serialize and deserialize
    //this module will be used in app.js, go there to see
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {
        //console.log(email);
        /*now look for user in data-base with that email and see if passwords match*/
        UserModel.findOne({ email: email })
            .then(user => {
                if(!user){
                    return done(null, false, {message: 'No user found'});
                }

                //Match password firs arg comes from request is not hashed and 2 arg comes hashed from data-base
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) {return done(err)}
                    if(isMatch){
                        //I think this user will be later in the request object
                        return done(null, user);
                    }else{
                        return done(null, false, {message: 'Incorrect password'});
                    }
                })
            })
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        UserModel.findById(id, function(err, user) {
          done(err, user);
        });
      });
}
