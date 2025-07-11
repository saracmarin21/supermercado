"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env.test' });
beforeEach(() => {
    jest.clearAllMocks();
});
jest.mock('../config/database', () => ({
    AppDataSource: {
        initialize: jest.fn().mockResolvedValue(true),
        createEntityManager: jest.fn()
    }
}));
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn().mockResolvedValue(true)
}));
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mocked_token'),
    verify: jest.fn().mockReturnValue({ userId: 1, email: 'test@test.com' })
}));
//# sourceMappingURL=setup.js.map