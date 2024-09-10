import { RequestHandler } from "express";
import fs from "fs";
import UserContact from "../models/UserContact";
import Group from "../models/Group";
import GroupMember from "../models/GroupMember";
import { recordNotFound } from "../errorMessages/errror";
import Message from "../models/Message";

/**
 * Create group
 */
export const createGroup: RequestHandler = async (req: any, res, next) => {
  try {
    const groupMembers = [
      ...req.body.groupMembers,
      { value: req.user._id, admin: true },
    ];

    req.body.creator = req.user._id;
    const newGroup = new Group(req.body);
    const group = await newGroup.save();

    for (const groupMember of groupMembers) {
      await UserContact.findOneAndUpdate(
        { user: groupMember.value },
        {
          $push: {
            users: {
              user: groupMember.value,
              isGroup: true,
              group: group._id,
              updatedAt: new Date(),
            },
          },
        },
        { new: true, upsert: true }
      );

      await GroupMember.create({
        user: groupMember.value,
        admin: groupMember?.admin ? true : false,
        group: group._id,
      });
    }

    res.status(201).json(group);
  } catch (error) {
    next(error);
  }
};

/**
 * Get group members
 */
export const getGroupMmebers: RequestHandler = async (req: any, res, next) => {
  let query = { group: req.params.id };

  try {
    const groupMembers = await GroupMember.find(query).populate("user group");

    res.status(200).json(groupMembers);
  } catch (error) {
    next(error);
  }
};

/**
 * Get group
 */
export const getGroup: RequestHandler = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) return next(recordNotFound("Group"));

    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};

export const updateGroup: RequestHandler = async (req: any, res, next) => {
  try {
    const updateGroup = await Group.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (req.body.disappearIn !== undefined) {
      req.body.sender = req.user;
      req.body.group = req.params.id;
      req.body.type = "action";
      req.body.isGroup = true;

      await addMessage(req.body);
    }

    res.status(200).json(updateGroup);
  } catch (error) {
    next(error);
  }
};

/**
 * Add group members
 */
export const updateGroupMembers: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    for (const groupMember of req.body?.members) {
      await UserContact.findOneAndUpdate(
        { user: groupMember.value },
        {
          $push: {
            users: {
              user: groupMember.value,
              isGroup: true,
              group: req.params.id,
              updatedAt: new Date(),
            },
          },
        },
        { new: true, upsert: true }
      );

      await GroupMember.create({
        user: groupMember.value,
        group: req.params.id,
      });
    }

    req.body.sender = req.user;
    req.body.group = req.params.id;
    req.body.type = "action";
    req.body.isGroup = true;

    await addMessage(req.body);

    res.status(201).json({ success: true });
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

    const findGroup = await Group.findById(req.params.id);

    const user = await Group.findByIdAndUpdate(
      req.params.id,
      { photoUrl: fileName },
      {
        new: true,
      }
    );

    if (findGroup?.photoUrl)
      fs.unlinkSync(`images/groups/${findGroup?.photoUrl}`);

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete group image controller
 */
export const deleteGroupPhoto: RequestHandler = async (req: any, res, next) => {
  try {
    const findGroup = await Group.findById(req.params.id);

    const user = await Group.findByIdAndUpdate(
      req.params.id,
      { photoUrl: "" },
      {
        new: true,
      }
    );

    if (findGroup?.photoUrl)
      fs.unlinkSync(`images/groups/${findGroup?.photoUrl}`);

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Mute group contact
 */
export const muteGroupContact: RequestHandler = async (req: any, res, next) => {
  try {
    const muteGroup = await UserContact.findOneAndUpdate(
      { user: req.user, "users._id": req.params.contactId },
      {
        $set: { "users.$.muteDate": req.body.muteDate },
      },
      { new: true, upsert: true }
    );

    res.status(201).json(muteGroup);
  } catch (error) {
    next(error);
  }
};

/**
 * Exist from group
 */
export const exitFromGroupContact: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    const deleteContactUser = await UserContact.findOneAndUpdate(
      { user: req.user },
      {
        $pull: { users: { _id: req.params.contactId } },
      },
      { new: true }
    );

    if (!deleteContactUser) {
      const notFound = await recordNotFound("User");
      return res.status(notFound.status).json({ message: notFound });
    }

    const existFromGroup = await GroupMember.findOneAndDelete({
      user: req.user,
      group: req.params.groupId,
    });

    if (!existFromGroup) {
      const notFound = await recordNotFound("User");
      return res.status(notFound.status).json({ message: notFound });
    }

    const groupMembers = await GroupMember.find({
      group: req.params.groupId,
    });

    if (groupMembers.length) {
      const getAdminGroup = groupMembers.find((member: any) => member.admin);

      if (!getAdminGroup) {
        await GroupMember.findOneAndUpdate(
          { user: groupMembers[0].user, group: req.params.groupId },
          {
            $set: { admin: true },
          },
          { new: true, upsert: true }
        );
      }
    }

    req.body.sender = req.user;
    req.body.group = req.params.groupId;
    req.body.type = "action";
    req.body.isGroup = true;

    await addMessage(req.body);
    res.status(200).json({ existFromGroup });
  } catch (error) {
    next(error);
  }
};

/**
 * Assign group admin
 */
export const assignGroupAdmin: RequestHandler = async (req: any, res, next) => {
  try {
    const makeUserAdmin = await GroupMember.findOneAndUpdate(
      { user: req.params.userId, group: req.params.groupId },
      {
        $set: { admin: true },
      },
      { new: true }
    );

    if (!makeUserAdmin) {
      const notFound = await recordNotFound("User");
      return res.status(notFound.status).json({ message: notFound });
    }

    req.body.sender = req.user;
    req.body.group = req.params.groupId;
    req.body.type = "action";
    req.body.isGroup = true;

    await addMessage(req.body);

    res.status(200).json({ makeUserAdmin });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove user from group
 */
export const removeUserFromGroup: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    const deleteContactUser = await UserContact.findOneAndUpdate(
      { user: req.params.userId },
      {
        $pull: {
          users: { user: req.params.userId, group: req.params.groupId },
        },
      },
      { new: true }
    );

    if (!deleteContactUser) {
      const notFound = await recordNotFound("User");
      return res.status(notFound.status).json({ message: notFound });
    }

    const existFromGroup = await GroupMember.findOneAndDelete({
      user: req.params.userId,
      group: req.params.groupId,
    });

    if (!existFromGroup) {
      const notFound = await recordNotFound("User");
      return res.status(notFound.status).json({ message: notFound });
    }

    const groupMembers = await GroupMember.find({
      group: req.params.groupId,
    });

    if (groupMembers.length) {
      const getAdminGroup = groupMembers.find(
        (member: { admin: boolean }) => member.admin
      );

      if (!getAdminGroup) {
        await GroupMember.findOneAndUpdate(
          { user: groupMembers[0].user, group: req.params.groupId },
          {
            $set: { admin: true },
          },
          { new: true, upsert: true }
        );
      }
    }

    req.body.sender = req.user;
    req.body.group = req.params.groupId;
    req.body.type = "action";
    req.body.isGroup = true;

    await addMessage(req.body);

    res.status(200).json({ existFromGroup });
  } catch (error) {
    next(error);
  }
};

const addMessage = async (body: any) => {
  const newMessage = new Message(body);
  await newMessage.save();
};
