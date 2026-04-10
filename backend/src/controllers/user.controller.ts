import { Request, Response } from 'express';
import userService from '../services/user.service';
import { UserFactory } from '../factories/user.factory';

class UserController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      // Use Factory Pattern to instantiate the user document
      const userInstance = UserFactory.createUser(req.body.role || 'PARENT', req.body);
      
      // Save the factory-created instance to the database
      const savedUser = await userInstance.save();
      
      res.status(201).json(savedUser);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id as string);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.updateUser(req.params.id as string, req.body);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.deleteUser(req.params.id as string);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new UserController();
