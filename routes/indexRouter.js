const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    const title = 'Welcome Alejandro';
    // with es6
    res.render('index', { title });
});

module.exports = router;