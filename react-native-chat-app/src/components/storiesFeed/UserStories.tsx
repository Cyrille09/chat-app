import React, { useState, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { useDispatch } from "react-redux";
import storiesStyles from "./storiesStyles";
import { UserInterface } from "../globalTypes/GlobalTypes";
import { successStoryFeedUserStatusActions } from "@/src/redux-toolkit/reducers/actionsSlice";
import { Animated, View } from "react-native";

import Story from "./Story";

const UserStories = ({
  stories,
  onAllStoriesEnd,
  user,
}: {
  stories: [];
  onAllStoriesEnd: () => void;
  user: UserInterface;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const duration = 5000; // 5 seconds per story
  const dispatch = useDispatch();
  const [progressAnim, setProgressAnim] = useState(new Animated.Value(0));

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onAllStoriesEnd();
      dispatch(
        successStoryFeedUserStatusActions({ status: false, record: {} })
      );
    }
  }, [currentIndex, stories.length, onAllStoriesEnd, dispatch]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // To be reviewed
  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
  });

  useEffect(() => {
    setProgressAnim(new Animated.Value(0));
    const timer = setTimeout(() => {
      handleNext();
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, handleNext, duration]);

  return (
    <View
      // {...handlers}
      style={storiesStyles.userStories}
    >
      <Story
        story={stories[currentIndex]}
        duration={duration}
        onStoryEnd={handleNext}
        user={user}
        currentIndex={currentIndex}
        progressAnim={progressAnim}
      />
    </View>
  );
};

export default UserStories;
