import { Router } from 'express';

import authRouter from './auth';
import autoMobileRouter from './automobile';
import adminRouter from './admin';
import zoneRouter from './zone';

const router = Router();

router.use('/auth',authRouter);
router.use('/automobile',autoMobileRouter);
router.use('/admin',adminRouter);
router.use('/zone',zoneRouter);

export default router;
