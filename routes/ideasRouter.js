const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const IdeaModel = require('../models/Idea');

router.get('/add', (req, res, next) => {
    res.render('ideas/add');
});


//Process Form
router.post('/', (req, res) => {
    //simple server validation
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add a title' });

    }
    if (!req.body.details) {
        errors.push({ text: 'Please add some details' });
    }
    // if there are errors
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }

        new IdeaModel(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas');
            })

    }

});



module.exports = router;