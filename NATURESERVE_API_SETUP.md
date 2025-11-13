# NatureServe API Setup Guide

## 🌍 Overview

NatureServe provides comprehensive data on endangered species and their conservation status. This integration brings real-time, authoritative data to your endangered animals feature.

## ⚡ IMPORTANT: API Key NOT Required!

**Good News:** The NatureServe Explorer REST API is **PUBLIC** and does NOT require an API key for basic access!

- ✅ **Free to use** for standard queries
- ✅ **No registration** needed for basic endpoints
- ✅ **Works immediately** out of the box
- 📚 **Official API Docs**: https://explorer.natureserve.org/api-docs/

Your app will **automatically** use the public API if no key is configured.

---

## 🚀 Quick Start (No Setup Required!)

Your app is **already configured** to work with the public NatureServe API!

### Test It Right Now:

1. **Start your dev server**

   ```bash
   npm run dev
   ```

2. **Visit your dashboard** and find "Climate-Affected Species"

3. **Click "Show Another Species"** - it will fetch real-time data from NatureServe!

4. **Look for the "Live Data" badge** - confirms you're using NatureServe API

That's it! No API key needed for basic usage.

---

## 🔑 When You MIGHT Need an API Key (Optional)

You only need to contact NatureServe for:

- **Bulk data downloads** (hundreds/thousands of requests)
- **Commercial/enterprise use**
- **Private/controlled datasets**
- **Legacy API services** (older developer portal)

### How to Request Special Access (if needed):

**Email**: DataSupport@natureserve.org

**Subject**: Special API Access Request for Educational Platform

**Email Template**:

```
Dear NatureServe Data Support Team,

I am developing "Alchemist AI," an environmental education web application
that showcases climate-affected endangered species using your public API.

I am writing to request special API access for [choose reason]:
☐ Bulk data downloads
☐ Commercial usage
☐ Private datasets
☐ Legacy API key requirement

Project Details:
- Platform: Alchemist AI (Next.js/React web application)
- Current API Usage: Public REST API at explorer.natureserve.org
- Purpose: Educational climate awareness and endangered species information
- Expected Usage: [Describe your needs]
- Website: [Your website URL]

I have reviewed the API documentation at https://explorer.natureserve.org/api-docs/
and acknowledge the Terms of Use.

Thank you for your consideration.

Best regards,
[Your Name]
[Your Email]
[Your Organization]
```

**Contact Information:**

- Email: DataSupport@natureserve.org
- General Info: info@natureserve.org
- Website: https://www.natureserve.org/contact-us

---

## 🔧 Configuration (Optional)

### Basic Setup: NONE REQUIRED! ✅

The app works with the public API out of the box. No environment variables needed!

### Advanced Setup: API Key (Only if you have one)

If you've obtained a special API key from NatureServe for bulk/commercial use:

1. Open or create `.env.local` file in your project root:

```bash
# NatureServe API Configuration (OPTIONAL - only needed for special access)
NATURESERVE_API_KEY=your_special_api_key_here
```

2. **For Production (Vercel/Other Hosting)**:

   - Go to your hosting platform's dashboard
   - Navigate to Environment Variables section
   - Add: `NATURESERVE_API_KEY` with your key value

3. **Restart Development Server**:

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

### How to Verify It's Working

1. Navigate to your application
2. Find the "Climate-Affected Species" card
3. Click "Show Another Species"
4. Check the browser console (F12) for logs:
   - ✅ "Fetching NatureServe data for: [Species Name]"
   - ✅ Look for "Live Data" green badge on the card
5. If you see the badge, **you're using real-time NatureServe data!**

---

## 🔍 API Endpoint Information

### Official Documentation

📚 **API Docs**: https://explorer.natureserve.org/api-docs/

### Base URL

```
https://explorer.natureserve.org/api/data/
```

### Endpoints Used

- **Species Data**: `/taxon/{uid}` (public, no key required)
- **Species Search**: `/speciesSearch?uid={uid}` (public, no key required)

### Request Format (Public API)

```bash
# Simple curl example (no API key needed!)
curl -H "Accept: application/json" \
  "https://explorer.natureserve.org/api/data/taxon/ELEMENT_GLOBAL.2.105212"
```

### Request Format in Code

```typescript
// No API key needed for basic access!
fetch(`https://explorer.natureserve.org/api/data/taxon/${uid}`, {
  headers: {
    Accept: "application/json",
    // API key is optional - only add if you have one for special access
  },
});
```

### Try It Yourself

Test the API directly in your browser:

- Polar Bear: https://explorer.natureserve.org/api/data/taxon/ELEMENT_GLOBAL.2.105212
- American Pika: https://explorer.natureserve.org/api/data/taxon/ELEMENT_GLOBAL.2.100925

---

## 🐾 Available Species UIDs

Current species in the system:

| Species               | UID                     | Status            |
| --------------------- | ----------------------- | ----------------- |
| Polar Bear            | ELEMENT_GLOBAL.2.105212 | Vulnerable        |
| American Pika         | ELEMENT_GLOBAL.2.100925 | Climate Sensitive |
| Canada Lynx           | ELEMENT_GLOBAL.2.100261 | Threatened        |
| Pacific Walrus        | ELEMENT_GLOBAL.2.105925 | Vulnerable        |
| Woodland Caribou      | ELEMENT_GLOBAL.2.106311 | Endangered        |
| Loggerhead Sea Turtle | ELEMENT_GLOBAL.2.104736 | Threatened        |
| Arctic Fox            | ELEMENT_GLOBAL.2.100925 | Regional Concern  |

### Adding More Species

To add more species, find their UIDs at:

- https://explorer.natureserve.org/
- Search for the species
- Copy the UID from the URL or species page

Then add to `app/api/endangered-animals/route.ts`:

```typescript
{
  uid: "ELEMENT_GLOBAL.2.XXXXXX",
  name: "Species Name",
  unsplashQuery: "species habitat"
}
```

---

## 🎯 How It Works

### Data Flow

1. **User clicks "Show Another Species"**
   ↓
2. **API checks for NATURESERVE_API_KEY**
   ↓
3. **If key exists**: Fetches from NatureServe API
   ↓
4. **If successful**: Returns real-time species data
   ↓
5. **If fails or no key**: Falls back to hardcoded data (12 species)

### Fallback System

The system has **2 layers of protection**:

```
NatureServe API (Real-time data)
        ↓ (if fails)
