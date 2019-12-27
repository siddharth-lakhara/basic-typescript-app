"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        handler: ({ payload }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // store data in DB
                const modifiedData = yield modifyDataWithHashedPassword(payload);
                yield db.users.destroy({ where: {} });
                yield db.users.bulkCreate(modifiedData);
                // store in S3
                const S3Data = extractDataForS3(payload);
                yield uploadToS3(S3Data);
                return 'success';
            }
            catch (e) {
                console.log('Failed uploading user:', e);
                return `Fail: ${e.message}`;
            }
        }),
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
        handler: ({ payload }) => __awaiter(void 0, void 0, void 0, function* () {
            const { username, password } = payload;
            try {
                const results = yield db.users.findOne({ where: { username, isActive: true } });
                if (results) {
                    const isValidUser = yield bcrypt.compare(password, results.password);
                    if (isValidUser) {
                        return 'Login successful';
                    }
                }
                return 'Authentication failed';
            }
            catch (e) {
                console.log('Failed uploading user:', e);
                return `Failed: ${e.message}`;
            }
        }),
    }];
//# sourceMappingURL=users.js.map