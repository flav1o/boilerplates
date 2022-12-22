import * as mongoose from 'mongoose';
import { Role } from 'src/graphql/graphql-schema';

export const UsersSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    confirmationCode: String,
    confirmed: Boolean,
    roles: {
      type: [String],
      enum: [Role.USER, Role.ADMIN],
    },
  },
  { timestamps: true, versionKey: false },
);