Hardcoded Data (12 species)
        ↓ (if fails)
Default Species (Polar Bear)
```

This ensures the feature **always works**, even without an API key.

---

## 📊 Expected Response Format

### NatureServe API Response

```json
{
  "scientificName": "Ursus maritimus",
  "primaryCommonName": "Polar Bear",
  "roundedGlobalStatus": "G3",
  "globalStatus": "G3T3",
  "populationSize": "22,000-31,000",
  "threats": [
    {
      "name": "Climate change",
      "description": "Sea ice loss due to warming"
    }
  ]
}
```

### Your App's Format

```json
{
  "name": "Polar Bear",
  "scientificName": "Ursus maritimus",
  "population": "22,000-31,000",
  "status": "Vulnerable",
  "image": "https://images.unsplash.com/...",
  "threats": [
    "Sea ice loss due to warming temperatures",
    "Reduced hunting grounds",
    "Habitat fragmentation",
    "Ocean acidification affecting prey"
  ],
  "source": "NatureServe"
}
```

---

## 🐛 Troubleshooting

### Issue: Not seeing "Live Data" badge

**This is normal!** Your app has two modes:

**Mode 1: NatureServe Live Data** (preferred)

- Shows "Live Data" green badge
- Check browser console for "Fetching NatureServe data for: [species]"
- If API fails, automatically falls back to Mode 2

**Mode 2: Curated Fallback Data** (backup)

- No badge displayed
- Still shows accurate data for 12 species
- Works even if NatureServe API is down

**To force NatureServe mode:**

- Check console for error messages
- Verify network connection
- Test API directly: https://explorer.natureserve.org/api/data/taxon/ELEMENT_GLOBAL.2.105212

### Issue: API returns 404 Not Found

**Solution**:

- Check the species UID is correct
- Verify the endpoint URL
- Try a different species UID from the list above

### Issue: Network error / CORS issues

**Solution**:

- NatureServe API should work from any domain (CORS enabled)
- Check your internet connection
- Verify the API endpoint in browser Network tab (F12)
- Try accessing the API URL directly in browser

### Issue: Data looks wrong

**Solution**:

- This is likely fallback data (still accurate!)
- Check console logs to see if using NatureServe or fallback
- Both data sources are curated and reliable

---

## 💡 Alternative APIs (If NatureServe Unavailable)

If you can't get NatureServe access, consider these alternatives:

### 1. IUCN Red List API

- **URL**: https://apiv3.iucnredlist.org/
- **Free tier available**
- **Comprehensive species data**

### 2. GBIF (Global Biodiversity Information Facility)

- **URL**: https://www.gbif.org/developer/summary
- **Open access**
- **Extensive biodiversity data**

### 3. EOL (Encyclopedia of Life)

- **URL**: https://eol.org/docs/what-is-eol/data-services
- **Open API**
- **Rich multimedia content**

---

## 📈 Benefits of API Integration

### With NatureServe API:

✅ Real-time data updates
✅ Authoritative conservation status
✅ Scientific accuracy
✅ More species variety (expandable to thousands)
✅ Professional credibility

### Without API (Fallback):

✅ Still works perfectly
✅ 12 curated species
✅ No dependencies
✅ Fast response times
✅ No API limits

---

## 🚀 Next Steps

1. **Request your API key** using the methods above
2. **Add the key** to `.env.local`
3. **Restart** your development server
4. **Test** the integration
5. **Monitor** console logs for successful API calls
6. **Optional**: Add more species UIDs to expand variety

---

## 📞 Support

- **NatureServe Support**: info@natureserve.org
- **NatureServe Explorer**: https://explorer.natureserve.org/
- **API Documentation**: https://explorer.natureserve.org/api

---

## ✅ Checklist

### Basic Setup (Works Now!)

- [x] NatureServe public API configured in code
- [x] Fallback data system in place
- [ ] Run `npm run dev` to start your server
- [ ] Click "Show Another Species" in your app
- [ ] Open console (F12) to see API calls
- [ ] Look for "Live Data" badge (confirms NatureServe API working)

### Advanced Setup (Only if Needed)

- [ ] Determined you need special access (bulk data, commercial use, etc.)
- [ ] Contacted DataSupport@natureserve.org
- [ ] Received special API key
- [ ] Added `NATURESERVE_API_KEY` to `.env.local`
- [ ] Restarted development server
- [ ] Added API key to production environment variables

---

## 📝 Summary

**What You Need to Know:**

1. ✅ **No setup required** - public API works immediately
2. ✅ **No API key needed** for standard educational use
3. ✅ **Fallback system** ensures feature always works
4. 📞 **Contact NatureServe** only for bulk/commercial needs
5. 📚 **Read Terms of Use**: https://explorer.natureserve.org/api-docs/

---

**Last Updated**: November 12, 2025
**Status**: ✅ Ready to Use (Public API - No Key Required!)
**API Documentation**: https://explorer.natureserve.org/api-docs/
