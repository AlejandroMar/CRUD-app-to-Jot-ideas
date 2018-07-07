## Section 3 lecture 11.
the send method is a method attached to the response object, the response object has built in methods and I can also attach custum ones.

##### Where are the global dependencies installed?
Type in terminal: 

**npm root -g** 
<span style="color:orange"> _very useful trick to find certain things_</span>.

## Section 3 lecture 12.
##### Middleware

they are basically functions that have access to the request and response objects, and the next middelware function in the req res cycle, if the current middleware doesn't end the req-res cycle, it must call the next function, otherwise the request will be left hanging.

#####example.

let's use a simple middleware

```javascript
app.use((req, res, next) => {
    req.name = 'alejo';
    next();
}) 
```

now the request object has the property name in it
and will be accessecible for the next middleware function.

This is how authentication works with passport for example it will put the user information from the session once logged in, in the request req.user = user so the whole app can use it when needed.

## Section 3 lecture 13.

##### handlebars template engine

npm i express-handlebars



handlebars middleware. 

```javascript
var exphbs  = require('express-handlebars');
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

```

create a views directory
check documentation and know that the layout folder is meant to wrapp the other views.

[express-handlebars github](https://github.com/ericf/express-handlebars)

inside layout -> main.handlebars you put your HTML DOCTYPE etc.. it is a view that wrapps around all the other views.
To inject a view inside main.handlebars use {{{body}}}.

you can pass dynamic data into the view like this:

```javascript
app.get('/', (req, res, next) => {

    const title = 'Welcome Alejandro';
    res.render('index', { title: title });
});

```

## Section 3 lecture 14.
##### Bootstrap and and 

grab the cdn and put it in the layout -> main.handlebars
create a partial folder in views and there create a _navbar.hadlebars file where you can put the navbar code and the injecte it in main.handlebars with {{ > _navbar }} (the _ signifies that it is a partial)

## Section 4 lecture 15.

#### install mongodb, mongoose and Connect

##### how to install mongodb and use it in local machine

[instructions](https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/t/lecture/5677846?start=0)

* go to mongoDB webpage and downoad it, in mac extract the file it's an executable, rename it to mongo, and move it to user directory
* create another folder alongside the mongo folder, not inside but beside and name it mongo-data this holdes the actual data in the data-base
* got to terminal and navigate to mongo folder and cd to the bin folder
* ther you find the mongod and mongo files, the mongod is for the data-base server and the mongo for the mongodb connection app to have the data base running on mongodb server
* set up the database server in terminal: ./mongod --dbpath ~/mongo-data, I should see a line in terminal that says waiting for connections on port 27017

* then in another terminal run: ./mongo  "this is the connection like the commando line app"
* if all the steps work close the mongo terminal and go to robomongo and use the data-base server there better with moongoose.

###### now install and set mongoose

npm i --save mongoose

start server again, import it to app.js and connect to data-base 

map the global promise 
mongoose.Promise = global.Promise

```javascript
mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/vidjot-dev')
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))
```


## Section 4 lecture 16.
mongodb is schemaless but with mongoose we use the schema to keep our collections and documents consistent

+ create your models folder and inside create an Idea.js file it is a good practice to name your models with a capital letter
 
## Section 4 lecture 17
let's add some more views for creating ideas and so on

## Section 4 lecture 18
##### server side form validation

to get input values from a form we use body parser, but it is already implemented by express so we just write 
```javascript
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());
```
This middleware parses the incoming request and turns the body of the request into an usable object. where the given names and values that are in the body can be used.

##### server side validation
```javascript
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
```
for frontend just add for now the required atribute to the input and textarea fields

## Section 4 lecture 19
##### saving idea to mongoDB
connect to mongo server and save your ideas then use robomogo to see if it is working.


## Section 4 lecture 20
##### fetching ideas from mongoDB
```javascript
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
```
We get an array back to work in the /ideas/index view so we can do something like this

```html
{{#each ideas}}
    <div class="card card-body">
        <h4>{{title}}</h4>
        <p>{{details}}</p>
    </div>
{{else}}
    <p>No Ideas listed</p>
{{/each}}
```

## Section 4 lecture 21
##### Edit idea form

easy just follow the code

## Section 4 lecture 22
##### Update idea 
###### put request

with out ajax we ca't simply do put request with express for that we need the npm package method-override
we want to do it using a query value

docs [method-override](https://github.com/expressjs/method-override) 

```javascript
var express = require('express')
var methodOverride = require('method-override')
var app = express()

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
```

```html
<form method="POST" action="/resource?_method=DELETE">
<input type="hidden" name="_method" value="DELETE">
  <button type="submit">Delete resource</button>
</form>

```

once you make the New request check the URL to see the extra parameter

the thing is I don't find traversy's way of doing it clean, I think it could be done better with model.update
or something like that

## Section 4 lecture 23
##### delete idea
delete request
add delete button  and use method-override again
Note: As long as the methods are diferent the urls can be the same.


## Section 4 lecture 24 
### Implement flash

first we have to use the express-session package: npm

[express-session](https://github.com/expressjs/session) documentation.
[npm express-session](https://www.npmjs.com/package/express-session)

npm install express-session
#### session basic options
##### secret 
in express-sesion is the string used to salt the hash to compare the cookie id between client and  server;

##### resave.
 tells to save or not the session information every time a request is made, no matter if there were changes or 
 
##### saveUninitialized
the session it's just an onbject that at the beginning is empty, it's meant to store the information about the user and it's behaviour
saveUninitialized stores the session object even when it's empty or not initialized. if it is false the session only get's stored when something get's writen in the object.

to access the session i just have to use req.session
exm:  console.log(req.session);



[connect-flash](https://github.com/jaredhanson/connect-flash) documentation
The flash is a special area of the session used for storing messages. Messages are written to the flash and cleared after being displayed to the user. The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered.

```javascript
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
```


##### res.locals
An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any). Otherwise, this property is identical to app.locals.

now check in folder views the partial _msg and note that it gets injected in main.handlebars

now when i delete a note I can flash the following msg

```javascript
router.delete('/:id', (req, res, next) => {
    IdeaModel.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Your idea was removed');
            res.redirect('/ideas');
        })
})
```

####callback:
A callback place in the function argument acording to es6 is should be the first argument, because that way i can use the rest paramenter also called ellipsis operator.

say if -1 return undefined or null, just an idea.

## section 5 lecture 25
#### A look at passport
basically we create a route  with post to /login and then we use the method: passport.authenticate('strategy')



## section 5 lecture 26
#### express router
+ In this lecture he uses the express router with the routes folder. But I already did it.

## section 5 lecture 27
#### login and register pages
res.render('users/login'); don't add / at the begining 


## section 5 lecture 28
#### register form Validation
install bcryptjs 
npm i --save bcryptjs

in the form action="/url/path"   method="POST"
let's see if the passwords match

The name="email" atribute set the property name in the request body object
name="name"
name="email"
name="password"
```javascript

{ name: 'Alejandro Márquez',
  email: 'mot@hotmail.com',
  password: 'sds',
  password2: 'sdsd' }

```