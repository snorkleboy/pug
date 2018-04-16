const express = require('express')
require('dotenv').config()
const app = express()
const morgan = require ('morgan');
var path = require('path');

setup();
console.log(process.argv);
app.listen(process.env.port || 3000, () => console.log('bound on port 3000'))

function setup(){
    app.set('view engine', 'pug')
    app.set('views', path.join(__dirname, '/views'));
    

    app.get('/', (req, res) => res.render('hello', { title: 'Hey', message: 'Hello there!' }))

}