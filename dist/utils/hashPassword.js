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
const bcrypt = require('bcrypt');
const saltRounds = 10;
const hashPassword = (originalPassword) => bcrypt
    .hash(originalPassword, saltRounds);
const modifyDataWithHashedPassword = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newUserDetails = yield Promise.all(data.map((userDetails) => __awaiter(void 0, void 0, void 0, function* () {
        const originalPassword = userDetails.password;
        userDetails.password = yield hashPassword(originalPassword);
        return userDetails;
    })));
    return newUserDetails;
});
module.exports = modifyDataWithHashedPassword;
//# sourceMappingURL=hashPassword.js.map