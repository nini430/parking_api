import {Router} from 'express'
import { forgotPasswordHandler, loginUserHandler, registerUserHandler } from '../controllers/auth';

const authRouter=Router();

authRouter.post('/register',registerUserHandler);
authRouter.post('/login',loginUserHandler);
authRouter.put('/forgot-password',forgotPasswordHandler);

export default authRouter;