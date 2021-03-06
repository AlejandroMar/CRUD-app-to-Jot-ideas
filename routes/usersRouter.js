const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User');
const passport = require('passport');


router.get('/login', (req, res, next) => {
    res.render('users/login');
});

router.get('/register', (req, res, next) => {
    res.render('users/register');
});

//Login POST FORM
router.post('/login', (req, res, next) => {
    //this is how we use the local strategy but we need to define in config/passport
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Register form POST
router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password !== req.body.password2) {
        errors.push({ text: 'Passwords do not match' });
    }

    if (req.body.password.length < 4) {
        errors.push({ text: 'Passwords must be at least 4 characters' });
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });

    } else {
        UserModel.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'email already exist');
                    res.redirect('/users/register');
                } else {
                    const newUser = new UserModel({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    })

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then((user) => {
                                    req.flash('success_msg', 'You are registered and can log in');
                                    //I think redirect works as a request to a url 
                                    res.redirect('/users/login');
                                }).catch((err) => {
                                    console.log(err);
                                });

                        });
                    });
                }
            });
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Your are logged out');
    res.redirect('/users/login');
})


module.exports = router;