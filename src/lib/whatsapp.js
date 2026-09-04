/**
 * Formats a phone number and message into a universal WhatsApp API URL
 * that works seamlessly across Mac/Windows WhatsApp desktop app, Web, iOS, and Android.
 */
export function getWhatsAppUrl(phone, message = "") {
  const encodedText = encodeURIComponent(message);
  
  if (!phone) {
    return `https://api.whatsapp.com/send?text=${encodedText}`;
  }

  // Strip all non-digit characters (+, -, spaces, parentheses)
  let clean = phone.toString().replace(/[^0-9]/g, "");

  // If 10 digits (standard Indian mobile number without country code), prepend 91
  if (clean.length === 10) {
    clean = "91" + clean;
  } else if (clean.length === 11 && clean.startsWith("0")) {
    clean = "91" + clean.slice(1);
  }

  return `https://api.whatsapp.com/send?phone=${clean}&text=${encodedText}`;
}
