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

export { createZone };
