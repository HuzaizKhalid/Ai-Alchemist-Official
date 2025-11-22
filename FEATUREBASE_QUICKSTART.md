# Featurebase Quick Start Guide 🚀

## Step-by-Step Implementation

### ✅ What's Already Done

1. ✅ Feedback page created at `/feedback`
2. ✅ API route for programmatic submission at `/api/feedback`
3. ✅ "Give Feedback" button added to search results
4. ✅ Feedback link added to navigation menu
5. ✅ Featurebase SDK integration in layout
6. ✅ Custom feedback form component created

### 🔧 What You Need To Do

#### 1. Create Featurebase Account (5 minutes)

1. Go to https://featurebase.app
2. Click "Sign Up" and create an account
3. Create a new organization (e.g., "Alchemist AI")
4. Complete the quick setup wizard

#### 2. Get Your Credentials (2 minutes)

1. In Featurebase dashboard, go to **Settings** → **Embed & API**
2. Copy your **Organization ID** (looks like: `alchemist-ai` or `your-org-name`)
3. Click "Generate API Key" and copy it
4. Keep these safe for the next step

#### 3. Add Environment Variables (1 minute)

Create or update `.env.local` file in your project root:

```bash
# Featurebase Configuration
NEXT_PUBLIC_FEATUREBASE_ORG_ID=your-org-id-here
FEATUREBASE_API_KEY=your-secret-api-key-here
```

**Replace:**

- `your-org-id-here` with your actual Organization ID
- `your-secret-api-key-here` with your actual API Key

⚠️ **Never commit `.env.local` to git!**

#### 4. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

#### 5. Test the Integration (3 minutes)

**Test 1: Feedback Page**

- Navigate to http://localhost:3000/feedback
- Click "Open Feedback Form" button
- Submit a test feedback

**Test 2: Navigation Menu**

- Open the hamburger menu
- Click "Feedback"
- Verify the page loads

**Test 3: Search Results Button**

- Perform a search
- Scroll to bottom of results
- Click "Give Feedback" button

**Test 4: Floating Widget** (appears on all pages)

- Look for the floating feedback button on the right side
- Click it to open the widget
- Submit feedback

**Test 5: API Route**

- Go to `/feedback` page
- Use the custom feedback form
- Check if submission works

### 📝 Customize Your Board (Optional)

In Featurebase Dashboard:

1. **Add Categories:**

   - Go to Settings → Categories
   - Add: Bug, Feature Request, Improvement, Question

2. **Set Up Statuses:**

   - Under Review
   - Planned
   - In Progress
   - Completed
   - Declined

3. **Configure Voting:**

   - Enable/disable public voting
   - Set voting limits

4. **Customize Appearance:**
   - Upload your logo
   - Set brand colors
   - Customize widget text

### 🎨 Advanced Customization

#### Change Widget Position

Edit `app/layout.tsx`:

```typescript
window.featurebaseConfig = {
  organization: "your-org-id",
  theme: "dark",
  placement: "bottom-right", // Options: left, right, bottom-left, bottom-right
};
```

#### Add User Identification

In your auth component, when user logs in:

```typescript
// Add to your login success handler
if (typeof window !== "undefined" && (window as any).Featurebase) {
  (window as any).Featurebase("identify", {
    email: user.email,
    name: user.name,
    userId: user.id,
    metadata: {
      plan: user.plan,
      signupDate: user.createdAt,
    },
  });
}
```

#### Customize Embed URLs

If Featurebase gives you custom embed codes, update `app/feedback/page.tsx`:

```tsx
// Replace the iframe src with your custom URL
<iframe
  src="https://your-custom-board.featurebase.app"
  // ...
/>
```

### 📊 Next Steps

1. **Create Roadmap Page:**

   - Copy `/feedback` structure
   - Create `/roadmap/page.tsx`
   - Use roadmap embed URL

2. **Create Changelog Page:**

   - Create `/changelog/page.tsx`
   - Embed changelog from Featurebase

3. **Add Analytics:**
   - Track feedback submissions
   - Monitor user engagement

### 🐛 Troubleshooting

**Widget not appearing?**

- Check environment variables are set
- Restart dev server
- Clear browser cache
- Check browser console for errors

**"Feedback service not configured" error?**

- Verify `.env.local` has both variables
- Restart server after adding variables
- Check for typos in variable names

**Iframe not loading?**

- Verify Organization ID is correct
- Check Featurebase embed settings
- Test embed URL in new tab

**API route failing?**

- Check API key in `.env.local`
- Verify Featurebase API key permissions
- Check server logs for detailed errors

### 📞 Support

- Featurebase Docs: https://help.featurebase.app
- Featurebase Support: support@featurebase.app
- API Reference: https://api.featurebase.app

### ✨ What Users Can Do

Once set up, your users can:

- 📝 Submit feedback, bugs, and feature requests
- 🗳️ Vote on existing suggestions
- 💬 Comment and discuss ideas
- 📧 Get notified when items are updated
- 🔍 Search existing feedback
- 👀 See your roadmap and progress

That's it! You're all set up with Featurebase 🎉
