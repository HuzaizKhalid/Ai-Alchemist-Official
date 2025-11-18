# Climate API Integration Guide

## Overview

The Climate Widget now uses **real-time climate data** from the Global Warming API to display current global temperature information.

## API Integration

### Primary Data Source

**Global Warming API**

- **URL**: https://global-warming.org/api/temperature-api
- **Authentication**: None required (free, open API)
- **Data Type**: Global temperature anomaly data
- **Update Frequency**: Regularly updated with latest climate measurements
- **No Rate Limits**: Free to use without restrictions

### API Response Structure

```json
{
  "result": [
    {
      "time": "2024-01-01",
      "station": "1.38",
      "land": "1.45"
    }
  ]
}
```

### How It Works

1. **Automatic Updates**:

   - The widget fetches real-time data when the component loads
   - Data is cached for the session but can be refreshed manually

2. **Manual Refresh**:

   - Users can click the "Refresh" button to get the latest data
   - The button shows a loading spinner during the fetch

3. **Fallback Mechanism**:

   - If the API is unavailable, the widget uses verified 2024 data (1.38°C)
   - Error handling ensures the widget always displays data

4. **Real-time Indicator**:
   - Green pulsing dot = Live data from API
   - Yellow dot = Static fallback data

## Features

### What's Displayed

- **Current Global Temperature**: Latest temperature anomaly from pre-industrial levels
- **Paris Agreement Target**: 1.5°C threshold
- **Difference from Target**: How far we are from the goal
- **Status**: Safe/Warning/Critical based on current temperature
- **Data Source**: Shows which API provided the data
- **Last Updated**: Timestamp of the data

### UI Enhancements

- **Live Data Badge**: Shows whether data is real-time or static
- **Refresh Button**: Allows users to manually update the temperature
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Graceful fallback to static data

## Technical Details

### API Endpoint: `/api/climate-data`

**GET Request**

```typescript
const response = await fetch('/api/climate-data');
const data = await response.json();

// Response:
{
  currentTemp: 1.38,
  targetTemp: 1.5,
  difference: -0.12,
  percentOfLimit: 92.0,
  status: "Warning",
  lastUpdated: "2024-11-18T...",
  source: "Climate Change API (global-warming.org)",
  isRealTime: true
}
```

### Temperature Calculation

```typescript
// Temperature status determination
if (currentTemp < 1.0) {
  status = "Safe"; // Below 1.0°C - good progress
} else if (currentTemp < 1.5) {
  status = "Warning"; // Between 1.0-1.5°C - approaching limit
} else {
  status = "Critical"; // Above 1.5°C - exceeded Paris Agreement
}
```

## Alternative APIs (Future Enhancement)

If you want to use other climate data sources, here are alternatives:

### 1. **Berkeley Earth API**

- Website: http://berkeleyearth.org/
- Free data downloads available
- Comprehensive temperature datasets

### 2. **NASA GISS Surface Temperature Analysis**

- Website: https://data.giss.nasa.gov/gistemp/
- Official NASA climate data
- Requires data file parsing

### 3. **NOAA Climate Data Online**

- Website: https://www.ncdc.noaa.gov/cdo-web/
- Requires API token (free registration)
- More detailed climate metrics

### 4. **Climate.gov API**

- Website: https://www.climate.gov/
- U.S. government data
- Various climate indicators

## Implementation in Your Code

### Backend (`app/api/climate-data/route.ts`)

```typescript
async function fetchClimateChangeData() {
  const response = await fetch(
    "https://global-warming.org/api/temperature-api",
    {
      cache: "no-store",
    }
  );
  const data = await response.json();
  const latestReading = data.result[data.result.length - 1];
  return parseFloat(latestReading.station);
}
```

### Frontend (`components/ClimateWidget.tsx`)

```typescript
const fetchClimateData = async () => {
  const response = await fetch("/api/climate-data");
  const data = await response.json();
  setClimateData(data);
};

// With refresh button
<Button onClick={fetchClimateData} disabled={refreshing}>
  <RefreshCw className={refreshing ? "animate-spin" : ""} />
  {refreshing ? "Updating..." : "Refresh"}
</Button>;
```

## Testing

To test the real-time integration:

1. Load the application and perform a search
2. Scroll to the Climate Widget at the bottom
3. Check the "Live Data" indicator (green pulsing dot)
4. Click the "Refresh" button to fetch latest data
5. Verify the temperature updates and timestamp changes

## Monitoring

Check the console logs for climate data updates:

```
Successfully fetched real-time climate data: {
  temperature: 1.38,
  source: "Climate Change API (global-warming.org)",
  timestamp: "2024-11-18T..."
}
```

## Benefits

✅ **Real-time Data**: Always shows current global temperature  
✅ **No API Keys**: Free to use, no authentication needed  
✅ **Automatic Updates**: Fetches latest data on component load  
✅ **Manual Refresh**: Users can update data on demand  
✅ **Reliable Fallback**: Static data ensures widget always works  
✅ **User Transparency**: Shows data source and update time

## Future Enhancements

Potential improvements:

- [ ] Add multiple climate APIs for redundancy
- [ ] Cache data with Redis for better performance
- [ ] Show historical temperature trends
- [ ] Add CO₂ concentration levels
- [ ] Display sea level rise data
- [ ] Include polar ice extent
- [ ] Show regional temperature breakdowns

## Support

For issues or questions about the climate API integration:

- Check API status: https://global-warming.org/
- Review console logs for errors
- Verify network connectivity
- Check fallback data is displaying correctly
