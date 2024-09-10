import React, { useEffect, useRef, useState } from "react";
import { parseISO, format, isToday, isYesterday } from "date-fns";
import { Animated, View } from "react-native";
import { Divider, Image, Text, Icon } from "@rneui/themed";
import storiesStyles from "./storiesStyles";

const Story = ({
  story,
  duration,
  onStoryEnd,
  user,
  currentIndex,
  progressAnim,
}: {
  story: { createdAt: string; type: string; message: string; url: string };
  duration: number;
  onStoryEnd: () => void;
  user: {
    user: {
      photoUrl: string;
      name: string;
    };
    stories: [];
  };
  currentIndex: number;
  progressAnim: any;
}) => {
  const videoRef: any = useRef(null);

  // useEffect(() => {
  //   if (story.type === "video") {
  //     videoRef.current.play();
  //   }

  //   const timer = setTimeout(() => {
  //     onStoryEnd();
  //   }, duration);

  //   return () => clearTimeout(timer);
  // }, [story, duration, onStoryEnd]);

  useEffect(() => {
    // Start the width animation
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [story, duration, onStoryEnd, progressAnim]);

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
  const widthInPercentage = 100 / user.stories.length;

  return (
    <View style={storiesStyles.container}>
      <Divider />
      <View style={storiesStyles.storyHeader}>
        <View style={storiesStyles.storyHeaderTop}>
          <View>
            {user.user?.photoUrl ? (
              <Image
                source={{
                  uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/profile/${user.user.photoUrl}`,
                }}
                alt={`profile`}
                width={50}
                height={50}
                containerStyle={storiesStyles.userStoryPic}
              />
            ) : (
              <Image
                source={{
                  uri: `https://via.placeholder.com/150`,
                }}
                alt={`profile`}
                width={50}
                height={50}
                containerStyle={storiesStyles.userStoryPic}
              />
            )}
          </View>

          <View style={storiesStyles.userStoryName}>
            <Text>{user.user.name}</Text>
            {/* <br /> */}
            <Text style={storiesStyles.userStoryTimestamp}>
              {dateCreated()}
            </Text>
          </View>
        </View>
      </View>
      <View style={storiesStyles.userStoryContainer}>
        {user.stories?.map((userStory: {}, index: number) => {
          return (
            <View
              style={[
                { width: `${widthInPercentage}%` },
                storiesStyles.userStoryList,
              ]}
              key={index}
            >
              {currentIndex === index ? (
                <View style={storiesStyles.progressBar}>
                  <Animated.View
                    style={[
                      storiesStyles.activeProgress,
                      {
                        width: progressAnim.interpolate({
                          inputRange: [0, 100],
                          outputRange: ["0%", "100%"],
                        }),
                      },
                    ]}
                  />
                </View>
              ) : (
                <View style={storiesStyles.progressBar}>
                  <View style={storiesStyles.progress} />
                </View>
              )}
            </View>
          );
        })}
      </View>
      {story.type === "image" && (
        <View>
          <Image
            source={{
              uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/stories/${story.message}`,
            }}
            alt="story"
            style={storiesStyles.storyImageVideo}
          />
        </View>
      )}
      {/* {story.type === "video" && (
        <video className="story-image-video" ref={videoRef} src={story.url} />
      )} */}
      {story.type === "text" && (
        <View style={storiesStyles.storyViewText}>
          <Text style={storiesStyles.storyText}>{story.message}</Text>
        </View>
      )}
    </View>
  );
};

export default Story;
