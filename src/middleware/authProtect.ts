import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse';
import { errorMessages } from '../utils/messages';
import { StatusCodes } from 'http-status-codes';
import { findUserById } from '../services/auth';
import { User } from '@prisma/client';

const authProtect = asyncHandler(
  async (req: Request & { user: User }, res: Response, next: NextFunction) => {
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
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      async (err, data: any) => {
        if (err) {
          return next(
            new ErrorResponse(
              errorMessages.unauthenticated,
              StatusCodes.UNAUTHORIZED
            )
          );
        }

        const user = await findUserById(data.id);
        if (!user) {
          return next(
            new ErrorResponse(
              errorMessages.unauthenticated,
              StatusCodes.UNAUTHORIZED
            )
          );
        }

        req.user = user;
        next();
      }
    );
  }
);

export default authProtect;
