import { Router } from 'express';

import authRouter from './auth';
import autoMobileRouter from './automobile';
import adminRouter from './admin';
import zoneRouter from './zone';
import parkingRouter from './parking';
import userRouter from './user';

const router = Router();

router.use('/auth',authRouter);
router.use('/automobile',autoMobileRouter);
router.use('/admin',adminRouter);
router.use('/zone',zoneRouter);
router.use('/parking',parkingRouter);
router.use('/user',userRouter);

export default router;
