import {Router} from 'express'
import authProtect from '../middleware/authProtect';
import { createParkingHandler } from '../controllers/parking';

const parkingRouter=Router();

parkingRouter.use(authProtect);

parkingRouter.post('/:zoneId/:automobileId',createParkingHandler);

export default parkingRouter;