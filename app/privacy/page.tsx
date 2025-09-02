"use client"

import { getBlogName } from "../../lib/blog-config"

export default function PrivacyPage() {
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <h2>1. Information We Collect</h2>
        <p>
          We only collect the information you provide directly to us, such as your name, email address, and other contact details when you reach out for inquiries, consultations, or to use our services.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the collected contact details solely to:
        </p>
        <ul>
          <li>Respond to your inquiries and provide requested services</li>
          <li>Communicate with you regarding your projects or consultations</li>
          <li>Send important service updates or notifications related to your requests</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          We do not sell, trade, or share your personal information with third parties without your consent, except when required by law or to comply with legal obligations.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate security measures to safeguard your personal information against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2>5. Cookies</h2>
        <p>
          We may use basic cookies to enhance user experience and improve our website functionality. You can manage or disable cookies through your browser settings.
        </p>

        <h2>6. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. Any updates will be posted on this page, and the revised date will be updated accordingly.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or how we handle your data, please contact us at inquiry@bitslytech.com.
        </p>
      </div>
    </div>
  )
}
