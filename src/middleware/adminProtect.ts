import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Admin } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import ErrorResponse from '../utils/errorResponse';
import { errorMessages } from '../utils/messages';
import db from '../utils/dbConnect';

const adminProtect = asyncHandler(
  async (
    req: Request & { admin: Admin },
    res: Response,
    next: NextFunction
  ) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(
        new ErrorResponse(
          errorMessages.unauthenticated,
          StatusCodes.UNAUTHORIZED
        )
      );
    } 
    jwt.verify(token,
      process.env.ADMIN_JWT_ACCESS_TOKEN_SECRET!,
      async (err, data: any) => {
        if (err) {
          return next(
            new ErrorResponse(
              errorMessages.unauthenticated,
              StatusCodes.UNAUTHORIZED
            )
          );
        }

        const admin = await db.admin.findUnique({
          where: {
            id: data.userId,
          },
        });

        if (!admin) {
          return next(
            new ErrorResponse(
              errorMessages.unauthenticated,
              StatusCodes.UNAUTHORIZED
            )
          );
        };
        req.admin=admin;
        next();
      }
    );
  }
);

export default adminProtect;
