import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { ParkingControllerInput } from '../types/parking';
import { User } from '@prisma/client';
import ErrorResponse from '../utils/errorResponse';
import { errorMessages, successMessages } from '../utils/messages';
import { StatusCodes } from 'http-status-codes';
import { getZoneById } from '../services/zone';
import { updateUserBalance } from '../services/user';
import {
  cancelParkingById,
  createParking,
  getParkingById,
  getParkingByIdDetailed,
  getValidParkingByAutoAndZone,
} from '../services/parking';
import { getAutomobileById } from '../services/automobile';

const createParkingHandler = asyncHandler(
  async (
    req: Request<
      { zoneId: string; automobileId: string },
      {},
      ParkingControllerInput
    > & { user: User },
    res: Response,
    next: NextFunction
  ) => {
    const { automobileId, zoneId } = req.params;
    const { boughtHours } = req.body;

    if (!req.user) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    if (!boughtHours || !automobileId || !zoneId) {
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

    const automobile = await getAutomobileById(automobileId);
    if (!automobile) {
      return next(
        new ErrorResponse(errorMessages.notFound, StatusCodes.NOT_FOUND)
      );
    }

    if (automobile.userId !== req.user.id) {
      return next(
        new ErrorResponse(errorMessages.actionNotAllowed, StatusCodes.FORBIDDEN)
      );
    }

    const instance = await getValidParkingByAutoAndZone(automobileId, zoneId);
    if (instance) {
      return next(
        new ErrorResponse(
          errorMessages.uniqueConstraintError,
          StatusCodes.CONFLICT
        )
      );
    }
    const totalCost = zone.hourlyCost * boughtHours;
    const expireDate = Date.now() + boughtHours * 60 * 60 * 1000;
    if (totalCost > req.user.virtualBalance) {
      return next(
        new ErrorResponse(
          errorMessages.notEnoughBalance,
          StatusCodes.BAD_REQUEST
        )
      );
    } else {
      await createParking({ boughtHours, expireDate }, automobileId, zoneId);
      await updateUserBalance(req.user.id, req.user.virtualBalance - totalCost);
    }

    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, data: successMessages.parkingCreateSuccess });
  }
);

const getParkingByIdHandler = asyncHandler(
  async (
    req: Request<{ parkingId: string }> & { user: User },
    res: Response,
    next: NextFunction
  ) => {
    const { parkingId } = req.params;

    if (!req.user) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    if (!parkingId) {
      return next(
        new ErrorResponse(errorMessages.missingFields, StatusCodes.BAD_REQUEST)
      );
    }

    const parking = await getParkingByIdDetailed(parkingId);
    if (!parking) {
      return next(
        new ErrorResponse(errorMessages.notFound, StatusCodes.NOT_FOUND)
      );
    }

    if (parking.automobile.userId !== req.user.id) {
      return next(
        new ErrorResponse(errorMessages.actionNotAllowed, StatusCodes.FORBIDDEN)
      );
    }

    return res.status(StatusCodes.OK).json({ success: true, data: parking });
  }
);

const removeParkingByIdHandler = asyncHandler(
  async (
    req: Request<{ parkingId: string }> & { user: User },
    res: Response,
    next: NextFunction
  ) => {
    const { parkingId } = req.params;
    if (!req.user) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    }
    if (!parkingId) {
      return next(
        new ErrorResponse(errorMessages.missingFields, StatusCodes.BAD_REQUEST)
      );
    }

    const parking = await getParkingById(parkingId);
    if (!parking) {
      return next(
        new ErrorResponse(errorMessages.notFound, StatusCodes.NOT_FOUND)
      );
    }

    if (parking.automobile.userId !== req.user.id) {
      return next(
        new ErrorResponse(errorMessages.actionNotAllowed, StatusCodes.FORBIDDEN)
      );
    }

    await cancelParkingById(parkingId);

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: successMessages.parkingDeleteSuccess });
  }
);

export {
  createParkingHandler,
  getParkingByIdHandler,
  removeParkingByIdHandler,
};
