import * as bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const SALT = bcrypt.genSaltSync();
  return bcrypt.hash(password, SALT);
};

export const compareHashPasswords = async (
  plainTextPassword: string,
  hashedPassword: string
) => {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};
