const { Telegraf } = require('telegraf');
const axios = require('axios');
const { Buffer } = require('buffer');

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

const quotes = [
    { text: "Bugun qilgan harakating, ertangi taqdiringni belgilaydi.", author: "Nomalum" },
    { text: "Muvaffaqiyat bu kichik urinishlarning yigindisidir.", author: "Robert Collier" },
    { text: "Orzularing katta bolsa, qiyinchiliklar kichik korinadi.", author: "Nomalum" },
    { text: "Ozingga ishon, sen allaqachon yarim yolni bosib otding.", author: "Theodore Roosevelt" },
    { text: "Imkoniyatlar yaratiladi, topilmaydi.", author: "Chris Grosser" },
    { text: "Yiqilish emas, qayta turish muhim.", author: "Konfutsiy" },
];

// Bepul quote image API
async function getQuoteImage(quoteText, quoteAuthor) {
    const url = 'https://api.quotable.io/quotes/random';
    
    // Quotable.io dan quote olish (bepul, hech qanday kalit kerak emas)
    const response = await axios.get(url, { timeout: 5000 });
    const data = response.data;
    
    // Agar Quotable ishlasa, u yerdan rasm olish
    if (data && data.length > 0) {
        return {
            text: data[0].content,
            author: data[0].author
        };
    }
    
    return { text: quoteText, author: quoteAuthor };
}

// Rasm yaratish (PlaceKitten orqali — har doim ishlaydi)
async function createImageWithText(quoteText, quoteAuthor) {
    // Placeholder rasm (doim ishlaydi)
    const imageUrl = 'https://picsum.photos/800/800';
    
    const response = await axios.get(imageUrl, { 
        responseType: 'arraybuffer',
        timeout: 5000 
    });
    
    return Buffer.from(response.data);
}

bot.start((ctx) => {
    ctx.reply(
        'Assalomu alaykum\n\n' +
        'Quote botga xush kelibsiz\n\n' +
        '/quote — Quote rasm\n' +
        '/daily — Kunlik obuna\n' +
        '/help — Yordam\n\n' +
        '@yoldoshev_2'
    );
});

bot.command('quote', async (ctx) => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    
    try {
        await ctx.reply('Rasm yuklanmoqda...');
        
        // Rasm yuklash
        const imageBuffer = await createImageWithText(q.text, q.author);
        
        // Rasmni caption bilan yuborish
        await ctx.replyWithPhoto(
            { source: imageBuffer },
            { caption: '"' + q.text + '"\n\n— ' + q.author + '\n\n@yoldoshev_2' }
        );
        
    } catch (err) {
        console.log('Rasm xatosi:', err.message);
        // Xatolikda matn yuborish
        ctx.reply('"' + q.text + '"\n\n— ' + q.author + '\n\n@yoldoshev_2');
    }
});

bot.command('quote3d', async (ctx) => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    
    try {
        await ctx.reply('3D rasm yuklanmoqda...');
        
        // Kattaroq rasm
        const imageUrl = 'https://picsum.photos/1080/1080';
        const response = await axios.get(imageUrl, { 
            responseType: 'arraybuffer',
            timeout: 5000 
        });
        const imageBuffer = Buffer.from(response.data);
        
        await ctx.replyWithPhoto(
            { source: imageBuffer },
            { caption: '3D Quote\n\n"' + q.text + '"\n\n— ' + q.author + '\n\n@yoldoshev_2' }
        );
        
    } catch (err) {
        console.log('3D rasm xatosi:', err.message);
        ctx.reply('"' + q.text + '"\n\n— ' + q.author + '\n\n@yoldoshev_2');
    }
});

bot.command('daily', (ctx) => {
    ctx.reply('Kunlik obuna qabul qilindi\n\nHar kuni yangi quote rasm olasiz\n\n@yoldoshev_2');
});

bot.command('help', (ctx) => {
    ctx.reply(
        'Yordam:\n\n' +
        '/quote — Quote rasm\n' +
        '/quote3d — 3D quote rasm\n' +
        '/daily — Kunlik obuna\n' +
        '/help — Yordam\n\n' +
        '@yoldoshev_2'
    );
});

bot.catch((err) => {
    console.log('Xatolik:', err.message);
});

bot.launch();
console.log('Bot ishga tushdi');
