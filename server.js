const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient;
var db = require("mongodb");

const uri = "mongodb+srv://bpereiraalmeida:teste123@cluster0-itjmp.mongodb.net/test?retryWrites=true&w=majority";
//const uri = 'mongodb://mongo:27017/docker-node-mongo';
const ObjectId = require('mongodb').ObjectID

MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('test')
})

app.use(bodyParser.urlencoded({ extended: true }))

app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port 3000')
})

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/show', (req, res) => {
    let cursor = db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results})
    })
})

app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('salvo no banco de dados')
        res.redirect('/show')
    })
    
})

app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('data').find(ObjectId(id)).toArray((err, result) => {
        if (err) return res.send(err)
        res.render('edit.ejs', { data: result})
    })
})
.post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname

    db.collection('data').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            surname: surname
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/show')
        console.log('Atualizado no Banco de Dados')
    }
    )
})

app.route('/delete/:id')
.get((req, res) => {
    var id = req.params.id
    db.collection('data').deleteOne({ _id: ObjectId(id)}, (err, result) => {
        if (err) return res.send(500, err)
        console.log('Deletado do Banco de Dados')
        res.redirect('/show')
    }
    )
})

