const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
     _id:mongoose.Schema.Types.ObjectId, //create a long string 
   // name:{type:String,required:true},
    email:{type:String,
        required:true,
        unique:true,
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    //to make constraints about the mail input to be valid
    password:{type:String,required:true},
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      }    
});


module.exports=mongoose.model('User',userSchema);