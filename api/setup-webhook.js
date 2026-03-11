/* ============================================================
   One-time webhook setup endpoint
   Call: GET /api/setup-webhook?secret=YOUR_BOT_TOKEN_LAST_8_CHARS
   ============================================================ */

export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const secret = req.query.secret;

  // Simple auth: last 8 chars of bot token
  if (!secret || !BOT_TOKEN || secret !== BOT_TOKEN.slice(-8)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Determine the webhook URL from the request
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const webhookUrl = `${proto}://${host}/api/telegram`;

  // Set webhook
  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message'],
        drop_pending_updates: true,
      }),
    }
  );

  const result = await response.json();

  // Set bot commands menu
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      commands: [
        { command: 'start', description: 'Почати роботу з ботом' },
        { command: 'menu', description: 'Головне меню' },
      ],
    }),
  });

  // Set bot description
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setMyDescription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description:
        'Бухгалтерська компанія Марго Пустотай — бухгалтерський супровід для e-commerce. Замовте безкоштовний аудит кабінету платника!',
    }),
  });

  // Set short description
  await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setMyShortDescription`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        short_description: 'Безкоштовний аудит кабінету платника для ФОП e-commerce',
      }),
    }
  );

  return res.status(200).json({
    webhook: result,
    webhookUrl,
    message: 'Webhook set! Now message /myid to the bot to get your OWNER_CHAT_ID.',
  });
}
