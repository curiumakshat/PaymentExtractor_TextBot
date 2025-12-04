const Tesseract = require('tesseract.js');

/**
 * Performs OCR on an image buffer.
 * @param {Buffer} imageBuffer - The image data.
 * @returns {Promise<string>} - The extracted text.
 */
async function extractTextFromImage(imageBuffer) {
    try {
        const result = await Tesseract.recognize(
            imageBuffer,
            'eng',
            {
                logger: m => console.log(`[OCR] ${m.status}: ${Math.round(m.progress * 100)}%`)
            }
        );
        return result.data.text;
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error('Failed to extract text from image');
    }
}

module.exports = { extractTextFromImage };
