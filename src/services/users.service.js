import { User } from '../models/users.model.js';
import { AppError } from '../utils/errors/AppError.js';

const createUser = async ({ username, email, password }) => {
  try {
    const existing = await getUserByEmail(email);
    if (existing) {
      throw new AppError('Email already exists', 409, 'EMAIL_ALREADY_EXISTS');
    }

    // Password aotomatically hashed user schema.pre() middlewarw
    const user = new User({
      username: username,
      email: email,
      password: password,
      role: 'user',
      isActive: false,
    });

    return await user.save();
  } catch (error) {
    console.error('UsersService :: createUser :: error :: ', error);
    throw error;
  }
};

const getUsers = async () => {
  try {
    return await User.find().select('-password -__v').lean();
  } catch (error) {
    console.error('UsersService :: getUsers :: error :: ', error);
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    return await User.findById(userId).select('-password -__v').lean();
  } catch (error) {
    console.error('UsersService :: getUserById :: error :: ', error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email: email });
  } catch (error) {
    console.error('UsersService :: getUserByEmail :: error :: ', error);
    throw error;
  }
};

const getUserByEmailWithThrowError = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new AppError(`User not found with email ${email}`, 404, 'NOT_FOUND');
    }
    return user;
  } catch (error) {
    console.error('UsersService :: getUserByEmail :: error :: ', error);
    throw error;
  }
};

const updateUserById = async (userId, updateData = {}) => {
  try {
    const { password, ...safeUpdateData } = updateData;
    const updatedUser = await User.findByIdAndUpdate(userId, safeUpdateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new Error('User not found', 404);
    }
    return updatedUser;
  } catch (error) {
    console.error('UsersService :: updateUserById :: error :: ', error);
    throw error;
  }
};

const deleteUserById = async (userId) => {
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new Error('User not found', 404);
    }
    return deletedUser;
  } catch (error) {
    console.error('UsersService :: deleteUserById :: error :: ', error);
    throw error;
  }
};

const deleteUserByEmail = async (email) => {
  try {
    const deletedUser = await User.deleteOne({ email: email });
    if (!deletedUser) {
      throw new Error('User not found', 404);
    }
    return deletedUser;
  } catch (error) {
    console.error('UsersService :: deleteUserByEmail :: error :: ', error);
    throw error;
  }
};

const deleteUsers = async () => {
  try {
    return await User.deleteMany();
  } catch (error) {
    console.error('UsersService :: deleteUsers :: error :: ', error);
    throw error;
  }
};

export default {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  getUserByEmailWithThrowError,
  updateUserById,
  deleteUserById,
  deleteUserByEmail,
  deleteUsers,
};
