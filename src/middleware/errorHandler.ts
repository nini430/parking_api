import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { errorMessages } from '../utils/messages';
import ErrorResponse from '../utils/errorResponse';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message=err.message;

  if (error.code === 'P2002') {
    error = new ErrorResponse(
      errorMessages.uniqueAuthConstraintError,
      StatusCodes.CONFLICT
    );
  }

  return res
    .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json({
      success: false,
      message: error.message || errorMessages.internalError,
    });
};

export default errorHandler;
