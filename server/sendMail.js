const nodeoutlook = require('nodejs-nodemailer-outlook')
const dotenv = require('dotenv')

var fs = require('fs');

dotenv.config();


require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var html = require('./mails/recover password/recoverPassword.html');

const sendResetPass = (email, firstName, lastName, link) => {
    html = html.replace("@FirstName", firstName);
    html = html.replace("@LastName", lastName);  
    html = html.replace("@Link", link);

    nodeoutlook.sendEmail({
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        },
        from: process.env.EMAIL,
        to: email,
        subject: 'Password reset',
        html: html,
        replyTo: process.env.EMAIL,
        attachments: [
            {
                filename: 'GIF_password.gif',
                path: './mails/recover password/images/GIF_password.gif',
                cid: 'GIF_password@kreata.ee'
            },
            {
                filename: 'Logo.png',
                path: './mails/recover password/images/Logo.png',
                cid: 'Logo@kreata.ee'
            },
            {
                filename: 'twitter2x.png',
                path: './mails/recover password/images/twitter2x.png',
                cid: 'twitter2x@kreata.ee'
            },
            {
                filename: 'linkedin2x.png',
                path: './mails/recover password/images/linkedin2x.png',
                cid: 'linkedin2x@kreata.ee'
            },
            {
                filename: 'instagram2x.png',
                path: './mails/recover password/images/instagram2x.png',
                cid: 'instagram2x@kreata.ee'
            },
            {
                filename: 'facebook2x.png',
                path: './mails/recover password/images/facebook2x.png',
                cid: 'facebook2x@kreata.ee'
            }
        ],
       
        onError: (error) => console.log(error),
        onSuccess: (success) => console.log(success.messageId)
        }
    );
}

module.exports = sendResetPass;