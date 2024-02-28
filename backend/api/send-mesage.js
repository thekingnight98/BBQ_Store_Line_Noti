const axios = require("axios");

module.exports = async (req, res) => {
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
      res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Failed to send message:", error.response.data);
      res.status(500).json({ success: false, message: "Failed to send message" });
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
