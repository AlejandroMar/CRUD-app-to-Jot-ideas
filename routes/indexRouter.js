const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    let title = 'Welcome to Que Nota!';
    if (req.isAuthenticated()) {
        title = 'Welcome ' + req.user.name;
    }

    // with es6
    res.render('index', { title });
});

module.exports = router;