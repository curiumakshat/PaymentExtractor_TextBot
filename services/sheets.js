const { google } = require('googleapis');

// Load credentials from environment or file
// For simplicity, we assume a 'google-creds.json' file is present or env vars are set
// In a real app, you might parse process.env.GOOGLE_CREDS_JSON
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function appendToSheet(data) {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: 'google-creds.json', // User must provide this
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Data format: [Timestamp, Amount, Name, UPI, Type, RawText, ImageURL]
        const values = [
            [
                data.timestamp,
                data.amount,
                data.name,
                data.upi,
                data.type,
                data.rawText,
                data.imageURL || ''
            ]
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A:G', // Appends to the first available row in columns A-G
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        });

        console.log('Data appended to Google Sheet');
    } catch (error) {
        console.error('Google Sheets Error:', error);
        // Don't throw, just log, so the bot doesn't crash
    }
}

module.exports = { appendToSheet };
