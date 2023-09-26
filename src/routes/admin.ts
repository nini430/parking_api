import {Router} from 'express'
import { loginAdmin, refreshTokenHandler } from '../controllers/admin';


const adminRouter=Router();

adminRouter.post('/login',loginAdmin);
adminRouter.post('/refresh-token',refreshTokenHandler);


export default adminRouter;