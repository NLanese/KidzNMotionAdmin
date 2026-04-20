import sgMail from '@sendgrid/mail';

export default async function sendEmail(
    message,
    recipient, 
    subject
){

    const msg = {
        to: recipient,
        from: 'no-reply@kidz-n-motion.app',
        subject: subject,
        text: message,
    };

    sgMail.send(msg)
    .then(() => {
        console.log('Email sent')
        return
    })
    .catch((err) => console.error(err));
}