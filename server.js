// Require the express module
var express = require("express");

// Create the Express App
var app = express();

// Require body-parser (to receive post data from clients)
var bodyParser = require("body-parser");

// Integrate body-parser with our app
app.use(bodyParser.urlencoded());

// path module -- try to figure out where and why we use this
var path = require("path");

// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, "./static")));

var mongoose = require('mongoose');

// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/quoting_dojo_redux');

// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));

// Setting our Engine set to EJS
app.set('view engine', 'ejs');

// To make a Model, you first define a schema, which is the blueprint for a model
var UserSchema = new mongoose.Schema({
	name: String, 
	quote: String,
	date: {type: Date, default: Date.now}
});

UserSchema.path('name').required(true, 'User name cannot be blank');
UserSchema.path('quote').required(true, 'Quote name cannot be blank');

// Store the Schema under the name 'User'
mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'

// Retrieve the Schema called 'User' and store it to the variable User
var User = mongoose.model('User') // We are retrieving this Schema from our Models, named 'User'

//root route to render the index.ejs view
app.get('/', function(req, res){
	// This is where we will retrieve the users from the database and include them in the view page we will be rendering
	
	res.render('index');
})

app.get('/quotes', function(req, res){
	User.find({}, function(err, users) {

	res.render('result', {users: users});
	})
})

// When the user presses the submit button on index.ejs it should send a post request to '/users'.  In
//  this route we should add the user to the database and then redirect to the root route (index view).
app.post('/quotes', function(req, res) {

	// This is where we would add the user from req.body to the database
	console.log("POST DATA", req.body);

 		var user = new User({	 
 			name: req.body.name,
 			quote: req.body.quote
 		})

 	user.save(function(err){
 	// if there is an error console.log that something went wrong!
	 	if(err) {
	 		console.log('something went wrong');
	 		res.render('index', {title: 'you have errors', errors: user.errors})
	 	} else { // else console.log that we did well and then redirect to the root route
	 		console.log('successfully added a user!');
	 		res.redirect('/quotes');
	 	}
 	})
})
 // This is where we would add the user to the database
 // Then redirect to the root route

// tell the express app to listen on port 8000
app.listen(8001, function() {
 console.log("listening on port 8001");
})