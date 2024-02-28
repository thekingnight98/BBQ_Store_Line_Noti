// server.js
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 9000;

app.use(cors());
app.use(bodyParser.json());

app.post("/send-message", async (req, res) => {
  const { message } = req.body;
  const lineToken =
    "zbZ8MmPPZbf/a+Xy4gSimEA+3U5ZcMz6Y7VThdCrOv/YdpMmqO+wzaw2qWqUSDwLjLhfwE6VLu8StfLzm22prK+42bxPZ/lKrYa/LkVq0W7HN/LwQHbDJ2MP53Fu+wG8DQtnDa39s3kQFSLnoXA5PwdB04t89/1O/w1cDnyilFU="; // Replace with your LINE access token
  try {
    await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: "Uff9254b93e0158b3983dd2c9e5a3638a", // Replace with your user ID
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
});

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
