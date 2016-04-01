
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const responses = require('./responses');

depend.on(['slackRtmClient', 'slackWebClient', 'easyDb'], (rtmClient, webClient, easyDb) => {
    
    function generateError(response) {
        return 'Beep Boop. "' + response.name + '" is broken. Fix it ' +
            ((response.author && '@' + response.author) || 'puny humans') + '!';
    }
    
    function handleResponseReply(response, message, userInfo, deferred) {
        
        try {
            
            const reply = response.reply(message, userInfo.user);
            
            if (typeof reply == 'string') {
                
                deferred.resolve(reply);
            }
            else if (typeof reply == 'object' && reply.then) {
                
                reply.then(r => deferred.resolve(r));
            }
            else {
                
                deferred.resolve(generateError(response));
            }
        }
        catch(e) {
            
            deferred.resolve(generateError(response));
        }
    }
    
    function getReply(response, message) {
        
        const deferred = Promise.defer();
        
        if (typeof response.reply == 'string') {
            
            deferred.resolve(response.reply);
        }
        else if (typeof response.reply == 'object' && response.reply.length >= 0) {
            
            deferred.resolve(response.reply[Math.floor(Math.random() * response.reply.length)]);
        }
        else if (typeof response.reply == 'function' && response.reply.length <= 1) {
            
            handleResponseReply(response, message, null, deferred);
        }
        else if (typeof response.reply == 'function' && response.reply.length >= 2) {
           
            webClient.users.info(message.user).then(userInfo => 
                handleResponseReply(response, message, userInfo, deferred)
            );
        }
        else {
            
            deferred.resolve(generateError(response));
        }
            
        return deferred.promise;
    }
    
    function responder(message, response) {
        
        const text = response.caseSensitive || typeof response.match != 'string' ? 
            (message.text || '') : (message.text || '').toLowerCase();
        const match = response.caseSensitive || typeof response.match != 'string' ? 
            response.match : response.match.toLowerCase();
        
        if (text.match(match)) {
            
            if (response.to) {
                
                var to = (typeof response.to == 'string' ? [response.to] : response.to);
                
                var messageToHandles = (message.text
                    .match(/<@U[a-z0-9]*>/ig) || [])
                    .map(u => u.substr(2, u.length - 3))
                    .map(u => webClient.users.info(u));
                
                Promise.all(messageToHandles).then(messageTo => {
                    
                    messageTo = messageTo.map(u => u.user.name);
                    
                    for (var username of messageTo) {
                        
                        if (to.indexOf(username) >= 0) {
                         
                            getReply(response, message).then(reply => 
                                rtmClient.sendMessage(reply, message.channel)
                            );
                            break;   
                        }    
                    }  
                });
            }
            else {
                
                getReply(response, message).then(reply => 
                    rtmClient.sendMessage(reply, message.channel)
                );
            }
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
    
});