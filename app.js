
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var twilio = require('twilio');


var app = express();

app.configure(function() {
		app.use(express.static(__dirname + '/public'));
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
});

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Restaurants');

var restaurant = mongoose.model('restaurant',{
	name : String,
	address : String,
	dishes : [{
		name : String,
		levels : {type : Number, min : 0}
	}],
	zip: Number
});



var hans = new restaurant({
	name : 'hans',
	address : 'lol',
	dishes : [{
		name : 'pro foodz',
		levels : 2
	}],
	zip: 12345
})


hans.save(); 



// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//app.get('/', routes.index);
app.get('*',function(req,res){
	res.sendfile('../public/index.html');
});

app.get('/api/restaurants',function(req,res){
	restaurant.find(function(err,restaurants){
		if (err)
			res.send(err);
		console.log(restaurants);
		res.json(restaurants);
	})
});

app.get('/api/restaurants/:name',function(req,res){
	restaurant.find({'name' : req.params.name}, function(err, results) {
		console.log(results);
		res.json(results);
	})
});


app.get('/api/sms', function(req, res) {
	console.log(req);

	var resp = new twilio.TwimlResponse();
	//var parsedResponse = textmessage.parse(req);
	//resp.message(parsedresponse.toString());

	var parsedResponse = 'Papa';

	restaurant.find({'name': parsedResponse},function(err,restaurants){
		
		console.log(restaurants);
		//res.json(restaurants);
		//get random restaurant from list of returned results
		var picked = restaurants[Math.floor(Math.random()*restaurants.length)];
		//send just the name of the restaurant
		var messageText = picked.name + ' ' + picked.address;
		console.log(messageText);
		resp.message(messageText);
		res.send(resp.toString());
	});

	//resp.message("Thanks for texting us. This service isn't running yet but it will be soon");
	//res.send(resp.toString());
});

app.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

/*app.get('/api/restaurants/:zip',function(req,res){
	restaurants.find({ 'zip': req.params.zip });
});*/

app.listen(1337);
console.log("App is running on port 1337");
