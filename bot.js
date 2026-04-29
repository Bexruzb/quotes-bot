const { Telegraf } = require('telegraf');
const puppeteer = require('puppeteer');
const fs = require('fs');

const BOT_TOKEN = process.env.BOT_TOKEN || '8364302087:AAGWaVsPbebwo6A_012SscCKvHNa5AT1Zjo';
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
];

// 3D Video yaratish funksiyasi
async function create3DQuoteImage(quoteText, quoteAuthor) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                width: 1080px;
                height: 1920px;
                overflow: hidden;
                background: #0a0a14;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Georgia', serif;
            }
            .bg {
                position: fixed;
                inset: 0;
                background: 
                    radial-gradient(circle at 30% 25%, rgba(100,160,255,0.25) 0%, transparent 50%),
                    radial-gradient(circle at 70% 60%, rgba(180,130,255,0.2) 0%, transparent 45%),
                    linear-gradient(180deg, #0a0a14 0%, #12122a 50%, #0d0d20 100%);
            }
            .card {
                position: relative;
                background: rgba(255,255,255,0.05);
                backdrop-filter: blur(35px);
                border: 1px solid rgba(255,255,255,0.15);
                border-radius: 28px;
                padding: 50px 40px;
                max-width: 700px;
                text-align: center;
                box-shadow: 0 30px 70px rgba(0,0,0,0.5);
            }
            .quote {
                font-size: 42px;
                color: #f0e6d3;
                line-height: 1.5;
                font-style: italic;
                margin-bottom: 20px;
            }
            .divider {
                width: 60px;
                height: 1.5px;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                margin: 0 auto 16px;
            }
            .author {
                font-size: 24px;
                color: #fbbf24;
            }
            .watermark {
                font-size: 18px;
                color: rgba(255,255,255,0.2);
                margin-top: 30px;
            }
        </style>
    </head>
    <body>
        <div class="bg"></div>
        <div class="card">
            <p class="quote">"${quoteText}"</p>
            <div class="divider"></div>
            <p class="author">— ${quoteAuthor}</p>
            <p class="watermark">@abdu1aziz_571</p>
        </div>
    </body>
    </html>
    `;
    
    await page.setContent(html);
    await page.waitForTimeout(500);
    
    const outputPath = `/tmp/quote_${Date.now()}.png`;
    await page.screenshot({ path: outputPath, type: 'png' });
    
    await browser.close();
    return outputPath;
}

// /start
bot.start((ctx) => {
    ctx.reply(`✨ Assalomu alaykum, ${ctx.from.first_name}!\n\nMen 3D motivatsion quote'lar botiman.\n\nBuyruqlar:\n/quote — Oddiy quote\n/quote3d — 3D quote (rasm)\n/daily — Kunlik obuna\n/help — Yordam`);
});

// /quote — Oddiy matn
bot.command('quote', (ctx) => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    ctx.reply(`✨ *"${q.text}"*\n\n— ${q.author}`, { parse_mode: 'Markdown' });
});

// /quote3d — 3D rasm
bot.command('quote3d', async (ctx) => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    
    await ctx.reply('⏳ 3D quote tayyorlanmoqda...');
    
    try {
        const imagePath = await create3DQuoteImage(q.text, q.author);
        await ctx.replyWithPhoto({ source: imagePath });
        await ctx.reply(`✨ *"${q.text}"*\n\n— ${q.author}`, { parse_mode: 'Markdown' });
        fs.unlinkSync(imagePath); // Rasmni o'chirish
    } catch (err) {
        console.error('Xatolik:', err);
        ctx.reply('❌ Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    }
});

// /daily
bot.command('daily', (ctx) => {
    const userId = ctx.from.id;
    let users = {};
    try { users = JSON.parse(fs.readFileSync('users.json', 'utf8')); } catch(e) {}
    users[userId] = { subscribed: true, date: new Date().toISOString() };
    fs.writeFileSync('users.json', JSON.stringify(users));
    ctx.reply('✅ Kunlik 3D quote\'larga obuna bo\'ldingiz!');
});

// /help
bot.help((ctx) => {
    ctx.reply(`📋 *Yordam:*\n\n/quote — Oddiy quote\n/quote3d — 3D quote rasm\n/daily — Kunlik obuna\n/help — Yordam\n\n💎 *@abdu1aziz_571*`, { parse_mode: 'Markdown' });
});

bot.launch();
console.log('🤖 3D Quote Bot ishga tushdi!');
