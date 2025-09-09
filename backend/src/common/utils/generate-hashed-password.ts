import * as bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync(10);

export const generateHashedPassword = (password: string) => {
  return bcrypt.hash(password, salt);
};
