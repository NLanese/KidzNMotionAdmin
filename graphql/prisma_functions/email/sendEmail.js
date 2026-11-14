import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

// Sender address. It must be on a domain (or be an address) verified in
// Amazon SES, in the same region as SES_AWS_REGION.
// Set EMAIL_FROM in Vercel to change it without a code change.
export const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@kidz-n-motion.app';
const FROM_NAME = 'Kidz-N-Motion';

// Vercel reserves the standard AWS_* variable names, so SES uses its own.
let client;
function sesClient() {
    const accessKeyId = process.env.SES_AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.SES_AWS_SECRET_ACCESS_KEY;
    if (!accessKeyId || !secretAccessKey) return null;
    if (!client) {
        client = new SESv2Client({
            region: process.env.SES_AWS_REGION || 'us-east-1',
            credentials: { accessKeyId, secretAccessKey },
        });
    }
    return client;
}

const utf8 = (Data) => ({ Data, Charset: 'UTF-8' });

/** Rough plain-text copy of an HTML email, for clients that don't show HTML. */
function htmlToText(html) {
    return String(html)
        .replace(/<a [^>]*href="?([^"\s>]+)"?[^>]*>(.*?)<\/a>/gi, (_, href, label) =>
            label.trim() === href ? href : `${label} (${href})`)
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n\s*\n\s*\n+/g, '\n\n')
        .trim();
}

/**
 * Sends one email through Amazon SES.
 * Never throws. Returns true if SES accepted it, false otherwise (the reason
 * is logged, so check Vercel's function logs for "sendEmail:").
 */
export default async function sendEmail(
    usesHTML = false,
    message,
    html,
    recipient,
    subject
){
    const ses = sesClient();
    if (!ses) {
        console.error(`sendEmail: SES_AWS_ACCESS_KEY_ID / SES_AWS_SECRET_ACCESS_KEY are not set, so "${subject}" was not sent.`);
        return false;
    }
    if (!recipient) {
        console.error(`sendEmail: no recipient for "${subject}".`);
        return false;
    }

    const Body = {};
    if (usesHTML) {
        Body.Html = utf8(html);
        // A plain-text copy helps deliverability and spam scores.
        Body.Text = utf8(message || htmlToText(html));
    } else {
        Body.Text = utf8(message);
    }

    try {
        await ses.send(new SendEmailCommand({
            FromEmailAddress: `${FROM_NAME} <${EMAIL_FROM}>`,
            Destination: { ToAddresses: Array.isArray(recipient) ? recipient : [recipient] },
            Content: { Simple: { Subject: utf8(subject), Body } },
            ...(process.env.SES_CONFIGURATION_SET
                ? { ConfigurationSetName: process.env.SES_CONFIGURATION_SET }
                : {}),
        }));
        return true;
    }
    catch (err) {
        console.error(`sendEmail: SES rejected "${subject}"`, {
            name: err.name,
            status: err.$metadata?.httpStatusCode,
            message: err.message,
        });
        return false;
    }
}
