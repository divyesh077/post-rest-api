import express from 'express';

import {
  deleteUserByEmail,
  deleteUserById,
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

router.delete('/by-user-email', deleteUserByEmail);
router.delete('/:userId', deleteUserById);

export default router;
