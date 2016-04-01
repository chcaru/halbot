
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const responses = require('./responses');

depend.on(['slackRtmClient', 'easyDb'], (rtmClient, easyDb) => {

    function responder(message, response) {
        
        const text = response.caseSensitive ? message.text : message.text.toLowerCase();
        const match = response.caseSensitive ? response.match : response.match.toLowerCase();
        
        if (text.match(match)) {
            
            rtmClient.sendMessage(response.reply, message.channel);
        }
    }
    
    rtmClient.on(RTM_EVENTS.MESSAGE, message => {

        responses.forEach(response => {
            
            if (!response.skipCount) {
                return responder(message, response);
            }
            
            const skipCountId = response.name + '-skipCount';
            easyDb.get(skipCountId, 0).then(skipCount => {
                
                if (skipCount <= 0) {
                    responder(message, response);
                }
                
                skipCount = (skipCount + 1) % response.skipCount;
                
                easyDb.set(skipCountId, skipCount);
            });
        }); 
    });
})