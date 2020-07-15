const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    port: '3306',
    database: 'dbtest',
    multipleStatements: true,
    insecureAuth: true,
})

module.exports = mysqlConnection