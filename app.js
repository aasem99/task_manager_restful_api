const express=require('express');
const app=express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');
// task routes and manager routes 
const managersRoutes = require('./api/routes/managers');
const tasksRoutes = require('./api/routes/tasks');
const usersRoutes = require('./api/routes/users');


mongoose.connect('mongodb+srv://nadahenedy:fadl2011@cluster0.1qtemcj.mongodb.net/?retryWrites=true&w=majority')


//Morgan simplifies the process of logging HTTP requests in Node. js applications 
app.use(morgan('dev'));

//body-parser is a Node.js library used to extract information from an incoming HTTP request
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());

//handling cors errors =>occur when a server doesn't return the HTTP headers that the CORS standard requires
app.use((req,res,next)=>{
    res.header("Acess-Control-Allow-Origin","*");
    res.header("Acess-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
    if(req.method==='options'){
        res.header('Acess-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/tasks',tasksRoutes);
app.use('/managers',managersRoutes);
app.use('/users',usersRoutes);


// handle the request that doesn't go for our routes "catch"
app.use((req,res,next)=>{
    const error = new Error('not found');
    error.status=404;
    //forward the handeled error 
    next(error);
});

//general error handling
app.use((error , req,res,next)=>{
    res.status(error.status|| 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

//to connect theapp.js with server
module.exports=app;