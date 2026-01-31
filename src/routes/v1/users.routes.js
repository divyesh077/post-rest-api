import express from 'express';

import { getUserByEmail, getUserById, getUsers } from '../../controllers/users.controller.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/by-user-email', getUserByEmail);
router.get('/:userId', getUserById);

export default router;
