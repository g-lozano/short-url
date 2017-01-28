// algorithm:
// pass url
// generate random string (numbers?)
// keep in mind: check if new string is in db before inserting

var mongo = require('mongodb').MongoClient
var express = require('express')
var validUrl = require('valid-url')
var urlExists = require('url-exists')
var app = express()

var url = "mongodb://test:test@ds033259.mlab.com:33259/url-shortener"

//res.redirect('http://www.google.com')
app.use('/', function(req, res) {

    var path = req.url.split('/') //returns array
    path.shift() //remove '/'

    console.log(path)

    if (req.url.length == 1) //no path
        res.sendFile(__dirname + '/index.html')
    else if (path[0] == "new") {
        if (path[1]) {
            path.shift() //remove 'new'
            path = path.join('/')
            urlExists(path, function(err, exists) {
                if (err) throw err
                else if (exists) {
                    res.send()
                    
                }
                else {
                    res.send({
                        error: 'Invalid URL format.'
                    })
                }
            })
        }
        else {
            res.send({
                error: 'No input URL.'
            })
        }

    }
    else if (path == 'wow') {
        // res.writeHead(301, {
        //     Location: 'http://www.google.com'
        // });
        // res.end();
        res.redirect('http://www.google.com')
            // urlExists('https://www.google.com', function(err, exists) {
            //   if (exists){
            //       res.redirect('http://www.google.com')
            //   }
            // });
    }
    else if (path == 'check') {
        mongo.connect(url, function(err, db) {
            if (err) throw err

            var doc = db.collection('urls')

            doc.find().toArray(function(err, docs) {
                if (err) throw err
                console.log(docs)
            })
            db.close();
        })
        res.send('');
    }
    else {
        //check if link is in db
        //if link is in db, redirect, else return error
        res.send({
            error: 'default error message'
        })
    }
})

//get url
//check if url is valid
//generate link
//insert into db


//may be used in if path == new
app.use('/new/', function(req, res) {
    var url = req.url
    url = url.toString().split('')
    url.shift()
    url = url.join('')

    if (url)
        console.log(url)


    if (validUrl.isUri(url)) {
        res.send({
            original_url: url,
            short_url: url
        })

        //generate string
        //insert to db 
        //***return json
    }
    else {
        res.send({
            error: 'URL is invalid'
        });
    }

    // db.admin().listDatabases(function(err, dbs){
    //     if (err) throw err
    //     console.log(dbs)
    // })


})

app.listen(process.env.PORT)



//db.createCollection(name, options)
//collection.find()
//collection.insert()
//collection.remove()
//collection.update()
// function connectToDB() {
//     mongo.connect(url, function(err, db) {
//         if (err) throw err

//         var doc = db.collection('urls')

//         doc.find().toArray(function(err, docs) {
//             if (err) throw err
//             console.log(docs)
//         })
//         db.close();
//     })
// }
