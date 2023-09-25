import {v4 as uuidv4} from 'uuid'

import db from './utils/dbConnect';
import { errorMessages, successMessages } from './utils/messages';
import { hashPassword } from './services/common';

const createFiveAdmins = async () => {
  try{
    await db.admin.deleteMany();
  for (let i = 0; i < 5; i++) {
    await db.admin.create({
      data: {
        uuid: uuidv4(),
        password: await hashPassword(process.env.MANUAL_ADMIN_SEED_PASSWORD!),
      },
    });
  }
  console.log(successMessages.seedSuccess);
  }catch(err) {
    console.log(err);
    console.log(errorMessages.seedError);
  }
  
};

createFiveAdmins();
