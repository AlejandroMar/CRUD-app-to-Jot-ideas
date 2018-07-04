const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());


//set promise to native global
mongoose.Promise = global.Promise

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/vidjot-dev')
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

//Load Idea model
const IdeaModel = require('./models/Idea');
const indexRouter = require('./routes/indexRouter');
const aboutRouter = require('./routes/aboutRouter');

app.use('/', indexRouter);
app.use('/about', aboutRouter);



app.get('/ideas/add', (req, res, next) => {
    res.render('ideas/add');
});

//Process Form
app.post('/ideas', (req, res) => {
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
    
})





app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
