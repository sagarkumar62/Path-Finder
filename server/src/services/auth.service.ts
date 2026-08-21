import { User, IUser } from '../models/User';
import { LearnerProfile } from '../models/LearnerProfile';
import { ApiError } from '../utils/ApiError';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  TokenPayload,
} from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export class AuthService {
  async register(input: RegisterInput) {
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw ApiError.conflict('User with this email already exists.');
    }

    const user = await User.create({
      name: input.name,
      email: input.email.toLowerCase(),
      password: input.password,
      avatar: input.avatar || '',
      role: 'user',
    });

    // Create initial LearnerProfile for the user with any initial skills/interests
    await LearnerProfile.create({
      userId: user._id,
      skills: input.skills || [],
      interests: input.interests || [],
      careerGoals: [],
      learningPreferences: [],
    });

    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const userObj = user.toObject();
    delete userObj.password;
    (userObj as any).id = user._id.toString();

    return {
      user: userObj,
      accessToken,
      refreshToken,
    };
  }

  async login(input: LoginInput) {
    const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const userObj = user.toObject();
    delete userObj.password;
    (userObj as any).id = user._id.toString();

    return {
      user: userObj,
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token is required.');
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw ApiError.unauthorized('User no longer exists.');
      }

      const payload: TokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired refresh token.');
    }
  }

  async getCurrentUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }
    return user;
  }

  async updateCurrentUser(userId: string, data: { name?: string; avatar?: string }) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw ApiError.notFound('User not found.');
    }
    const userObj = user.toObject();
    delete userObj.password;
    (userObj as any).id = user._id.toString();
    return userObj;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw ApiError.badRequest('Current password is incorrect.');
    }

    user.password = newPassword;
    await user.save();
  }
}

export const authService = new AuthService();

