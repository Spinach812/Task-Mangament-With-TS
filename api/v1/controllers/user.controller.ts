import { Request, Response } from "express";

import User from "../models/user.model";
import md5 from "md5";

// [POST] /api/v1/users/register
export const register = async (req: Request, res: Response) => {
  const emailExist = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    res.json({
      code: 400,
      message: "Email existed!",
    });
  } else {
    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    const data = await user.save();

    const token = data.token;

    res.json({
      code: 200,
      message: "Success!",
      token: token,
    });
  }
};

// [POST] /api/v1/users/login
export const login = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    res.json({
      code: 400,
      message: "Email is not exist!",
    });
    return;
  }

  if (md5(password) !== user.password) {
    res.json({
      code: 400,
      message: "Password is not correct!",
    });
    return;
  }

  const token = user.token;
  res.cookie("token", token);

  res.json({
    code: 200,
    message: "Login success!",
    token: token,
  });
};

// [GET] /api/v1/users/detail/:id
export const detail = async (req: Request, res: Response) => {
  const id: string = String(req.params.id);

  const user = await User.findOne({
    _id: id,
    deleted: false,
  }).select("-password -token");

  res.json({
    code: 200,
    user: user,
  });
};
