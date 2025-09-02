"use client";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { MessageSquare, Cpu, Zap, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AIChatbotSection() {
  return (
    <>
    <div style={{ backgroundImage: 'url(/products/ai-chat-bot.jpg)'}} className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg mb-8 bg-cover bg-center bg-no-repeat">
    </div>
    <section className="w-full py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          AI Chatbot Platform
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
          Elevate your customer experience with an AI-powered chatbot designed for smarter,
          faster, and personalized interactions. Built for businesses that want to deliver
          24/7 support with a human-like touch.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6">
              <MessageSquare className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Conversational AI</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Engage users with human-like conversations powered by advanced language models.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Cpu className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Fact-Checking</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Integrated RAG technology ensures accurate, data-driven responses every time.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Instant Support</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Provide round-the-clock customer assistance without delays or human bottlenecks.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Globe className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Scalable & Secure</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Designed for businesses of all sizes, ensuring security and scalability.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Link href="#contact">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl">
            Book a Consultation
          </Button>
        </Link>
      </div>
    </section>
    </>
  );
}