"use client";

import React, { useState, useEffect } from 'react';
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Send, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DarkModeToggle from '../_components/DarkModeToggle';
import { Funnel_Display } from "next/font/google";

const funnel = Funnel_Display({ subsets: ["latin"], weight: ["600"] });

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatPage() {
  const { user } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: `Hello ${user?.fullName || 'there'}! How can I help you today?`, 
      sender: 'bot', 
      timestamp: new Date() 
    },
  ]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: "Thanks for your message! This is a simulated response.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-zinc-800 transition-colors duration-300">
      <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-500 p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className={`${funnel.className} text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600`}>
              MailSense
            </Link>
            <Link 
              href="/mail" 
              className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Mail</span>
            </Link>
          </div>
          <div className="flex items-center gap-10">
            <UserButton
                appearance={{ elements: { userButtonAvatarBox: "w-10 h-10" } }}
            />
            <DarkModeToggle />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-800 transition-colors duration-300">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-zinc-700 text-white'
                  : 'bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
              }`}
            >
              <p>{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-zinc-400 dark:text-zinc-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-zinc-400 dark:placeholder-zinc-500 transition-colors duration-300"
          />
          <Button 
            type="submit"
            className=" text-white rounded-lg px-4 py-2 transition-colors duration-300"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}