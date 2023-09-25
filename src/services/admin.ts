import crypto from 'crypto'

import db from "../utils/dbConnect";

const generateRandomPassword=()=>{
    return crypto.randomBytes(20).toString('hex');
}

export {generateRandomPassword}