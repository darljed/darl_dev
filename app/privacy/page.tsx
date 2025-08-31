"use client"

import { getBlogName } from "@/lib/blog-config"

export default function PrivacyPage() {
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, write a {getBlogName().toLowerCase()} post, or contact us for support.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send technical notices and support messages</li>
          <li>Communicate with you about products, services, and events</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2>5. Cookies</h2>
        <p>
          We use cookies and similar technologies to enhance your experience on our application. You can control cookies through your browser settings.
        </p>

        <h2>6. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at admin@example.com.
        </p>
      </div>
    </div>
  )
}