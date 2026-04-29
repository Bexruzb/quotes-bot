const { Telegraf } = require('telegraf');
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

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

// 3D Quote Rasm yaratish (Canvas orqali)
async function create3DQuoteImage(quoteText, quoteAuthor) {
    const width = 1080;
    const height = 1920;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Orqa fon gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0a0a14');
    bgGrad.addColorStop(0.5, '#12122a');
    bgGrad.addColorStop(1, '#0d0d20');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Yorug'lik effektlari
    const glow1 = ctx.createRadialGradient(300, 400, 0, 300, 400, 600);
    glow1.addColorStop(0, 'rgba(100, 160, 255, 0.2)');
    glow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, width, height);

    const glow2 = ctx.createRadialGradient(750, 1000, 0, 750, 1000, 500);
    glow2.addColorStop(0, 'rgba(180, 130, 255, 0.15)');
    glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, width, height);

    // Glassmorphism karta
    const cardX = 140;
    const cardY = 600;
    const cardW = 800;
    const cardH = 600;

    // Karta soyasi
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 50;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 20;

    // Karta fon
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    roundRect(ctx, cardX, cardY, cardW, cardH, 28);
    ctx.fill();

    // Soya o'chirish
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Karta chegarasi
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, cardX, cardY, cardW, cardH, 28);
    ctx.stroke();

    // Quote matni
    ctx.fillStyle = '#f0e6d3';
    ctx.font = 'italic 42px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Matnni qatorlarga bo'lish
    const words = quoteText.split(' ');
    const lines = [];
    let currentLine = '';
    const maxWidth = cardW - 80;

    for (const word of words) {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine !== '') {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine.trim());

    // Matnni chizish
    ctx.fillStyle = '#f0e6d3';
    const lineHeight = 60;
    const startY = cardY + cardH / 2 - (lines.length - 1) * lineHeight / 2;

    lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, startY + i * lineHeight);
    });

    // Ajratuvchi chiziq
    const dividerY = startY + lines.length * lineHeight + 20;
    const dividerGrad = ctx.createLinearGradient(width / 2 - 60, 0, width / 2 + 60, 0);
    dividerGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    dividerGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    dividerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = dividerGrad;
    ctx.fillRect(width / 2 - 60, dividerY, 120, 1.5);

    // Muallif
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'italic 28px Georgia, serif';
    ctx.fillText(`— ${quoteAuthor}`, width / 2, dividerY + 50);

    // Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = '20px Georgia, serif';
    ctx.fillText('@abdu1aziz_571', width / 2, cardY + cardH - 40);

    // Yuqori sarlavha
    ctx.fillStyle = '#22d3ee';
    ctx.font = '18px Georgia, serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('✦ DAILY MOTIVATION ✦', width / 2, cardY - 40);

    // Rasmni saqlash
    const outputPath = path.join('/tmp', `quote_${Date.now()}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    return outputPath;
}

// roundRect yordamchi funksiyasi
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

// /start
bot.start((ctx) => {
    ctx.reply(`✨ Assalomu alaykum, ${ctx.from.first_name}!\n\nMen 3D motivatsion quote'lar botiman.\n\nBuyruqlar:\n/quote — Oddiy quote\n/quote3d — 3D quote rasm\n/daily — Kunlik obuna\n/help — Yordam`);
});

// /quote
bot.command('quote', (ctx) => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    ctx.reply(`✨ *"${q.text}"*\n\n— ${q.author}`, { parse_mode: 'Markdown' });
});

// /quote3d
bot.command('quote3d', async (ctx) => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    
    await ctx.reply('⏳ 3D quote tayyorlanmoqda...');
    
    try {
        const imagePath = await create3DQuoteImage(q.text, q.author);
        await ctx.replyWithPhoto({ source: imagePath });
        fs.unlinkSync(imagePath);
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
    ctx.reply(`📋 *Yordam:*\n\n/quote — Oddiy quote\n/quote3d — 3D quote rasm\n/daily — Kunlik obuna\n/help — Yordam\n\n💎 *@yoldoshev_2*`, { parse_mode: 'Markdown' });
});

bot.launch();
console.log('🤖 3D Quote Bot ishga tushdi!');
