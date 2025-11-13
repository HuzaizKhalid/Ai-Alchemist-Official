# 🚀 NatureServe API - Quick Reference

## ⚡ TL;DR (Too Long; Didn't Read)

**The NatureServe Explorer API is PUBLIC and requires NO API key!**

```bash
# Your app is already configured and ready to use! ✅
npm run dev
```

---

## 🎯 Key Facts

| Question                  | Answer                                          |
| ------------------------- | ----------------------------------------------- |
| **Do I need an API key?** | ❌ No! The API is public for standard use       |
| **Is it free?**           | ✅ Yes! Free for educational/non-commercial use |
| **Does it work now?**     | ✅ Yes! Already configured in your app          |
| **Setup required?**       | ❌ None! Works out of the box                   |
| **Data quality?**         | ✅ Authoritative species conservation data      |

---

## 📚 Resources

- **Official API Docs**: https://explorer.natureserve.org/api-docs/
- **Test API in Browser**: https://explorer.natureserve.org/api/data/taxon/ELEMENT_GLOBAL.2.105212
- **Full Setup Guide**: See `NATURESERVE_API_SETUP.md`
- **Integration Summary**: See `NATURESERVE_INTEGRATION_SUMMARY.md`

---

## 🧪 Quick Test

### Method 1: Test Script

```bash
node test-natureserve.js
```

### Method 2: Your App

```bash
npm run dev
# Click "Show Another Species" in dashboard
# Look for "Live Data" green badge
```

### Method 3: Direct Browser Test

Open in browser: https://explorer.natureserve.org/api/data/taxon/ELEMENT_GLOBAL.2.105212

---

## 📞 When to Contact NatureServe

Contact **DataSupport@natureserve.org** ONLY if you need:

- 📦 Bulk data downloads (thousands of requests)
- 💼 Commercial/enterprise usage
- 🔐 Private/controlled datasets
- 🔑 Legacy API key (older services)

For standard educational use: **NO CONTACT NEEDED!**

---

## ✅ Your Current Status

- [x] NatureServe API integrated
- [x] Public API working (no key required)
- [x] Fallback data system in place
- [x] "Live Data" badge indicator added
- [x] 12 curated species available
- [x] Expandable to thousands via API

**Status: ✅ READY TO USE!**

---

## 🎨 What You'll See

### With NatureServe API (Default)

```
┌─────────────────────────────────┐
│ Climate-Affected Species        │
├─────────────────────────────────┤
│  [LIVE DATA] [ENDANGERED]       │
│  ┌─────────────────────────┐   │
│  │                          │   │
│  │     [Animal Photo]       │   │
│  │                          │   │
│  └─────────────────────────┘   │
│  Polar Bear                     │
│  Ursus maritimus                │
│  Population: 22,000-31,000      │
│                                 │
│  Climate Threats:               │
│  • Sea ice loss                 │
│  • Reduced hunting grounds      │
│  • ...                          │
│                                 │
│  [Show Another Species]         │
└─────────────────────────────────┘
```

**"LIVE DATA" badge = Using NatureServe API!**

---

## 🛠 Technical Details

### Endpoint Used

```
GET https://explorer.natureserve.org/api/data/taxon/{uid}
```

### Example Request

```bash
curl -H "Accept: application/json" \
  "https://explorer.natureserve.org/api/data/taxon/ELEMENT_GLOBAL.2.105212"
```

### Response Format

```json
{
  "scientificName": "Ursus maritimus",
  "primaryCommonName": "Polar Bear",
  "roundedGlobalStatus": "G3",
  "populationSize": "22,000-31,000"
}
```

---

## 🔄 Fallback System

Your app has **automatic fallback**:

```
Try NatureServe API
    ↓ (if fails)
Use Curated Data (12 species)
    ↓ (if fails)
Default to Polar Bear
```

**Result: Feature ALWAYS works!** ✅

---

## 📊 Species Currently Available

### NatureServe API Species (7 UIDs configured)

1. Polar Bear - `ELEMENT_GLOBAL.2.105212`
2. American Pika - `ELEMENT_GLOBAL.2.100925`
3. Canada Lynx - `ELEMENT_GLOBAL.2.100261`
4. Pacific Walrus - `ELEMENT_GLOBAL.2.105925`
5. Woodland Caribou - `ELEMENT_GLOBAL.2.106311`
6. Loggerhead Sea Turtle - `ELEMENT_GLOBAL.2.104736`
7. Arctic Fox - `ELEMENT_GLOBAL.2.100925`

### Fallback Curated Species (12 total)

Includes all above plus: Coral Reefs, Sea Turtle, Emperor Penguin, Orangutan, Beluga Whale, Koala, Leatherback Sea Turtle, Snow Leopard, Monarch Butterfly

---

## 💡 Pro Tips

1. **No setup needed** - API works immediately
2. **Check console** (F12) to see which data source is active
3. **"Live Data" badge** confirms NatureServe connection
4. **Fallback is normal** - still shows accurate data
5. **Add more species** easily via UIDs in code

---

**Questions?** See full guide: `NATURESERVE_API_SETUP.md`

**Last Updated**: November 12, 2025
