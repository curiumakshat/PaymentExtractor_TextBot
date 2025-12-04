/**
 * Extracts payment details from text using Regex.
 * @param {string} text - The raw text to parse.
 * @returns {object} - Extracted details (amount, name, upi).
 */
function parsePaymentDetails(text) {
  if (!text) return { amount: null, name: null, upi: null };

  // Regex Patterns
  // Amount: Matches ₹, Rs, INR followed by digits
  const amountRegex = /(?:rs\.?|inr|₹)\s*(\d+(?:\.\d{2})?)/i;
  
  // Name: Matches text between 'to' and 'UPI'
  // Example: "Paid ₹250 to Rohit UPI..."
  const nameRegex = /to\s+([a-zA-Z\s]+)(?=\s+UPI)/i;
  
  // UPI: Matches UPI ID pattern
  const upiRegex = /UPI\s+([a-zA-Z0-9.\-_]+@[a-zA-Z]+)/i;

  // Execution
  const amountMatch = text.match(amountRegex);
  const nameMatch = text.match(nameRegex);
  const upiMatch = text.match(upiRegex);

  return {
    amount: amountMatch ? amountMatch[1] : null,
    name: nameMatch ? nameMatch[1].trim() : null,
    upi: upiMatch ? upiMatch[1] : null
  };
}

module.exports = { parsePaymentDetails };
