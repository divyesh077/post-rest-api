import express from 'express';

import {
  getUserByEmail,
  getUserById,
  getUsers,
  updateUserById,
} from '../../controllers/users.controller.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/by-user-email', getUserByEmail);
router.get('/:userId', getUserById);

router.put('/:userId', updateUserById);

export default router;
