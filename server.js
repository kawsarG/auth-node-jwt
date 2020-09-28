const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/authRoutes');
const path = require('path');
const cookieParser = require('cookie-parser');
const {authRequire,checkUser} = require('./middlewares/authMiddleware');



// express app
const app = express();

//view engin
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(routes);

//database connection
mongoose.connect('mongodb+srv://user123:user123@cluster0.vfnkv.mongodb.net/user-auth?retryWrites=true&w=majority',{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true})
.then(()=>{
    app.listen(5000,()=>{
        console.log('server started at 5000');
    })
})
.catch((err)=>{console.log(err)})


// routes
app.get('*',checkUser);
app.get('/',(req,res)=>{
    res.render('Home');
})
app.get('/projects',authRequire,(req,res)=>{
    res.render('Projects');
});

