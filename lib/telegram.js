const https = require('https');

// Escape user input for Telegram's HTML parse mode.
// (Markdown mode rejects messages containing stray _ * [ ` characters,
// which silently dropped notifications for many real messages.)
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Resolves true when Telegram accepted the message, false otherwise. Never rejects.
function sendTelegramNotification(name, email, message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return Promise.resolve(false);

  const text =
    `📬 <b>New Portfolio Message</b>\n\n` +
    `👤 <b>Name:</b> ${escapeHtml(name)}\n` +
    `📧 <b>Email:</b> ${escapeHtml(email)}\n` +
    `💬 <b>Message:</b>\n${escapeHtml(message)}`;

  const body = JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' });

  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${token}/sendMessage`,
    method: 'POST',
    timeout: 8000,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        console.warn(`Telegram API returned status ${res.statusCode}`);
      }
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('timeout', () => req.destroy(new Error('Telegram request timed out')));
    req.on('error', (err) => {
      console.error('Telegram notification failed:', err.message);
      resolve(false);
    });
    req.write(body);
    req.end();
  });
}

module.exports = { sendTelegramNotification };
