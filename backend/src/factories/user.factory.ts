import User, { IUser, UserRole } from '../models/user.model';
import bcrypt from 'bcryptjs';

/**
 * Factory class for creating Users
 * Implements the Factory Method pattern to encapsulate Mongoose document instantiation
 * and enforce role-based constraints. 
 */
export class UserFactory {
  /**
   * Creates a Mongoose User document based on the requested role.
   * Hashes the password before creating the document.
   * 
   * @param role The type of user to create ('ADMIN', 'DRIVER', 'PARENT', 'STUDENT')
   * @param userData The user data payload
   * @returns A new, unsaved Mongoose Document
   */
  static async createUser(role: UserRole | string, userData: Partial<IUser>): Promise<import('mongoose').Document<unknown, {}, IUser> & IUser> {
    // Validate role constraint before instantiation
    const validRoles = Object.values(UserRole) as string[];
    const normalizedRole = role.toUpperCase();

    if (!validRoles.includes(normalizedRole)) {
      throw new Error(`Invalid user role provided to UserFactory: ${role}`);
    }

    // Role-specific validation or data transformation can happen here
    if (normalizedRole === UserRole.DRIVER && !userData.email?.includes('@driver.')) {
      // Stub validation just to demonstrate why Factory is useful
      // e.g. console.warn('Note: Driver emails usually follow @driver domain');
    }

    // Hash the password if provided
    let hashedPassword = userData.password;
    if (userData.password) {
      hashedPassword = await bcrypt.hash(userData.password, 12);
    }

    // Construct the Mongoose User Document
    const userInstance = new User({
      ...userData,
      password: hashedPassword,
      role: normalizedRole
    });

    return userInstance;
  }
}
