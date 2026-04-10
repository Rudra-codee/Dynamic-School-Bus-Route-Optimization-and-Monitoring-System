import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const signup = (req: Request, res: Response, next: NextFunction) => authService.signup(req, res, next);
export const login = (req: Request, res: Response, next: NextFunction) => authService.login(req, res, next);
