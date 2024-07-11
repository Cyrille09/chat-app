import { RequestHandler } from "express";
import fs from "fs";
import User from "../models/User";
import { recordNotFound, unauthorizedError } from "../errorMessages/errror";
import { isEmail } from "validator";
import { compareHashPasswords, hashPassword } from "../bcrypt/bcrypt";

interface Todo {
  id: number;
  task: string;
  status: string;
  date: string;
}

/**
 * Get users
 */
export const getUsers: RequestHandler = async (req: any, res, next) => {
  const {
    filter = null,
    status = null,
    userStatus = "active",
    billing = { $in: ["monthly", "annual"] },
    subscriptionActivate = null,
    page = 1,
  } = req.query;

  let query = {};

  try {
    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query);

    res.status(200).json({
      users,
      page: req.query.page || 1,
      perPage: req.query.itemsPerPage || 25,
      total: totalUsers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create user
 */
export const createUser: RequestHandler = async (req, res, next) => {
  const newUser = new User(req.body);

  try {
    const email = req.body.email;
    const password = req.body.password;
    const confirmEmail = await User.findOne({ email });
    let errorMessage: any = {};
    if (
      !email ||
      (email && !isEmail(email)) ||
      !req.body.name ||
      !password ||
      confirmEmail
    ) {
      if (!req.body.name) errorMessage.name = "Name required!";
      if (!email) errorMessage.email = "Email required!";
      if (email && !isEmail(email)) errorMessage.email = "Email invalid!";
      if (confirmEmail) errorMessage.email = "Email already in use!";
      if (!password) errorMessage.password = "Password required!";
      if (password?.toLowerCase().includes("password"))
        errorMessage.password = "Password cannot contain 'password'";
      if (password?.length < 8)
        errorMessage.password = "Password must be minimum 8 characters";

      return res.status(400).json({ status: 401, ...errorMessage });
    }

    const user: any = await newUser.save();
    const token = await user.generateAuthToken();
    // if (user) {
    //   receiveEmail.autoEmail(email, subject, output);
    // }

    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user
 */
export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(recordNotFound("User"));

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Get profile user
 */
export const getUserProfile: RequestHandler = async (req: any, res, next) => {
  try {
    const user = req.user;
    const token = req.token;
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 */
export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const email = req.body.email;
    let errorMessage: any = {};
    if (
      (typeof req.body.name === "string" && !req.body.name) ||
      (typeof email === "string" && (!email || (email && !isEmail(email))))
    ) {
      if (!req.body.name) errorMessage.name = "Name required!";
      if (!email) errorMessage.email = "Email required!";
      if (email && !isEmail(email)) errorMessage.email = "Email invalid!";

      return res.status(400).json({ status: 401, ...errorMessage });
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updateUser) {
      const notFound = await recordNotFound("User");
      return res.status(notFound.status).json({ message: notFound });
    }

    res.status(200).json(updateUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Update profile user
 */
export const updateUserProfile: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.user,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updateUser) {
      const notFound = await recordNotFound("User");
      return res.status(notFound.status).json({ message: notFound });
    }

    res.status(200).json(updateUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */
export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if (!deleteUser) {
      const notFound = await recordNotFound("User");
      return res.status(notFound.status).json({ message: notFound });
    }
    res.status(200).json({ deleteUser });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user controller
 */
export const login: RequestHandler = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user: any = await User.findOne({ email });
    if (!user) throw unauthorizedError();

    const isMatch = await compareHashPasswords(password, user.password);
    if (!isMatch) throw unauthorizedError();
    if (user.status !== "active") throw unauthorizedError();

    const token = await user.generateAuthToken();
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({ user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload image controller
 */
export const uploadImage: RequestHandler = async (req: any, res, next) => {
  try {
    const file = req.file;
    const fileName = file.filename;

    const userOne = await User.findById(req.user._id);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { photoUrl: fileName },
      {
        new: true,
      }
    );

    if (userOne?.photoUrl) fs.unlinkSync(`images/profile/${userOne?.photoUrl}`);

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user image controller
 */
export const deleteUserPhoto: RequestHandler = async (req: any, res, next) => {
  try {
    const userOne = await User.findById(req.user._id);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { photoUrl: "" },
      {
        new: true,
      }
    );

    if (userOne?.photoUrl) fs.unlinkSync(`images/profile/${userOne?.photoUrl}`);

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const changeUserProfilePassword: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    const password = req.body.password;
    const userLogin: any = await User.findOne({ _id: req.user._id });

    const isMatch = await compareHashPasswords(
      req.body.oldPassword,
      userLogin.password
    );

    if (password.toLowerCase().includes("password")) {
      return res
        .status(404)
        .json({ errorPassword: 'Password cannot contain "password"' });
    }
    if (!isMatch) {
      return res.status(404).json({ error: "Wrong password" });
    }

    req.body.password = await hashPassword(req.body.password);
    const user = await User.findByIdAndUpdate(req.user, req.body, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};
