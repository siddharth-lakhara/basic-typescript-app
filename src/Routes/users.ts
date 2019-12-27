import Users from '../types/Users';
import Login from '../types/Login';

const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');

const db = require('../../models');
const modifyDataWithHashedPassword = require('../utils/hashPassword');
const { extractDataForS3, uploadToS3 } = require('../utils/s3Upload');

module.exports = [{
  method: 'POST',
  path: '/upload-users',
  config: {
    validate: {
      payload: Joi.array().items(Joi.object({
        username: Joi.string().trim().min(1).required()
          .error(new Error('Invalid username')),
        password: Joi.string().trim().min(1).required()
          .error(new Error('Invalid password')),
        firstName: Joi.string().trim().min(1).required()
          .error(new Error('Invalid first name')),
        lastName: Joi.string().trim().min(1).required()
          .error(new Error('Invalid last name')),
        mobile: Joi.number().min(1000000000).max(9999999999)
          .required()
          .error(new Error('Invalid mobile number')),
        isActive: Joi.boolean().strict().required().error(new Error('invalid isActive')),
      })),
    },
  },
  handler: async ({ payload }: { payload:Users[] }) => {
    try {
      // store data in DB
      const modifiedData = await modifyDataWithHashedPassword(payload);
      await db.users.destroy({ where: {} });
      await db.users.bulkCreate(modifiedData);

      // store in S3
      const S3Data = extractDataForS3(payload);
      await uploadToS3(S3Data);
      return 'success';
    } catch (e) {
      console.log('Failed uploading user:', e);
      return `Fail: ${e.message}`;
    }
  },
}, {
  method: 'POST',
  path: '/login',
  config: {
    validate: {
      payload: Joi.object({
        username: Joi.string().trim().min(1).required()
          .error(new Error('username error')),
        password: Joi.string().trim().min(1).required()
          .error(new Error('password error')),
      }),
    },
  },
  handler: async ({ payload }: { payload: Login}) => {
    const { username, password } = payload;
    try {
      const results = await db.users.findOne({ where: { username, isActive: true } });
      if (results) {
        const isValidUser = await bcrypt.compare(password, results.password);
        if (isValidUser) {
          return 'Login successful';
        }
      }
      return 'Authentication failed';
    } catch (e) {
      console.log('Failed uploading user:', e);
      return `Failed: ${e.message}`;
    }
  },
}];
