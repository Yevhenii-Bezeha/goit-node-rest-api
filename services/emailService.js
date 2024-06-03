const sgMail = require("@sendgrid/mail");
const { envsConfig } = require("../configs");

sgMail.setApiKey(envsConfig.sendGridApiKey);

const sendEmail = async ({ to, subject, text, html }) => {
  const msg = {
    to,
    from: "bezegajenja0305@gmail.com", // Use your verified sender email
    subject,
    text,
    html,
  };

  await sgMail.send(msg);
};

module.exports = sendEmail;
