import { Router } from 'express';
import adminProtect from '../middleware/adminProtect';
import {
  createZoneHandler,
  getAllParkingZonesHandler,
  getZoneByIdHandler,
  removeZoneByIdHandler,
  updateZoneHandler,
} from '../controllers/zone';

const zoneRouter = Router();

zoneRouter.use(adminProtect);

zoneRouter.get('/',getAllParkingZonesHandler);
zoneRouter.post('/', createZoneHandler);
zoneRouter.get('/:zoneId', getZoneByIdHandler);
zoneRouter.put('/:zoneId', updateZoneHandler);
zoneRouter.delete('/:zoneId',removeZoneByIdHandler);

export default zoneRouter;
