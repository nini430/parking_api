import { Router } from 'express';

import authRouter from './auth';
import autoMobileRouter from './automobile';
import adminRouter from './admin';

const router = Router();

router.use('/auth',authRouter);
router.use('/automobile',autoMobileRouter);
router.use('/admin',adminRouter);

export default router;
