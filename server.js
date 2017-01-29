var mongo = require('mongodb').MongoClient
var express = require('express')
var validUrl = require('valid-url')
var urlExists = require('url-exists')
var app = express()

var url = process.env.MONGOLAB_URI
var site = "https://lil-url-gl.herokuapp.com/"

function generateShortString() {
    var charCount = 4;
    var str = []
    var x = ''
    for (var i = 0; i < charCount; i++) {
        switch (Math.floor(Math.random() * (3))) {
            case 0: //number
                x = Math.random() * (57 - 48) + 48
                str.push(String.fromCharCode(x))
                break
            case 1: //uppercase
                x = Math.random() * (90 - 65) + 65
                str.push(String.fromCharCode(x))
                break
            case 2: //lowercase
                x = Math.random() * (122 - 97) + 97
                str.push(String.fromCharCode(x))
                break
        }
    }
    return str.join('')
}

function insertLink(obj, cb) {
    mongo.connect(url, function(err, db) {
        if (err) throw err
        else {
            var doc = db.collection('urls')
            doc.find({
                path: obj.str
            }, {
                _id: 0
            }).toArray(function(err, docs) {
                if (err) throw err

                else if (docs.length) { //exists, generate new string
                    var str = generateShortString()
                    insertLink(str, function(data) {
                        //do nothing
                    })
                }
                else { //generated string does not exist, insert
                    mongo.connect(url, function(err, db2) {
                        if (err) throw err
                        else {
                            var item = {
                                original_url: obj.path,
                                path: obj.str
                            }
                            var collection = db2.collection('urls')
                            collection.insert(item, function(err, data) {
                                if (err) throw err
                                else {
                                    cb({
                                        original_url: item.original_url,
                                        short_url: site + item.path
                                    })
                                    db2.close()
                                }
                            })
                        }
                    })

                }
            })
        }
        db.close();
    })
}

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/html/index.html')
})

app.use('/new/', function(req, res) {
    var path = req.url.split('/') //returns array
    path.shift() //remove '/'
    path = path.join('/')

    if (validUrl.isUri(path)) {
        urlExists(path, function(err, exists) {
            if (err) throw err
            else if (exists) {
                var str = generateShortString()
                var doc = {
                    path: path,
                    str: str
                }
                insertLink(doc, function(docs) {
                    res.send(docs)
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
        if (path)
            res.send({
                error: 'URL format is invalid.'
            })
        else
            res.send({
                error: 'No URL was passed.'
            })
    }
})

app.get('/:id', function(req, res) {
    var path = req.params.id

    mongo.connect(url, function(err, db) {
        if (err) throw err
        else {
            var doc = db.collection('urls')
            doc.find({
                path: path
            }, {
                _id: 0
            }).toArray(function(err, docs) {
                if (err) throw err
                else if (docs.length == 1) {
                    res.redirect(docs[0].original_url)
                }
                else {
                    res.send({
                        error: 'Invalid short URL.'
                    })
                }
            })
            db.close();
        }
    })
})

app.get('/:id', function(req, res) {
    res.redirect('/')
})

app.listen(process.env.PORT)