import bcrypt from 'bcrypt';
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

export { createUser };
