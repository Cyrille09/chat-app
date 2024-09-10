import "dotenv/config";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { NextFunction, RequestHandler } from "express";
import User from "../models/User";
import { unauthorizedError } from "../errorMessages/errror";

/**
 * Checks for valid Auth JWT in Authorization header
 */
export const verifyAccessToken: RequestHandler = async (
  req: any,
  res,
  next: NextFunction
) => {
  try {
    const accessToken = req.header("Authorization").replace("Bearer ", "");
    const decoded: any = jwt.verify(
      accessToken,
      `${process.env.JWT_ACCESS_SECRET}`
    );

    const user = await User.findOne({
      _id: decoded.id,
      status: "active",
    });

    if (!user) {
      return next(unauthorizedError());
    }
    req.user = user;
    next();
  } catch (error) {
    return next(unauthorizedError());
  }
};
