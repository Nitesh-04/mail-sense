"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { getMiscMails } from "./_actions/actions";

type Email = {
  id: string;
  sender: string;
  subject: string;
  body: string | null;
  summary: string;
  receivedAt: Date;
  category: string;
};

export default function MailPage() {
  const { user } = useUser();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const syncAndFetchEmails = async () => {
      setLoading(true);
      try {
        const syncResponse = await fetch("/api/fetch-mails");
        if (!syncResponse.ok) {
          throw new Error("Failed to sync emails with Gmail");
        }

        const fetchedEmails = await getMiscMails(user.id);
        setEmails(fetchedEmails);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while processing emails."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    syncAndFetchEmails();
  }, [user]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Emails</h1>

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

        {!loading && emails.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No emails found</p>
          </div>
        )}

        <div className="space-y-4">
          {emails.map((email) => (
            <div
              key={email.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  {email.subject}
                </h2>
                <span className="text-sm text-gray-500">
                  {formatDate(email.receivedAt)}
                </span>
              </div>

              <p className="text-gray-600 mb-2">
                <span className="font-medium">From:</span> {email.sender}
              </p>

              <div className="mt-4 text-gray-700">
                <p className="line-clamp-3">{email.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
