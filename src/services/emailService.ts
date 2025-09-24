// @ts-nocheck
/**
 * Email Service Integration with n8n Workflow
 * Handles sending verification codes and other emails
 */

export interface EmailRequest {
  to: string;
  subject: string;
  body: string;
}

export interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class EmailService {
  private static readonly N8N_WEBHOOK_URL = 'https://n8n-k6lq.onrender.com/webhook/send-email';

  /**
   * Send email using n8n workflow
   */
  static async sendEmail(emailData: EmailRequest): Promise<EmailResponse> {
    try {
      console.log('Sending email via n8n:', { to: emailData.to, subject: emailData.subject });

      const response = await fetch(this.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);

      return {
        success: true,
        message: 'Email sent successfully'
      };

    } catch (error) {
      console.error('Failed to send email:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email'
      };
    }
  }

  /**
   * Send registration verification email
   */
  static async sendRegistrationVerification(
    email: string, 
    fullName: string, 
    verificationCode: string
  ): Promise<EmailResponse> {
    const subject = `Verify Your Email - Code: ${verificationCode}`;
    
    const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 30px; 
          text-align: center; 
          border-radius: 10px 10px 0 0; 
        }
        .content { 
          background: #f9f9f9; 
          padding: 30px; 
          border-radius: 0 0 10px 10px; 
        }
        .code-box { 
          background: white; 
          border: 2px dashed #667eea; 
          padding: 20px; 
          text-align: center; 
          margin: 20px 0; 
          border-radius: 8px; 
        }
        .verification-code { 
          font-size: 32px; 
          font-weight: bold; 
          color: #667eea; 
          letter-spacing: 8px; 
          font-family: monospace; 
        }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          color: #666; 
          font-size: 14px; 
        }
        .security-note { 
          background: #e8f4fd; 
          border-left: 4px solid #2196F3; 
          padding: 15px; 
          margin: 20px 0; 
          border-radius: 4px; 
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎤 DebateWorld AI</h1>
        <p>Verify Your Email Address</p>
      </div>
      
      <div class="content">
        <h2>Hello ${fullName || 'there'}!</h2>
        <p>Welcome to DebateWorld AI! To complete your registration, please verify your email address by entering the verification code below in the application.</p>
        
        <div class="code-box">
          <p><strong>Your Verification Code:</strong></p>
          <div class="verification-code">${verificationCode}</div>
        </div>
        
        <div class="security-note">
          <strong>🔒 Security Note:</strong> This code will expire in 15 minutes for your security. If you didn't request this verification, please ignore this email.
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <div class="footer">
          <p>© 2024 DebateWorld AI. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    return this.sendEmail({ to: email, subject, body });
  }

  /**
   * Send password reset verification email
   */
  static async sendPasswordResetVerification(
    email: string, 
    fullName: string, 
    verificationCode: string
  ): Promise<EmailResponse> {
    const subject = `Password Reset Code: ${verificationCode}`;
    
    const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
        }
        .header { 
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
          color: white; 
          padding: 30px; 
          text-align: center; 
          border-radius: 10px 10px 0 0; 
        }
        .content { 
          background: #f9f9f9; 
          padding: 30px; 
          border-radius: 0 0 10px 10px; 
        }
        .code-box { 
          background: white; 
          border: 2px dashed #ef4444; 
          padding: 20px; 
          text-align: center; 
          margin: 20px 0; 
          border-radius: 8px; 
        }
        .verification-code { 
          font-size: 32px; 
          font-weight: bold; 
          color: #ef4444; 
          letter-spacing: 8px; 
          font-family: monospace; 
        }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          color: #666; 
          font-size: 14px; 
        }
        .security-note { 
          background: #fee2e2; 
          border-left: 4px solid #ef4444; 
          padding: 15px; 
          margin: 20px 0; 
          border-radius: 4px; 
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔐 DebateWorld AI</h1>
        <p>Password Reset Request</p>
      </div>
      
      <div class="content">
        <h2>Hello ${fullName || 'there'}!</h2>
        <p>You have requested to reset your password for your DebateWorld AI account. Please use the verification code below to proceed with resetting your password.</p>
        
        <div class="code-box">
          <p><strong>Your Password Reset Code:</strong></p>
          <div class="verification-code">${verificationCode}</div>
        </div>
        
        <div class="security-note">
          <strong>🔒 Security Note:</strong> This code will expire in 15 minutes for your security. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <div class="footer">
          <p>© 2024 DebateWorld AI. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    return this.sendEmail({ to: email, subject, body });
  }

  /**
   * Send welcome email after successful verification
   */
  static async sendWelcomeEmail(
    email: string, 
    fullName: string
  ): Promise<EmailResponse> {
    const subject = 'Welcome to DebateWorld AI!';
    
    const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to DebateWorld AI</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
        }
        .header { 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
          color: white; 
          padding: 30px; 
          text-align: center; 
          border-radius: 10px 10px 0 0; 
        }
        .content { 
          background: #f9f9f9; 
          padding: 30px; 
          border-radius: 0 0 10px 10px; 
        }
        .feature-box { 
          background: white; 
          padding: 20px; 
          margin: 15px 0; 
          border-radius: 8px; 
          border-left: 4px solid #10b981; 
        }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          color: #666; 
          font-size: 14px; 
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Welcome to DebateWorld AI!</h1>
        <p>Your account has been successfully verified</p>
      </div>
      
      <div class="content">
        <h2>Hello ${fullName || 'there'}!</h2>
        <p>Congratulations! Your email has been verified and your DebateWorld AI account is now active. You're ready to start your journey in the world of AI-powered debate practice!</p>
        
        <div class="feature-box">
          <h3>🤖 What you can do now:</h3>
          <ul>
            <li>Practice debates with AI opponents</li>
            <li>Analyze your arguments with our Freud-based feedback system</li>
            <li>Track your progress and improve your debating skills</li>
            <li>Explore various debate topics and formats</li>
          </ul>
        </div>
        
        <div style="text-align: center;">
          <a href="${window.location.origin}/" class="cta-button">Start Debating Now</a>
        </div>
        
        <p>If you have any questions or need help getting started, please don't hesitate to contact our support team.</p>
        
        <div class="footer">
          <p>© 2024 DebateWorld AI. All rights reserved.</p>
          <p>Happy debating!</p>
        </div>
      </div>
    </body>
    </html>
    `;

    return this.sendEmail({ to: email, subject, body });
  }
}