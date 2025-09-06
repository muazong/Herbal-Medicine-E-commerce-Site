import * as bcrypt from 'bcrypt';

const SALTORROUNDS = 10;

export const generateHashedPassword = (password: string) => {
  return bcrypt.hash(password, SALTORROUNDS);
};
