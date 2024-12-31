"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { checkUser } from "./_actions/actions";
import { useEffect } from "react";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    } else {
      checkUser(
        user.id,
        user.primaryEmailAddress?.emailAddress || '',
        user.fullName || ''
      );
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Chat</h1>
      <h1>{user.id}</h1>
      <h1>{user.primaryEmailAddress?.emailAddress}</h1>
      <h1>{user.fullName}</h1>
    </div>
  );
}
