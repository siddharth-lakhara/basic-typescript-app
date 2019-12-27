import Users from '../types/Users';

export {};

const bcrypt = require('bcrypt');

const saltRounds = 10;

const hashPassword = (originalPassword: string):Promise<string> => bcrypt
  .hash(originalPassword, saltRounds);

const modifyDataWithHashedPassword = async (data: Users[]):Promise<Users[]> => {
  const newUserDetails = await Promise.all(data.map(async (userDetails) => {
    const originalPassword = userDetails.password;
    userDetails.password = await hashPassword(originalPassword);
    return userDetails;
  }));
  return newUserDetails;
};

module.exports = modifyDataWithHashedPassword;
