import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);


export default async function sendEmail(
    usesHTML = false,
    message,
    html,
    recipient, 
    subject
){

    let msg = {
        to: recipient,
        from: 'no-reply@dashboard.kidz-n-motion.app',
        subject: subject,
    };

    if(!usesHTML)
        msg.text = message
    else
        msg.html = html


    try{
        await sgMail.send(msg)
        console.log('Email sent')
        return
    }
    catch(err){
        console.error(err)
        console.error('SendGrid error:', err.response?.body || err);
    }
    
}