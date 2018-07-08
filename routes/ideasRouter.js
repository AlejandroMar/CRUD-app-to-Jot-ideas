const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const IdeaModel = require('../models/Idea');

//Load helper
const { ensureAuthenticated } = require('../helpers/auth');


//get form to add ideas
router.get('/add', ensureAuthenticated, (req, res, next) => {
    res.render('ideas/add');
});

//fetch the ideas
router.get('/', ensureAuthenticated, (req, res) => {
    IdeaModel.find({ user: req.user.id })
        //sort ideas in descending order
        .sort({ date: 'desc' })
        .then((ideas) => {
            res.render('ideas/index', {
                ideas
            });
        });
});

// Edit Idea form
router.get('/edit/:id', ensureAuthenticated, (req, res, next) => {
    IdeaModel.findOne({ _id: req.params.id })
        .then(idea => {
            if (idea.user !== req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/ideas');
            } else {
                res.render('ideas/edit', { idea })
            }
        })


});

// Edit the Idea with PUT request method
router.put('/:id', ensureAuthenticated, (req, res, next) => {

    IdeaModel.findOne({ _id: req.params.id })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;
            //I want to practice  promises
            return Promise.resolve(idea);
        }).then(idea => idea.save())
        .then(idea => {
            req.flash('success_msg', 'Idea updated');
            res.redirect('/ideas')
        })
        .catch(err => console.log(err))
});

// Delete ideas with DELETE request method
router.delete('/:id', ensureAuthenticated, (req, res, next) => {
    IdeaModel.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Your idea was removed');
            res.redirect('/ideas');
        })
});



//Process Form
router.post('/', ensureAuthenticated, (req, res) => {
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
            details: req.body.details,
            user: req.user.id
        }

        new IdeaModel(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'New Idea added');
                res.redirect('/ideas');
            })

    }

});



module.exports = router;