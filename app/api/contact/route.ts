import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

function getEmailTemplate({ title, body }: { title: string; body: string }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 500px; background-color: #000000; border-radius: 12px; color: #ffffff;">
              
              <!-- Header -->
              <tr>
                <td style="text-align: center; padding: 20px;">
                  <img src="https://www.darl.dev/_next/image?url=%2Fdark%2Flogo-long-dark.png&w=256&q=75" alt="Darl Logo" style="max-width: 180px; height: auto;" />
                </td>
              </tr>
              <tr>
                <td style="padding: 0 20px;">
                  <hr style="border: none; border-top: 1px solid #444; margin: 0 0 20px 0;" />
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 0 20px 20px 20px; font-size: 16px; line-height: 1.5; color: #ffffff;">
                  <h2 style="color: #ffffff; margin-top: 0;">${title}</h2>
                  ${body}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 20px; text-align: center; font-size: 14px; color: #bbbbbb;">
                  <p style="margin-bottom: 10px;">Connect with us:</p>
                  <p style="margin: 0;">
                    <a href="https://facebook.com/jedmatundan" style="color: #ffffff; text-decoration: none; margin: 0 8px;">Facebook</a> |
                    <a href="https://www.tiktok.com/@darl.dev" style="color: #ffffff; text-decoration: none; margin: 0 8px;">TikTok</a> |
                    <a href="https://linkedin.com/in/darljedmatundan" style="color: #ffffff; text-decoration: none; margin: 0 8px;">LinkedIn</a> |
                    <a href="https://github.com/darljed" style="color: #ffffff; text-decoration: none; margin: 0 8px;">GitHub</a>
                  </p>
                  <div style="margin-top: 15px;">
                    <img src="https://www.darl.dev/_next/image?url=%2Fdark%2Flogo-long-dark.png&w=256&q=75" alt="Darl Logo" style="max-width: 120px; height: auto;" />
                  </div>
                  <p style="margin-top: 10px; font-size: 12px; color: #777;">&copy; 2025 Darl. All rights reserved.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json()
    
    console.log('SMTP Config:', {
      host: process.env.NEXT_SMTP_HOST,
      port: process.env.NEXT_SMTP_PORT,
      user: process.env.NEXT_SMTP_USER ? 'SET' : 'NOT SET',
      pass: process.env.NEXT_SMTP_PASS ? 'SET' : 'NOT SET'
    })

    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_SMTP_HOST,
      port: parseInt(process.env.NEXT_SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.NEXT_SMTP_USER,
        pass: process.env.NEXT_SMTP_PASS,
      },
    })

    const recipients = process.env.NEXT_EMAIL_RECIPIENT?.split(',') || []

    // Send notification to admin
    await transporter.sendMail({
      from: process.env.NEXT_FROM_EMAIL,
      to: recipients,
      subject: 'New Contact Form Inquiry',
      html: getEmailTemplate({
        title: 'New Contact Form Inquiry',
        body: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #111; padding: 10px; border-radius: 8px;">${message}</p>
        `
      })
    });


    // Send confirmation to inquirer
    await transporter.sendMail({
      from: process.env.NEXT_FROM_EMAIL,
      to: email,
      subject: 'Thank you for your inquiry - Darl',
      html: getEmailTemplate({
        title: 'Thank you for contacting us!',
        body: `
          <p>Hi ${name},</p>
          <p>We have received your inquiry and will respond within 24 hours.</p>
          <p>Your message:</p>
          <p style="font-style: italic; background: #111; padding: 10px; border-radius: 8px;">${message}</p>
          <br>
          <p>Best regards,<br>Darl</p>
        `
      })
    });


    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ 
      error: 'Failed to send email', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}