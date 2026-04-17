const axios = require('axios');
let trashplug = async (m, { text,mzazi,reply}) => {
  if (!text) return reply('provide a URL from YouTube!\n\nUse: .ytmp4 https://youtube.com/watch?v=xxxx 360p')

  let [url, quality] = text.split(' ')
  quality = quality || '480p'

  const qualityMap = {
    '1080p': 'Full HD (1080p)',
    '720p': 'HD (720p)',
    '480p': 'SD (480p)',
    '360p': 'Low (360p)',
    '240p': 'Very Low (240p)',
    '144p': 'Tiny (144p)'
  }

  if (!qualityMap[quality]) return m.reply(`Quality must be valid!\n\nprovide a valid format:\n${Object.keys(qualityMap).join(', ')}`)

  try {
    let { data } = await axios.post('https://api.ytmp4.fit/api/video-info', { url }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://ytmp4.fit',
        'Referer': 'https://ytmp4.fit/'
      }
    })

    if (!data || !data.title) throw new Error('Gagal mengambil info video.')

    let { title, duration, channel, views, thumbnail } = data

    await mzazi.sendMessage(m.chat, {
      text: `🎬 *Info Video YouTube:*\n\n📌 Title: ${title}\n📺 Channel: ${channel}\n⏱ Duration: ${duration}\n👁 Views: ${views}\n\n⏳ Quality*${qualityMap[quality]}*...`,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: channel,
          thumbnailUrl: thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: url
        }
      }
    }, { quoted: m })

    let videoRes = await axios.post('https://api.ytmp4.fit/api/download', { url, quality }, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream',
        'Origin': 'https://ytmp4.fit',
        'Referer': 'https://ytmp4.fit/',
      }
    })

    if (!videoRes.headers['content-type'].includes('video')) {
      throw new Error('an error has occurred while fetching the video.')
    }

    let filename = decodeURIComponent(
      (videoRes.headers['content-disposition'] || '').split("filename*=UTF-8''")[1] || `video_${quality}.mp4`
    ).replace(/[\/\\:*?"<>|]/g, '_')

    await mzazi.sendMessage(m.chat, {
      video: Buffer.from(videoRes.data),
      mimetype: 'video/mp4',
      fileName: filename,
      caption: `✅ *Video successfully downloaded!*\n\n📌 Title: ${title}\n🎞️ Quality: ${qualityMap[quality]}\n\nPowered By ${botname}`
    }, { quoted: m })

  } catch (err) {
    reply(`❌ Error: ${err.message}`)
  }
};
trashplug.help = ['ytvid']
trashplug.tags = ['ytvid']
trashplug.command = ['ytvid']


module.exports = trashplug;
