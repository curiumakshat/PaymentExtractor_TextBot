require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { parsePaymentDetails } = require('./services/parser');
const { downloadMedia } = require('./services/whatsapp');
const { extractTextFromImage } = require('./services/ocr');
const { appendToSheet } = require('./services/sheets');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Verification Endpoint
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Webhook Handler
app.post('/webhook', async (req, res) => {
    const body = req.body;

    // Check if this is an event from a page subscription
    if (body.object === 'whatsapp_business_account') {
        // Iterate over each entry - there may be multiple if batched
        for (const entry of body.entry) {
            for (const change of entry.changes) {
                const value = change.value;

                if (value.messages && value.messages.length > 0) {
                    const message = value.messages[0];
                    const msgType = message.type;

                    let extractedData = {
                        timestamp: new Date().toISOString(),
                        type: msgType,
                        rawText: '',
                        amount: null,
                        name: null,
                        upi: null,
                        imageURL: ''
                    };

                    try {
                        if (msgType === 'text') {
                            const text = message.text.body;
                            extractedData.rawText = text;
                            const details = parsePaymentDetails(text);
                            Object.assign(extractedData, details);

                        } else if (msgType === 'image') {
                            const imageId = message.image.id;
                            console.log(`Processing image: ${imageId}`);

                            // 1. Download
                            const { buffer, url } = await downloadMedia(imageId);
                            extractedData.imageURL = url;

                            // 2. OCR
                            const ocrText = await extractTextFromImage(buffer);
                            extractedData.rawText = ocrText; // Store OCR text as raw text

                            // 3. Extract
                            const details = parsePaymentDetails(ocrText);
                            Object.assign(extractedData, details);
                        }

                        // Log to Sheets if relevant data found (or just log everything)
                        if (extractedData.amount || extractedData.upi) {
                            console.log('Payment Detected:', extractedData);
                            await appendToSheet(extractedData);
                        } else {
                            console.log('Message received but no payment details found.');
                        }

                    } catch (err) {
                        console.error('Error processing message:', err);
                    }
                }
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
