# Featurebase Quick Start Guide 🚀

## ⚡ 3-Minute Setup

### 1. Create Featurebase Account

1. Visit [featurebase.app](https://www.featurebase.app)
2. Sign up and create an organization
3. Choose your organization name (e.g., `alchemist-ai`)

### 2. Get Your Organization Name

1. Go to Settings → Embed & API
2. Copy your organization name

### 3. Update Configuration Files

**Update `.env.local`:**

```bash
NEXT_PUBLIC_FEATUREBASE_ORG=your-org-name
```

**Update `app/layout.tsx` (line ~85):**

```javascript
organization: 'your-org-name', // ← Change this from 'alchemist-ai'
```

**Update `app/feedback/page.tsx` (line ~100):**

```tsx
src = "https://your-org-name.featurebase.app/board";
```

### 4. Test It

```bash
npm run dev
```

Visit http://localhost:3000 → Look for floating feedback button

---

## ✅ What's Already Integrated

1. ✅ Floating feedback widget (appears on all pages)
2. ✅ Full feedback page at `/feedback`
3. ✅ Embedded feedback board with voting
4. ✅ Reusable React components
5. ✅ Dark theme matching your app
6. ✅ Feedback link in navigation menu

---

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
