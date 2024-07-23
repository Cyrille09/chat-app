import axiosInterceptors from "../lib/axiosInterceptors";

/**
 * Send message service
 */
export async function sendMessage(
  messageSend: {
    message: string;
    disappear: string | undefined;
    disappearTime: Date | undefined;
  },
  receiver: {}
) {
  return await axiosInterceptors.post(`/messages/send`, {
    message: messageSend.message,
    disappear: messageSend.disappear,
    disappearTime: messageSend.disappearTime,
    receiver,
  });
}

/**
 * Send group message service
 */
export async function sendGroupMessage(
  messageSend: {
    message: string;
    disappear: string | undefined;
    disappearTime: Date | undefined;
  },
  groupId: string
) {
  return await axiosInterceptors.post(`/messages/send/group`, {
    message: messageSend.message,
    disappear: messageSend.disappear,
    disappearTime: messageSend.disappearTime,
    groupId,
    isGroup: true,
  });
}

export async function sendImage(data: any) {
  return await axiosInterceptors.post(`/messages/send/image`, data, {
    headers: { multipartFormData: "multipart/form-data" },
  });
}

export async function sendAudio(data: any) {
  return await axiosInterceptors.post(`/messages/send/audio`, data, {
    headers: { multipartFormData: "multipart/form-data" },
  });
}

export async function sendGroupImage(data: any) {
  return await axiosInterceptors.post(`/messages/send/image/group`, data, {
    headers: { multipartFormData: "multipart/form-data" },
  });
}
export async function sendGroupAudio(data: any) {
  return await axiosInterceptors.post(`/messages/send/audio/group`, data, {
    headers: { multipartFormData: "multipart/form-data" },
  });
}

export async function sendDocument(data: any) {
  return await axiosInterceptors.post(`/messages/send/document`, data, {
    headers: { multipartFormData: "multipart/form-data" },
  });
}

export async function sendGroupDocument(data: any) {
  return await axiosInterceptors.post(`/messages/send/document/group`, data, {
    headers: { multipartFormData: "multipart/form-data" },
  });
}

/**
 * Get sender and receiver messages
 */
export async function getSenderAndReceiverMessages(secondUser: any) {
  return await axiosInterceptors.post(`/messages/display`, {
    secondUser,
  });
}

/**
 * Get group messages
 */
export async function getGroupMessages(groupId: string) {
  return await axiosInterceptors.get(`/messages/group/${groupId}`, {});
}

/**
 * Update message service
 */
export async function updateMessage(messageDetail: any, id: string) {
  return await axiosInterceptors.patch(`/messages/${id}`, {
    ...messageDetail,
  });
}

/**
 * Add star to the  message service
 */
export async function addStarToMessage(id: string) {
  return await axiosInterceptors.post(`/messages/star/${id}`, {});
}

/**
 * Add star to the  message service
 */
export async function removeStarToMessage(id: string) {
  return await axiosInterceptors.post(`/messages/unstar/${id}`, {});
}
