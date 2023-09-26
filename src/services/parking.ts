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

const getValidParkingByAutoAndZone = async (
  automobileId: string,
  zoneId: string
) => {
  const instance = await db.parkingInstance.findFirst({
    where: {
      automobileId,
      zoneId,
      expireDate: {
        gt: Date.now(),
      },
    },
  });
  return instance;
};

const getParkingById = async (parkingId: string) => {
  const parking = await db.parkingInstance.findUnique({
    where: {
      id: parkingId,
    },
  });
  return parking;
};

const cancelParkingById = async (parkingId: string) => {
  await db.parkingInstance.update({
    where: {
      id: parkingId,
    },
    data: {
      isCanceled: true,
    },
  });
};

export {
  createParking,
  getParkingByIdDetailed,
  getParkingById,
  cancelParkingById,
  getValidParkingByAutoAndZone,
};
