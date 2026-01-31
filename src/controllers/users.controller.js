import usersService from '../services/users.service.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await usersService.getUsers();
    res.status(200).json({
      success: true,
      message: 'users fetch successfully',
      users,
    });
  } catch (error) {
    next(error);
  }
};
