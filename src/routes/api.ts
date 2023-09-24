import { Router } from 'express';

import authRouter from './auth';
import autoMobileRouter from './automobile';

const router = Router();

router.use('/auth',authRouter);
router.use('/automobile',autoMobileRouter);

export default router;
