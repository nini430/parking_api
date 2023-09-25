import {v4 as uuidv4} from 'uuid'

import db from './utils/dbConnect';
import { generateRandomPassword } from './services/admin';
import { errorMessages, successMessages } from './utils/messages';

const createFiveAdmins = async () => {
  try{
    await db.admin.deleteMany();
  for (let i = 0; i < 5; i++) {
    await db.admin.create({
      data: {
        uuid: uuidv4(),
        password: generateRandomPassword(),
      },
    });
  }
  console.log(successMessages.seedSuccess);
  }catch(err) {
    console.log(errorMessages.seedError);
  }
  
};

createFiveAdmins();
