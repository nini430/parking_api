import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { RegisterInput } from '../types/auth';
import db from '../utils/dbConnect';

const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};

const createUser = async (input: RegisterInput) => {
  const { firstName, lastName, email, password, idNumber, phoneNumber } = input;
  const hashedPassword = await hashPassword(password);
  const newUser = await db.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      idNumber,
      phoneNumber,
    },
  });
  return newUser;
};

const findUserByEmailOrPhone = async (email?: string, phoneNumber?: string) => {
  const user = await db.user.findFirst({
    where: { OR: [{ email }, { phoneNumber }] },
  });
  return user;
};

const createToken = (id: string, secret: string, expiresIn: string) => {
  const newToken = jwt.sign({ userId: id }, secret, { expiresIn });
  return newToken;
};

const comparePassword = async (password: string, hashedPassword: string) => {
  const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
  return isPasswordCorrect;
};

export { createUser, createToken, comparePassword, findUserByEmailOrPhone };
