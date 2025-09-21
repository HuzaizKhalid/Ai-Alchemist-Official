import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    console.log('=== CONTACT FORM SUBMISSION ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Admin Email: paulsemz17@gmail.com');
    console.log('===============================');

    // Create email transporter using your Gmail credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // shahhaseebahmadkhan9@gmail.com
        pass: process.env.EMAIL_APP_PASSWORD, // hokqbosxqflhvzzg
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'paulsemz17@gmail.com', // Admin email
      subject: `Contact Form: ${subject} - Alchemist AI`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #06b6d4, #8b5cf6); padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">💬 New Contact Form Message</h1>
            <p style="color: #e0f2fe; margin: 5px 0 0 0;">From your Alchemist AI website</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="margin-bottom: 20px;">
              <h3 style="color: #1e293b; margin: 0 0 10px 0;">Contact Information</h3>
              <p style="margin: 5px 0; color: #475569;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 5px 0; color: #475569;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0; color: #475569;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 5px 0; color: #475569;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #1e293b; margin: 0 0 10px 0;">Message</h3>
              <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; border-left: 4px solid #06b6d4;">
                <p style="margin: 0; color: #334155; line-height: 1.6;">${message}</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                Reply directly to this email to respond to ${name}
              </p>
            </div>
          </div>
        </div>
      `,
      replyTo: email, // This allows you to reply directly to the user
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to paulsemz17@gmail.com from ${name}`);

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
  }
}