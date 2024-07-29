import { RequestHandler } from "express";
import UserContact from "../models/UserContact";
import Message from "../models/Message";
import mongoose from "mongoose";
import { recordNotFound } from "../errorMessages/errror";
import StoryFeed from "../models/StoryFeed";

/**
 * Get messages
 */
export const getMessages: RequestHandler = async (req: any, res, next) => {
  let query = {};

  try {
    const messages = await StoryFeed.find(query);

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

/**
 * Send story feed
 */
export const sendStoryFeed: RequestHandler = async (req: any, res, next) => {
  try {
    req.body.user = req.user;

    const newMessage = new StoryFeed(req.body);
    await newMessage.save();

    res.status(201).json({ user: req.user, message: newMessage });
  } catch (error) {
    next(error);
  }
};

/**
 * Send image
 */
export const sendStoryFeedImageOrVideo: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    req.body.user = req.user;
    req.body.message = req.file.filename;
    req.body.type = "image";

    const newMessage = new StoryFeed(req.body);
    await newMessage.save();

    res.status(201).json({ user: req.user, newMessage });
  } catch (error) {
    next(error);
  }
};

/**
 * Get contact user story feeds
 */
export const getContactUserStoryFeeds: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    const contactUsers: any = await UserContact.findOne({ user: req.user });
    const contactUsersList = contactUsers?.users?.map((user: any) => user.user);

    const storyFeeds = await StoryFeed.find({
      user: { $in: [...contactUsersList, req.user._id] },
    }).populate("user");

    const storyFeedsByUser = Object.values(
      storyFeeds.reduce((acc: any, item: any) => {
        if (!acc[item.user._id]) {
          acc[item.user._id] = { user: item.user, stories: [] };
        }
        acc[item.user._id].stories.push(item);
        return acc;
      }, {})
    );

    res.status(200).json(storyFeedsByUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete story feed
 */
export const deleteStoryFeed: RequestHandler = async (req: any, res, next) => {
  try {
    const deleteStoryFeed = await StoryFeed.deleteOne({ _id: req.params.id });
    if (!deleteStoryFeed) return next(recordNotFound("Story Feed"));

    res.status(200).json({ user: req.user, deleteStoryFeed });
  } catch (error) {
    next(error);
  }
};
