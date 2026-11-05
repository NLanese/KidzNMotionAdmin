import sgMail from '@sendgrid/mail';

// SendGrid only delivers mail from addresses on a domain verified in the
// SendGrid account. Every other email in this codebase (invites, billing)
// sends from the em9019 subdomain, which is the one verified for
// kidz-n-motion.app. The old "no-reply@dashboard.kidz-n-motion.app" sender was
// rejected, so password resets and therapist alerts never arrived.
// Set SENDGRID_FROM_EMAIL in Vercel to override without a code change.
export const EMAIL_FROM = process.env.SENDGRID_FROM_EMAIL || 'noreply@em9019.kidz-n-motion.app';

/**
 * Sends one email through SendGrid.
 * Never throws. Returns true if SendGrid accepted it, false otherwise (the
 * reason is logged, so check Vercel's function logs for "sendEmail:").
 */
export default async function sendEmail(
    usesHTML = false,
    message,
    html,
    recipient,
    subject
){
    const apiKey = process.env.SEND_GRID_API_KEY;
    if (!apiKey) {
        console.error(`sendEmail: SEND_GRID_API_KEY is not set, so "${subject}" was not sent.`);
        return false;
    }
    sgMail.setApiKey(apiKey);

    const msg = {
        to: recipient,
        from: { email: EMAIL_FROM, name: 'Kidz-N-Motion' },
        subject: subject,
    };

    if (!usesHTML) {
        msg.text = message;
    } else {
        msg.html = html;
        // A plain-text copy helps deliverability and spam scores.
        if (message) msg.text = message;
    }

    try {
        await sgMail.send(msg);
        return true;
    }
    catch (err) {
        console.error(`sendEmail: SendGrid rejected "${subject}"`, {
            status: err.code,
            errors: err.response?.body?.errors,
        });
        return false;
    }
}
