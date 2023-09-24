import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { RegisterInput } from '../types/auth';
import db from '../utils/dbConnect';
import { Token, TokenType } from '@prisma/client';

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

const findUserByEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

const createCryptoToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

const hashCryptoToken = (token: string) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return hashedToken;
};

const createTokenModel = async (name: TokenType, userId: string) => {
  const initialToken = createCryptoToken();
  const hashedToken = hashCryptoToken(initialToken);
  await db.token.create({
    data: {
      name,
      userId,
      hashedToken,
      hashedTokenExpire: Date.now() + 10 * 60 * 1000,
    },
  });
  return initialToken;
};

const checkToken=async(userId:string,name:TokenType)=>{
  const token=await db.token.findFirst({
    where:{
      name,
      userId
    }
  });
  if(token) {
    await db.token.delete({where:{id:token.id}})
  }
}

export {
  createUser,
  createToken,
  comparePassword,
  findUserByEmailOrPhone,
  findUserByEmail,
  createTokenModel,
  checkToken
};
