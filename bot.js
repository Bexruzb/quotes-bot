const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

const quotes = [
    { text: "Bugun qilgan harakating, ertangi taqdiringni belgilaydi.", author: "Noma'lum" },
    { text: "Muvaffaqiyat — bu kichik urinishlarning yig'indisidir.", author: "Robert Collier" },
    { text: "Orzularing katta bo'lsa, qiyinchiliklar kichik ko'rinadi.", author: "Noma'lum" },
    { text: "O'zingga ishon, sen allaqachon yarim yo'lni bosib o'tding.", author: "Theodore Roosevelt" },
    { text: "Imkoniyatlar yaratiladi, topilmaydi.", author: "Chris Grosser" },
    { text: "Yiqilish emas, qayta turish muhim.", author: "Konfutsiy" },
    { text: "Kecha bilan emas, bugun bilan yasha.", author: "Noma'lum" },
    { text: "Har bir mutaxassis bir paytlar yangi boshlovchi bo'lgan.", author: "Helen Hayes" },
    { text: "Harakat — omadning kalitidir.", author: "Pablo Pikasso" },
    { text: "O'z vaqtida qilingan ish — eng yaxshi ishdir.", author: "Benjamin Franklin" },
];

bot.start((ctx) => {
    const name = ctx.from.first_name || "Do'stim";
    ctx.reply(
        `✨ Assalomu alaykum, *${name}*!\n\n` +
        `Men professional motivatsion quote'lar botiman.\n\n` +
        `📋 *Buyruqlar:*\n` +
        `/quote — Yangi quote\n` +
        `/quote3d — 3D uslubdagi quote\n` +
        `/daily — Kunlik obuna\n` +
        `/help — Yordam\n\n` +
        `👤 *@yoldoshev_2*`,
        { parse_mode: 'Markdown' }
    );
});

bot.command('quote', (ctx) => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    ctx.reply(
        `✨ *"${q.text}"*\n\n` +
        `— ${q.author}\n\n` +
        `👤 @yoldoshev_2`,
        { parse_mode: 'Markdown' }
    );
});

bot.command('quote3d', (ctx) => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    ctx.reply(
        `🎨 *3D Quote*\n\n` +
        `✨ *"${q.text}"*\n\n` +
        `— ${q.author}\n\n` +
        `━━━━━━━━━━━━━━━\n` +
        `👤 @yoldoshev_2`,
        { parse_mode: 'Markdown' }
    );
});

bot.command('daily', (ctx) => {
    ctx.reply(
        `✅ *Kunlik quote'larga obuna bo'ldingiz!*\n\n` +
        `Har kuni ertalab 8:00 da yangi motivatsion quote olasiz.\n\n` +
        `👤 @yoldoshev_2`,
        { parse_mode: 'Markdown' }
    );
});

bot.help((ctx) => {
    ctx.reply(
        `📋 *Yordam:*\n\n` +
        `/quote — Yangi quote\n` +
        `/quote3d — 3D uslubdagi quote\n` +
        `/daily — Kunlik obuna\n` +
        `/help — Yordam\n\n` +
        `👤 *@yoldoshev_2*`,
        { parse_mode: 'Markdown' }
    );
});

bot.launch();
console.log('🤖 Quote Bot ishga tushdi! @yoldoshev_2');
