const express = require('express');
const router = express.Router();
const IdeaModel = require('../models/Idea');

router.get('/add', (req, res, next) => {
    res.render('ideas/add');
});


//Process Form
router.post('/', (req, res) => {
    //simple server validation
    let errors = [];

    if(!req.body.title){
      errors.push({text: 'Please add a title'}); 
      
    }
    if(!req.body.details){
      errors.push({text: 'Please add some details'});  
    }
    // if there are errors
    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details 
        });
    }else{
        res.send('passed');

    }
    
});



module.exports = router;