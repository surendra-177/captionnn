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
// --- Subscription Verification Routes ---

// Verify subscription with Google Play Billing (dummy example)
app.post("/verify-subscription", async (req, res) => {
  const { userId, purchaseToken } = req.body;

  // Normally, here you’d call Google Play API using purchaseToken
  // For now, we’ll mock a successful subscription
  const isValid = true;

  if (isValid) {
    // Save subscription status in DB (replace with real DB later)
    res.json({ success: true, premium: true });
  } else {
    res.json({ success: false, premium: false });
  }
});

// Check user subscription status
app.get("/user/:id/status", async (req, res) => {
  const { id } = req.params;

  // Normally fetch from DB
  // For now return mock status
  res.json({
    userId: id,
    premium: true, // change to false for free users
  });
});

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Render!");
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
