import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendMail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
    // Read the logo file
    const logoPath = path.join(process.cwd(), 'public', 'assets', 'images', 'Austrange Logo.png');
    let logoAttachment = null;

    try {
        const logoBuffer = fs.readFileSync(logoPath);
        logoAttachment = {
            filename: 'austrange-logo.png',
            content: logoBuffer,
            cid: 'austrange-logo',
        };
    } catch (error) {
        console.warn('Logo file not found, sending email without logo:', error);
    } const emailOptions = {
        from: 'Austrange Solutions Employee Management <no-reply@austrangesolutions.com>',
        to: [to],
        subject: subject,
        html: html,
        ...(logoAttachment && { attachments: [logoAttachment] })
    };

    const result = await resend.emails.send(emailOptions);

    if (result.error) {
        throw new Error(`Failed to send email: ${result.error.message}`);
    }
    console.log('Email sent successfully:', result);
    return result;
}
