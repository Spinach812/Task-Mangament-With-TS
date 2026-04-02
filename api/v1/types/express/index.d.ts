import { UserType } from "../../models/user.model";
import mongoose from "mongoose";

export type ExpressUser = UserType & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

declare global {
  namespace Express {
    interface Request {
      user?: ExpressUser;
    }
  }
}

export {};
