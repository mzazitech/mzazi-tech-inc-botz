const fs = require('fs')
const chalk = require('chalk')
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname+'/.env' })


global.SESSION_ID = process.env.SESSION_ID || '' 
// Owner Setting
global.xprefix = process.env.BOT_PREFIX ||''
global.owner = ["254750611309"]
global.error = ["6666",]
global.ownername = process.env.OWNER_NAME ||'Mzazi'
global.antidelete = process.env.ANTI_DELETE || true
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Bot Setting
global.botname = "Mzazi Tech Inc. Bot 2026"
global.botversion = "2026.1.0"
global.typebot = "Plugin"
global.session = "trashsession"
global.connect = true
global.statusview = process.env.AUTO_STATUS || true
global.antilinkgc = process.env.ANTILINK_GROUP || true
global.autoTyping = process.env.AUTO_TYPE || false
global.autoRecord = process.env.AUTO_RECORD || false
global.thumb = "https://files.catbox.moe/ixzhu5.jpeg"
global.wagc = "https://chat.whatsapp.com/BPyIptm3ZH68y4pSPrLMyq?mode=r_t"
global.caption = "Mzazi Tech Inc. Bot 2026"
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Sticker Maker
global.packname = process.env.PACK_NAME ||'Mzazi Tech Inc. Bot 2026'
global.author = process.env.AUTHOR||'Mzazi Tech Inc. Bot 2026'
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Respon Message
global.mess = {
    success: 'Done.',
    admin: 'Admin only.',
    premium: 'must be a premium user.',
    botAdmin: 'Make me admin first.',
    owner: 'Owner only.',
    OnlyGrup: 'Group only.',
    private: 'Private chat only.',
    wait: 'Processing...',
    error: 'Error occurred.',
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
// File Update
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update File 📁 : ${__filename}`)
delete require.cache[file]
require(file)
})
