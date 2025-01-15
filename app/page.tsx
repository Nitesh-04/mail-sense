'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Funnel_Display } from "next/font/google";
import { Mail, MessageSquare, Inbox, Zap } from "lucide-react";
import FeatureCard from './_components/FeatureCard';
import DarkModeToggle from './_components/DarkModeToggle';

const funnel = Funnel_Display({ subsets: ["latin"], weight: ["600"] });

export default function Home() {
  return (
    <div className="min-h-screen relative w-full bg-gray-100 dark:bg-gradient-to-br dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-white transition-colors duration-300">
      <div className="absolute top-4 right-4 z-20">
        <DarkModeToggle />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 pt-6">
        <div className="text-center">
          <p className={`${funnel.className} text-[40px] md:text-[80px] bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600`}>
            MailSense
          </p>
          <p className={`${funnel.className} text-xl md:text-2xl text-blue-600 dark:text-blue-200`}>
            Your Emails, Reinvented.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mt-16 px-4">
          <div className="space-y-6">
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="Chat with your emails"
              description="Natural language interaction with your inbox"
            />
            <FeatureCard
              icon={<Inbox className="w-6 h-6" />}
              title="Smart Organization"
              description="Automated categorization and filtering"
            />
          </div>
          <div className="space-y-6">
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Instant Responses"
              description="AI-powered quick replies and suggestions"
            />
            <FeatureCard
              icon={<Mail className="w-6 h-6" />}
              title="Email Clarity"
              description="Turn email chaos into structured communication"
            />
          </div>
        </div>

        <Button className={`${funnel.className} mt-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-400 dark:hover:to-purple-400 animate-fade-in dark:text-white px-8 py-6 text-lg rounded-lg transition-all duration-300 hover:scale-105 mb-10 md:mb-0`}>
          <Link href={"/chat"}>Get Started</Link>
        </Button>
      </div>
    </div>
  );
};