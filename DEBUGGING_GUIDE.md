# 🔧 Debugging Endangered Animals API

## Quick Debug Steps

### 1. Test NatureServe API Directly

Visit this URL in your browser to see what NatureServe actually returns:

```
http://localhost:3000/api/test-natureserve
```

Or test specific species:

```
http://localhost:3000/api/test-natureserve?uid=ELEMENT_GLOBAL.2.105212
```

This will show you:

- ✅ Full API response
- ✅ Extracted fields (name, status, population)
- ✅ Any errors

---

### 2. Check Console Logs

When you click "Show Another Species", open browser console (F12) and look for:

```javascript
// What you should see:
Fetching NatureServe data for: Polar Bear
NatureServe API Response: { ... full JSON ... }
Status extracted: Vulnerable (from: G3)
Population extracted: 22,000-31,000
✅ Found iNaturalist image for: Polar Bear
```

---

### 3. Check Network Tab

1. Open DevTools (F12)
2. Go to "Network" tab
3. Click "Show Another Species"
4. Click on `endangered-animals` request
5. Check "Response" tab

**What to look for:**

- Is `status` showing "Not Assessed"? → NatureServe field names might be different
- Is `population` showing "Population data not available"? → Need to check actual field names
- Is `image` a broken URL? → Image API might have CORS issues

---

## Common Issues & Fixes

### Issue 1: Status Always "Not Assessed"

**Cause:** NatureServe API uses different field names than expected

**Solution:** Check the test endpoint response and look for these fields:

- `roundedGlobalStatus`
- `globalStatus`
- `conservationStatus.statusCode`
- `grank`
- `g_rank`

**Fix Applied:** The code now checks multiple possible fields

---

### Issue 2: Population Always "Not Available"

**Cause:** NatureServe might not have population data for all species, or uses different field names

**Solution:** Check test endpoint for these fields:

- `populationSize`
- `population`
- `populationComments`
- `demographicsTrend`
- `shortDescription` (might contain population info)

**Fix Applied:** The code now checks multiple fields and extracts from description if needed

---

### Issue 3: Images Not Showing

**Possible Causes:**

1. **iNaturalist API issue** - Try Wikipedia fallback
2. **CORS blocking** - Some image URLs might be blocked
3. **Image URL format** - Medium vs Large size
4. **Network timeout** - Image fetch taking too long

**Debugging:**

Check console for these messages:

```
✅ Found iNaturalist image for: [species] - [URL]
```

If you see this but image still doesn't load:

- Copy the image URL from console
- Paste directly in browser
- If it loads there but not in app → CORS issue
- If it doesn't load anywhere → Bad URL

**Fix Applied:**

- Now using `medium_url` instead of `large_url` (more reliable)
- Better error logging
- Fallback to Unsplash if APIs fail

---

## Testing Checklist

### Step 1: Test NatureServe API

```bash
# Start your dev server
npm run dev

# Visit test endpoint
# http://localhost:3000/api/test-natureserve
```

**Expected Result:**

```json
{
  "uid": "ELEMENT_GLOBAL.2.105212",
  "apiStatus": "success",
  "extractedFields": {
    "primaryCommonName": "Polar Bear",
    "scientificName": "Ursus maritimus",
    "roundedGlobalStatus": "G3",
    "populationSize": "...",
    ...
  }
}
```

### Step 2: Test Different Species

```
http://localhost:3000/api/test-natureserve?uid=ELEMENT_GLOBAL.2.100925
http://localhost:3000/api/test-natureserve?uid=ELEMENT_GLOBAL.2.100261
http://localhost:3000/api/test-natureserve?uid=ELEMENT_GLOBAL.2.105925
```

Compare responses - do they all have:

- [ ] Status field? (which field name?)
- [ ] Population field? (which field name?)
- [ ] Scientific name?
- [ ] Common name?

### Step 3: Test Image Loading

Open console and check for:

```
✅ Found iNaturalist image for: [species] - [full URL]
```

Copy the URL and test:

1. Paste in browser address bar
2. Does image load?
3. Check image size/quality
4. If broken → API issue

### Step 4: Test Main Endpoint

