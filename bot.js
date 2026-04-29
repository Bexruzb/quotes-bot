const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN || '8364302087:AAGWaVsPbebwo6A_012SscCKvHNa5AT1Zjo' ;
const bot = new Telegraf(BOT_TOKEN);

const quotes = [
    { text: "Bugun qilgan harakating, ertangi taqdiringni belgilaydi.", author: "Noma'lum", emoji: "🚀" },
    { text: "Muvaffaqiyat — bu kichik urinishlarning yig'indisidir.", author: "Robert Collier", emoji: "💪" },
    { text: "Orzularing katta bo'lsa, qiyinchiliklar kichik ko'rinadi.", author: "Noma'lum", emoji: "✨" },
    { text: "O'zingga ishon, sen allaqachon yarim yo'lni bosib o'tding.", author: "Theodore Roosevelt", emoji: "🔥" },
    { text: "Imkoniyatlar yaratiladi, topilmaydi.", author: "Chris Grosser", emoji: "💎" },
    { text: "Yiqilish emas, qayta turish muhim.", author: "Konfutsiy", emoji: "🏆" },
    { text: "Kecha bilan emas, bugun bilan yasha.", author: "Noma'lum", emoji: "🌅" },
    { text: "Har bir mutaxassis bir paytlar yangi boshlovchi bo'lgan.", author: "Helen Hayes", emoji: "📚" },
];

// 3D Quote yaratish (SVG orqali)
function createQuoteSVG(quoteText, quoteAuthor, emoji) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
        <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0a0a14"/>
                <stop offset="50%" stop-color="#12122a"/>
                <stop offset="100%" stop-color="#0d0d20"/>
            </linearGradient>
            <radialGradient id="glow1" cx="30%" cy="20%" r="50%">
                <stop offset="0%" stop-color="rgba(100,160,255,0.25)"/>
                <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
            </radialGradient>
            <radialGradient id="glow2" cx="70%" cy="55%" r="45%">
                <stop offset="0%" stop-color="rgba(180,130,255,0.2)"/>
                <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
            </radialGradient>
            <filter id="glassBlur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
            </filter>
        </defs>
        
        <!-- Background -->
        <rect width="1080" height="1920" fill="url(#bg)"/>
        <rect width="1080" height="1920" fill="url(#glow1)"/>
        <rect width="1080" height="1920" fill="url(#glow2)"/>
        
        <!-- Glass Card -->
        <rect x="120" y="580" width="840" height="600" rx="28" ry="28" 
              fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
        
        <!-- Title -->
        <text x="540" y="530" text-anchor="middle" fill="#22d3ee" 
              font-family="Georgia, serif" font-size="22" letter-spacing="4">
            ✦ DAILY MOTIVATION ✦
        </text>
        
        <!-- Emoji -->
        <text x="540" y="650" text-anchor="middle" font-size="60">${emoji}</text>
        
        <!-- Quote Text -->
        <text x="540" y="880" text-anchor="middle" fill="#f0e6d3" 
              font-family="Georgia, serif" font-size="42" font-style="italic">
            <tspan x="540" dy="0">"${quoteText}"</tspan>
        </text>
        
        <!-- Divider -->
        <line x1="480" y1="960" x2="600" y2="960" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
        
        <!-- Author -->
        <text x="540" y="1010" text-anchor="middle" fill="#fbbf24" 
              font-family="Georgia, serif" font-size="28" font-style="italic">
            — ${quoteAuthor}
        </text>
        
        <!-- Watermark -->
        <text x="540" y="1140" text-anchor="middle" fill="rgba(255,255,255,0.25)" 
              font-family="Georgia, serif" font-size="18">
            @abdu1aziz_571
        </text>
    </svg>`;
    
    return svg;
}

// SVG dan PNG ga o'tkazish (base64)
function svgToBase64(svgString) {
    const base64 = Buffer.from(svgString).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
}

// /start
bot.start((ctx) => {
    const name = ctx.from.first_name || 'Do\'stim';
    ctx.reply(
        `✨ Assalomu alaykum, *${name}*!\n\n` +
        `Men 3D motivatsion quote'lar botiman.\n\n` +
        `🎨 *Buyruqlar:*\n` +
        `/quote — Oddiy matnli quote\n` +
        `/quote3d — 3D quote rasm\n` +
        `/daily — Kunlik obuna\n` +
        `/help — Yordam\n\n` +
        `💎 @abdu1aziz_571`,
        { parse_mode: 'Markdown' }
    );
});

// /quote
bot.command('quote', (ctx) => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    ctx.reply(`${q.emoji} *"${q.text}"*\n\n— ${q.author}`, { parse_mode: 'Markdown' });
});

// /quote3d — 3D Rasm
bot.command('quote3d', async (ctx) => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    
    await ctx.reply('⏳ 3D quote tayyorlanmoqda...');
    
    try {
        const svg = createQuoteSVG(q.text, q.author, q.emoji);
        const base64 = svgToBase64(svg);
        const buffer = Buffer.from(svg);
        
        // Rasm fayl sifatida yuborish
        const filePath = path.join('/tmp', `quote_${Date.now()}.svg`);
        fs.writeFileSync(filePath, svg);
        
        await ctx.replyWithDocument({ source: filePath, filename: 'quote.svg' });
        
        // Matn ham yuborish
        await ctx.reply(`${q.emoji} *"${q.text}"*\n\n— ${q.author}`, { parse_mode: 'Markdown' });
        
        fs.unlinkSync(filePath);
    } catch (err) {
        console.error('Xatolik:', err.message);
        
        // Xatolik bo'lsa, oddiy matn yuborish
        ctx.reply(`${q.emoji} *"${q.text}"*\n\n— ${q.author}\n\n💎 @yoldoshev_2`, { parse_mode: 'Markdown' });
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
    ctx.reply(
        `📋 *Yordam:*\n\n` +
        `/quote — Oddiy quote\n` +
        `/quote3d — 3D quote rasm\n` +
        `/daily — Kunlik obuna\n` +
        `/help — Yordam\n\n` +
        `💎 *@abdu1aziz_571*`,
        { parse_mode: 'Markdown' }
    );
});

bot.launch();
console.log('🤖 3D Quote Bot ishga tushdi!');
