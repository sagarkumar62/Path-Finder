import { LearnerProfile, ILearnerProfile } from '../models/LearnerProfile';
import { ApiError } from '../utils/ApiError';
import { ProfileInput, ProfileUpdateInput } from '../validators/profile.validator';

export class ProfileService {
  async getProfileByUserId(userId: string): Promise<ILearnerProfile> {
    let profile = await LearnerProfile.findOne({ userId });
    if (!profile) {
      // Auto-create blank profile if not present
      profile = await LearnerProfile.create({
        userId,
        skills: [],
        interests: [],
        careerGoals: [],
        learningPreferences: [],
      });
    }
    return profile;
  }

  async createOrUpdateProfile(userId: string, data: ProfileInput): Promise<ILearnerProfile> {
    let profile = await LearnerProfile.findOne({ userId });

    if (profile) {
      Object.assign(profile, data);
      await profile.save();
    } else {
      profile = await LearnerProfile.create({
        userId,
        ...data,
      });
    }

    return profile;
  }

  async replaceProfile(userId: string, data: ProfileInput): Promise<ILearnerProfile> {
    let profile = await LearnerProfile.findOne({ userId });

    if (!profile) {
      profile = new LearnerProfile({ userId, ...data });
    } else {
      profile.set(data);
      profile.userId = userId as any;
    }

    await profile.save();
    return profile;
  }

  async updateProfilePartial(userId: string, data: ProfileUpdateInput): Promise<ILearnerProfile> {
    const profile = await LearnerProfile.findOne({ userId });
    if (!profile) {
      throw ApiError.notFound('Learner profile not found.');
    }

    Object.assign(profile, data);
    await profile.save();
    return profile;
  }
}

export const profileService = new ProfileService();
