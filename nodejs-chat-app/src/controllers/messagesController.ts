import { RequestHandler } from "express";
import translate from "@iamtraction/google-translate";
import UserContact from "../models/UserContact";
import Message from "../models/Message";
import mongoose from "mongoose";
import Group from "../models/Group";
import GroupMember from "../models/GroupMember";
import { recordNotFound } from "../errorMessages/errror";
import User from "../models/User";
import { Console } from "console";

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

    if (req.user?.preferLanguage?.isoCode) {
      const translatedMessage = await translate(req.body.message, {
        to: `${req.user?.preferLanguage?.isoCode}`,
      });

      await Message.findOneAndUpdate(
        { _id: message._id },
        {
          $push: {
            translatedMessage: {
              user: req.user,
              message: translatedMessage.text,
              preferLanguage: req.user?.preferLanguage,
            },
          },
        },
        { new: true, upsert: true }
      );
    }

    if (secondUser?.preferLanguage?.isoCode) {
      const translatedMessage = await translate(req.body.message, {
        to: `${secondUser?.preferLanguage?.isoCode}`,
      });

      await Message.findOneAndUpdate(
        { _id: message._id },
        {
          $push: {
            translatedMessage: {
              user: secondUser._id,
              message: translatedMessage.text,
              preferLanguage: secondUser?.preferLanguage,
            },
          },
        },
        { new: true, upsert: true }
      );
    }

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
 * Send audio
 */
export const sendAudio: RequestHandler = async (req: any, res, next) => {
  try {
    req.body.sender = req.user;
    const secondUser = JSON.parse(req.body.receiver);
    req.body.receiver = secondUser._id;
    req.body.message = req.file.filename;
    req.body.type = "audio";

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
        { disappear: { $ne: "disappeared" } },
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

    const groupedMessages = messages.reduce((acc: any, message: any) => {
      // Format the createdAt date to YYYY-MM-DD
      const date = message.createdAt.toISOString().split("T")[0];

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);

      return acc;
    }, {});

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

    if (req.user?.preferLanguage?.isoCode) {
      const translatedMessage = await translate(req.body.message, {
        to: `${req.user?.preferLanguage?.isoCode}`,
      });

      await Message.findOneAndUpdate(
        { _id: message._id },
        {
          $push: {
            translatedMessage: {
              user: req.user,
              message: translatedMessage.text,
              preferLanguage: req.user?.preferLanguage,
            },
          },
        },
        { new: true, upsert: true }
      );
    }

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

      const userMember: any = groupMember;

      if (userMember?.user?.preferLanguage?.isoCode) {
        const translatedMessage = await translate(req.body.message, {
          to: `${userMember?.user?.preferLanguage?.isoCode}`,
        });

        await Message.findOneAndUpdate(
          { _id: message._id },
          {
            $push: {
              translatedMessage: {
                user: userMember?.user._id,
                message: translatedMessage.text,
                preferLanguage: userMember?.user?.preferLanguage,
              },
            },
          },
          { new: true, upsert: true }
        );
      }
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
 * Send group image
 */
export const sendGroupAudio: RequestHandler = async (req: any, res, next) => {
  try {
    req.body.sender = req.user;
    req.body.group = req.body.groupId;
    req.body.message = req.file.filename;
    req.body.type = "audio";

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
      disappear: { $ne: "disappeared" },
    }).populate("receiver sender");

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

/**
 * Update message
 */
export const updateMessage: RequestHandler = async (req, res, next) => {
  try {
    const updateMessage = await Message.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updateMessage) {
      const notFound = await recordNotFound("Message");
      return res.status(notFound.status).json({ message: notFound });
    }

    if (updateMessage.translatedMessage.length) {
      for (const messageTranslated of updateMessage.translatedMessage) {
        const translatedMessage = await translate(req.body.message, {
          to: `${messageTranslated.preferLanguage?.isoCode}`,
        });

        await Message.updateOne(
          {
            _id: req.params.id,
            "translatedMessage.user": messageTranslated.user,
          },
          {
            $set: {
              "translatedMessage.$.message": translatedMessage.text,
            },
          }
        );
      }
    }

    res.status(200).json(updateMessage);
  } catch (error) {
    next(error);
  }
};

/**
 * Add star to the message
 */
export const addStarToMessage: RequestHandler = async (req: any, res, next) => {
  try {
    const addStarToMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { $push: { stars: { user: req.user } } },
      { new: true }
    );

    if (!addStarToMessage) {
      const notFound = await recordNotFound("Message");
      return res.status(notFound.status).json({ message: notFound });
    }

    res.status(200).json(addStarToMessage);
  } catch (error) {
    next(error);
  }
};

/**
 * Add star to the message
 */
export const removeStarToMessage: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    const addStarToMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { $pull: { stars: { user: req.user } } },
      { new: true }
    );

    if (!addStarToMessage) {
      const notFound = await recordNotFound("Message");
      return res.status(notFound.status).json({ message: notFound });
    }

    res.status(200).json(addStarToMessage);
  } catch (error) {
    next(error);
  }
};
