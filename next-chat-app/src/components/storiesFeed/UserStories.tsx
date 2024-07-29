import React, { useState, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { useDispatch } from "react-redux";

import Story from "./Story";
import { successStoryFeedUserStatusActions } from "@/redux-toolkit/reducers/actionsSlice";
import "./stories.scss";

const UserStories = ({ stories, onAllStoriesEnd, user }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const duration = 5000; // 5 seconds per story
  const dispatch = useDispatch();

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onAllStoriesEnd();
      dispatch(
        successStoryFeedUserStatusActions({ status: false, record: {} })
      );
    }
  }, [currentIndex, stories.length, onAllStoriesEnd]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, handleNext, duration]);

  return (
    <div {...handlers} className="user-stories">
      <Story
        story={stories[currentIndex]}
        duration={duration}
        onStoryEnd={handleNext}
        user={user}
        currentIndex={currentIndex}
      />
    </div>
  );
};

export default UserStories;
