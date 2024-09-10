import ChatList from "@/components/chatList/ChatList";
import ChatArea from "@/components/chatArea/ChatArea";
import ContactInfo from "@/components/contactInfo/ContactInfo";

import styles from "./page.module.css";
import { withAuthentication } from "@/services/usersServices";
import { cookies } from "next/headers";
import { LOCAL_STORAGE_USER_TOKEN } from "@/constants/defaultValues";
import { AuthLayout } from "@/components/layout/AuthLayout";
import {
  getRequestUserContact,
  getUserContacts,
} from "@/services/userContactsServices";
import { UserInterface } from "@/components/globalTypes/GlobalTypes";

export default async function Home() {
  const cookieStore = cookies();
  const ctxArguments = {
    token: cookieStore.get(LOCAL_STORAGE_USER_TOKEN)?.value,
  };

  const data = await getData(ctxArguments as any);
  const { user, userContacts, requestUserContact } = data;

  return (
    <>
      <AuthLayout user={user}>
        <div className="mainContainer">
          <div className={styles.container}>
            <ChatList
              user={user}
              userContacts={userContacts}
              requestUserContact={requestUserContact}
            />
            <ChatArea user={user} />
            <ContactInfo user={user} userContacts={userContacts} />
          </div>
        </div>
      </AuthLayout>
    </>
  );
}

const getData = withAuthentication(async function (
  ctx: { token: string },
  user: { data: UserInterface }
) {
  const userContacts = await getUserContacts(ctx.token);
  const requestUserContact = await getRequestUserContact(ctx.token);

  try {
    return {
      user: user && user.data,
      userContacts: userContacts?.data?.users,
      requestUserContact: requestUserContact?.data,
    };
  } catch (error) {
    return {
      user,
      userContacts,
      requestUserContact,
      error: "error",
    };
  }
});
