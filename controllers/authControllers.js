const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleErrors=(err)=>{
    let error ={name:'',email:'',password:''};
    console.log(err.message)
    if(err.message==='Incorrect Email!'){
        error.email='This Email is not registered';
        return error;
    }
    if(err.message==='Incorrect Password'){
        error.password='This Password is incorrect';
        return error;
    }
    if(err.code===11000){
        error.email='Email already exists';
        return error;
    }
    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            error[properties.path]=properties.message
            
        });
    }
    return error;
}
const maxAge = 3*24*60*60;
const createToken=(id)=>{
    return jwt.sign({id},'farulovesme',{expiresIn:maxAge});
}
module.exports.signup_get = (req,res) =>{
    res.render('signup');
}
module.exports.signup_post = async(req,res) =>{
    let {name,email,password} = req.body;
    
    try {
        
        const user = await User.create({name,email,password});
         const token = createToken(user._id);
         res.cookie('jwt',token,{maxAge:maxAge*1000})
        
        res.status(200).json({user:user._id});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}
module.exports.login_get = (req,res) =>{
    res.render('login');
}
module.exports.login_post = async (req,res) =>{
    let {email,password} = req.body;
    
    try {
        
        const user = await User.login(email,password);
        console.log(user);
        const token = createToken(user._id);
        res.cookie('jwt',token,{maxAge:maxAge*1000})
        
        res.status(200).json({user:user._id});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}
module.exports.logout_get = (req,res) =>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}