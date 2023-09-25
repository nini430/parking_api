import crypto from 'crypto'

import db from "../utils/dbConnect";


const findAdminByUniqueId=async(uuid:string)=>{
    const admin=await db.admin.findFirst({
        where:{
            uuid
        }
    })
    return admin;
}



export {findAdminByUniqueId}