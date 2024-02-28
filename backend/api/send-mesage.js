const axios = require("axios");

module.exports = async (req, res) => {
  // กำหนด CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // อนุญาต request จากทุก origins
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // ตอบสนองต่อ preflight request สำหรับ CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { message } = req.body;
    const lineToken = process.env.LINE_ACCESS_TOKEN; // ใช้ environment variable สำหรับเก็บ LINE access token
    try {
      await axios.post(
        "https://api.line.me/v2/bot/message/push",
        {
          to: process.env.LINE_USER_ID, // ใช้ environment variable สำหรับเก็บ LINE user ID
          messages: [
            {
              type: "text",
              text: message,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${lineToken}`,
          },
        }
      );
      return res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Failed to send message:", error.response.data);
      return res.status(500).json({ success: false, message: "Failed to send message" });
    }
  } else {
    // ตอบสนองต่อ HTTP methods อื่นๆ ด้วยข้อความไม่อนุญาต
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
