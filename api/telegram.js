/* ============================================================
   Telegram Bot — «Бронежилет для ФОП»
   Vercel Serverless Function (webhook handler)
   ============================================================ */

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_CHAT_ID = process.env.OWNER_CHAT_ID;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ——— Telegram API helpers ———

async function sendMessage(chatId, text, options = {}) {
  const body = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    ...options,
  };
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function notifyOwner(lead) {
  if (!OWNER_CHAT_ID) return;

  const text =
    `🔔 <b>НОВА ЗАЯВКА З ЛЕНДІНГУ!</b>\n\n` +
    `👤 <b>Ім'я:</b> ${lead.name}\n` +
    `📱 <b>Телефон:</b> ${lead.phone}\n` +
    (lead.username ? `💬 <b>Telegram:</b> @${lead.username}\n` : '') +
    `🆔 <b>Chat ID:</b> ${lead.chatId}\n` +
    `🕐 <b>Час:</b> ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}`;

  await sendMessage(OWNER_CHAT_ID, text);
}

// ——— Keyboards ———

const mainKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '📋 Замовити безкоштовний аудит' }],
      [{ text: 'ℹ️ Про послугу' }, { text: '💰 Вартість' }],
    ],
    resize_keyboard: true,
  },
};

const contactKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '📱 Надіслати мій номер телефону', request_contact: true }],
      [{ text: '◀️ Назад до меню' }],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

// ——— Messages ———

const MESSAGES = {
  welcome:
    `👋 Вітаємо у <b>Бухгалтерській компанії Марго Пустотай</b>!\n\n` +
    `Ми — команда з 25+ років досвіду в бухгалтерському супроводі для e-commerce підприємців на Новій Пошті.\n\n` +
    `🛡 Система <b>«Бронежилет для ФОП»</b> — це:\n` +
    `✅ Повне ведення обліку та звітності\n` +
    `✅ Моніторинг лімітів і попередження\n` +
    `✅ Налаштування РРО/ПРРО\n` +
    `✅ Гарантія компенсації штрафів\n\n` +
    `Натисніть кнопку нижче, щоб замовити <b>безкоштовний аудит</b> вашого кабінету платника 👇`,

  audit:
    `📋 <b>Безкоштовний аудит кабінету платника</b>\n\n` +
    `За 15 хвилин ми перевіримо стан вашого кабінету та покажемо, де реальні ризики.\n\n` +
    `Щоб ми могли зв'язатися з вами, будь ласка, <b>надішліть свій номер телефону</b>, натиснувши кнопку нижче 👇\n\n` +
    `<i>Або напишіть номер вручну у форматі +380XXXXXXXXX</i>`,

  about:
    `🛡 <b>Система «Бронежилет для ФОП»</b>\n\n` +
    `Повний бухгалтерський супровід для e-commerce підприємців:\n\n` +
    `1️⃣ <b>Нішева спеціалізація</b> — 100+ клієнтів саме в e-commerce на Новій Пошті\n\n` +
    `2️⃣ <b>Ви не торкаєтесь документів</b> — декларації, ЄСВ, ПРРО, ліміти — все на нас\n\n` +
    `3️⃣ <b>Фінансова відповідальність</b> — штраф з нашої вини = ми компенсуємо\n\n` +
    `4️⃣ <b>Проактивний підхід</b> — моніторимо ліміти, попереджаємо заздалегідь\n\n` +
    `🏆 За 25 років роботи — <b>0 штрафів</b> з вини компанії.\n\n` +
    `Хочете дізнатись більше? Замовте безкоштовний аудит 👇`,

  price:
    `💰 <b>Вартість обслуговування</b>\n\n` +
    `📊 Для порівняння:\n` +
    `• Самостійно (Taxer/Дія) — 500–950 грн/рік\n` +
    `• Бухгалтер-фрілансер — 1–2 000 грн/міс\n` +
    `• <b>Бронежилет для ФОП — від 4 500 грн/міс</b>\n\n` +
    `Це <b>150 грн на день</b> — менше одного штрафу.\n\n` +
    `Для контексту: один штраф за невидачу чека = <b>60 000 грн</b>. Річне обслуговування — вдвічі менше.\n\n` +
    `✅ У вартість входить:\n` +
    `• Повне ведення обліку\n` +
    `• Аудит кабінету при підключенні\n` +
    `• Моніторинг лімітів\n` +
    `• ПРРО для NovaPay\n` +
    `• Консолідація доходів з усіх каналів\n` +
    `• Персональний бухгалтер\n` +
    `• <b>Гарантія компенсації штрафів</b>\n\n` +
    `🎁 + 5 бонусів на суму 44 000 грн\n\n` +
    `Почніть з безкоштовного аудиту 👇`,

  thankYou: (name) =>
    `✅ <b>Дякуємо, ${name}!</b>\n\n` +
    `Вашу заявку на безкоштовний аудит отримано.\n\n` +
    `📞 Ми зателефонуємо вам <b>протягом робочого дня</b> та за 15 хвилин покажемо реальний стан вашого обліку.\n\n` +
    `Якщо у вас є додаткові питання — просто напишіть сюди, ми відповімо.`,

  alreadyApplied:
    `✅ Ви вже залишили заявку! Ми зв'яжемось з вами найближчим часом.\n\n` +
    `Якщо хочете додати інформацію — просто напишіть, і ми передамо вашому бухгалтеру.`,

  fallback:
    `Я поки не розумію цю команду 🤔\n\n` +
    `Скористайтесь кнопками меню нижче або напишіть <b>«АУДИТ»</b> для замовлення безкоштовної перевірки.`,
};

