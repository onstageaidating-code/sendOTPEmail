// index.js
const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  try {
    // Parse payload safely
    const body = req.payload ? JSON.parse(req.payload) : {};
    const toEmail = body.email;
    const otp = body.otp;

    if (!toEmail || !otp) {
      return res.json({ ok: false, error: "Missing email or otp" }, 400);
    }

    // 🔥 Hardcoded Gmail credentials (temporary for testing)
    const EMAIL_USER = "onstageaidating@gmail.com";
    const EMAIL_PASS = "onstage.by-aicek";

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });

    // Send email
    await transporter.sendMail({
      from: `"Asyra OTP Service" <${EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Asyra OTP Code",
      text: `Your OTP code is ${otp}`,
      html: `<p>Your OTP code is <b>${otp}</b></p>`
    });

    console.log("✅ OTP sent successfully to", toEmail);
    return res.json({ ok: true, sentTo: toEmail });
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    return res.json({ ok: false, error: String(err) }, 500);
  }
};
