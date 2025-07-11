"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../config/database");
const User_1 = require("../models/User");
class UserRepository extends typeorm_1.Repository {
    constructor() {
        super(User_1.User, database_1.AppDataSource.createEntityManager());
    }
    async findByEmail(email) {
        return this.findOne({ where: { email } });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map