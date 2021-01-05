const { Router } = require('express');
const router = Router();

const nodemailer = require('nodemailer');

router.post('/sendEmail', async (req, res) => {

    const xd = await nodemailer.createTestAccount()

    let transporter = await nodemailer.createTransport({
        host: xd.smtp.host,
        port: 587,
        secure: false,
        auth: {
            user: xd.user,
            pass: xd.pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });


    let info = await transporter.sendMail({
        from: '"FaztTech Server" <testtwo@fazttech.xyz>', // sender address,
        to: 'streeghzalt@gmail.com',
        subject: 'Website Contact Form',
        text: 'Hello World'
    })

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    res.sendStatus(200)
});

module.exports = router