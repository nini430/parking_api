import {Router} from 'express'
import { loginUserHandler, registerUserHandler } from '../controllers/auth';

const authRouter=Router();

authRouter.post('/register',registerUserHandler);
authRouter.post('/login',loginUserHandler);

export default authRouter;