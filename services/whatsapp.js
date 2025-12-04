const axios = require('axios');

const WA_TOKEN = process.env.WA_TOKEN;

/**
 * Downloads media from WhatsApp Cloud API.
 * @param {string} mediaId - The ID of the media to download.
 * @returns {Promise<Buffer>} - The image buffer.
 */
async function downloadMedia(mediaId) {
    try {
        // Step 1: Get Media URL
        const urlResponse = await axios.get(`https://graph.facebook.com/v17.0/${mediaId}`, {
            headers: { Authorization: `Bearer ${WA_TOKEN}` }
        });

        const mediaUrl = urlResponse.data.url;

        // Step 2: Download Binary
        const binaryResponse = await axios.get(mediaUrl, {
            headers: { Authorization: `Bearer ${WA_TOKEN}` },
            responseType: 'arraybuffer'
        });

        return {
            buffer: Buffer.from(binaryResponse.data),
            url: mediaUrl // Return URL for logging
        };
    } catch (error) {
        console.error('WhatsApp Media Download Error:', error.response ? error.response.data : error.message);
        throw new Error('Failed to download media from WhatsApp');
    }
}

module.exports = { downloadMedia };
