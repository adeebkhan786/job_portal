import express from 'express';




//Importing Files
import { register, login, logout, getUser, updateProfile, updatePassword } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/Auth.js';


//Instances
const router = express.Router();

//User routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);
router.get('/getUser', isAuthenticated, getUser);
router.put('/update/profile', isAuthenticated, updateProfile);
router.put('/update/password', isAuthenticated, updatePassword);




export default router;