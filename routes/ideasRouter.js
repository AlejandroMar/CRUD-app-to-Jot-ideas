const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const IdeaModel = require('../models/Idea');

router.get('/add', (req, res, next) => {
    res.render('ideas/add');
});

router.get('/', (req, res) => {
    IdeaModel.find({})
        //sort ideas in descending order
        .sort({date: 'desc'})
        .then((ideas) => {
            res.render('ideas/index', {
                ideas
            });
        });  
});

// Edit Idea form
router.get('/edit/:id', (req, res, next) => {
    IdeaModel.findOne({ _id: req.params.id })
        .then(idea => res.render('ideas/edit', { idea }))

    
});

// Edit the Idea with PUT request method
router.put('/:id', (req, res, next) => {

    IdeaModel.findOne({ _id: req.params.id })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;
            //I want to practice  promises
            return Promise.resolve(idea);
        }).then(idea => idea.save()).then(idea => res.redirect('/ideas'))
        .catch(err => console.log(err))
});

// Delete ideas with DELETE request method
router.delete('/:id', (req, res, next) => {
    IdeaModel.remove({ _id: req.params.id })
        .then(() => {
            res.redirect('/ideas');
        })
})



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