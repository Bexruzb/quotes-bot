const { Telegraf } = require('telegraf');
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

const quotes = [
    { text: "Bugun qilgan harakating, ertangi taqdiringni belgilaydi.", author: "Nomalum" },
    { text: "Muvaffaqiyat — bu kichik urinishlarning yigindisidir.", author: "Robert Collier" },
    { text: "Orzularing katta bolsa, qiyinchiliklar kichik korinadi.", author: "Nomalum" },
    { text: "Ozingga ishon, sen allaqachon yarim yolni bosib otding.", author: "Theodore Roosevelt" },
    { text: "Imkoniyatlar yaratiladi, topilmaydi.", author: "Chris Grosser" },
    { text: "Yiqilish emas, qayta turish muhim.", author: "Konfutsiy" },
    { text: "Kecha bilan emas, bugun bilan yasha.", author: "Nomalum" },
    { text: "Har bir mutaxassis bir paytlar yangi boshlovchi bolgan.", author: "Helen Hayes" },
];

// Rasm yaratish funksiyasi (Quotable API orqali)
async function generateQuoteImage(quoteText, quoteAuthor) {
    // Beytulik quote image generator
    const url = 'https://image-generator.com/api/quote';
    
    try {
        const response = await axios.get(url, {
            params: {
                text: quoteText,
                author: quoteAuthor,
                theme: 'dark',
                format: 'png'
            },
            responseType: 'arraybuffer',
            timeout: 8000
        });
        
        return Buffer.from(response.data);
    } catch (err) {
        // Agar API ishlamasa, oddiy rasm yasash (HTML orqali emas)
        return null;
    }
}

// Oddiy quote rasm yasash (SVG)
function createQuoteSVG(quoteText, quoteAuthor) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
        <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0a0a14"/>
                <stop offset="100%" stop-color="#12122a"/>
            </linearGradient>
        </defs>
        <rect width="1080" height="1080" fill="url(#bg)"/>
        <rect x="100" y="200" width="880" height="600" rx="30" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
        <text x="540" y="170" text-anchor="middle" fill="#22d3ee" font-family="Georgia,serif" font-size="24">✦ DAILY MOTIVATION ✦</text>
        <text x="540" y="450" text-anchor="middle" fill="#f0e6d3" font-family="Georgia,serif" font-size="38" font-style="italic">"${quoteText}"</text>
        <line x1="450" y1="520" x2="630" y2="520" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
        <text x="540" y="580" text-anchor="middle" fill="#fbbf24" font-family="Georgia,serif" font-size="28">— ${quoteAuthor}</text>
        <text x="540" y="750" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Georgia,serif" font-size="20">@yoldoshev_2</text>
    </svg>`;
    return Buffer.from(svg);
}

bot.start((ctx) => {
    ctx.reply('Assalomu alaykum Men quote botman.\n\n/quote — Yangi quote rasm\n/daily — Kunlik obuna\n/help — Yordam\n\n@yoldoshev_2');
});

bot.command('quote', async (ctx) => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    
    await ctx.reply('Rasm tayyorlanmoqda...');
    
    try {
        // Avval API orqali rasm olish
        let imageBuffer = await generateQuoteImage(q.text, q.author);
        
        // API ishlamasa, SVG yaratish
        if (!imageBuffer) {
            imageBuffer = createQuoteSVG(q.text, q.author);
        }
        
        await ctx.replyWithPhoto({ source: imageBuffer });
        
    } catch (err) {
        console.log('Rasm xatosi:', err.message);
        // Xatolik bo'lsa, matn yuborish
        ctx.reply('"' + q.text + '"\n\n— ' + q.author + '\n\n@yoldoshev_2');
    }
});

bot.command('quote3d', async (ctx) => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    await ctx.reply('3D rasm tayyorlanmoqda...');
    
    try {
        const svgBuffer = createQuoteSVG(q.text, q.author);
        await ctx.replyWithPhoto({ source: svgBuffer });
    } catch (err) {
        ctx.reply('"' + q.text + '"\n\n— ' + q.author + '\n\n@yoldoshev_2');
    }
});

bot.command('daily', (ctx) => {
    ctx.reply('Kunlik obuna qabul qilindi\n\n@yoldoshev_2');
});

bot.command('help', (ctx) => {
    ctx.reply('/quote — Yangi quote rasm\n/quote3d — 3D quote rasm\n/daily — Kunlik obuna\n/help — Yordam\n\n@yoldoshev_2');
});

bot.catch((err) => {
    console.log('Bot xatosi:', err.message);
});

bot.launch();
console.log('Bot ishga tushdi');
