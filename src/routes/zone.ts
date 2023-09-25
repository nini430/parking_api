import {Router} from 'express'
import adminProtect from '../middleware/adminProtect';
import { createZoneHandler } from '../controllers/zone';

const zoneRouter=Router();

zoneRouter.use(adminProtect);

zoneRouter.post('/',createZoneHandler);



export default zoneRouter;