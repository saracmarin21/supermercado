import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

export class UserRepository extends Repository<User> {
  constructor() {
    super(User, AppDataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }
}
