"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkUser } from "./_actions/actions";
import Link from "next/link";
import { Mail, MessageSquare, Loader2 } from "lucide-react";
import { Funnel_Display } from "next/font/google";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "../_components/DarkModeToggle";

const funnel = Funnel_Display({ subsets: ["latin"], weight: ["600"] });

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

    async function checkAuth() {
      try {
        if(user) {
          await checkUser(
            user.id,
            user.primaryEmailAddress?.emailAddress || "",
            user.fullName || ""
          );
        }
        }  catch (error) {
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
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className={`${funnel.className} text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600`}>
            MailSense
          </Link>
          <DarkModeToggle />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="space-y-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="space-y-4">
            <h1 className={`${funnel.className} text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600`}>
              Connect Your Gmail Account
            </h1>
            
            <p className="text-zinc-600 dark:text-zinc-400 mx-auto">
              You need to authenticate with your Gmail account to fetch your emails.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              Please use the same email address that you registered with MailSense
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleGmailAuth}
              disabled={loading}
              className="w-full max-w-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Authenticate with Gmail"
              )}
            </Button>
            <br/>
            <Link 
              href="/mail"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              Go to Mail
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}