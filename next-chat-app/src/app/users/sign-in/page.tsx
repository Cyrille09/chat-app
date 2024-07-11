import { cookies } from "next/headers";

// style components
import { withUser } from "@/services/usersServices";
import { LOCAL_STORAGE_USER_TOKEN } from "@/constants/defaultValues";
import { Metadata } from "next";
import { signInPage } from "@/constants/routePath";
import SignInPage from "@/components/users/sign-in/SignInPage";
import { UnauthenticatedLayout } from "@/components/layout/UnauthenticatedLayout";

export const metadata: Metadata = {
  title: "Sing in",
  description: "Sign in",
  alternates: {
    canonical: `${signInPage}`,
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default async function SignIn() {
  const cookieStore = cookies();
  const ctxArguments = {
    token: cookieStore.get(LOCAL_STORAGE_USER_TOKEN)?.value,
  };

  const data = await getData(ctxArguments);

  const { user } = data;

  return (
    <>
      <UnauthenticatedLayout user={user}>
        <SignInPage />
      </UnauthenticatedLayout>
    </>
  );
}

const getData = withUser(async function (ctx: any, user: any) {
  try {
    return {
      user: user && user.data,
    };
  } catch (error) {
    return {
      user,
      error: "error",
    };
  }
});
