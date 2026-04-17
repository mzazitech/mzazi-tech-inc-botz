const axios = require('axios');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

let trashplug = async (m, { reply, text, mzazi }) => {
  try {
    if (!text) {
      return reply('Usage: .play <song name or YouTube link>');
    }

    let video;

    // 🔍 Detect YouTube link or perform search
    if (text.includes('youtube.com') || text.includes('youtu.be')) {
      video = { url: text };
    } else {
      const search = await yts(text);
      if (!search || !search.videos.length) {
        return reply('❌ No results found.');
      }
      video = search.videos[0];
    }

    // 🖼️ Send thumbnail preview
    await mzazi.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: `🎵 Downloading: *${video.title || 'Unknown Title'}*\n⏱ Duration: ${video.timestamp || 'Unknown'}\n\nPlease wait...`,
    }, { quoted: m });

    // 🎧 Use PrivateZia API
    const apiUrl = `https://api.privatezia.biz.id/api/downloader/ytmp3?url=${encodeURIComponent(video.url)}`;
    const res = await axios.get(apiUrl, { timeout: 30000 });

    if (!res.data || !res.data.status || !res.data.result?.downloadUrl) {
      throw new Error('⚠️ PrivateZia API failed to return a valid download link.');
    }

    const downloadUrl = res.data.result.downloadUrl;
    const title = (video.title || 'song').replace(/[^a-zA-Z0-9 ]/g, '');
    const outputFile = path.join(__dirname, `${title}.mp3`);

    // 📥 Download and convert with ffmpeg
    const response = await axios({
      url: downloadUrl,
      method: 'GET',
      responseType: 'stream',
    });

    await new Promise((resolve, reject) => {
      ffmpeg(response.data)
        .toFormat('mp3')
        .save(outputFile)
        .on('end', resolve)
        .on('error', reject);
    });

    // 🎶 Send audio file
    const caption = `
🎶 *${video.title}*
⏱️ Duration: ${video.timestamp || 'Unknown'}
👤 Channel: ${video.author?.name || 'Unknown'}
📎 URL: ${video.url}

® 𝐌𝐎𝐍𝐄𝐘𝐇𝐄𝐈𝐒𝐓 𝐀𝐈
    `;

    await mzazi.sendMessage(m.chat, {
      audio: { url: outputFile },
      mimetype: 'audio/mpeg',
      ptt: false, // change to true for voice note style
      fileName: `${title}.mp3`,
      caption,
      contextInfo: {
        externalAdReply: {
          title: video.title,
          body: video.author?.name || '',
          thumbnailUrl: video.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: video.url,
        },
      },
    }, { quoted: m });

    fs.unlinkSync(outputFile); // 🧹 Delete temp file
  } catch (err) {
    console.error('Playdoc command error:', err);
    reply('❌ Failed to download song. The API might be down or the link is invalid.');
  }
};

trashplug.help = ['play'];
trashplug.tags = ['downloader'];
trashplug.command = ['play'];

module.exports = trashplug;