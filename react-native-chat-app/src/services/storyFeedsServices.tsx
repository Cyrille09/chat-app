import axiosInterceptors from "../lib/axiosInterceptors";

/**
 * Send story feed  service
 */
export async function sendStoryFeed(message: string) {
  return await axiosInterceptors.post(`/storyFeeds/send`, {
    message,
  });
}

export async function sendStoryFeedImageOrVideo(data: {}) {
  return await axiosInterceptors.post(`/storyFeeds/send/image`, data, {
    headers: { multipartFormData: "multipart/form-data" },
  });
}

/**
 * Get story feed messages
 */
export async function getContactUserStoryFeeds() {
  return await axiosInterceptors.get(`/storyFeeds/display`, {});
}

/**
 * Delete story feed service
 */
export async function deleteContactUserStoryFeed(id: string) {
  return await axiosInterceptors.remove(`/storyFeeds/${id}`, {});
}
