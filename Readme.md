# Bridging the Gap Between UPI Payments and Financial Awareness for College Students

This project is a dedicated WhatsApp Bot designed to bridge the gap between digital UPI payments and financial awareness. By automatically extracting payment details from transaction screenshots and text messages, it helps users (specifically college students) track their expenses effortlessly.

The system uses Optical Character Recognition (OCR) to read payment screenshots and regex-based text analysis to parse transaction details, logging everything into a Google Sheet for easy tracking and analysis.

## 🚀 Features

*   **Automated Expense Tracking**: Automatically detects and logs payment details from WhatsApp messages.
*   **Screenshot Support**: Uses **OCR (Tesseract.js)** to extract text from payment screenshots (e.g., GPay, Paytm, PhonePe).
*   **Text Message Parsing**: Extracts details from standard text messages containing payment info.
*   **Intelligent Extraction**: Identifies:
    *   **Amount** (₹)
    *   **Receiver Name**
    *   **UPI ID**
    *   **Transaction Type** (Image/Text)
*   **Google Sheets Integration**: Logs all extracted data into a centralized Google Sheet in real-time.
*   **Secure & Scalable**: built with Node.js and integrates securely with WhatsApp Cloud API.

## 🛠️ Technical Architecture

### Tech Stack
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/) (Webhook Server)
*   **Messaging API**: [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
*   **OCR Engine**: [Tesseract.js](https://github.com/naptha/tesseract.js)
*   **Database**: Google Sheets (via [Google Sheets API](https://developers.google.com/sheets/api))
*   **Utilities**: Axios (HTTP requests), dotenv (Config management)

### Project Structure
```
d:\paymentbot\
├── services/
│   ├── parser.js      # Regex logic to extract Amount, Name, UPI
│   ├── whatsapp.js    # Handles media downloads from WhatsApp
│   ├── ocr.js         # Tesseract.js implementation for image-to-text
│   └── sheets.js      # Google Sheets API connection and logging
├── index.js           # Main server entry & Webhook handler
├── package.json       # Project dependencies
└── .env               # Environment configuration (Secrets)
```

## 📋 Prerequisites

Before running the project, ensure you have:
1.  **Node.js** installed (v16 or higher).
2.  A **Meta Developer Account** with a WhatsApp App set up.
3.  A **Google Cloud Console Project** with the Sheets API enabled.
4.  A **Service Account** for Google API with `client_email` and `private_key`.

## ⚙️ Installation & Setup

1.  **Clone the Repository** (if applicable) or navigate to the project directory:
    ```bash
    cd d:\paymentbot
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add the following keys:

    ```env
    # Server Configuration
    PORT=3000

    # WhatsApp Cloud API Credentials
    VERIFY_TOKEN=your_custom_verify_token  # Set this in Meta App Dashboard
    WA_TOKEN=your_whatsapp_access_token     # Permanent or Temporary Access Token

    # Google Sheets Configuration
    SPREADSHEET_ID=your_google_sheet_id
    GOOGLE_CLIENT_EMAIL=your_service_account_email
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
    ```

    > **Note**: For `GOOGLE_PRIVATE_KEY`, ensure specific newlines (`\n`) are preserved or handled correctly if copying from a JSON key file.

4.  **Google Sheet Setup**:
    *   Create a new Google Sheet.
    *   Share the sheet (Editor access) with the `GOOGLE_CLIENT_EMAIL` address.
    *   The bot writes to columns A-G: `[Timestamp, Amount, Name, UPI, Type, RawText, ImageURL]`.

## 🏃‍♂️ Usage

1.  **Start the Server**:
    ```bash
    npm start
    ```
    Or for development (with auto-restart):
    ```bash
    npm run dev
    ```

2.  **Expose Localhost (for testing)**:
    Since WhatsApp needs a public URL for webhooks, use a tool like `ngrok`:
    ```bash
    ngrok http 3000
    ```
    Use the generated URL (e.g., `https://your-url.ngrok-free.app/webhook`) in your WhatsApp App Configuration.

3.  **Verify Webhook**:
    *   Go to Meta App Dashboard -> WhatsApp -> Configuration.
    *   Enter the Callback URL (`.../webhook`) and the `VERIFY_TOKEN` you set in `.env`.

4.  **Test It**:
    *   Send a payment screenshot or a text message like "Paid 500 to Alex via UPI" to your WhatsApp Bot number.
    *   Check your Google Sheet for the new entry!

## 🧪 Deployment

This project is ready for deployment on platforms like **Render**, **Heroku**, or **Railway**.
*   **Build Command**: `npm install`
*   **Start Command**: `npm start`
*   Ensure all `.env` variables are set in the cloud provider's dashboard.

## 🤝 Contribution

Feel free to fork this project and submit pull requests to improve the OCR accuracy or add new financial insights features!
