//to do: handle url not in database

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

function generateShortURL(){
    
}

//res.redirect('http://www.google.com')
app.use('/', function(req, res) {

    var path = req.url.split('/') //returns array
    path.shift() //remove '/'

    console.log(path)

    if (req.url.length == 1) //no path
        res.sendFile(__dirname + '/home')
    else if (path[0] == "new") {
        if (path[1]) {
            path.shift() //remove 'new'
            path = path.join('/')

            if (validUrl.isUri(path)) {
                urlExists(path, function(err, exists) {
                    if (err) throw err
                    else if (exists) {
                        //generate string
                        //insert into db
                        res.send({
                            original_url: path,
                            short_url: 'string'
                        })
                    }
                    else {
                        res.send({
                            error: 'Website does not exist.'
                        })
                    }
                })
            }
            else {
                res.send({
                    error: 'URL format is invalid.'
                })
            }


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
