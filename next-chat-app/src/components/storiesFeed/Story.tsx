import React, { useEffect, useRef } from "react";
import { parseISO, format, isToday, isYesterday } from "date-fns";
import Image from "next/image";
import "./stories.scss";

const Story = ({ story, duration, onStoryEnd, user, currentIndex }: any) => {
  const videoRef: any = useRef(null);

  useEffect(() => {
    if (story.type === "video") {
      videoRef.current.play();
    }

    const timer = setTimeout(() => {
      onStoryEnd();
    }, duration);

    return () => clearTimeout(timer);
  }, [story, duration, onStoryEnd]);

  const dateCreated = () => {
    const date = parseISO(story.createdAt);
    if (isToday(date)) {
      return `Today at ${format(date, "HH:mm")}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, "HH:mm")}`;
    } else {
      return `${format(date, "EEEE")} at ${format(date, "HH:mm")}`;
    }
  };

  return (
    <div className="story">
      <hr />
      <div className="story-header">
        <div className="story-header-top">
          <div>
            {user.user?.photoUrl ? (
              <Image
                src={`${process.env.baseUrl}/images/profile/${user.user.photoUrl}`}
                alt={`profile`}
                className="user-story-pic"
                width={50}
                height={50}
              />
            ) : (
              <Image
                src={"https://via.placeholder.com/150"}
                alt={`profile`}
                width={50}
                height={50}
                className="user-story-pic"
              />
            )}
          </div>

          <div className="user-story-name">
            <span>{user.user.name}</span> <br />
            <span className="user-story-timestamp">{dateCreated()}</span>
          </div>
        </div>
      </div>
      <div className="userStoryContainer">
        {user.stories.map((userStory: any, index: number) => {
          return (
            <div className="userStoryList" key={index}>
              {currentIndex === index ? (
                <div className="progress-bar">
                  <div
                    className="active-progress"
                    style={{ animationDuration: `${duration}ms` }}
                  />
                </div>
              ) : (
                <div className="progress-bar">
                  <div className="progress" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {story.type === "image" && (
        <img
          className="story-image-video"
          src={`${process.env.baseUrl}/images/stories/${story.message}`}
          alt="story"
        />
      )}
      {story.type === "video" && (
        <video className="story-image-video" ref={videoRef} src={story.url} />
      )}
      {story.type === "text" && <p className="story-text">{story.message}</p>}
    </div>
  );
};

export default Story;
