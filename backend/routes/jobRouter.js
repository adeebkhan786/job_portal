import express from 'express';




//Importing Files
import { postJob, getAllJobs, getMyJobs, deleteJob, getASingleJob } from '../controllers/jobController.js';
import { isAuthenticated, isAuthorized } from '../middlewares/Auth.js';


//Instances
const router = express.Router();


//Job routes
router.post('/post', isAuthenticated, isAuthorized("Employer"), postJob);
router.get('/getall', getAllJobs);
router.get('/getmyjobs', isAuthenticated, isAuthorized("Employer"), getMyJobs);
router.delete('/delete/:id', isAuthenticated, isAuthorized("Employer"), deleteJob);   //isme id ko hum req.params se access krnge.
router.get('/get/:id', isAuthenticated, getASingleJob)



export default router;