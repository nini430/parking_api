import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

import { LoginInput, RegisterInput } from '../types/auth';
import {
  comparePassword,
  createToken,
  createUser,
  findUserByEmailOrPhone,
} from '../services/auth';
import { errorMessages, successMessages } from '../utils/messages';
import ErrorResponse from '../utils/errorResponse';

const registerUserHandler = asyncHandler(
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

const loginUserHandler = asyncHandler(
  async (
    req: Request<{}, {}, LoginInput>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, phoneNumber, password } = req.body;

    if (!password || (!email && !phoneNumber)) {
      return next(
        new ErrorResponse(errorMessages.missingFields, StatusCodes.BAD_REQUEST)
      );
    }

    const user = await findUserByEmailOrPhone(email, phoneNumber);

    if (!user) {
      return next(
        new ErrorResponse(
          errorMessages.invalidCredentials,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      return next(
        new ErrorResponse(
          errorMessages.invalidCredentials,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const accessToken = createToken(
      user.id,
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      process.env.JWT_ACCESS_TOKEN_EXPIRE_MIN!
    );
    const refreshToken = createToken(
      user.id,
      process.env.JWT_REFRESH_TOKEN_SECRET!,
      process.env.JWT_REFRESH_TOKEN_EXPIRE_MIN!
    );
    const { password: pass, ...rest } = user;
    return res
      .status(StatusCodes.OK)
      .json({ success: true, accessToken, refreshToken, user: rest });
  }
);

export { registerUserHandler, loginUserHandler };
