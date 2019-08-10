import express from 'express';
import sgMail from '@sendgrid/mail';
import bodyParser from 'body-parser';

const router = express.Router();

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

// Send Email
router.post('/sendQuery', (req,res) =>  {
    var emailId = req.body.email;
    var name = req.body.name;
    var query = req.body.query;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: 'support@talentica.com',
        from: 'customerhelpdeskk@talentica.com',
        subject: `Query from name: ${name} email: ${emailId}`,
        text: `${query}`,
        html: '<strong>Thank You</strong>',
    };
    sgMail.send(msg);
    res.redirect('/contactus');
});

module.exports = router;