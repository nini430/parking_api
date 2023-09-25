import { AutoMobileInput } from '../types/automobile';
import db from '../utils/dbConnect';

const addAutoMobile = async (input: AutoMobileInput & { userId: string }) => {
  const {
    brand,
    color,
    modelYear,
    name,
    type,
    vehicleIdentificationNumber,
    userId,
  } = input;
  const newAutomobile = await db.autoMobile.create({
    data: {
      brand,
      color,
      modelYear,
      name,
      type,
      vehicleIdentificationNumber,
      userId,
    },
  });
  return newAutomobile;
};

const updateAutomobile = async (
  input: AutoMobileInput,
  automobileId: string
) => {
  const updatedAutomobile = await db.autoMobile.update({
    where: {
      id: automobileId,
    },
    data: {
      ...input,
    },
  });
  return updatedAutomobile;
};

const getAutomobileById = async (id: string) => {
  const automobile = await db.autoMobile.findUnique({
    where: {
      id,
    },
  });
  return automobile;
};


const removeAutomobileById=async(id:string)=>{
   await db.autoMobile.delete({where:{
    id
   }});
}

export { addAutoMobile, updateAutomobile, getAutomobileById, removeAutomobileById };