// ——— Phone number validation ———

function extractPhone(text) {
  const cleaned = text.replace(/[\s\-\(\)]/g, '');
  const match = cleaned.match(/^\+?3?8?(0\d{9})$/);
  if (match) return '+38' + match[1];
  const matchFull = cleaned.match(/^(\+380\d{9})$/);
  if (matchFull) return matchFull[1];
  return null;
}

// ——— Main handler ———

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, message: 'Bot is running' });
  }

  try {
    const { message } = req.body;
    if (!message) return res.status(200).json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text || '';
    const firstName = message.from.first_name || 'Клієнт';
    const username = message.from.username || '';

    // ——— Contact shared (phone button) ———
    if (message.contact) {
      const phone = message.contact.phone_number;
      const name = message.contact.first_name || firstName;

      await sendMessage(chatId, MESSAGES.thankYou(name), mainKeyboard);
      await notifyOwner({ name, phone, username, chatId });
      return res.status(200).json({ ok: true });
    }

    // ——— Commands ———

    // /start
    if (text === '/start') {
      await sendMessage(chatId, MESSAGES.welcome, mainKeyboard);
      return res.status(200).json({ ok: true });
    }

    // /myid — utility for owner to get their chat ID
    if (text === '/myid') {
      await sendMessage(chatId, `Ваш Chat ID: <code>${chatId}</code>\n\nДодайте його як OWNER_CHAT_ID у Vercel.`);
      return res.status(200).json({ ok: true });
    }

    // ——— Button: Audit ———
    if (text === '📋 Замовити безкоштовний аудит' || text.toLowerCase().includes('аудит')) {
      await sendMessage(chatId, MESSAGES.audit, contactKeyboard);
      return res.status(200).json({ ok: true });
    }

    // ——— Button: About ———
    if (text === 'ℹ️ Про послугу') {
      await sendMessage(chatId, MESSAGES.about, mainKeyboard);
      return res.status(200).json({ ok: true });
    }

    // ——— Button: Price ———
    if (text === '💰 Вартість') {
      await sendMessage(chatId, MESSAGES.price, mainKeyboard);
      return res.status(200).json({ ok: true });
    }

    // ——— Button: Back ———
    if (text === '◀️ Назад до меню' || text === '/menu') {
      await sendMessage(chatId, 'Головне меню 👇', mainKeyboard);
      return res.status(200).json({ ok: true });
    }

    // ——— Phone number in text ———
    const phone = extractPhone(text);
    if (phone) {
      await sendMessage(chatId, MESSAGES.thankYou(firstName), mainKeyboard);
      await notifyOwner({ name: firstName, phone, username, chatId });
      return res.status(200).json({ ok: true });
    }

    // ——— Forward other messages to owner ———
    if (OWNER_CHAT_ID && text.length > 0) {
      await sendMessage(
        OWNER_CHAT_ID,
        `💬 <b>Повідомлення від клієнта:</b>\n\n` +
          `👤 ${firstName}${username ? ` (@${username})` : ''}\n` +
          `📝 ${text}`
      );
      await sendMessage(chatId, MESSAGES.fallback, mainKeyboard);
    } else {
      await sendMessage(chatId, MESSAGES.fallback, mainKeyboard);
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Bot error:', error);
    return res.status(200).json({ ok: true });
  }
}
