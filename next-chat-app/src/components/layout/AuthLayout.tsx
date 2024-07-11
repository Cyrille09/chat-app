"use client";
import { signInPage } from "@/constants/routePath";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const AuthLayout = ({
  user,
  children,
}: {
  user: {
    user: { name: string; photoUrl: string; email: string; status: string };
  };
  children: React.ReactNode;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push(signInPage);
    }
  }, [user, router]);

  if (!user) return null;

  return <div>{children}</div>;
};
