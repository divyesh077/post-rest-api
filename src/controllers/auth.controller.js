import authService from '../services/auth.service.js';

export const signup = async (req, res, next) => {
  try {
    const userData = req.body;
    const meta = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      deviceId: req.headers['x-device-is'] || null,
    };
    const data = await authService.signup({ userData, meta });

    res.status(201).json({
      success: true,
      message: 'user created successfully.',
      user: data.user,
      tokens: data.tokens,
    });
  } catch (error) {
    console.error('AuthController :: signup :: error :: ', error);
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const meta = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      deviceId: req.headers['x-device-id'] || null,
    };

    const data = await authService.signin({ email, password, meta });

    res.status(200).json({
      success: true,
      message: 'user signin successfully.',
      user: data.user,
      tokens: data.tokens,
    });
  } catch (error) {
    console.error('AuthController :: signin :: error :: ', error);
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    const user = await authService.signout({ refreshToken });
    res.status(201).json({
      success: true,
      message: 'user logout successfully.',
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('AuthController :: signout :: error :: ', error);
    next(error);
  }
};

export const signoutAllDevicesForUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await authService.signoutAllDevices({ userId });
    res.status(201).json({
      success: true,
      message: 'user created successfully.',
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('AuthController :: signout :: error :: ', error);
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    const meta = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      deviceId: req.headers['x-device-is'] || null,
    };
    const tokens = await authService.refresh({ refreshToken, meta });
    res.status(200).json({
      success: true,
      message: 'tokens refresh successfully',
      tokens,
    });
  } catch (error) {
    console.error('AuthController :: sendverifyEmail :: error :: ', error);
    next(error);
  }
};

export const sendVerificationEmail = async (req, res, next) => {
  try {
    const email = req.body.email;
    const meta = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      deviceId: req.headers['x-device-id'] || null,
    };

    await authService.sendVerificationEmail({ email, meta });

    res.status(200).json({
      success: true,
      message: 'email verify token send',
    });
  } catch (error) {
    console.error('AuthController :: sendverifyEmail :: error :: ', error);
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const emailVerifyToken = req.query.token;
    const user = await authService.verifyEmail({ emailVerifyToken });
    res.status(201).json({
      success: true,
      message: 'user verify successfully.',
      user,
    });
  } catch (error) {
    console.error('AuthController :: verifyEmail :: error :: ', error);
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const meta = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      deviceId: req.headers['x-device-id'] || null,
    };

    await authService.forgotPassword({ email, meta });

    res.status(200).json({
      success: true,
      message: `Password reset link sent to ${email}`,
    });
  } catch (error) {
    console.error('AuthController :: forgotPassword :: error :: ', error);
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.query;

    const user = await authService.resetPassword(token, password);

    res.status(200).json({
      success: true,
      message: 'Password reset  successfully.',
      user,
    });
  } catch (error) {
    console.error('AuthController :: resetPassword :: error :: ', error);
    next(error);
  }
};
