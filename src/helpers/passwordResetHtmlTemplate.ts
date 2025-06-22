export const passwordResetHtmlTemplate = (resetLink: string, firstName: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Austrange Solutions</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #f8fafc;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                border-radius: 12px;
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 30px 20px;
                text-align: center;
                color: white;
            }            .logo {
                margin-bottom: 15px;
            }
            .logo img {
                height: 60px;
                width: auto;
                max-width: 200px;
                object-fit: contain;
            }
            .company-name {
                font-size: 28px;
                font-weight: bold;
                margin-top: 10px;
                letter-spacing: 1px;
            }
            .company-tagline {
                font-size: 14px;
                opacity: 0.9;
                font-weight: 300;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 24px;
                color: #2d3748;
                margin-bottom: 20px;
                font-weight: 600;
            }
            .message {
                font-size: 16px;
                color: #4a5568;
                margin-bottom: 30px;
                line-height: 1.8;
            }
            .reset-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                margin: 20px 0;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }
            .reset-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }
            .button-container {
                text-align: center;
                margin: 30px 0;
            }
            .security-note {
                background-color: #fef5e7;
                border-left: 4px solid #f6ad55;
                padding: 20px;
                margin: 30px 0;
                border-radius: 0 8px 8px 0;
            }
            .security-note h3 {
                color: #c05621;
                margin-bottom: 10px;
                font-size: 16px;
            }
            .security-note p {
                color: #744210;
                font-size: 14px;
                margin-bottom: 8px;
            }
            .link-container {
                background-color: #f7fafc;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border: 1px solid #e2e8f0;
            }
            .link-container p {
                font-size: 14px;
                color: #4a5568;
                margin-bottom: 10px;
            }
            .reset-link {
                word-break: break-all;
                color: #667eea;
                text-decoration: none;
                font-family: monospace;
                background-color: #edf2f7;
                padding: 8px;
                border-radius: 4px;
                display: block;
                font-size: 12px;
            }
            .footer {
                background-color: #2d3748;
                color: #a0aec0;
                padding: 30px 20px;
                text-align: center;
            }
            .footer-content {
                margin-bottom: 20px;
            }
            .footer h3 {
                color: #e2e8f0;
                margin-bottom: 10px;
                font-size: 18px;
            }
            .footer p {
                font-size: 14px;
                margin-bottom: 8px;
            }
            .footer-links {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #4a5568;
            }
            .footer-link {
                color: #81e6d9;
                text-decoration: none;
                margin: 0 15px;
                font-size: 14px;
            }
            .footer-link:hover {
                color: #4fd1c7;
            }
            .disclaimer {
                font-size: 12px;
                color: #718096;
                margin-top: 20px;
                line-height: 1.5;
            }
            @media (max-width: 600px) {
                .email-container {
                    margin: 10px;
                    border-radius: 8px;
                }
                .content {
                    padding: 30px 20px;
                }
                .header {
                    padding: 20px;
                }
                .logo {
                    font-size: 24px;
                }
                .greeting {
                    font-size: 20px;
                }
                .reset-button {
                    width: 100%;
                    padding: 16px;
                }
                .footer {
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">            <!-- Header -->
            <div class="header">
                <div class="logo">
                    <img src="cid:austrange-logo" alt="Austrange Solutions" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                    <div style="display:none; font-size: 28px; font-weight: bold;">🏢</div>
                </div>
                <div class="company-name">Austrange Solutions</div>
                <div class="company-tagline">Employee Management Portal</div>
            </div>

            <!-- Main Content -->
            <div class="content">
                <h1 class="greeting">Hello ${firstName}! 👋</h1>
                
                <p class="message">
                    We received a request to reset your password for your Austrange Solutions Employee Portal account. 
                    If you made this request, click the button below to create a new password.
                </p>

                <div class="button-container">
                    <a href="${resetLink}" class="reset-button">
                        🔑 Reset Your Password
                    </a>
                </div>

                <div class="security-note">
                    <h3>🔒 Security Notice</h3>
                    <p>• This password reset link will expire in 1 hour for your security.</p>
                    <p>• If you didn't request this reset, please ignore this email.</p>
                    <p>• Never share this link with anyone else.</p>
                    <p>• Make sure you're on the official Austrange Solutions domain when resetting.</p>
                </div>

                <div class="link-container">
                    <p><strong>Can't click the button?</strong> Copy and paste this link into your browser:</p>
                    <a href="${resetLink}" class="reset-link">${resetLink}</a>
                </div>

                <p class="message">
                    If you're having trouble accessing your account or didn't request this password reset, 
                    please contact our IT support team immediately.
                </p>
            </div>

            <!-- Footer -->
            <div class="footer">
                <div class="footer-content">
                    <h3>Austrange Solutions</h3>
                    <p>Employee Management & HR Portal</p>
                    <p>Streamlining workforce efficiency since 2024</p>
                </div>

                <div class="footer-links">
                    <a href="https://austrangesolutions.com" class="footer-link">Company Website</a>
                    <a href="mailto:support@austrangesolutions.com" class="footer-link">IT Support</a>
                    <a href="mailto:hr@austrangesolutions.com" class="footer-link">HR Department</a>
                </div>

                <div class="disclaimer">
                    <p>
                        This email was sent from an automated system. Please do not reply to this email. 
                        If you need assistance, contact our support team directly.
                    </p>
                    <p>
                        © ${new Date().getFullYear()} Austrange Solutions. All rights reserved. 
                        This email and any attachments are confidential and intended solely for the addressee.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}