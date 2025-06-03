const express = require('express');

const app = express();

app.get('/', function(req, res) {
    res.send('Hello, World!');
});

app.get('/about', function(req, res) {
    res.send('About Page');
});

app.get('/contact', function(req, res) {
    res.send('Contact Page');
});

app.listen(3000, function(){
    console.log('Server is running on port 3000');
});