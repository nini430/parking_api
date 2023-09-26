import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AdminAuthInput } from '../types/admin';
import ErrorResponse from '../utils/errorResponse';
import { errorMessages } from '../utils/messages';
import { findAdminById, findAdminByUniqueId } from '../services/admin';
import { createToken } from '../services/auth';
import { comparePassword } from '../services/common';

const loginAdmin = asyncHandler(
  async (
    req: Request<{}, {}, AdminAuthInput>,
    res: Response,
    next: NextFunction
  ) => {
    const { uuid, password } = req.body;
    if (!uuid || !password) {
      return next(
        new ErrorResponse(errorMessages.missingFields, StatusCodes.BAD_REQUEST)
      );
    }

    const admin = await findAdminByUniqueId(uuid);
    if (!admin) {
      return next(
        new ErrorResponse(
          errorMessages.invalidCredentials,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const isPasswordCorrect = await comparePassword(password, admin.password);

    if (!isPasswordCorrect) {
      return next(
        new ErrorResponse(
          errorMessages.invalidCredentials,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const accessToken = createToken(
      admin.id,
      process.env.ADMIN_JWT_ACCESS_TOKEN_SECRET!,
      process.env.ADMIN_JWT_ACCESS_TOKEN_EXPIRE_MIN!
    );
    const refreshToken = createToken(
      admin.id,
      process.env.ADMIN_JWT_REFRESH_TOKEN_SECRET!,
      process.env.ADMIN_JWT_REFRESH_TOKEN_EXPIRE_MIN!
    );

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: { accessToken, refreshToken } });
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
      process.env.ADMIN_JWT_REFRESH_TOKEN_SECRET!,
      async (err, data: any) => {
        if (err) {
          return next(
            new ErrorResponse(
              errorMessages.unauthenticated,
              StatusCodes.UNAUTHORIZED
            )
          );
        }

        const admin = await findAdminById(data.userId);
        if (!admin) {
          return next(
            new ErrorResponse(
              errorMessages.unauthenticated,
              StatusCodes.UNAUTHORIZED
            )
          );
        }

        const accessToken = createToken(
          admin.id,
          process.env.ADMIN_JWT_ACCESS_TOKEN_SECRET!,
          process.env.ADMIN_JWT_ACCESS_TOKEN_EXPIRE_MIN!
        );

        return res
          .status(StatusCodes.OK)
          .json({ success: true, data: { accessToken } });
      }
    );
  }
);

export { loginAdmin, refreshTokenHandler };
