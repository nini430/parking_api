import {Router} from 'express'
import authProtect from '../middleware/authProtect';
import { getAllAutomobilesHandler, getAllUserParkingHistory } from '../controllers/user';

const userRouter=Router();

userRouter.use(authProtect);

userRouter.get('/automobiles',getAllAutomobilesHandler);
userRouter.get('/parkings',getAllUserParkingHistory);



export default userRouter;