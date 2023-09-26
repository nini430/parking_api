import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { Admin } from '@prisma/client';
import { ZoneInput } from '../types/zone';
import ErrorResponse from '../utils/errorResponse';
import { errorMessages, successMessages } from '../utils/messages';
import { StatusCodes } from 'http-status-codes';
import {
  createZone,
  getAllParkingZones,
  getZoneById,
  getZoneByIdDetailed,
  removeZoneById,
  updateZone,
} from '../services/zone';

const getAllParkingZonesHandler = asyncHandler(
  async (
    req: Request & { admin: Admin },
    res: Response,
    next: NextFunction
  ) => {
    if (!req.admin) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    const zones = await getAllParkingZones();
    return res.status(StatusCodes.OK).json({ success: true, data: zones });
  }
);

const createZoneHandler = asyncHandler(
  async (
    req: Request<{}, {}, ZoneInput> & { admin: Admin },
    res: Response,
    next: NextFunction
  ) => {
    const { address, hourlyCost, name } = req.body;

    if (!req.admin) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    if (!address || !hourlyCost || !name) {
      return next(
        new ErrorResponse(errorMessages.missingFields, StatusCodes.BAD_REQUEST)
      );
    }

    const newZone = await createZone({
      addedById: req.admin.id,
      address,
      hourlyCost,
      name,
    });
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, data: newZone });
  }
);

const getZoneByIdHandler = asyncHandler(
  async (
    req: Request<{ zoneId: string }> & { admin: Admin },
    res: Response,
    next: NextFunction
  ) => {
    const { zoneId } = req.params;
    if (!req.admin) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    }
    if (!zoneId) {
      return next(
        new ErrorResponse(errorMessages.missingFields, StatusCodes.BAD_REQUEST)
      );
    }

    const zone = await getZoneByIdDetailed(zoneId);
    if (!zone) {
      return next(
        new ErrorResponse(errorMessages.notFound, StatusCodes.NOT_FOUND)
      );
    }

    return res.status(StatusCodes.OK).json({ success: true, data: zone });
  }
);

const updateZoneHandler = asyncHandler(
  async (
    req: Request<{ zoneId: string }, {}, ZoneInput> & { admin: Admin },
    res: Response,
    next: NextFunction
  ) => {
    const { zoneId } = req.params;
    const { address, hourlyCost, name } = req.body;
    if (!req.admin) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    }
    if (!address || !hourlyCost || !name) {
      return next(
        new ErrorResponse(errorMessages.missingFields, StatusCodes.BAD_REQUEST)
      );
    }
    const zone = await getZoneById(zoneId);
    if (!zone) {
      return next(
        new ErrorResponse(errorMessages.notFound, StatusCodes.NOT_FOUND)
      );
    }
    const updatedZone = await updateZone({ address, hourlyCost, name }, zoneId);

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: updatedZone });
  }
);

const removeZoneByIdHandler = asyncHandler(
  async (
    req: Request<{ zoneId: string }> & { admin: Admin },
    res: Response,
    next: NextFunction
  ) => {
    const { zoneId } = req.params;
    if (!req.admin) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    if (!zoneId) {
      return next(
        new ErrorResponse(errorMessages.missingFields, StatusCodes.BAD_REQUEST)
      );
    }
    const zone = await getZoneById(zoneId);
    if (!zone) {
      return next(
        new ErrorResponse(errorMessages.notFound, StatusCodes.NOT_FOUND)
      );
    }

    await removeZoneById(zoneId);

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: successMessages.zoneDeleteSuccess });
  }
);

export {
  createZoneHandler,
  getZoneByIdHandler,
  updateZoneHandler,
  removeZoneByIdHandler,
  getAllParkingZonesHandler,
};
