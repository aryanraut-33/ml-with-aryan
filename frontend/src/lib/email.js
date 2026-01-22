
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
    const msg = {
        to,
        from: process.env.VERIFIED_SENDER_EMAIL || 'noreply@aryanraut.tech', // Fallback or strict requirement
        subject,
        html,
    };

    try {
        await sgMail.send(msg);
        return { success: true };
    } catch (error) {
        console.error('Email send error:', error);
        if (error.response) {
            console.error(error.response.body);
        }
        return { success: false, error };
    }
};
