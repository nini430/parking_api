import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';

import ErrorResponse from '../utils/errorResponse';
import { AutoMobileInput } from '../types/automobile';
import { errorMessages, successMessages } from '../utils/messages';
import { StatusCodes } from 'http-status-codes';
import {
  addAutoMobile,
  getAutomobileById,
  removeAutomobileById,
  updateAutomobile,
} from '../services/automobile';
import { User } from '@prisma/client';

const addAutoMobileHandler = asyncHandler(
  async (
    req: Request<{}, {}, AutoMobileInput> & { user: User },
    res: Response,
    next: NextFunction
  ) => {
    const { brand, color, modelYear, name, type, vehicleIdentificationNumber } =
      req.body;
    if (!req.user) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    }
    if (
      !brand ||
      !color ||
      !modelYear ||
      !name ||
      !type ||
      !vehicleIdentificationNumber
    ) {
      return next(
        new ErrorResponse(errorMessages.missingFields, StatusCodes.BAD_REQUEST)
      );
    }

    const newAutomobile = await addAutoMobile({
      userId: req.user.id,
      brand,
      color,
      modelYear,
      name,
      type,
      vehicleIdentificationNumber,
    });
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, data: newAutomobile });
  }
);

const updateAutomobileHandler = asyncHandler(
  async (
    req: Request<{ automobileId: string }, {}, AutoMobileInput> & {
      user: User;
    },
    res: Response,
    next: NextFunction
  ) => {
    const { brand, color, modelYear, name, type, vehicleIdentificationNumber } =
      req.body;
    const { automobileId } = req.params;

    if (!req.user) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    if (
      !automobileId ||
      !brand ||
      !color ||
      !modelYear ||
      !name ||
      !type ||
      !vehicleIdentificationNumber
    ) {
      return next(
        new ErrorResponse(errorMessages.missingFields, StatusCodes.BAD_REQUEST)
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

    const updatedAutomobile = await updateAutomobile(
      { brand, color, modelYear, name, type, vehicleIdentificationNumber },
      automobileId
    );

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: updatedAutomobile });
  }
);

const getAutomobileByIdHandler = asyncHandler(
  async (
    req: Request<{ automobileId: string }> & { user: User },
    res: Response,
    next: NextFunction
  ) => {
    const { automobileId } = req.params;

    if (!req.user) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    if (!automobileId) {
      return next(
        new ErrorResponse(errorMessages.missingFields, StatusCodes.BAD_REQUEST)
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

    return res.status(StatusCodes.OK).json({ success: true, data: automobile });
  }
);

const removeAutomobileByIdHandler = asyncHandler(
  async (
    req: Request<{ automobileId: string }> & { user: User },
    res: Response,
    next: NextFunction
  ) => {
    const { automobileId } = req.params;
    if (!req.user) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    if (!automobileId) {
      return next(
        new ErrorResponse(errorMessages.missingFields, StatusCodes.BAD_REQUEST)
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

    await removeAutomobileById(automobile.id);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: successMessages.automobileDeleteSuccess,
    });
  }
);
export {
  addAutoMobileHandler,
  updateAutomobileHandler,
  getAutomobileByIdHandler,
  removeAutomobileByIdHandler,
};
