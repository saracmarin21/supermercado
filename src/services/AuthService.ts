import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(userData: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email!);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    return this.userRepository.save(user);
  }

  async login(email: string, password: string): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }
}
