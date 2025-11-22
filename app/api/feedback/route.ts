import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, subject, message } = body;

    // Validate required fields
    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: "Email, subject, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Get email configuration from environment
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
    const smtpPass = process.env.EMAIL_APP_PASSWORD || process.env.SMTP_PASS;
    const adminEmail = "paulsemz17@gmail.com";

    if (!smtpUser || !smtpPass) {
      console.error("Email credentials not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send email to admin
    await transporter.sendMail({
      from: `"Alchemist AI Feedback" <${smtpUser}>`,
      to: adminEmail,
      replyTo: email,
      subject: `[Feedback] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9fafb;
              }
              .header {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                text-align: center;
              }
              .content {
                background: white;
                padding: 30px;
                border-radius: 0 0 8px 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .label {
                font-weight: bold;
                color: #10b981;
                margin-top: 15px;
                margin-bottom: 5px;
              }
              .value {
                padding: 10px;
                background: #f3f4f6;
                border-radius: 4px;
                border-left: 3px solid #10b981;
              }
              .message-box {
                padding: 15px;
                background: #f9fafb;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                margin-top: 10px;
                white-space: pre-wrap;
              }
              .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🌿 Alchemist AI Feedback</h1>
              </div>
              <div class="content">
                <p>You have received new feedback from a user:</p>
                
                <div class="label">From:</div>
                <div class="value">${email}</div>
                
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
                
                <div class="label">Message:</div>
                <div class="message-box">${message.replace(/\n/g, "<br>")}</div>
                
                <div class="footer">
                  <p>Reply directly to this email to respond to the user.</p>
                  <p>Sent from Alchemist AI Feedback System</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Feedback Received

From: ${email}
Subject: ${subject}

Message:
${message}

---
Reply directly to this email to respond to the user.
Sent from Alchemist AI Feedback System
      `,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: `"Alchemist AI" <${smtpUser}>`,
      to: email,
      subject: "We received your feedback - Alchemist AI",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9fafb;
              }
              .header {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 30px;
                border-radius: 8px 8px 0 0;
                text-align: center;
              }
              .content {
                background: white;
                padding: 30px;
                border-radius: 0 0 8px 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background: #10b981;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin-top: 20px;
              }
              .footer {
                margin-top: 30px;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Thank You! 🌿</h1>
              </div>
              <div class="content">
                <h2>We received your feedback</h2>
                <p>Dear user,</p>
                <p>Thank you for taking the time to share your feedback with us. We truly appreciate your input and will review your message carefully.</p>
                
                <p><strong>Your feedback summary:</strong></p>
                <p style="background: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 3px solid #10b981;">
                  <strong>Subject:</strong> ${subject}
                </p>
                
                <p>Our team typically responds within 24 hours. If your feedback requires a response, we'll get back to you at <strong>${email}</strong>.</p>
                
                <div style="text-align: center;">
                  <a href="https://alchemist-ai-official.vercel.app" class="button">Visit Alchemist AI</a>
                </div>
                
                <div class="footer">
                  <p>Best regards,<br>The Alchemist AI Team</p>
                  <p style="margin-top: 20px; font-size: 12px;">
                    This is an automated confirmation. Please do not reply to this email.
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Failed to send feedback. Please try again later." },
      { status: 500 }
    );
  }
}
