import axiosInterceptors from "../lib/axiosInterceptors";

/**
 * Send message service
 */
export async function sendMessage(message: string, receiver: {}) {
  return await axiosInterceptors.post(`/messages/send`, {
    message,
    receiver,
  });
}

/**
 * Send group message service
 */
export async function sendGroupMessage(message: string, groupId: string) {
  return await axiosInterceptors.post(`/messages/send/group`, {
    message,
    groupId,
    isGroup: true,
  });
}

export async function sendImage(data: any) {
  return await axiosInterceptors.post(`/messages/send/image`, data, {
    headers: { multipartFormData: "multipart/form-data" },
  });
}

export async function sendGroupImage(data: any) {
  return await axiosInterceptors.post(`/messages/send/image/group`, data, {
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
