const express = require("express");
const app = express();
const router = express.Router();
const path = __dirname + '/views/';

const http = require('http'),
    https = require('https'),
    bodyParser = require('body-parser'),
    errorhandler = require('errorhandler'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    fs = require('fs'),
    crypto = require('crypto');

const db = require('./db/mongoose-data').db;

const app_host = 'localhost',
    app_port = 3000;   

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(errorhandler());


router.get("/",function(req,res){
  res.sendFile("index.html");
});

router.get("/home",function(req,res){
  res.sendFile(path + "home.html");
});


app.use("/",router);

const routes = require('./apis/routes');
routes(app);

app.listen(app_port,function(){
  console.log(app.settings.env + ';__dirname:' + __dirname + ';');
  console.log('Automation Server started @Port : ' + this.address().port);
});