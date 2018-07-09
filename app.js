require('dotenv').config()
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');




//Import routes
const indexRouter = require('./routes/indexRouter');
const aboutRouter = require('./routes/aboutRouter');
const ideasRouter = require('./routes/ideasRouter');
const usersRouter = require('./routes/usersRouter');

//passport config
require('./config/passport')(passport);
//db config
const db = require('./config/database');

const app = express();
const port = process.env.PORT || 5000;



//set promise to native global
mongoose.Promise = global.Promise

//Connect to mongoose
mongoose.connect(db.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//express session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

//passport init and session middleware important goes after normal session
app.use(passport.initialize());
app.use(passport.session());

//mount flash
app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    //this is the error message for passport
    res.locals.error = req.flash('error');
    //in passport config we get access to the user and we assign it to the request object
    res.locals.user = req.user || null;
    next();
});



app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/ideas', ideasRouter);
app.use('/users', usersRouter);


app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
