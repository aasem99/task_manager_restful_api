const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId, //create a long string 
    title:{type:String,required:true},
    desc:{type:String,required:true},
    status:{type:String,required:true,enum: ['pending', 'completed', 'canceled']},
    due_date:{type:Date, required:true},
    dependencies:{
        type: mongoose.Schema.Types.ObjectId,
      },
      user: { // Optional field for assigned user
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
      }
});


module.exports=mongoose.model('Task',taskSchema);