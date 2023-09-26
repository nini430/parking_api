import {Router} from 'express'
import authProtect from '../middleware/authProtect';
import { createParkingHandler, getParkingByIdHandler, removeParkingByIdHandler } from '../controllers/parking';

const parkingRouter=Router();

parkingRouter.use(authProtect);

parkingRouter.get('/details/:parkingId',getParkingByIdHandler);
parkingRouter.delete('/remove/:parkingId',removeParkingByIdHandler);
parkingRouter.post('/:zoneId/:automobileId',createParkingHandler);

export default parkingRouter;