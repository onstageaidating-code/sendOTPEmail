const nodemailer = require("nodemailer");

module.exports = async function (context) {
  try {
    const payload = context.req.bodyRaw ? JSON.parse(context.req.bodyRaw) : {};
    const toEmail = payload.email;
    const otp = payload.otp;

    if (!toEmail || !otp) {
      return context.res.json({ ok: false, error: "Missing email or OTP" }, 400);
    }

    const EMAIL_USER = context.env.EMAIL_USER;
    const EMAIL_PASS = context.env.EMAIL_PASS;

    if (!EMAIL_USER || !EMAIL_PASS) {
      return context.res.json({ ok: false, error: "Email credentials missing" }, 500);
    }

    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Asyra Dating" <${EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Asyra OTP Code",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:400px;margin:auto;padding:20px;border:1px solid #eee;border-radius:10px;">
          <h2 style="color:#06a2d2;text-align:center;">Asyra Verification</h2>
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) is:</p>
          <p style="font-size:24px;text-align:center;font-weight:bold;color:#06a2d2;">${otp}</p>
          <p>This code will expire in 10 minutes.</p>
          <p>Thank you,<br>Team Asyra</p>
        </div>`,
    });

    return context.res.json({ ok: true, sentTo: toEmail });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return context.res.json({ ok: false, error: String(err) }, 500);
  }
};
