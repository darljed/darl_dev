"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, LineChart, Database, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function DataAnalyticsSection() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Data Analytics Dashboard
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
          Turn your raw data into actionable insights with our intuitive and powerful analytics dashboards.
          Make informed decisions faster with real-time data visualization.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6">
              <BarChart3 className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-Time Insights</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Get real-time analytics and key metrics at your fingertips, anytime you need them.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6">
              <LineChart className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interactive Visuals</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Explore your data with interactive charts, graphs, and detailed drill-downs.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Database className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data Integration</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Connect with multiple data sources and consolidate your analytics in one place.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6">
              <ShieldCheck className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Compliant</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Protect your data with enterprise-level security and compliance standards.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Link href="#contact">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl">
            Book a Consultation
          </Button>
        </Link>
      </div>
    </section>
  );
}