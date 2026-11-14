// Sends one test email through Amazon SES using the same settings as the site.
// Usage: node --env-file=.env scripts/test-email.mjs you@example.com
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const to = process.argv[2];
if (!to) {
  console.error('Usage: node --env-file=.env scripts/test-email.mjs you@example.com');
  process.exit(1);
}
const from = process.env.EMAIL_FROM || 'noreply@kidz-n-motion.app';
const region = process.env.SES_AWS_REGION || 'us-east-1';
const ses = new SESv2Client({
  region,
  credentials: {
    accessKeyId: process.env.SES_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SES_AWS_SECRET_ACCESS_KEY,
  },
});

try {
  const res = await ses.send(new SendEmailCommand({
    FromEmailAddress: `Kidz-N-Motion <${from}>`,
    Destination: { ToAddresses: [to] },
    Content: { Simple: {
      Subject: { Data: 'Kidz-N-Motion SES test', Charset: 'UTF-8' },
      Body: { Text: { Data: `SES is working. Sent from ${from} in ${region}.`, Charset: 'UTF-8' } },
    } },
  }));
  console.log('Sent. Message ID:', res.MessageId);
} catch (err) {
  console.error('Failed:', err.name, '-', err.message);
  if (err.name === 'MessageRejected' && /not verified/i.test(err.message)) {
    console.error('The account is probably still in the SES sandbox (it can only send to verified addresses), or the sender domain is not verified in', region);
  }
  process.exit(1);
}