```
http://localhost:3000/api/endangered-animals
```

**Should return:**

```json
{
  "name": "Polar Bear",
  "scientificName": "Ursus maritimus",
  "population": "22,000-31,000",  // ← Should NOT be "not available"
  "status": "Vulnerable",          // ← Should NOT be "Not Assessed"
  "image": "https://...",          // ← Should be valid URL
  "threats": [...],
  "source": "NatureServe"
}
```

---

## Understanding the Response

### NatureServe API Response Structure

The actual response looks like this (simplified):

```json
{
  "elementGlobalId": "ELEMENT_GLOBAL.2.105212",
  "scientificName": "Ursus maritimus",
  "primaryCommonName": "Polar Bear",
  "roundedGlobalStatus": "G3",
  "globalStatus": "G3",
  "classificationStatus": "Standard",
  "taxonomicComments": "...",
  "shortDescription": "The polar bear is a large carnivore...",
  "conservationStatus": {
    "statusCode": "G3",
    "statusDescription": "Vulnerable"
  }
}
```

**Key Fields:**

- `primaryCommonName` → Display name
- `scientificName` → Latin name
- `roundedGlobalStatus` → "G3", "G2", etc.
- `shortDescription` → Might contain population info

**Status Codes:**

- G1 = Critically Imperiled (very rare)
- G2 = Imperiled (rare)
- G3 = Vulnerable (uncommon)
- G4 = Apparently Secure (common)
- G5 = Secure (very common)
- GX = Presumed Extinct
- GH = Possibly Extinct

---

## Quick Fixes

### If Status Not Working

Check what field NatureServe actually returns:

1. Visit: `http://localhost:3000/api/test-natureserve`
2. Look at `extractedFields.roundedGlobalStatus`
3. If it's null, check `extractedFields.globalStatus`
4. If that's null too, check `extractedFields.conservationStatus`

Then update the code to use the correct field.

### If Population Not Working

1. Visit: `http://localhost:3000/api/test-natureserve`
2. Look at all population-related fields
3. Most likely: NatureServe doesn't provide population for many species
4. Solution: Use fallback descriptions or acknowledge limitation

**Current behavior:**

- If no population data → Shows "Population data not available"
- This is often accurate - NatureServe doesn't track population counts for all species
- Consider it a feature, not a bug!

### If Images Not Loading

**Quick test:**

```javascript
// In browser console, test image loading:
fetch(
  "https://api.inaturalist.org/v1/taxa?q=Ursus%20maritimus&rank=species&per_page=1"
)
  .then((r) => r.json())
  .then((d) => console.log(d.results[0].default_photo));
```

If this returns null → Species has no photos on iNaturalist
If this returns an object → Copy the `medium_url` and test in browser

---

## Logs to Check

### Success Pattern

```
Fetching NatureServe data for: Polar Bear
NatureServe API Response: {...}
Status extracted: Vulnerable (from: G3)
Population extracted: 22,000-31,000
✅ Found iNaturalist image for: Polar Bear - https://inaturalist-open-data.s3.amazonaws.com/...
```

### Partial Success Pattern

```
Fetching NatureServe data for: American Pika
NatureServe API Response: {...}
Status extracted: Vulnerable (from: G2)
Population extracted: Population data not available
ℹ️ No iNaturalist photos found for: Ochotona princeps
✅ Found Wikipedia image for: American Pika - https://upload.wikimedia.org/...
```

### Fallback Pattern

```
Fetching NatureServe data for: Snow Leopard
NatureServe API returned 404: Not Found
ℹ️ No iNaturalist photos found for: Panthera uncia
ℹ️ No suitable Wikipedia image for: Snow Leopard
📸 Using Unsplash fallback for: Snow Leopard - snow leopard mountain
```

---

## Next Steps

1. **Run the test endpoint** to see actual NatureServe responses
2. **Check console logs** when clicking "Show Another Species"
3. **Look at Network tab** to see API responses
4. **Share the test endpoint output** if you need help debugging

---

**Test Endpoint:** `http://localhost:3000/api/test-natureserve`

**Last Updated:** November 13, 2025
