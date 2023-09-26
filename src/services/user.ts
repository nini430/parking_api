import db from "../utils/dbConnect";



const updateUserBalance=async(userId:string,newBalance:number)=>{
    await db.user.update({
        where:{
            id:userId
        },
        data:{
            virtualBalance:newBalance
        }
    })
}

export {updateUserBalance}