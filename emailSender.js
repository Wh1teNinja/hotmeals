const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.validateLogin = function (data) {
  
};

module.exports.sendWelcomeEmail = (data) => {
  return new Promise((resolve, reject) => {
    const msg = {
      to: `${data.email}`,
      from: "afedchenko@myseneca.ca",
      subject: "Successful Registration",
      html: `<strong>Thank you, ${data.firstName} ${data.lastName}, for choosing our meal delivery service!</strong>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
