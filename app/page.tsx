import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Funnel_Display } from "next/font/google";
import { Mail, MessageSquare, Inbox, Zap } from "lucide-react";
import FeatureCard from './_components/FeatureCard';

const funnel = Funnel_Display({ subsets: ["latin"], weight: ["600"] });

export default function Home() {
  
  return (
    <div className="min-h-screen relative w-full bg-gradient-to-br from-zinc-950 to-zinc-900 text-white">

      <div className="relative z-10 flex flex-col items-center px-4 pt-4">
        <div className="text-center">
          <p className={`${funnel.className} text-[40px] md:text-[80px] bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 animate-fade-in`}>
            MailSense
          </p>
          <p className={`${funnel.className} text-xl md:text-2xl text-blue-200 animate-fade-slide-up`}>
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

        <Button className={` ${funnel.className} mt-12 bg-gradient-to-r from-blue-600 to-purple-600 animate-fade-in text-white px-8 py-6 text-lg rounded-lg transition-all duration-300 hover:scale-105 mb-10 md:mb-0`}>
          <Link href={"/chat"}>Get Started</Link>
        </Button>
      </div>
    </div>
  );
};