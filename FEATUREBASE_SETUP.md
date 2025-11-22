# Featurebase Integration Guide

## 🎯 Overview

Featurebase is integrated into Alchemist AI to collect user feedback, feature requests, and bug reports. This guide covers the complete setup and usage.

## 📋 What's Integrated

✅ **Floating Feedback Widget** - Global button accessible from any page  
✅ **Embedded Feedback Board** - Full board view at `/feedback`  
✅ **API Route** - Programmatic feedback submission  
✅ **User Metadata** - Automatic user info attachment

## 🚀 Setup Instructions

### Step 1: Create Featurebase Account

1. Go to [Featurebase.app](https://featurebase.app)
2. Sign up and create a new organization
3. Complete the onboarding process

### Step 2: Get Your Credentials

1. Navigate to **Settings → Embed & API**
2. Copy your **Organization ID** (e.g., `alchemist-ai`)
3. Generate and copy your **API Key**

### Step 3: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Featurebase Configuration
NEXT_PUBLIC_FEATUREBASE_ORG_ID=your-org-id-here
FEATUREBASE_API_KEY=your-api-key-here
```

⚠️ **Important:**

- `NEXT_PUBLIC_FEATUREBASE_ORG_ID` is safe for client-side (starts with `NEXT_PUBLIC_`)
- `FEATUREBASE_API_KEY` is server-side only (NEVER expose to client!)

### Step 4: Update Embed URLs (Optional)

If Featurebase provides custom embed URLs, update them in:

**File:** `app/feedback/page.tsx`

```tsx
<iframe
  src={`https://your-custom-url.featurebase.app/embed/feedback?organization=${process.env.NEXT_PUBLIC_FEATUREBASE_ORG_ID}`}
  // ... rest of props
/>
```

## 📦 What Was Added

### 1. Global Widget Script

**Location:** `app/layout.tsx`

The Featurebase SDK is loaded globally and initializes the floating feedback button.

### 2. Feedback Page

**Location:** `app/feedback/page.tsx`

Features:

- Open feedback widget button
- Embedded feedback board (iframe)
- User-friendly interface
- Dark theme matching Alchemist AI

### 3. API Route

**Location:** `app/api/feedback/route.ts`

Allows programmatic feedback submission from custom forms.

**Usage:**

```typescript
const response = await fetch("/api/feedback", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Feature Request",
    description: "Add dark mode toggle",
    email: "user@example.com",
    userMetadata: {
      plan: "pro",
      userId: "123",
    },
  }),
});
```

### 4. Feedback Button in Search Results

**Location:** `components/search-results.tsx`

Added "Give Feedback" button below "Share this conversation".

### 5. Navigation Menu Item

**Location:** `components/header.tsx`

Added "Feedback" link between "Vote" and "Contact Us".

## 🎨 Customization

### Change Widget Placement

Edit `app/layout.tsx`:

```typescript
Featurebase("initialize", {
  organization: "...",
  theme: "dark",
  placement: "right", // Options: left, right, bottom-left, bottom-right
});
```

### Customize Widget Theme

Available themes: `light`, `dark`, `auto`

### Add User Identification

When users are logged in, identify them:

```typescript
if (typeof window !== "undefined" && (window as any).Featurebase) {
  (window as any).Featurebase("identify", {
    email: user.email,
    name: user.name,
    userId: user.id,
  });
}
```

## 🔧 Advanced Usage

### Programmatic Feedback Submission

Create a custom form in your app:

```tsx
const submitFeedback = async (data) => {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      email: currentUser?.email,
      userMetadata: {
        plan: currentUser?.plan,
        userId: currentUser?.id,
        page: window.location.pathname,
      },
    }),
  });

  const result = await response.json();
  return result;
};
```

### Attach Context Automatically

Modify `app/api/feedback/route.ts` to add automatic context:

```typescript
metadata: {
  ...userMetadata,
  submittedAt: new Date().toISOString(),
  userAgent: request.headers.get('user-agent'),
  referrer: request.headers.get('referer'),
}
```

## 🧪 Testing

1. **Test Widget:** Navigate to any page and click the floating feedback button
2. **Test Feedback Page:** Go to `/feedback` and try the embedded board
3. **Test API:** Use the custom form or test with curl:

```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Feedback",
    "description": "Testing the API",
    "email": "test@example.com"
  }'
```

## 📊 Viewing Feedback

1. Log into your Featurebase dashboard
2. Navigate to **Feedback** section
3. View, prioritize, and respond to submissions
4. Create roadmap items from feedback
5. Update users when features are shipped

## 🔒 Security Notes

- ✅ API key is server-side only
- ✅ Rate limiting recommended for API route
- ✅ Validate user input in API route
- ✅ Never expose `FEATUREBASE_API_KEY` to client

## 📝 Next Steps

1. **Customize Board:** Set up categories, tags, and voting in Featurebase dashboard
2. **Add Roadmap:** Create `/roadmap` page with embedded roadmap
3. **Add Changelog:** Create `/changelog` page to show updates
4. **User Notifications:** Set up email notifications for feedback updates
5. **Analytics:** Track feedback submission rates

## 🐛 Troubleshooting

### Widget Not Showing

- Check if `NEXT_PUBLIC_FEATUREBASE_ORG_ID` is set
- Verify script is loading (check browser console)
- Clear cache and reload

### API Errors

- Verify `FEATUREBASE_API_KEY` is correct
- Check Featurebase API status
- Review server logs for details

### Iframe Not Loading

- Check CORS settings in Featurebase
- Verify embed URL is correct
- Check browser console for errors

## 📚 Resources

- [Featurebase Documentation](https://help.featurebase.app)
- [Featurebase API Reference](https://api.featurebase.app)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## ✨ Features Available

### From Featurebase Dashboard

- 📊 Analytics & insights
- 🎯 Prioritization tools
- 📬 Email notifications
- 🔄 Status updates
- 🗳️ User voting
- 💬 Comments & discussions
- 🏷️ Tags & categories
- 🚀 Roadmap planning

### For Users

- 📝 Submit feedback easily
- ✅ Vote on features
- 💬 Comment on requests
- 📧 Get status updates
- 🔍 Search existing feedback
