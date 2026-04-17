const axios = require('axios');
const fs = require("fs");
const path = require("path");
const yts = require("yt-search");

let trashplug = async (m, { command, prefix, reply, text, mzazi }) => {
  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const formatStylishReply = (message) => {
    return `◈━━━━━━━━━━━━━━━━◈\n│❒ ${message}\n◈━━━━━━━━━━━━━━━━◈\n> 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐌𝐳𝐚𝐳𝐢 𝐒𝐲𝐬𝐭𝐞𝐦𝐬`;
  };

  if (!text) {
    return mzazi.sendMessage(m.chat, {
      text: formatStylishReply("Yo, drop a song name, fam! 🎵 Ex: .play Not Like Us")
    }, { quoted: m });
  }

  if (text.length > 100) {
    return mzazi.sendMessage(m.chat, {
      text: formatStylishReply("Keep it short, homie! Song name max 100 chars. 📝")
    }, { quoted: m });
  }

  try {
    const searchQuery = `${text} official`;
    const searchResult = await yts(searchQuery);
    const video = searchResult.videos[0];

    if (!video) {
      return mzazi.sendMessage(m.chat, {
        text: formatStylishReply("No tunes found, bruh! 😕 Try another search!")
      }, { quoted: m });
    }

    const apiUrl = `https://api.privatezia.biz.id/api/downloader/ytmp3?url=${encodeURIComponent(video.url)}`;                                                                            
    const response = await axios.get(apiUrl);
    const apiData = response.data;

    if (!apiData.status || !apiData.result || !apiData.result.downloadUrl) {
      throw new Error("API failed to process the video");
    }

    const timestamp = Date.now();
    const fileName = `audio_${timestamp}.mp3`;
    const filePath = path.join(tempDir, fileName);

    const audioResponse = await axios({
      method: "get",
      url: apiData.result.downloadUrl,
      responseType: "stream",
      timeout: 600000,
    });

    const writer = fs.createWriteStream(filePath);
    audioResponse.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
      throw new Error("Download failed or file is empty");
    }

    await mzazi.sendMessage(m.chat, {
      text: formatStylishReply(`Droppin' *${apiData.result.title || video.title}* for ya, fam! Crank it up! 🔥🎧`)
    }, { quoted: m });

    await mzazi.sendMessage(m.chat, {
      audio: { url: filePath },
      mimetype: "audio/mpeg",
      fileName: `${(apiData.result.title || video.title).substring(0, 100)}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: apiData.result.title || video.title,
          body: `${video.author.name || "Unknown Artist"} | 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐌𝐳𝐚𝐳𝐢 𝐒𝐲𝐬𝐭𝐞𝐦𝐬`,
          thumbnailUrl: apiData.result.thumbnail || video.thumbnail || "https://via.placeholder.com/120x90",                       
          sourceUrl: video.url,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    }, { quoted: m });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    await mzazi.sendMessage(m.chat, {
      text: formatStylishReply(`Yo, we hit a snag: ${error.message}. Pick another track! 😎`)
    }, { quoted: m });
  }
};



trashplug.help = ['song'];
trashplug.tags = ['downloader'];
trashplug.command = ['song'];

module.exports = trashplug;