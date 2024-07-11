"use client";
import { homePage, signInPage } from "@/constants/routePath";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const UnauthenticatedLayout = ({
  user,
  children,
}: {
  user: {
    user: { name: string; photoUrl: string; email: string; status: string };
    children: React.ReactNode;
  };
  children: React.ReactNode;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (user?.user?.status === process.env.userActiveStatus) {
      router.push(homePage);
    }
  }, [user, router]);

  if (user?.user?.status === process.env.userActiveStatus) return null;

  return <div>{children}</div>;
};
