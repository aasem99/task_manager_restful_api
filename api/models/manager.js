const mongoose = require('mongoose');
const managerSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId, //create a long string 
    email:{type:String,
        required:true,
        unique:true,
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    //to make constraints about the mail input to be valid
    password:{type:String,required:true},
    
});


module.exports=mongoose.model('Manager',managerSchema);