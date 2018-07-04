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

* go to mongodg webpage and downoad it, in mac extract the file it's an executable, rename it to mongo, and move it to user directory
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
mongodb is schmaless but with mongoose we use the schema to keep our collections and documents consistent

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