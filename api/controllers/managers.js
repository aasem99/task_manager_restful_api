const Manager=require("../models/manager");
const mongoose =require('mongoose');
const bcrypt =require('bcrypt');
const manager = require('../models/manager');
const jwt =require ('jsonwebtoken');
const Task=require("../models/task");
const user = require("../models/user");




//manager log in function


exports.manager_log_in = (req,res,next)=>{
        Manager.find({email:req.body.email})
        .exec()
        .then(manager=>{
            if(manager.length<1){ //check if the email is valid even for minor changes
                return res.status(401).json({//401 means unauthorized
                    message:'auth failed'
                });
            }
            //to compare the given password with the hashed password in DB
            bcrypt.compare(req.body.password, manager[0].password,(err,result)=>{
               if(err){
                return res.status(401).json({
                    message:'auth failed'
                });
               } 
               //tokenization for the session since the log in
               if(result){
                const token = jwt.sign({
                    email:manager[0].email,
                    managerId:manager[0]._id
        
                },process.env.JWT_KEY,
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
    
    
            //sign up for new Manager

exports.manager_sign_up = async (req, res, next) => {
            try {
              const existingManager = await Manager.find({ email: req.body.email });
              if (existingManager.length >= 1) { //check if the email is used before or not
                return res.status(409).json({ message: "Email already exists" });
              }
            //to hash the password in DB
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
          //the details of Manager
              const newManager = new Manager({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hashedPassword,
              });
          
              await newManager.save();
              res.status(201).json({ message: 'Manager created' });
            } catch (err) {
              // Differentiate between validation errors (e.g., Mongoose validation errors)
              // and other errors (e.g., database errors) and send appropriate error messages.
              console.error(err);
              res.status(500).json({ error: "An error occurred during signup" });
            }
          };

            //give a list of all tasks and filter them with status or due date


            exports.tasks_get_all = (req, res, next) => {
                const { status, due_date,user } = req.query; // Get filter parameters from query string
                const userid=req.params.userId;
            
                let filter = {}; // Create an empty filter object
              
                // Add filters based on query string parameters
                if (status) {
                  filter.status = status;
                }
                if (due_date) {
                  filter.due_date = due_date; // Assuming due_date is a date string
                }
                if (user) {
                  filter.user = user;
                } 
              
                // Find tasks with filters
                Task.find(filter)
                  .select("_id title desc  status due_date dependencies user")
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
              };
              
            
        

          //to get  only the informations of only 1 task by its id
        
            exports.tasks_get_one = (req,res,next)=>{
                const id=req.params.taskId;
                Task.findById(id).select("title desc  status due_date _id")
                .exec().then(doc=>{
                    console.log("from database",doc);
                    if(doc){
                        res.status(200).json({
                                task:doc,
                                request:{
                                    type:'GET',
                                    url:'http://localhost:3000/tasks/'
                                }
                        });
                    }else{
                        res.status(404).json({message:"No valid entery found for provided ID"});
            
                    }
                })
                .catch(err=>{console.log(err);
                res.status(500).json({error:err});
                });
            };
        
        

            //to update single task by its ID 

        exports.tasks_update_one = (req, res, next)=>{
                const id=req.params.taskId;
                const updateOps ={};
                for(const ops of req.body){
                    updateOps[ops.propchange] = ops.value;
                }
                    Task.updateOne({_id:id},{ $set:updateOps })
                .exec()
                .then(result=>
                    {
                        
                        res.status(200).json({
                            message:'Task updated',
                        })
                })
                .catch(err=>{
                    console.log(err);
                res.status(500).json({error:err});
                });
                };
          

                exports.tasks_create_all = async (req, res, next) => {
                    try {
                      const userId = req.body.user || null; // Optional user ID for assigning tasks
                  
                      // Validate user ID (optional, but recommended for security)
                      if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
                        return res.status(400).json({ error: 'Invalid user ID format' });
                      }
                  
                      const task = new Task({
                        _id: new mongoose.Types.ObjectId(),
                        title: req.body.title,
                        desc: req.body.desc,
                        due_date: req.body.due_date,
                        dependencies: req.body.dependencies || null || [],
                        status: req.body.dependencies ? 'pending' : 'completed',
                        user: userId // Assign user if provided
                      });
                  
                      const createdTask = await task.save(); // Save the task
                  
                      res.status(201).json({
                        message: 'Created a task successfully',
                        createdTask: {
                          title: createdTask.title,
                          desc: createdTask.desc,
                          status: createdTask.status,
                          user: createdTask.user, // Include assigned user (if any)
                          due_date: createdTask.due_date,
                          _id: createdTask._id,
                          dependencies: createdTask.dependencies,
                        }
                      });
                    } catch (err) {
                      console.error(err);
                      res.status(500).json({ error: 'An error occurred while creating the task' });
                    }
                  };
                  
                
                