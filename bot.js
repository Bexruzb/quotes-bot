const { Telegraf } = require('telegraf');
const fs = require('fs');

// ⚠️ TOKENNI SHU YERGA YOZING
const BOT_TOKEN = '8364302087:AAGWaVsPbebwo6A_012SscCKvHNa5AT1Zjo';
const bot = new Telegraf(BOT_TOKEN);

// Quote'lar
const quotes = [
    { text: "Bugun qilgan harakating, ertangi taqdiringni belgilaydi.", author: "Noma'lum" },
    { text: "Muvaffaqiyat — bu kichik urinishlarning yig'indisidir.", author: "Robert Collier" },
    { text: "Orzularing katta bo'lsa, qiyinchiliklar kichik ko'rinadi.", author: "Noma'lum" },
    { text: "O'zingga ishon, sen allaqachon yarim yo'lni bosib o'tding.", author: "Theodore Roosevelt" },
    { text: "Imkoniyatlar yaratiladi, topilmaydi.", author: "Chris Grosser" },
    { text: "Yiqilish emas, qayta turish muhim.", author: "Konfutsiy" },
];

// /start
bot.start((ctx) => {
    ctx.reply(`✨ Assalomu alaykum, ${ctx.from.first_name}!\n\nMen motivatsion quote'lar botiman.\n\nBuyruqlar:\n/quote — Yangi quote\n/daily — Kunlik obuna\n/help — Yordam`);
});

// /quote
bot.command('quote', (ctx) => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    ctx.reply(`✨ *"${q.text}"*\n\n— ${q.author}`, { parse_mode: 'Markdown' });
});

// /daily
bot.command('daily', (ctx) => {
    const userId = ctx.from.id;
    let users = {};
    try { users = JSON.parse(fs.readFileSync('users.json', 'utf8')); } catch(e) {}
    
    users[userId] = { subscribed: true, date: new Date().toISOString() };
    fs.writeFileSync('users.json', JSON.stringify(users));
    
    ctx.reply('✅ Kunlik quote\'larga obuna bo\'ldingiz!');
});

// /help
bot.help((ctx) => {
    ctx.reply('/quote — Yangi quote\n/daily — Kunlik obuna\n/help — Yordam');
});

bot.launch();
console.log('🤖 Bot ishga tushdi!');