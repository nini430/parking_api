import { Router } from 'express';
import {
  forgotPasswordHandler,
  loginUserHandler,
  refreshTokenHandler,
  registerUserHandler,
  resetPasswordTokenHandler,
} from '../controllers/auth';

const authRouter = Router();

authRouter.post('/register', registerUserHandler);
authRouter.post('/login', loginUserHandler);
authRouter.post('/refresh-token',refreshTokenHandler);
authRouter.put('/forgot-password', forgotPasswordHandler);
authRouter.put('/reset-password/:token', resetPasswordTokenHandler);

export default authRouter;
