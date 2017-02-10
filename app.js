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

//Home page
app.get('/', function (req, res) {
    const db = req.app.locals.db;
    db.collection('todo', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.render('index', {
                users: items
            });
}); });
});


//add the add.pug page
app.get('/add', function (req, res) {
    res.render('add', {
        title: "Get shift done"
    });
});

//adding the new to do list item
app.post('/', function (req, res) {
    req.body.id = randomID(10);
    // req.body.img = "/images/doggo.gif";
    const db = req.app.locals.db;
    db.collection('todo', function (err, collection) {
        collection.insert(req.body, function (err, result) {
            console.log('Inserted %d documents into the "todo" collection:', result.length, result);
        });
        collection.find().toArray(function (err, items) {
            res.render('index', {
                users: items,
                success: "Your task was added to the list"
            });
        });
    });
});


//Handle our Requests
// app.get('/', function (req, res) {
//     var deleteMessage = req.query.message || "";
//     console.log(req.query.message)
//     // fs.readFile(__dirname + "/data/tasks.json", 'utf8', function (err, data) {
//         console.log(data);
//         res.render(
//             'index', {
//                 title: "Get shift done",
//                 tea: data,
//                 deleteMessage: deleteMessage
//             });
//     });
//     console.log(req.body);
//
// });
//
// //sort by alphabetically
// app.get('/sortByTitle', function (req, res) {
//     var deleteMessage = req.query.message || "";
//     fs.readFile(__dirname + "/data/tasks.json", 'utf8', function (err, data) {
//         tasks = JSON.parse(data); //turn it into a js property
//         tasks.sort(sortBy('taskName'));
//         sortedTasks = JSON.stringify(tasks);
//         res.render(
//             'index', {
//                 title: "Get shift done",
//                 tea: sortedTasks,
//                 deleteMessage: deleteMessage
//             });
//     });
//     console.log(req.body);
// });
//
// //sort by date
// app.get('/sortByDate', function (req, res) {
//     var deleteMessage = req.query.message || "";
//     fs.readFile(__dirname + "/data/tasks.json", 'utf8', function (err, data) {
//         date = JSON.parse(data); //turn it into a js property
//         date.sort(sortBy('date'));
//         sortedDate = JSON.stringify(date);
//         res.render(
//             'index', {
//                 title: "Get shift done",
//                 tea: sortedDate,
//                 deleteMessage: deleteMessage
//             });
//     });
//     console.log(req.body);
// });
//
// //for adding a new task
// app.get('/add', function (req, res) {
//
//     res.render(
//         'add', {
//             title: "Get shft done",
//             // url: "http://banditbrewery.ca/"
//         });
// });

// Home
// app.post('/', function (req, res) {
//     console.log(req.body);
//     var formData = req.body;
//     // console.log(req.body.name);
//     // req.body.img = "/images/doggo.gif";
//     req.body.id = randomID(10);
//     fs.readFile(__dirname + "/data/tasks.json", 'utf8', function (err, data) {
//
//         console.log(data);
//             console.log("i entered")
//             data = JSON.parse(data);
//             data.push(req.body);
//             req.body.id = randomID(10);
//             data = JSON.stringify(data);
//             fs.writeFile(__dirname + "/data/tasks.json", data, function (err) {
//                 if (err) {
//                     console.log(err.message);
//                     return;
//                 }
//                 res.redirect('/');
//                 console.log("The file was saved!");
//             });
//     });
// });


// app.get('/delete/:id', function (req, res) {
//     var taskId = req.params.id;
//     console.log(taskId);
//     fs.readFile(__dirname + "/data/tasks.json", 'utf8', function (err, data) {
//         tasks = JSON.parse(data);
//         // iterate over each element in the array
//         for (var i = 0; i < tasks.length; i++) {
//             // look for the entry with a matching 'id' value
//             if (tasks[i].id == taskId) {
//                 // we found it
//                 tasks.splice(i, 1);
//                 //delete users[i];
//                 //console.log(users);
//                 //var user = JSON.stringify(users[i]);
//             }
//         }
//         console.log(tasks);
//         tasks = JSON.stringify(tasks);
//         fs.writeFile(__dirname + "/data/tasks.json", tasks, function (err) {
//             if (err) {
//                 console.log(err.message);
//                 return;
//             }
//             res.redirect('/?message=task was deleted');
//             console.log("The file was deleted!");
//
//         });
//
//     });
// });

//Start our server
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
