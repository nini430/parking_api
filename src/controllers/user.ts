import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import ErrorResponse from '../utils/errorResponse';
import { errorMessages } from '../utils/messages';
import { StatusCodes } from 'http-status-codes';
import { getAllAutomobiles, getParkingsByUserId } from '../services/user';

const getAllAutomobilesHandler = asyncHandler(
  async (req: Request & { user: User }, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    const automobiles = await getAllAutomobiles(req.user.id);
    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: automobiles });
  }
);

const getAllUserParkingHistory = asyncHandler(
  async (req: Request & { user: User }, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    const allParkings = await getParkingsByUserId(req.user.id);

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: allParkings });
  }
);

export { getAllUserParkingHistory, getAllAutomobilesHandler };
