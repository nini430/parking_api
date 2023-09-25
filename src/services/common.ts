import bcrypt from 'bcrypt';

const comparePassword = async (password: string, hashedPassword: string) => {
  console.log(password,hashedPassword)
  const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
  return isPasswordCorrect;
};

const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};

export { comparePassword, hashPassword };
