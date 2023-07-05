const moment = require('moment');


function formatMessage(username, text){
    return{
        username,
        text,
        time: moment().format('h:mm a')                        // format is hour:min min am/pm
    }
}

// export this module

module.exports = formatMessage;