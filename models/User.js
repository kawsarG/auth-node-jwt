const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail} = require('validator');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        lowercase:true,
       
    },
    email:{
        type:String,
        required:[true,'Please enter an email'],
        lowercase:true,
        unique:true,
        validate:[isEmail,'Please enter an valid email']
    },
    password:{
        type:String,
        required:[true,'Enter password'],
        minlength:[6,'Password must be length of 6 characters']
    }
},{timestamps:true})

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password =await bcrypt.hash(this.password,salt);
    next();
})
userSchema.statics.login = async(email,password)=>{
    const user = await User.findOne({email})
        if(user){
          const auth = await bcrypt.compare(password,user.password)
          if(auth){
                console.log(user);
                return user;
          }
          throw Error('Incorrect Password')
        }
        throw Error('Incorrect Email!')
}

const User = mongoose.model('User',userSchema);
module.exports = User;