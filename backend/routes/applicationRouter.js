import express from 'express';



//Importing Files
import { postApplication, employerGetAllApplication, jobSeekerGetAllApplication, deleteApplication } from '../controllers/applicationController.js';
import { isAuthenticated, isAuthorized } from '../middlewares/Auth.js';



//Instances
const router = express.Router();


//Application Routes
router.post('/post/:id', isAuthenticated, isAuthorized("Job Seeker"), postApplication);
router.get('/employer/getall', isAuthenticated, isAuthorized("Employer"), employerGetAllApplication);
router.get('/jobseeker/getall', isAuthenticated, isAuthorized("Job Seeker"), jobSeekerGetAllApplication);
router.delete('/delete/:id', isAuthenticated, deleteApplication);





export default router;