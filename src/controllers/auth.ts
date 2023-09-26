import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { LoginInput, RegisterInput } from '../types/auth';
import {
  checkToken,
  checkTokenExpiration,
  createToken,
  createTokenModel,
  createUser,
  findTokenByCryptoToken,
  findUserByEmail,
  findUserByEmailOrPhone,
  findUserById,
  removeTokenById,
  resetPassword,
} from '../services/auth';
import { comparePassword } from '../services/common';
import { errorMessages, successMessages } from '../utils/messages';
import ErrorResponse from '../utils/errorResponse';
import sendEmail from '../utils/sendEmail';

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

const forgotPasswordHandler = asyncHandler(
  async (
    req: Request<{}, {}, { email: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { email } = req.body;
    if (!email) {
      return next(
        new ErrorResponse(errorMessages.missingFields, StatusCodes.BAD_REQUEST)
      );
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return next(
        new ErrorResponse(
          errorMessages.invalidCredentials,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    await checkToken(user.id, 'PASSWORD_RESET');
    const token = await createTokenModel('PASSWORD_RESET', user.id);

    const message = `You requested to reset your password. please make a put request to ${
      req.protocol
    }://${req.get('host')}/api/v1/auth/reset-password/${token}?userId=${
      user.id
    }`;
    sendEmail({
      email: user.email,
      message,
      subject: 'Password Reset Request',
    });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: successMessages.emailSent });
  }
);

const resetPasswordTokenHandler = asyncHandler(
  async (
    req: Request<
      { token: string },
      {},
      { newPassword: string },
      { userId: string }
    >,
    res: Response,
    next: NextFunction
  ) => {
    const { userId } = req.query;
    const tokenParam = req.params.token;
    const { newPassword } = req.body;

    if (!userId || !newPassword) {
      return next(
        new ErrorResponse(
          errorMessages.invalidCredentials,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    if (!tokenParam) {
      return next(
        new ErrorResponse(errorMessages.invalidParams, StatusCodes.BAD_REQUEST)
      );
    }

    const user = await findUserById(userId);
    if (!user) {
      return next(
        new ErrorResponse(
          errorMessages.invalidCredentials,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const token = await findTokenByCryptoToken(
      tokenParam,
      userId,
      'PASSWORD_RESET'
    );
    if (!token) {
      return next(
        new ErrorResponse(errorMessages.invalidRequest, StatusCodes.BAD_REQUEST)
      );
    }

    const isTokenExpired = await checkTokenExpiration(token);

    if (isTokenExpired) {
      return next(
        new ErrorResponse(errorMessages.expiredLink, StatusCodes.BAD_REQUEST)
      );
    }

    await resetPassword(newPassword, userId);
    await removeTokenById(token.id);

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: successMessages.passwordResetSuccess });
  }
);

const refreshTokenHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    jwt.verify(
      token,
      process.env.JWT_REFRESH_TOKEN_SECRET!,
      async (err, data: any) => {
        if (err) {
          return next(
            new ErrorResponse(
              errorMessages.unauthenticated,
              StatusCodes.UNAUTHORIZED
            )
          );
        }
        const user = await findUserById(data.userId);
        if (!user) {
          return next(
            new ErrorResponse(
              errorMessages.unauthenticated,
              StatusCodes.UNAUTHORIZED
            )
          );
        }

        const accessToken = createToken(
          user.id,
          process.env.JWT_ACCESS_TOKEN_SECRET!,
          process.env.JWT_ACCESS_TOKEN_EXPIRE_MIN!
        );
        return res
          .status(StatusCodes.OK)
          .json({ success: true, data: { accessToken } });
      }
    );
  }
);

export {
  registerUserHandler,
  loginUserHandler,
  forgotPasswordHandler,
  resetPasswordTokenHandler,
  refreshTokenHandler,
};
