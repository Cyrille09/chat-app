import axiosInterceptors from "../lib/axiosInterceptors";

/**
 * Send message service
 */
export async function createGroup(name: string, groupMembers: []) {
  return await axiosInterceptors.post(`/groups`, {
    name,
    groupMembers,
  });
}

/**
 * Get group members
 */
export async function getGroupMmebers(id: string) {
  return await axiosInterceptors.get(`/groups/members/${id}`, {});
}

export async function sendImage(data: any) {
  return await axiosInterceptors.post(`/messages/send/image`, data, {
    headers: { multipartFormData: "multipart/form-data" },
  });
}

export async function sendDocument(data: any) {
  return await axiosInterceptors.post(`/messages/send/document`, data, {
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
 * Update group service
 */
export async function updateGroup(groupDetail: any, id: string) {
  return await axiosInterceptors.patch(`/groups/${id}`, {
    ...groupDetail,
  });
}

/**
 * Update group service
 */
export async function updateGroupMembers(
  members: any,
  id: string,
  message: string
) {
  return await axiosInterceptors.patch(`/groups/members/${id}`, {
    members,
    message,
  });
}

/**
 * Update group image service
 */
export async function updateGroupProfileImage(data: any, id: string) {
  return await axiosInterceptors.put(`/groups/photo/${id}`, data, {
    headers: { multipartFormData: "multipart/form-data" },
  });
}

export async function deleteGroupPhoto(id: string) {
  return await axiosInterceptors.remove(`/groups/photo/${id}`);
}

/**
 * Exist from the group
 */
export async function exitFromGroupContact(
  contactId: string,
  groupId: string,
  message: string
) {
  return await axiosInterceptors.post(`/groups/exist/${contactId}/${groupId}`, {
    message,
  });
}

/**
 * Mute group
 */
export async function muteGroupContact(contactId: string, muteDate: Date) {
  return await axiosInterceptors.post(`/groups/mute/${contactId}`, {
    muteDate,
  });
}

/**
 * Assign group admin
 */
export async function assignGroupAdmin(
  groupId: string,
  userId: string,
  message: string
) {
  return await axiosInterceptors.post(`/groups/admin/${groupId}/${userId}`, {
    message,
  });
}

/**
 * Remove user from group
 */
export async function removeUserFromGroup(
  groupId: string,
  userId: string,
  message: string
) {
  return await axiosInterceptors.post(`/groups/remove/${groupId}/${userId}`, {
    message,
  });
}
