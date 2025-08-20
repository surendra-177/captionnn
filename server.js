import express from "express";
import bodyParser from "body-parser";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Generate AI Caption
app.post("/generate-caption", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `Write a catchy Instagram caption for: ${text}`,
        max_tokens: 50,
      }),
    });

    const data = await response.json();
    res.json({ caption: data.choices[0].text.trim() });
  } catch (error) {
    res.status(500).json({ error: "Error generating caption" });
  }
});

// ✅ Create Payment Order
app.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error creating order" });
  }
});

const PORT = process.env.PORT || 0.0.0.0;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
