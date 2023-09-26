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

const getParkingByIdDetailed = async (parkingId: string) => {
  const parking = await db.parkingInstance.findUnique({
    where: {
      id: parkingId,
    },
    include: {
      automobile: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
            },
          },
        },
      },
      zone: true,
    },
  });

  //@ts-ignore
  const { expireDate, ...rest } = parking;
  return rest;
};

const getParkingById = async (parkingId: string) => {
  const parking = await db.parkingInstance.findUnique({
    where: {
      id: parkingId,
    },
  });
  return parking;
};

const removeParkingById = async (parkingId: string) => {
  await db.parkingInstance.delete({
    where: {
      id: parkingId,
    },
  });
};

export {
  createParking,
  getParkingByIdDetailed,
  getParkingById,
  removeParkingById,
};
