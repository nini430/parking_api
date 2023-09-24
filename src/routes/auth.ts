import {Router} from 'express'
import { registerUser } from '../controllers/auth';

const authRouter=Router();

authRouter.post('/register',registerUser);

export default authRouter;