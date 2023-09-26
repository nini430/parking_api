import { ParkingInput } from '../types/parking';
import db from '../utils/dbConnect';

const createParking = async (
  input: ParkingInput,
  automobileId: string,
  zoneId: string
) => {
  const newParking = await db.parkingInstance.create({
    data: {
      ...input,
      automobileId,
      zoneId,
    },
  });
  return newParking;
};

export { createParking };
