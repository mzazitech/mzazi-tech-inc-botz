const axios = require("axios");
const os = require('os')
let trashplug = async (m, { reply, mzazi }) => {
    const startTime = performance.now();
    const latency = performance.now() - startTime;

    const memoryUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memPercent = ((usedMem / totalMem) * 100).toFixed(1);

    const cpus = os.cpus();
    const cpuModel = cpus[0]?.model || 'Unknown CPU';
    const cpuCores = cpus.length;

    const finalStatus = `🤖 *Mzazi Tech Inc. Bot 2026*

╭─── 🏓 PING RESULT ───╮
│ ⚡ Speed   : ${latency.toFixed(4)} ms
│ 🧠 RAM     : ${(usedMem / 1024 / 1024).toFixed(1)} MB / ${(totalMem / 1024 / 1024).toFixed(1)} MB (${memPercent}%)
│ 💻 CPU     : ${cpuModel}
│ 🔢 Cores   : ${cpuCores}
│ 🖥️ Platform : ${os.platform()} (${os.arch()})
╰──────────────────────╯

> _Powered by Mzazi Tech Inc. 2026_`;

    await m.reply(finalStatus);
};
trashplug.help = ['ping', 'ping2']
trashplug.tags = ['status']
trashplug.command = ['ping', 'ping2']

module.exports = trashplug;
