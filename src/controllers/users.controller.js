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

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await usersService.getUserById(userId);

    res.status(200).json({
      success: true,
      message: 'users fetch successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await usersService.getUserByEmailWithThrowError(email);

    res.status(200).json({
      success: true,
      message: 'users fetch successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const userData = req.body;
    const { userId } = req.params;

    const user = await usersService.updateUserById(userId, userData);

    res.status(200).json({
      success: true,
      message: 'users updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await usersService.deleteUserById(userId);

    res.status(200).json({
      success: true,
      message: 'users deleted successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await usersService.deleteUserByEmail(email);

    res.status(200).json({
      success: true,
      message: 'users deleted successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUsers = async (req, res, next) => {
  try {
    const user = await usersService.deleteUsers();

    res.status(200).json({
      success: true,
      message: 'users deleted successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};
