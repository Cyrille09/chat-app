import { cookies } from "next/headers";

// style components
import { withUser } from "@/services/usersServices";
import { LOCAL_STORAGE_USER_TOKEN } from "@/constants/defaultValues";
import { Metadata } from "next";
import { signUpPage } from "@/constants/routePath";
import SignUpPage from "@/components/users/sign-up/SignUpPage";
import { UnauthenticatedLayout } from "@/components/layout/UnauthenticatedLayout";
import { UserInterface } from "@/components/globalTypes/GlobalTypes";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign up",
  alternates: {
    canonical: `${signUpPage}`,
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default async function SignUp() {
  const cookieStore = cookies();
  const ctxArguments = {
    token: cookieStore.get(LOCAL_STORAGE_USER_TOKEN)?.value,
  };

  const data = await getData(ctxArguments as any);

  const { user } = data;

  return (
    <>
      <UnauthenticatedLayout user={user}>
        <SignUpPage />
      </UnauthenticatedLayout>
    </>
  );
}
const getData = withUser(async function (
  ctx: { token: string },
  user: { data: UserInterface }
) {
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
