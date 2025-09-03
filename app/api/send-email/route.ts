import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Email template for better formatting
const createEmailTemplate = (
  email: string,
  subject: string,
  message: string
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #06b6d4); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #374151; margin-bottom: 8px; display: block; }
          .value { background: white; padding: 15px; border-radius: 6px; border: 1px solid #d1d5db; }
          .message-box { min-height: 120px; white-space: pre-wrap; }
          .footer { background: #374151; color: #9ca3af; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">From Email:</span>
            <div class="value">${email}</div>
          </div>
          <div class="field">
            <span class="label">Subject:</span>
            <div class="value">${subject}</div>
          </div>
          <div class="field">
            <span class="label">Message:</span>
            <div class="value message-box">${message}</div>
          </div>
          <div class="field">
            <span class="label">Submitted:</span>
            <div class="value">${new Date().toLocaleString()}</div>
          </div>
        </div>
        <div class="footer">
          This message was sent from your website contact form.
        </div>
      </body>
    </html>
  `;
};

export async function POST(req: Request) {
  try {
    const { to, subject, text, html, senderEmail, senderName } =
      await req.json();

    // Validate required fields
    if (!subject || !text) {
      return NextResponse.json(
        { message: "Subject and message are required" },
        { status: 400 }
      );
    }

    // Validate environment variables
    const requiredEnvVars = [
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_USER",
      "SMTP_PASS",
      "FROM_EMAIL",
    ];
    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      console.error("Missing environment variables:", missingVars);
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create transporter with better error handling
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Add these for better reliability
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
    });

    // Verify connection
    await transporter.verify();

    // Determine recipient - use provided 'to' or default to a support email
    const recipient = to || process.env.SUPPORT_EMAIL || process.env.FROM_EMAIL;
    const recipient2 = process.env.SUPPORT_EMAIL2;
    // Create email content
    const emailSubject = senderEmail
      ? `Contact Form: ${subject} (from ${senderEmail})`
      : `Contact Form: ${subject}`;

    const emailHtml =
      html || createEmailTemplate(senderEmail || "Anonymous", subject, text);

    const emailText = senderEmail
      ? `Contact form submission from: ${senderEmail}\n\nSubject: ${subject}\n\nMessage:\n${text}\n\nSubmitted: ${new Date().toLocaleString()}`
      : `Contact form submission\n\nSubject: ${subject}\n\nMessage:\n${text}\n\nSubmitted: ${new Date().toLocaleString()}`;

    // Send email
    const info = await transporter.sendMail({
      from: `"${senderName || "Website Contact Form"}" <${
        process.env.FROM_EMAIL
      }>`,
      to: recipient,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
      // Add reply-to if sender email is provided
      ...(senderEmail && { replyTo: senderEmail }),
    });

    // Optionally send a copy to a second recipient
    if (recipient2) {
      await transporter.sendMail({
        from: `"${senderName || "Website Contact Form"}" <${
          process.env.FROM_EMAIL
        }>`,
        to: recipient2,
        subject: `Copy of: ${emailSubject}`,
        text: emailText,
        html: emailHtml,
        // Add reply-to if sender email is provided
        ...(senderEmail && { replyTo: senderEmail }),
      });
    }

    console.log("Email sent successfully:", {
      messageId: info.messageId,
      recipient,
      subject: emailSubject,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: "Email sent successfully",
        messageId: info.messageId,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Email send error:", {
      error: error.message,
      code: error.code,
      command: error.command,
      timestamp: new Date().toISOString(),
    });

    // Provide more specific error messages
    let errorMessage = "Failed to send email";
    if (error.code === "EAUTH") {
      errorMessage = "Email authentication failed";
    } else if (error.code === "ECONNECTION") {
      errorMessage = "Failed to connect to email server";
    } else if (error.code === "ETIMEDOUT") {
      errorMessage = "Email server timeout";
    }

    return NextResponse.json(
      {
        message: errorMessage,
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
