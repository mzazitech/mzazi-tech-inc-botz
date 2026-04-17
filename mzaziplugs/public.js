const axios = require("axios");
 
let trashplug = async (m, { trashown,reply,mzazi }) => {
                if (!trashown) return reply(mess.owner)
                mzazi.private = false
                reply('*Successful in Changing To Self Usage*')
            };
            
trashplug.help = ['public']
trashplug.tags = ['public']
trashplug.command = ['public']
 
module.exports = trashplug;