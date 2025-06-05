const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

app.post("/send-code", async (req, res) => {
  const { email, username, kodeVerifikasi } = req.body;

  const mailOptions = {
    from: `"${process.env.SENDER_NAME}" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Kode Verifikasi Akun",
    html: `
      <p>Hai <strong>${username}</strong>,</p>
      <p>Kode verifikasi Anda adalah: <strong>${kodeVerifikasi}</strong></p>
      <p>Gunakan kode ini untuk melanjutkan proses pendaftaran.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email OTP terkirim!" });
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    res.status(500).json({ success: false, message: "Gagal mengirim email OTP" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
