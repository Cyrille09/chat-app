import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux-toolkit/store";
import { getTokenFromLocalStorage } from "../lib/asyncStorage";
import { loginSuccess } from "../redux-toolkit/reducers/authSlice";
import { Spinner } from "../components/spinner/Spinner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile } from "../services/usersServices";
import { currentUserRecord } from "../redux-toolkit/reducers/usersSlice";
import { getUserContacts } from "../services/userContactsServices";
import { userContactsRecord } from "../redux-toolkit/reducers/userContactsSlice";

export function AuthReduxProvider({ children }: React.PropsWithChildren) {
  const authSlice = useSelector((state: RootState) => state.authSlice);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  const router = useRouter();

  let token: string | null = "";

  useEffect(() => {
    let isSubscribed = true;

    async function getToken() {
      if (isSubscribed) {
        token = await getTokenFromLocalStorage();
      }

      if (authSlice.token && isSubscribed) {
        await userContactData();
        await getUserProfileData();
      } else if (token && isSubscribed) {
        dispatch(loginSuccess({ token: token }));
        await userContactData();
        await getUserProfileData();
      } else {
        logoutData();
      }
    }
    const getUserProfileData = async () => {
      const user = await getUserProfile();
      if (user?.data?.user) {
        dispatch(currentUserRecord(user.data));
        setIsLoading(false);
        router.replace("/(tabs)");
      } else {
        logoutData();
      }
    };

    const userContactData = async () => {
      const userContact = await getUserContacts("");
      if (userContact.data?.users?.length) {
        dispatch(userContactsRecord(userContact.data.users));
      }
    };

    const logoutData = async () => {
      await AsyncStorage.clear();
      dispatch(loginSuccess({ token: "" }));
      setIsLoading(false);
      router.navigate("/sign-in");
    };

    getToken();

    return () => {
      isSubscribed = false;
    };
  }, [authSlice.token, isLoading]);

  if (isLoading) {
    return <Spinner visible={isLoading} textContent={"Loading..."} />;
  }

  return <>{children}</>;
}
