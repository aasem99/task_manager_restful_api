const mongoose =require('mongoose');
const bcrypt =require('bcrypt');
const User = require('../models/user');
const user = require('../models/user');
const jwt =require ('jsonwebtoken');
const JWT_KEY = "secret";
const Task = require('../models/task');


//sign up new user

exports.user_sign_up = (req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length >=1){   //if there is a minor change in already existing email e.g.adding one character more or less
            //to make sure that the email is not used before
            //409 means we got conflict due to using alreasy existing email in DB
            return res.status(409).json({
                message:"mail already exists"
            });
        }   else{
                  
            //to hash thepassword in DB
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
            return res.status(500).json({
            error:err
}) ;
    
 }  else{
    const user =new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password:hash
 
    });
    user
    .save()
    .then(result=> {
        console.log(result);
        res.status(201).json({
            message:'user created'
        });
    })
    .catch(err=>{
        console.log(err);
     res.status(500).json({
                error:err    
  }); 
});
 }
}); 
        }
    })
};

//sign in new user


exports.user_log_in = (req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            return res.status(401).json({//401 means unauthorized
                message:'auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password,(err,result)=>{
           if(err){
            return res.status(401).json({
                message:'auth failed'
            });
           } 
           if(result){
            const token = jwt.sign({
                email:user[0].email,
                userId:user[0]._id
    
            },process.env.JWT_KEY|| JWT_KEY,
            {
                expiresIn:"1h"
            });
            return res.status(200).json({
                message:'auth successful',
                token:token
    
            });
           }
           res.status(401).json({
            message:'auth failed'
        });
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
       });
    };

 
    
//function that user get his/her assigned task details

 exports.user_tasks = async (req, res, next) => {
    try {
      const userid=req.params.userId;
      let filter = {}; // Create an empty filter object
    
      // Add filters based on query string parameters
      if (userid) {
        filter.user = userid;
      }
      const tasks = await Task.find(filter)
      .select("_id title desc status due_date dependencies user") // Select desired fields
      .populate('dependencies') // Optionally populate dependencies
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,
          tasks: docs.map((doc) => ({
            title: doc.title,
            desc: doc.desc,
            status: doc.status,
            due_date: doc.due_date,
            _id: doc.id,
            user:doc.userId,
            dependencies:doc.dependencies,
          })),
        };
        console.log(docs);
        res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching tasks' });
      }
    };


    exports.users_patch_task_status = async (req, res, next) => {
        const userid = req.params.userId; // Assuming user ID is stored in req.user
        const taskId = req.params.taskId;
        const newStatus = req.body.newStatus;
      
        try {
          const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, user: userid }, // Filter by assigned user and task ID
            { $set: { status: newStatus } },
            { new: true } // Return the updated task document
          );
      
          if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found or not assigned to you' });
          }

           // Check for unauthorized modifications (assuming other fields are in req.body)
    const allowedFields = ['newStatus']; // Replace with actual allowed fields
    const unauthorizedUpdates = Object.keys(req.body).filter(
      field => !allowedFields.includes(field)
    );

    if (unauthorizedUpdates.length > 0) {
      return res.status(400).json({
        error: 'Unauthorized modification of fields: ' + unauthorizedUpdates.join(', ')
      });
    }

      
          res.status(200).json({
            message: 'Task status updated successfully',
            task: updatedTask, // Include the updated task object in the response
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
        }
      };
      