

<div align="center">
	<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Hashmi & Zerlin
.
## Run locally,

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. (Optional) Set `GEMINI_API_KEY` in `.env.local`.
3. Start dev server: `npm run dev`

## RSVP -> Google Sheets

This app submits RSVP entries to Google Sheets via a Google Apps Script Web App..

### 1) Create Apps Script endpoint

Open your Google Sheet, then go to **Extensions -> Apps Script** and paste this into `Code.gs`:

```js
function doPost(e) {
  try {
    // Prefer FormData field `payload` (works without CORS), else use raw JSON body.
    var payloadText = (e && e.parameter && e.parameter.payload)
      ? e.parameter.payload
      : (e && e.postData && e.postData.contents);

    if (!payloadText) throw new Error('No payload received');
    var data = JSON.parse(payloadText);

    // Automatically uses the Google Sheet this script is attached to!
    var ss = SpreadsheetApp.getActiveSpreadsheet(); 
    if (!ss) throw new Error('Script is not attached to a Google Sheet');
    
    // Determine sheet name from payload (default to RSVP for backwards compatibility)
    var sheetName = data._sheetName || 'RSVP';
    delete data._sheetName; // Remove internal variable so it isn't saved as a column

    var sheet = ss.getSheetByName(sheetName);
    // If sheet doesn't exist, create it automatically (e.g. for Wish)
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    var keys = Object.keys(data);
    
    // Handle headers dynamically based on incoming form fields
    var headers = [];
    if (sheet.getLastRow() === 0) {
      // Sheet is completely empty, insert headers as row 1
      headers = keys;
      sheet.appendRow(headers);
    } else {
      // Read existing headers
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      
      // Check if any keys from incoming data are missing in the sheet's headers
      var missingHeaders = [];
      for (var i = 0; i < keys.length; i++) {
        if (headers.indexOf(keys[i]) === -1) {
          missingHeaders.push(keys[i]);
        }
      }
      
      // If there are missing headers, update the header row dynamically
      if (missingHeaders.length > 0) {
        headers = headers.concat(missingHeaders);
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }
    }

    // Build the row data exactly matching the order of the current headers
    var rowData = [];
    for (var j = 0; j < headers.length; j++) {
      var header = headers[j];
      var value = data[header];
      if (value !== undefined && value !== null) {
        rowData.push(typeof value === 'object' ? JSON.stringify(value) : value);
      } else {
        rowData.push(""); // Empty cell for missing fields
      }
    }

    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

Then deploy it:

1. **Deploy -> New deployment**
2. Select **Web app**
3. **Execute as:** Me
4. **Who has access:** Anyone
5. Click **Deploy**, then copy the Web App URL (ends with `/exec`)

### 2) Configure the frontend

Create `.env.local` and set:

`VITE_RSVP_ENDPOINT="https://script.google.com/macros/s/.../exec"`

Restart the dev server after changing env vars.

