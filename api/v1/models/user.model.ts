import mongoose, { InferSchemaType } from "mongoose";
import * as generate from "../../../helpers/generate";

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: {
      type: String,
      default: () => generate.generateRandomString(20),
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deleteAt: Date,
  },
  {
    timestamps: true,
  },
);
export type UserType = InferSchemaType<typeof userSchema>;

const User = mongoose.model("User", userSchema, "users");

export default User;
