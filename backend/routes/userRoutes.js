import express from 'express';
import userController from '../controllers/userController.js';

import { isAuthenticated } from '../middlewares/authMiddleware.js';
const router = express.Router();

/* Authentication */
router.post('/', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.get('/verify/:code', userController.verifyEmail);

router.get('/', isAuthenticated, userController.getUserData);

/* Profile Activity */
router.patch('/profile', isAuthenticated, userController.updateUserData);

export default router;