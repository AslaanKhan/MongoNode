
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import UserModel, { UserDocument } from '../models/user.model';

export async function createUser(input: any) {
    try {
        return await UserModel.create(input);
    } catch (error:any) {
        throw new Error(error);
    }
}

// export async function getUser(query: FilterQuery<UserDocument>) {
//     return UserModel.findOne(query).lean();
//   }

export async function getUserById(query: FilterQuery<UserDocument>) {
    return UserModel.findOne(query).lean();
}

export async function updateUser(query: FilterQuery<UserDocument>,
    update: UpdateQuery<UserDocument>,
    options: QueryOptions = { lean: true }) {
    return UserModel.findOneAndUpdate(query, update, options);
  }
