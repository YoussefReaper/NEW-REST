const {Resend} = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, text) {
    await resend.emails.send({
        from: "AuroCore <noreply@aurocore.com>",
        to,
        subject,
        text
    });
}

module.exports = sendEmail;