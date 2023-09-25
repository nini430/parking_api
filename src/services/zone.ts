import { ZoneInput } from '../types/zone';
import db from '../utils/dbConnect';

const createZone = async (input: ZoneInput & { addedById: string }) => {
  const newZone = await db.parkingZone.create({
    data: {
      ...input,
    },
  });
  return newZone;
};

const getZoneById = async (id: string) => {
  const zone = await db.parkingZone.findUnique({
    where: {
      id,
    },
  });
  return zone;
};

const updateZone = async (input: ZoneInput, zoneId: string) => {
 const updatedZone= await db.parkingZone.update({
    where: {
      id: zoneId,
    },
    data: { ...input },
  });
  return updatedZone;
};

const removeZoneById=async(zoneId:string)=>{
    await db.parkingZone.delete({
        where:{
            id:zoneId
        }
    })
}

export { createZone, getZoneById, updateZone, removeZoneById };
