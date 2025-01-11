"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useCallback } from "react";
import { getAcademicMails, getCdcMails, getEventsMails, getHostelMails, getMiscMails } from "./_actions/actions";
import { redirect } from "next/navigation";
import { Email } from "@/lib/types";
import RenderMails from "./_components/RenderMails";

type EmailCategories = {
  academic: Email[];
  cdc: Email[];
  events: Email[];
  hostel: Email[];
  misc: Email[];
};

export default function MailPage() {
  const { user } = useUser();
  const [emails, setEmails] = useState<EmailCategories>({
    academic: [],
    cdc: [],
    events: [],
    hostel: [],
    misc: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllEmails = useCallback(async (userId: string) => {
    try {
      const [academic, cdc, events, hostel, misc] = await Promise.all([
        getAcademicMails(userId),
        getCdcMails(userId),
        getEventsMails(userId),
        getHostelMails(userId),
        getMiscMails(userId),
      ]);

      setEmails({
        academic,
        cdc,
        events,
        hostel,
        misc,
      });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to fetch emails");
    }
  }, []);

  useEffect(() => {
    if (!user) {
      redirect("/sign-in");
      return;
    }

    const userId = user.id;
    if (!userId) return;

    fetchAllEmails(userId).catch((err) => {
      setError(err.message);
      console.error("Error fetching emails:", err);
    });
  }, [user, fetchAllEmails]);

  async function syncAndFetchEmails() {
    if (!user?.id) return;
    
    setLoading(true);
    setError("");

    try {
      const syncResponse = await fetch("/api/fetch-mails");
      if (!syncResponse.ok) {
        throw new Error("Failed to sync emails with Gmail");
      }

      await fetchAllEmails(user.id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing emails."
      );
      console.error("Error syncing emails:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Emails</h1>
        <button 
          onClick={syncAndFetchEmails} 
          disabled={loading}
        >
          Fetch Mails
        </button>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-600">Loading emails...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
         <RenderMails emailCategories={emails} />

        <button 
          onClick={syncAndFetchEmails}
          disabled={loading}
        >
          Fetch Mails
        </button>
      </div>
    </div>
  );
}