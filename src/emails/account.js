const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = async (email, name = 'User') => {
    await sgMail.send({
        to: email,
        from: 'ankitagrawal700aa@gmail.com',
        subject: 'Welcome to the Task App',
        text: `Dear ${name},\n\tThank you for signing in to the Task App. Let us know how you get along with the app.\n\nFor any further queries mail us at ankitagrawal700aa@gmail.com`,
        // html:''
    });
    // console.log('Welcome mail sent !');
};

const sendCancellationEmail = async (email, name = 'User') => {
    await sgMail.send({
        to: email,
        from: 'ankitagrawal700aa@gmail.com',
        subject: 'Task App account deleted successfully',
        text: `Dear ${name},
        Your account on Task App has been deleted successfully. Whenever you like, you can re-sign-in to our Task App.\n
Please feel free to let us know about any issues and suggestions regarding the Task App. Your suggestions are sincerely welcomed.
You can mail us at ankitagrawal700aa@gmail.com`,
    });
    // console.log('Cancellation mail sent !');
};

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail,
};
