const express=require('express');
const router = express.Router();
const Manager=require('../models/manager');

const ManagersController =require ('../controllers/managers');

router.get('/task' ,ManagersController.tasks_get_all);

router.get("/:taskId",ManagersController.tasks_get_one);

router.post('/createtask' ,ManagersController.tasks_create_all);

router.post('/login',ManagersController.manager_log_in);

router.post("/signup",ManagersController.manager_sign_up);

router.patch("/:taskId", ManagersController.tasks_update_one);

module.exports=router;