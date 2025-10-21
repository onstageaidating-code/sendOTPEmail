const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  try {
    const body = req.payload ? JSON.parse(req.payload) : {};
    const toEmail = body.email;
    const otp = body.otp;

    if (!toEmail || !otp) {
      return res.json({ ok: false, error: "Missing email or OTP" }, 400);
    }

    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;

    if (!EMAIL_USER || !EMAIL_PASS) {
      return res.json({ ok: false, error: "Email credentials missing" }, 500);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Asyra Dating" <${EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Asyra OTP Code",
      text: `Your OTP code is ${otp}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:400px;margin:auto;padding:20px;border:1px solid #eee;border-radius:10px;">
          <h2 style="color:#06a2d2;text-align:center;">Asyra Verification</h2>
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) is:</p>
          <p style="font-size:24px;text-align:center;font-weight:bold;color:#06a2d2;">${otp}</p>
          <p>This code will expire in 10 minutes.</p>
          <p>Thank you,<br>Team Asyra</p>
        </div>`
    });

    return res.json({ ok: true, sentTo: toEmail });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return res.json({ ok: false, error: String(err) }, 500);
  }
};
