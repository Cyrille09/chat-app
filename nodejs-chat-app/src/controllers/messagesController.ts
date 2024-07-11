import { RequestHandler } from "express";
import UserContact from "../models/UserContact";
import Message from "../models/Message";
import mongoose from "mongoose";
import Group from "../models/Group";
import GroupMember from "../models/GroupMember";

/**
 * Get messages
 */
export const getMessages: RequestHandler = async (req: any, res, next) => {
  let query = {};

  try {
    const messages = await Message.find(query);

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

/**
 * Send message
 */
export const sendMessage: RequestHandler = async (req: any, res, next) => {
  try {
    const urlRegExp =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

    if (urlRegExp.test(req.body.message)) req.body.type = "link";

    req.body.sender = req.user;
    const secondUser = req.body.receiver;
    req.body.receiver = req.body.receiver._id;

    const newMessage = new Message(req.body);

    const findReceiverContacts: any = await UserContact.findOne({
      user: req.body.receiver,
    });

    if (
      !findReceiverContacts ||
      (findReceiverContacts &&
        !findReceiverContacts?.users.some(
          (user: { user: mongoose.Types.ObjectId }) =>
            user?.user.toString() === req.user._id.toString()
        ))
    ) {
      await UserContact.findOneAndUpdate(
        { user: req.body.receiver },
        { $push: { users: { user: req.user } } },
        { new: true, upsert: true }
      );
    }
    const message = await newMessage.save();

    // sender
    await UserContact.findOneAndUpdate(
      { user: req.user._id, "users.user": req.body.receiver },
      {
        $set: {
          "users.$.latestMessage": message._id,
          "users.$.message": message._id,
          "users.$.updatedAt": new Date(),
        },
      },
      { new: true, upsert: true }
    );

    // receiver
    await UserContact.findOneAndUpdate(
      { user: req.body.receiver, "users.user": req.user._id },
      {
        $set: {
          "users.$.latestMessage": message._id,
          "users.$.updatedAt": new Date(),
        },
        $inc: { "users.$.messageUnreadCount": 1 },
      },

      { new: true, upsert: true }
    );

    res.status(201).json({ message, secondUser });
  } catch (error) {
    next(error);
  }
};

/**
 * Send image
 */
export const sendImage: RequestHandler = async (req: any, res, next) => {
  try {
    req.body.sender = req.user;
    const secondUser = JSON.parse(req.body.receiver);
    req.body.receiver = secondUser._id;
    req.body.message = req.file.filename;
    req.body.type = "image";

    const newMessage = new Message(req.body);

    const findReceiverContacts: any = await UserContact.findOne({
      user: req.body.receiver,
    });

    if (
      !findReceiverContacts ||
      (findReceiverContacts &&
        !findReceiverContacts?.users.some(
          (user: { user: mongoose.Types.ObjectId }) =>
            user?.user.toString() === req.user._id.toString()
        ))
    ) {
      await UserContact.findOneAndUpdate(
        { user: req.body.receiver },
        { $push: { users: { user: req.user } } },
        { new: true, upsert: true }
      );
    }
    const message = await newMessage.save();

    // sender
    await UserContact.findOneAndUpdate(
      { user: req.user._id, "users.user": req.body.receiver },
      {
        $set: {
          "users.$.latestMessage": message._id,
          "users.$.updatedAt": new Date(),
        },
      },
      { new: true, upsert: true }
    );

    // receiver
    await UserContact.findOneAndUpdate(
      { user: req.body.receiver, "users.user": req.user._id },
      {
        $set: {
          "users.$.latestMessage": message._id,
          "users.$.updatedAt": new Date(),
        },
        $inc: { "users.$.messageUnreadCount": 1 },
      },

      { new: true, upsert: true }
    );

    res.status(201).json({ message, secondUser });
  } catch (error) {
    next(error);
  }
};

/**
 * Send document
 */
export const sendDocument: RequestHandler = async (req: any, res, next) => {
  try {
    req.body.sender = req.user;
    const secondUser = JSON.parse(req.body.receiver);
    req.body.receiver = secondUser._id;
    req.body.message = req.file.filename;
    req.body.type = "document";

    const newMessage = new Message(req.body);

    const findReceiverContacts: any = await UserContact.findOne({
      user: req.body.receiver,
    });

    if (
      !findReceiverContacts ||
      (findReceiverContacts &&
        !findReceiverContacts?.users.some(
          (user: { user: mongoose.Types.ObjectId }) =>
            user?.user.toString() === req.user._id.toString()
        ))
    ) {
      await UserContact.findOneAndUpdate(
        { user: req.body.receiver },
        { $push: { users: { user: req.user } } },
        { new: true, upsert: true }
      );
    }
    const message = await newMessage.save();

    // sender
    await UserContact.findOneAndUpdate(
      { user: req.user._id, "users.user": req.body.receiver },
      {
        $set: {
          "users.$.latestMessage": message._id,
          "users.$.updatedAt": new Date(),
        },
      },
      { new: true, upsert: true }
    );

    // receiver
    await UserContact.findOneAndUpdate(
      { user: req.body.receiver, "users.user": req.user._id },
      {
        $set: {
          "users.$.latestMessage": message._id,
          "users.$.updatedAt": new Date(),
        },
        $inc: { "users.$.messageUnreadCount": 1 },
      },

      { new: true, upsert: true }
    );

    res.status(201).json({ message, secondUser });
  } catch (error) {
    next(error);
  }
};

/**
 * Get sender and receiver messages
 */
export const getSenderAndReceiverMessages: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    let query = {
      $and: [
        { sender: { $in: [req.user, req.body.secondUser] } },
        { receiver: { $in: [req.user, req.body.secondUser] } },
        {
          "deleteMessage.user": {
            $nin: [req.body.secondUser],
          },
        },
      ],
    };

    await UserContact.findOneAndUpdate(
      { user: req.user._id, "users.user": req.body.secondUser },
      {
        $set: { "users.$.messageUnreadCount": 0 },
      },

      { new: true, upsert: true }
    );

    const messages = await Message.find(query).populate("receiver sender");

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

/**
 * Send group message
 */
export const sendGroupMessage: RequestHandler = async (req: any, res, next) => {
  try {
    const urlRegExp =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

    if (urlRegExp.test(req.body.message)) req.body.type = "link";

    req.body.sender = req.user;
    req.body.group = req.body.groupId;

    const newMessage = new Message(req.body);
    const message = await newMessage.save();

    // add the latest message to into the group
    await Group.findOneAndUpdate(
      {
        _id: req.body.groupId,
      },
      {
        $set: {
          latestMessage: message._id,
          latestSender: req.user,
        },
      },
      { new: true, upsert: true }
    );

    const groupMembers = await GroupMember.find({
      group: req.body.groupId,
      user: { $nin: [req.user._id] },
    }).populate("user group");

    await UserContact.findOneAndUpdate(
      {
        user: req.user._id,
        "users.group": req.body.groupId,
      },
      {
        $set: {
          "users.$.updatedAt": new Date(),
        },
      },

      { new: true, upsert: true }
    );

    for (const groupMember of groupMembers) {
      await UserContact.findOneAndUpdate(
        {
          user: groupMember.user._id,
          "users.group": groupMember.group._id,
        },
        {
          $set: {
            "users.$.latestMessage": message._id,
            "users.$.updatedAt": new Date(),
          },
          $inc: { "users.$.messageUnreadCount": 1 },
        },

        { new: true, upsert: true }
      );
    }

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};

/**
 * Send group image
 */
export const sendGroupImage: RequestHandler = async (req: any, res, next) => {
  try {
    req.body.sender = req.user;
    req.body.group = req.body.groupId;
    req.body.message = req.file.filename;
    req.body.type = "image";

    const newMessage = new Message(req.body);
    const message = await newMessage.save();

    // add the latest message to into the group
    await Group.findOneAndUpdate(
      {
        _id: req.body.groupId,
      },
      {
        $set: {
          latestMessage: message._id,
          latestSender: req.user,
        },
      },
      { new: true, upsert: true }
    );

    const groupMembers = await GroupMember.find({
      group: req.body.groupId,
      user: { $nin: [req.user._id] },
    }).populate("user group");

    await UserContact.findOneAndUpdate(
      {
        user: req.user._id,
        "users.group": req.body.groupId,
      },
      {
        $set: {
          "users.$.updatedAt": new Date(),
        },
      },

      { new: true, upsert: true }
    );

    for (const groupMember of groupMembers) {
      await UserContact.findOneAndUpdate(
        {
          user: groupMember.user._id,
          "users.group": groupMember.group._id,
        },
        {
          $set: {
            "users.$.latestMessage": message._id,
            "users.$.updatedAt": new Date(),
          },
          $inc: { "users.$.messageUnreadCount": 1 },
        },

        { new: true, upsert: true }
      );
    }

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};

/**
 * Send group document
 */
export const sendGroupDocument: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    req.body.sender = req.user;
    req.body.group = req.body.groupId;
    req.body.message = req.file.filename;
    req.body.type = "document";

    const newMessage = new Message(req.body);
    const message = await newMessage.save();

    // add the latest message to into the group
    await Group.findOneAndUpdate(
      {
        _id: req.body.groupId,
      },
      {
        $set: {
          latestMessage: message._id,
          latestSender: req.user,
        },
      },
      { new: true, upsert: true }
    );

    const groupMembers = await GroupMember.find({
      group: req.body.groupId,
      user: { $nin: [req.user._id] },
    }).populate("user group");

    await UserContact.findOneAndUpdate(
      {
        user: req.user._id,
        "users.group": req.body.groupId,
      },
      {
        $set: {
          "users.$.updatedAt": new Date(),
        },
      },

      { new: true, upsert: true }
    );

    for (const groupMember of groupMembers) {
      await UserContact.findOneAndUpdate(
        {
          user: groupMember.user._id,
          "users.group": groupMember.group._id,
        },
        {
          $set: {
            "users.$.latestMessage": message._id,
            "users.$.updatedAt": new Date(),
          },
          $inc: { "users.$.messageUnreadCount": 1 },
        },

        { new: true, upsert: true }
      );
    }

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};

/**
 * Get group messages
 */
export const getGroupMessages: RequestHandler = async (req: any, res, next) => {
  try {
    await UserContact.findOneAndUpdate(
      {
        user: req.user._id,
        "users.group": req.params.groupId,
      },
      {
        $set: { "users.$.messageUnreadCount": 0 },
      },

      { new: true, upsert: true }
    );

    const messages = await Message.find({
      isGroup: true,
      group: req.params.groupId,
    }).populate("receiver sender");

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
