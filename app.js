var express = require('express');
var app = express();
var path = require('path');
var fs = require("fs");

var sortBy = require("sort-by");

var bodyParser = require('body-parser');
var randomID = require("random-id");
var methodOverride = require('method-override');

// ADD MONGODB PACKAGES CODE BELOW -- START
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/todo_list';
// ADD MONGODB PACKAGES CODE ABOVE -- END

app.use(methodOverride('_method'));

app.set('view engine', 'pug');
app.set('views','./views');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded


// ADD THE MONGODB CONNECTION CODE BELOW -- START
MongoClient.connect(url, function (err, db) { // making the connection to mongoDB
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    }
    else {
        console.log('Connection established to', url);
        app.locals.db = db;
    }
});
// ADD THE MONGODB CONNECTION CODE ABOVE -- END

// Home page
app.get('/', function (req, res) {
    var deleteMessage = req.query.message || "";
    const db = req.app.locals.db;
    db.collection('todo', function (err, collection) {
        collection.find().toArray(function (err, items) {
            console.log(items);
            res.render('index', { /* loading the index first */
                users: items,
                deleteMessage: deleteMessage
            });
        });
    });
});


// add the add.pug page
app.get('/add', function (req, res) {
    res.render('add', {
        title: "Get shift done"
    });
});

//add a POST for the add.pug page so we can post task items
app.post('/', function (req, res) {
    req.body.id = randomID(10);
    // req.body.img = "/images/doggo.gif";
    const db = req.app.locals.db;
    db.collection('todo', function (err, collection) { /* go into collection todo */
        collection.insert(req.body, function (err, result) { /* insert into todo collection */
            console.log('Inserted %d documents into the "todo" collection:', result.length, result); /* put the stuff you just added into the todo collection */
        });
        collection.find().toArray(function (err, items) { /* now go into the collection , turn it into a json array */
            res.render('index', { /* and display it all in the index */
                users: items,
                success: "Your task was added to the list"
            });
        });
    });
});


//deleting a task
app.get('/delete/:id', function (req, res) {
    const db = req.app.locals.db;
    console.log(req.params.id);
    db.collection('todo', function (err, collection) {
        collection.deleteOne({
            id: req.params.id
        }, function (err, result) {
            console.log('Deleted the record.');
            collection.find().toArray(function (err, items) {
                res.redirect('/?message=task was deleted'); /* the message when you deleted something */
            });
        });
    });
});



//SORTING IT OUT YO
// app.get('/sortByTitle', function (req, res) {
//     const db = req.app.locals.db;
//     console.log(req.params.id);
//
//         db.collection('todo').find().toArray(function (err, items) {
//         db.collection('todo').sort({"taskName":1})
//             res.render('index', {
//                 users: items
//                 // success: "Your Dog Was Added to the List"
//             });
//         });
//     });



//Start our server
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
