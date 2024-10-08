import { RequestHandler } from "express";
import User from "../models/User";
import UserContact from "../models/UserContact";
import { recordNotFound } from "../errorMessages/errror";
import Message from "../models/Message";
import BlockContactUser from "../models/BlockContactUser";

/**
 * Create user contacts
 */
export const createUserContacts: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    if (!req.body.user)
      return res.status(400).json({ status: 401, message: "user required!" });

    const upsertUserContact = await UserContact.findOneAndUpdate(
      { user: req.user._id },
      { $push: { users: { user: req.body.user, updatedAt: new Date() } } },
      { new: true, upsert: true }
    );

    res.status(201).json(upsertUserContact);
  } catch (error) {
    next(error);
  }
};

/**
 * Block user contact
 */
export const blockUserContacts: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    if (!req.body.receiver)
      return res.status(400).json({ status: 401, message: "user required!" });

    const blockUser = await UserContact.findOne({
      user: req.user,
      "users.user": req.body.receiver,
    });

    if (req.body.status) {
      await BlockContactUser.create({
        user: req.user,
        userBlock: req.body.receiver,
      });
    } else {
      await BlockContactUser.deleteMany({
        user: req.user,
        userBlock: req.body.receiver,
      });
    }

    res.status(201).json(blockUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Get block user contact
 */
export const getBlockUserContacts: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    const query = {
      $or: [
        { user: req.user, userBlock: req.params.receiverId },
        { user: req.params.receiverId, userBlock: req.user },
      ],
    };

    const blockUser = await BlockContactUser.findOne(query);

    res.status(201).json(blockUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Clear  user chat
 */
export const clearUserContactChat: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    if (!req.body.receiver)
      return res.status(400).json({ status: 401, message: "user required!" });

    let query = {
      $and: [
        { sender: { $in: [req.user, req.body.receiver] } },
        { receiver: { $in: [req.user, req.body.receiver] } },
      ],
    };

    await Message.updateMany(query, {
      $push: {
        deleteMessage: { user: req.body.receiver._id, date: new Date() },
      },
    });

    res.status(201).json({ receiver: req.body.receiver });
  } catch (error) {
    next(error);
  }
};

/**
 * Mute user contact
 */
export const muteUserContacts: RequestHandler = async (req: any, res, next) => {
  try {
    if (!req.body.receiver)
      return res.status(400).json({ status: 401, message: "user required!" });

    const blockUser = await UserContact.findOneAndUpdate(
      { user: req.user, "users.user": req.body.receiver },
      {
        $set: { "users.$.muteDate": req.body.muteDate },
      },
      { new: true, upsert: true }
    );

    res.status(201).json(blockUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Disappear contact user message
 */
export const disappearContactUserMessage: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    if (!req.body.receiver)
      return res.status(400).json({ status: 401, message: "user required!" });

    const blockUser = await UserContact.findOneAndUpdate(
      { user: req.user, "users.user": req.body.receiver },
      {
        $set: { "users.$.disappearIn": req.body.disappearIn },
      },
      { new: true, upsert: true }
    );

    req.body.sender = req.user;
    req.body.type = "action";
    req.body.receiver = req.body.receiver._id;

    await addMessage(req.body);

    res.status(201).json(blockUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user contacts
 */
export const getUserContacts: RequestHandler = async (req: any, res, next) => {
  try {
    const userContacts = await UserContact.findOne({
      user: req.user,
    })
      .populate("user")
      .populate({
        path: "users.user users.latestMessage",
        populate: {
          path: "sender receiver latestMessage latestSender",
          strictPopulate: false,
        },
      })
      .populate({
        path: "users.group",
        populate: {
          path: "latestMessage latestSender",
          strictPopulate: false,
          populate: {
            path: "sender",
            strictPopulate: false,
          },
        },
      });

    res.status(200).json(userContacts);
  } catch (error) {
    next(error);
  }
};

/**
 * Get request user contacts
 */
export const getRequestUserContact: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    const userContacts: any = await UserContact.findOne({
      user: req.user,
    });

    const existentContacts =
      userContacts?.users?.map((user: { user: { user: {} } }) => user?.user) ||
      [];

    let query = {
      _id: { $nin: [req.user, ...existentContacts] },
    };

    const requestContacts = await User.find(query);

    res.status(200).json(requestContacts);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete contact user
 */
export const deleteUserContact: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    const deleteContactUser = await UserContact.findOneAndUpdate(
      { user: req.user },
      {
        $pull: { users: { _id: req.params.id } },
      },
      { new: true }
    );

    if (!deleteContactUser) {
      const notFound = await recordNotFound("User");
      return res.status(notFound.status).json({ message: notFound });
    }

    res.status(200).json({ deleteContactUser });
  } catch (error) {
    next(error);
  }
};

const addMessage = async (body: any) => {
  const newMessage = new Message(body);
  await newMessage.save();
};
