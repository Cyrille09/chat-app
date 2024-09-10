import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_STORAGE_USER_TOKEN } from "../constants/defaultValues";

/**
 * Store async local storage for user token
 */
export async function storeTokenInLocalStorage(token: string) {
  try {
    await AsyncStorage.setItem(LOCAL_STORAGE_USER_TOKEN, token);
  } catch (error: any) {
    throw new Error(error);
  }
}

/**
 * Get async local storage for user token
 */
export async function getTokenFromLocalStorage() {
  try {
    return await AsyncStorage.getItem(LOCAL_STORAGE_USER_TOKEN);
  } catch (error: any) {
    throw new Error(error);
  }
}
