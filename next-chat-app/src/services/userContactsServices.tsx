import axiosInterceptors from "../lib/axiosInterceptors";

/**
 * Add contact user service
 */
export async function createUserContacts(userId: string) {
  try {
    const response = await axiosInterceptors.post(`/userContacts`, {
      user: userId,
    });

    return response;
  } catch (error) {}
}

/**
 * Block contact user service
 */
export async function blockUserContact(receiver: {}, status: boolean) {
  try {
    const response = await axiosInterceptors.post(`/userContacts/block`, {
      receiver,
      status,
    });

    return response;
  } catch (error) {}
}

/**
 * Clear user chat service
 */
export async function clearUserContactChat(receiver: {}) {
  try {
    const response = await axiosInterceptors.post(`/userContacts/clearchat`, {
      receiver,
    });

    return response;
  } catch (error) {}
}

/**
 * Mute contact user service
 */
export async function muteUserContact(receiver: {}, muteDate: Date) {
  try {
    const response = await axiosInterceptors.post(`/userContacts/mute`, {
      receiver,
      muteDate,
    });

    return response;
  } catch (error) {}
}

/**
 * View chat users service
 */
export async function getChatUsers(token?: string) {
  return await axiosInterceptors.get(`/users/chat`, {
    tokenFromServer: token,
  });
}

/**
 * View user contacts service
 */
export async function getUserContacts(token?: string) {
  return await axiosInterceptors.get(`/userContacts/list`, {
    tokenFromServer: token,
  });
}

/**
 * View request user contact service
 */
export async function getRequestUserContact(token?: string) {
  return await axiosInterceptors.get(`/userContacts/request`, {
    tokenFromServer: token,
  });
}

/**
 * Delete contact user service
 */
export async function deleteContactUser(id: string) {
  return await axiosInterceptors.remove(`/userContacts/${id}`, {});
}
