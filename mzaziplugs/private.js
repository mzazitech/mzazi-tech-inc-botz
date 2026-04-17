const axios = require("axios");
 
let trashplug = async (m, { trashown,reply,mzazi }) => {
                if (!trashown) return reply(mess.owner)
                mzazi.public = false
                reply('*Successful in Changing To Self Usage*')
            };
            
trashplug.help = ['self']
trashplug.tags = ['private']
trashplug.command = ['private']
 
module.exports = trashplug;