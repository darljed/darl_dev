"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Workflow, TrendingUp, Clock, Lock } from "lucide-react";
import Link from "next/link";

export function BusinessAutomationSection() {
  return (
    <>
    <div style={{ backgroundImage: 'url(/products/business-suite.webp)'}} className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg mb-8 bg-cover bg-center bg-no-repeat">
    </div>
    <section className="w-full py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Business Automation Suite
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
          Optimize your workflows, eliminate manual tasks, and boost productivity with our
          cutting-edge automation tools. Designed for growing businesses ready to scale.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Workflow className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Workflows</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Automate repetitive tasks and streamline operations with intelligent workflows.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6">
              <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Boost Efficiency</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Reduce overhead costs and maximize team productivity through automation.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Clock className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Free up hours every week by letting automation handle routine tasks for you.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Lock className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Ensure your automation processes run safely with enterprise-grade security.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Link href="#contact">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl">
            Book a Consultation
          </Button>
        </Link>
      </div>
    </section>
    </>
  );
}