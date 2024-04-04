const nodemailer = require('nodemailer');

const sendEmail = async emailData => {
  const transporter = nodemailer.createTransport({
    host: process.env.host,
    port: 587,
    secure: false, // Note: it's false since we're not using port 465
    auth: {
      user: process.env.user,
      pass: process.env.password
    }
  });
  return await transporter
    .sendMail(emailData)
    .then(info => console.log(`Message sent: ${info.response}`))
    .catch(err => console.log(`Problem sending email: ${err}`));
};

const testEmail = async (req, res) => {
  const { email } = req.body;
//   console.log(email);
  const emailData = {
    from: process.env.user,
    to: email,
    subject: `Test Email`,
    html: `
            <p>This is Test Email:</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>https://example.com</p>
            `
  };
  try {
    const info = await sendEmail(emailData);
    console.log(info);
    res.status(200).send('Email sent to ' + email);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending email');
  }
};

module.exports = {
  sendEmail,
  testEmail
};
