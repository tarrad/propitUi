const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')
const mysqlConnection = require('./db/db')
const getUserDetails = require('./db/getUserDetails')
const getTasks = require('./db/getTasks')
const getUser = require('./db/login')
const register = require('./db/register')
const createTask = require('./db/createTask')
const updateTask = require('./db/updateTask')
const daleteTask = require('./db/deleteTask')
const decode = require('./security/decodeToken')
var cors = require('cors');
var app = express()
 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
mysqlConnection.connect((err) => {
    if(!err){
        console.log('connection success mysql')
    }
    else{
        console.log(err)
    }
})


app.listen(3001)

app.post('/login', (req,res) => { 
    
    getUser(req.body,mysqlConnection).then((token) => {
        res.send(token)
    }).catch((err) =>{
        res.sendStatus(401)
    })
})


app.post('/register', (req,res) => {
    register(req.body,mysqlConnection).then((answer) => {
        res.send(answer)
    }).catch((err) =>{
        res.sendStatus(err)
    })
})

app.post('/tasks', (req,res) => {
    decode(req.header('authorization').split(' ')[1]).then((decoded) => {
        return createTask(decoded.data,req.body,mysqlConnection)
    }).then((answer) => {
        res.send(answer)
    }).catch((err) =>{
        res.sendStatus(err)
    })
})


app.get('/tasks', (req,res) => {
    decode(req.header('authorization').split(' ')[1]).then((decoded) => {
        return getUserDetails(decoded.data,mysqlConnection)
    }).then((user) => {
        return getTasks(user[0].Username,user[0].Admin,mysqlConnection)
    }).then((tasks) => {
        res.send(tasks)
    }).catch((err) =>{
        if(err  === 401){
            res.send({error: 401})
        }
        else
        {
            res.send(err)
        }
        
    })
})

app.put('/tasks', (req,res) => {

    decode(req.header('authorization').split(' ')[1]).then((decoded) => {
        return updateTask(decoded.data,req.body,mysqlConnection)
    }).then((result) => {
        res.send(result)
    }).catch((err) =>{
        res.sendStatus(404)
    })
})

app.delete('/tasks/:id' , (req,res) => {
    decode(req.header('authorization').split(' ')[1]).then((decoded) => {
        return daleteTask(req.params.id,mysqlConnection)
    }).then((result) => {
        res.send(result)
    }).catch((err) =>{
        res.send(err)
    })

})

app.get('/validation', (req,res) => {
    decode(req.header('authorization').split(' ')[1]).then((decoded) => {
        res.sendStatus(200)
    }).catch((err) =>{
        res.sendStatus(401)
    })
})




