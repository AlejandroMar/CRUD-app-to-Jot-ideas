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
            })
    }));
}
