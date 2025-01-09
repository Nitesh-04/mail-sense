"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkUser } from "./_actions/actions";
import Link from "next/link";

export default function AccessPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check-token");
        
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          return;
        }

        if (data.hasToken) {
          
          router.push('/mail');
        } else {
          await checkUser(
            user.id,
            user.primaryEmailAddress?.emailAddress || "",
            user.fullName || ""
          );
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setError("Failed to validate authentication status");
      }
    };

    checkAuth();
  }, [user, router]);

  const handleGmailAuth = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth/gmail");
      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error starting Gmail OAuth process:", error);
      setError("Failed to start authentication process");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Connect Your Gmail Account</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
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
      
      <p className="text-black font-bold text-lg mt-10 border-2 border-blue-600 rounded-md p-2">
        <Link href={"/chat"}>Chat</Link>
      </p>
    </div>
  );
}