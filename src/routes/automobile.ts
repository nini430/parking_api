import { Router } from 'express';
import authProtect from '../middleware/authProtect';
import {
  addAutoMobileHandler,
  getAutomobileByIdHandler,
  removeAutomobileByIdHandler,
  updateAutomobileHandler,
} from '../controllers/automobile';

const autoMobileRouter = Router();

autoMobileRouter.use(authProtect);

autoMobileRouter.post('/', addAutoMobileHandler);
autoMobileRouter.get('/:automobileId', getAutomobileByIdHandler);
autoMobileRouter.put('/:automobileId', updateAutomobileHandler);
autoMobileRouter.delete('/:automobileId', removeAutomobileByIdHandler);

export default autoMobileRouter;
