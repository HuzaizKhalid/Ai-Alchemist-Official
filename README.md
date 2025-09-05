# Alchemist AI - Official Deployment

*AI-powered platform with MongoDB Atlas integration*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/anasmubashars-projects/v0-next-js-llm-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/T15C8eaMQKn)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Environment variables configured

### Installation & Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd Alchemist_Ai_Official_Deployment-main
   npm install
   ```

2. **Environment Configuration**
   Create a `.env.local` file with your credentials:
   ```bash
   # MongoDB Atlas
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/AiAlchemist
   
   # JWT & Auth
   JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-characters-long
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # OpenAI
   OPENAI_API_KEY=your-openai-api-key
   
   # Stripe
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=your-webhook-secret
   STRIPE_PRO_PRICE_ID=your-price-id
   ```

3. **Test MongoDB Connection**
   ```bash
   npm run test-db
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### 🔍 MongoDB Connection Status

When you run `npm run dev`, you'll see the MongoDB connection status:

```
🔍 Testing MongoDB connection...
🔗 Connecting to: mongodb+srv://***:***@cluster.mongodb.net/AiAlchemist
✅ MongoDB connection successful!
🏓 Database ping successful!
📊 Connected to database: AiAlchemist
📄 Collections: 0
💾 Data size: 0 bytes
🔌 MongoDB connection closed
```

### 🛠 Available Scripts

- `npm run dev` - Start development server with MongoDB connection test
- `npm run test-db` - Test MongoDB connection only
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### 🔌 API Endpoints

- `GET /api/test-db` - Test MongoDB connection via API
- Visit `http://localhost:3000/database-test` - Database test page

## 🏗 Project Structure





