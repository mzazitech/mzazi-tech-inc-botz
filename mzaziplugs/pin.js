const axios = require('axios');
const fetch = require('node-fetch');
let trashplug = async (m, { text,mzazi,reply}) => {
  if (!text) return m.reply('❌ Provide a URL Pinterest!\nUse: .pinterestdl https://pin.it/2NCffxXoN');

  try {
    await mzazi.sendMessage(m.chat, {
      react: { text: '⏰', key: m.key }
    });

    const res = await fetch(`https://api.nekorinn.my.id/downloader/pinterest?url=${encodeURIComponent(text)}`);
    const data = await res.json();

    if (!data.status || !data.result || !data.result.medias?.length) {
      return reply('❌ provide a valid media link.');
    }

    const media = data.result.medias.find(m => m.extension === 'mp4') ||
                  data.result.medias.find(m => m.extension === 'jpg');

    if (!media) return reply('❌ provide a valid media.');

    const caption = `📌 *Pinterest Downloader*\n\n🎞️ *Title:* ${data.result.title}\n💾 *Size:* ${media.formattedSize || '-'}\n📎 *Share:* ${text}`;
    const type = media.extension === 'mp4' ? 'video' : 'image';

    await mzazi.sendMessage(m.chat, {
      [type]: { url: media.url },
      caption
    }, { quoted: m });

  } catch (err) {
    console.error('PinterestDL Error:', err);
    reply('❌failed to download Pinterest media.');
  }
};

trashplug.help = ['pin']
trashplug.tags = ['pin']
trashplug.command = ['pinterestdl']


module.exports = trashplug;