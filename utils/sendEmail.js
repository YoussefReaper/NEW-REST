const {Resend} = require('resend');
async function sendEmail(to, subject, text) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error('Email service is not configured (missing RESEND_API_KEY)');
    }

    const resend = new Resend(apiKey);
    await resend.emails.send({
        from: "AuroCore <noreply@aurocore.com>",
        to,
        subject,
        text
    });
}

module.exports = sendEmail;