# 🎯 Featurebase Integration - Complete Setup Guide

## ✨ What is Featurebase?

Featurebase is a customer feedback management platform that helps you:

- 📝 Collect feature requests and bug reports
- 🗳️ Let users vote on what features they want most
- 💬 Engage with users through comments and discussions
- 📊 Track and prioritize your product roadmap
- 📧 Send automatic updates when features ship

## 🚀 What's Been Integrated

✅ **Floating Feedback Widget** - A persistent button that appears on all pages  
✅ **Dedicated Feedback Page** - Full feedback experience at `/feedback`  
✅ **Embedded Board** - View all feedback directly in your app  
✅ **Reusable Components** - Easy-to-use React components  
✅ **Dark Theme** - Matches Alchemist AI's design

---

## 📋 Setup Instructions

### Step 1: Create Your Featurebase Account

1. Go to [https://www.featurebase.app](https://www.featurebase.app)
2. Click "Sign Up" or "Get Started"
3. Create your account (it's free to start!)
4. Complete the onboarding wizard

### Step 2: Configure Your Organization

1. After signing in, you'll be prompted to create an organization
2. Choose a name for your organization (e.g., "alchemist-ai")
   - This becomes part of your public URL
   - Example: `alchemist-ai.featurebase.app`
3. Set up your feedback board settings:
   - Enable/disable voting
   - Choose public or private board
   - Set up categories (e.g., "Feature Request", "Bug Report", "Improvement")

### Step 3: Get Your Credentials

1. Navigate to **Settings → Embed & API** in your Featurebase dashboard
2. Find your **Organization Name** (e.g., `alchemist-ai`)
3. (Optional) Generate an **API Key** if you want programmatic access

### Step 4: Update Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and update these variables:

   ```bash
   # Replace 'alchemist-ai' with YOUR organization name
   NEXT_PUBLIC_FEATUREBASE_ORG=your-organization-name

   # Optional: Only if you need API access
   FEATUREBASE_API_KEY=your_api_key_here
   ```

### Step 5: Update the Integration Code

Open `app/layout.tsx` and find the Featurebase initialization script (around line 80). Update the organization name:

```javascript
Featurebase("initialize_feedback_widget", {
  organization: "your-organization-name", // ← Change this
  theme: "dark",
  placement: "right",
});
```

Also update the iframe URL in `app/feedback/page.tsx`:

```tsx
<iframe
  src="https://your-organization-name.featurebase.app/board"
  // ... rest of props
/>
```

### Step 6: Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Visit [http://localhost:3000](http://localhost:3000)

3. Look for the floating feedback button on the right side of the screen

4. Click it to open the feedback widget

5. Visit [http://localhost:3000/feedback](http://localhost:3000/feedback) to see the full feedback page

---

## 🎨 Customization Options

### Change Widget Position

In `app/layout.tsx`, modify the `placement` option:

```javascript
Featurebase("initialize_feedback_widget", {
  organization: "your-org",
  theme: "dark",
  placement: "right", // Options: 'left', 'right', 'bottom-left', 'bottom-right'
});
```

### Change Theme

```javascript
Featurebase("initialize_feedback_widget", {
  organization: "your-org",
  theme: "dark", // Options: 'light', 'dark', 'auto'
});
```

### Identify Users (Optional)

If you want to track which users submit feedback, add this code where users are authenticated:

```typescript
import { useFeaturebase } from "@/components/FeaturebaseWidget";

// In your component
const { identifyUser } = useFeaturebase();

// After user logs in
identifyUser({
  email: user.email,
  name: user.name,
  userId: user.id,
  // Add any custom metadata
  plan: user.subscriptionPlan,
  signupDate: user.createdAt,
});
```

---

## 🧩 Using the Components

### Method 1: Using the Floating Widget (Already Integrated)

The floating widget appears automatically on all pages. Users can click it anytime to give feedback.

### Method 2: Using the FeaturebaseWidget Component

Add a feedback button anywhere in your app:

```tsx
import { FeaturebaseWidget } from "@/components/FeaturebaseWidget";

function MyComponent() {
  return (
    <div>
      <FeaturebaseWidget
        buttonText="Share Your Ideas"
        className="bg-emerald-500 hover:bg-emerald-600"
      />
    </div>
  );
}
```

### Method 3: Programmatic Control

Use the hook for custom interactions:

```tsx
import { useFeaturebase } from "@/components/FeaturebaseWidget";

function MyComponent() {
  const { openWidget, isReady } = useFeaturebase();

  return (
    <button onClick={openWidget} disabled={!isReady}>
      Give Feedback
    </button>
  );
}
```

---

## 📊 Managing Feedback in Featurebase Dashboard

### Viewing Feedback

1. Log into [Featurebase.app](https://www.featurebase.app)
2. Navigate to **Feedback** or **Board**
3. View all submissions from users
4. See vote counts, comments, and discussions

### Organizing Feedback

1. **Add Tags**: Categorize feedback (bug, feature, improvement, etc.)
2. **Set Status**: Mark as "Under Review", "Planned", "In Progress", "Complete"
3. **Prioritize**: Use votes and comments to understand what matters most
4. **Merge Duplicates**: Combine similar requests

### Responding to Users

1. Click on any feedback item
2. Add comments to ask questions or provide updates
3. Change the status to keep users informed
4. Users receive email notifications automatically

### Creating a Roadmap

1. Go to **Roadmap** in Featurebase
2. Add planned features and link them to feedback items
3. Set timelines and milestones
4. Make it public so users can see what's coming

---

## 🔧 Advanced Features

### Email Notifications

Configure email settings in Featurebase to:

- Notify you when new feedback arrives
- Update users when their requests are completed
- Send digest emails of popular requests

### Custom Branding

In Featurebase settings:

- Upload your logo
- Set brand colors
- Customize the widget appearance
- Add custom CSS

### Integrations

Connect Featurebase with:

- **Slack** - Get notifications in your team channel
- **Jira** - Sync feedback with development tasks
- **Zapier** - Connect to 1000+ other tools
- **GitHub** - Link feedback to issues and PRs

### Webhooks

Set up webhooks to trigger actions when:

- New feedback is submitted
- Feedback status changes
- Comments are added
- Votes reach a threshold

---

## 🐛 Troubleshooting

### Widget Not Appearing

1. **Check browser console** for JavaScript errors
2. **Verify organization name** in `app/layout.tsx` matches your Featurebase org
3. **Clear cache** and hard reload (Ctrl+Shift+R / Cmd+Shift+R)
4. **Check network tab** - ensure `sdk.js` loads successfully

### Iframe Not Loading

1. **Check the URL** in `app/feedback/page.tsx`
2. **Ensure your board is public** in Featurebase settings
3. **Check CORS settings** in Featurebase dashboard
4. **Try opening the direct URL** in a new tab to verify it works

### Widget Appears But Doesn't Open

1. **Check console** for errors
2. **Verify initialization** - the script should log to console
3. **Try refreshing** the page
4. **Check if adBlockers** are interfering

### Styles Look Broken

1. The widget uses its own styles, but you can customize via Featurebase settings
2. Check if your CSS is interfering with the widget's z-index
3. Try adjusting the `placement` option

---

## 📚 Additional Resources

- **Featurebase Documentation**: [https://help.featurebase.app](https://help.featurebase.app)
- **API Reference**: [https://api.featurebase.app](https://api.featurebase.app)
- **Widget Customization**: [Featurebase Settings → Embed & API](https://www.featurebase.app/settings)
- **Community Support**: [Featurebase Discord/Slack]

---

## 🎯 Next Steps

1. ✅ Set up your Featurebase account
2. ✅ Update environment variables
3. ✅ Test the widget
4. ✅ Customize the appearance
5. ✅ Set up email notifications
6. ✅ Create feedback categories
7. ✅ Share with your users!

---

## 💡 Pro Tips

1. **Encourage Feedback**: Add clear calls-to-action throughout your app
2. **Respond Quickly**: Users appreciate knowing their feedback is heard
3. **Be Transparent**: Use the roadmap to show what you're working on
4. **Close the Loop**: Update users when their requested features ship
5. **Use Votes Wisely**: Popular doesn't always mean important - balance user wants with your vision

---

## 🔐 Security Notes

- ✅ `NEXT_PUBLIC_FEATUREBASE_ORG` is safe for client-side (it's public anyway)
- ⚠️ `FEATUREBASE_API_KEY` should NEVER be exposed to the client
- ✅ The widget is loaded from Featurebase's CDN (trusted source)
- ✅ All data is transmitted over HTTPS

---

## 📞 Support

If you have issues with:

- **This integration**: Check this guide or review the code
- **Featurebase platform**: Contact Featurebase support
- **Alchemist AI**: Use the feedback widget to report issues! 😊

---

**Enjoy collecting valuable feedback from your users! 🚀**
