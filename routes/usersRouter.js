const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.get('/login', (req, res, next) => {
    res.send('login');
});

router.get('/register', (req, res, next) => {
    res.send('register');
});


module.exports = router;