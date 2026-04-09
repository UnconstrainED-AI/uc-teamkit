export function validateBotToken(token) {
  if (!token || typeof token !== "string") return false;
  // Telegram bot tokens look like: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
  return /^\d{8,15}:[A-Za-z0-9_-]{30,50}$/.test(token.trim());
}

export function validateNotEmpty(value) {
  return value && value.trim().length > 0;
}

export function validatePairingCode(code) {
  return code && code.trim().length >= 4 && code.trim().length <= 20;
}
