# CaptionCraft Backend

Backend API for CaptionCraft SaaS.

## Setup

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file with:
   ```
   OPENAI_API_KEY=your_openai_key
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```
4. Run the server:
   ```bash
   npm start
   ```

---

## API Routes

- **POST /generate-caption**
  - Body: `{ "text": "your product or post" }`
  - Returns: `{ "caption": "Generated caption text" }`

- **POST /create-order**
  - Body: `{ "amount": 100 }` (amount in INR)
  - Returns: Razorpay order object
