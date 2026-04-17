const axios = require('axios');
let trashplug = async (m, {mzazi,reply,trashpic,fkontak}) => {
  try {
    let me = m.sender;
 const response = await axios.get(`https://api.github.com/repos/Tennor-modz/mzazi-system`)
    if (response.status === 200) {
      const repoData = response.data
      const repos = `
*BOT NAME:*
> ${repoData.name}

*STARS:* 
> ${repoData.stargazers_count}

*FORKS:* 
> ${repoData.forks_count}

*GITHUB LINK:* 
https://github.com/Tennor-modz/mzazi-system 

@${me.split("@")[0]}👋, Star ⭐ fork and deploy my repo 🤭

> 𝐌𝐎𝐍𝐄𝐘𝐇𝐄𝐈𝐒𝐓 𝐀𝐈`;
mzazi.sendMessage(m.chat, { text : repos,
contextInfo: {
mentionedJid: [m.sender],
forwardingScore: 99, 
isForwarded: true, 
forwardedNewsletterMessageInfo: {
newsletterJid: '120363418618707597@newsletter',
serverMessageId: 20,
newsletterName: '𝐌𝐎𝐍𝐄𝐘𝐇𝐄𝐈𝐒𝐓 𝐀𝐈'
},
externalAdReply: {
title: "𝐌𝐎𝐍𝐄𝐘𝐇𝐄𝐈𝐒𝐓 𝐀𝐈", 
body: "𝐌𝐎𝐍𝐄𝐘𝐇𝐄𝐈𝐒𝐓 𝐀𝐈",
thumbnail: replypic, 
sourceUrl: null,
mediaType: 1
}}}, { quoted : fkontak })
    } else {
      await reply(`Failed to fetch repository data!`)
    }
  } catch (error) {
    console.error(error)
    await reply(`Couldn't find repository!`)
  }
};
trashplug.help = ['sc']
trashplug.tags = ['script']
trashplug.command = ['repo']


module.exports = trashplug;
