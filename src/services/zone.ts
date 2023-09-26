import { ZoneInput } from '../types/zone';
import db from '../utils/dbConnect';

const getAllParkingZones = async () => {
  const zones = await db.parkingZone.findMany();
  return zones;
};

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

const getZoneByIdDetailed = async (id: string) => {
  const zone = await db.parkingZone.findUnique({
    where: {
      id,
    },
    include: {
      parkings: {
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
      },
    },
  });

  return {
    ...zone,
    parkings: zone?.parkings.map((parking) => {
      const { expireDate, ...rest } = parking;
      return { ...rest, isExpired: expireDate < Date.now() };
    }),
  };
};

const updateZone = async (input: ZoneInput, zoneId: string) => {
  const updatedZone = await db.parkingZone.update({
    where: {
      id: zoneId,
    },
    data: { ...input },
  });
  return updatedZone;
};

const removeZoneById = async (zoneId: string) => {
  await db.parkingZone.delete({
    where: {
      id: zoneId,
    },
  });
};

export {
  createZone,
  getZoneById,
  updateZone,
  removeZoneById,
  getAllParkingZones,
  getZoneByIdDetailed,
};
