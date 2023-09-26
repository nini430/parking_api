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

const getParkingsByUserId=async(userId:string)=>{
    const automobiles=await db.autoMobile.findMany({
        where:{
            userId
        },
        include:{
            parkings:{
                include:{
                    zone:true,
                    automobile:{
                        include:{
                            user:{
                                select:{
                                    firstName:true,
                                    lastName:true,
                                    id:true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    const parkings=automobiles.map(automobile=>automobile.parkings).flat();
    const formattedParkings=parkings.map(parking=>{
            const {expireDate,...rest}=parking;
            return {...rest, isExpired:expireDate<Date.now()}
    });
    return formattedParkings;
}


const getAllAutomobiles=async(userId:string)=>{
    const automobiles=await db.autoMobile.findMany({
        where:{
            userId
        },
        include:{
            user:{
                select:{
                    firstName:true,
                    lastName:true,
                    id:true
                }
            }
        }
    });
    return automobiles;
}

export {updateUserBalance, getParkingsByUserId, getAllAutomobiles}