import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

import { RegisterInput } from '../types/auth';
import { createUser } from '../services/auth';
import { errorMessages, successMessages } from '../utils/messages';
import ErrorResponse from '../utils/errorResponse';

const registerUser = asyncHandler(
  async (
    req: Request<{}, {}, RegisterInput>,
    res: Response,
    next: NextFunction
  ) => {
    const { firstName, lastName, email, idNumber, password, phoneNumber } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !idNumber ||
      !password ||
      !phoneNumber
    ) {
      return next(
        new ErrorResponse(errorMessages.missingFields, StatusCodes.BAD_REQUEST)
      );
    }
    const newUser = await createUser({
      firstName,
      lastName,
      email,
      idNumber,
      password,
      phoneNumber,
    });
    if (!newUser) {
      return next(
        new ErrorResponse(
          errorMessages.noRegister,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: successMessages.registerSuccess });
  }
);

export { registerUser };
