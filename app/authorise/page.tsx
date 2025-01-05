"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkUser } from "./_actions/actions";

export default function AccessPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    } else {
      checkUser(
        user.id,
        user.primaryEmailAddress?.emailAddress || "",
        user.fullName || ""
      );
    }
  }, [user, router]);

  const handleGmailAuth = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/gmail");
      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error starting Gmail OAuth process:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Connect Your Gmail Account</h1>
      <p className="text-center mb-8 text-gray-700">
        You need to authenticate with your Gmail account to fetch and categorize
        your emails.
      </p>
      <button
        onClick={handleGmailAuth}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition disabled:bg-gray-400"
      >
        {loading ? "Authenticating..." : "Authenticate with Gmail"}
      </button>
      <br/>
      <span className="font-bold">KINDLY USE THE SAME EMAIL ID AS REGISTERED WITH MAILSENSE</span>
    </div>
  );
}
