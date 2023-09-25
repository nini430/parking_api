import {Router} from 'express'
import { loginAdmin } from '../controllers/admin';


const adminRouter=Router();

adminRouter.post('/login',loginAdmin);


export default adminRouter;