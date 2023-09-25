import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { Admin } from '@prisma/client';
import { ZoneInput } from '../types/zone';
import ErrorResponse from '../utils/errorResponse';
import { errorMessages } from '../utils/messages';
import { StatusCodes } from 'http-status-codes';
import { createZone } from '../services/zone';

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

export { createZoneHandler };
