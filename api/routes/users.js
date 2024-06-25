const express=require('express');
const router = express.Router();
const UsersController =require ('../controllers/users');
 
router.get('/:userId',UsersController.user_tasks);
router.post("/signup",UsersController.user_sign_up);
router.post("/login",UsersController.user_log_in);
router.patch("/:userId/:taskId",UsersController.users_patch_task_status);

module.exports=router;