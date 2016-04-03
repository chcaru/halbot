
'use strict';

class AutoResponder {
    
    constructor(rtmClient, userService, easyDb, responses) {
        this.rtmClient = rtmClient;
        this.userService = userService;
        this.easyDb = easyDb;
        this.responses = responses;
    }
    
    message(message) {
        
        this.responses.forEach(response => {
            
            if (!response.skipCount) {
                
                return this.responder(message, response).then(send => {
                    
                    if (send) {
                        send();
                    }
                });
            }
            
            this.responder(message, response).then(send => {
                
                if (!send) {
                    return;
                }
                
                const skipCountId = response.name + '-skipCount';
                this.easyDb.get(skipCountId, 0).then(skipCount => {
                    
                    if (skipCount <= 0) {
                        send();
                    }
                    
                    skipCount = (skipCount + 1) % response.skipCount;
                    
                    this.easyDb.set(skipCountId, skipCount);
                });
            });
        });
    }
    
    responder(message, response) {
        
        if (message.subtype) {
            return Promise.resolve();
        }
        
        const deferred = Promise.defer();
        
        const text = response.caseSensitive || typeof response.match !== 'string' ? 
            (message.text || '') : (message.text || '').toLowerCase();
            
        const match = response.caseSensitive || typeof response.match !== 'string' ? 
            response.match : response.match.toLowerCase();
        
        const self = this;
        if (text.match(match)) {
            
            if (response.to) {
                
                const to = (typeof response.to === 'string' ? [response.to] : response.to);
                
                const messageToHandles = (message.text
                    .match(/<@U[a-z0-9]*>/ig) || [])
                    .map(u => u.substr(2, u.length - 3))
                    .map(u => self.userService.getUserInfo(u));
                
                Promise.all(messageToHandles).then(messageTo => {
                    
                    messageTo = messageTo.map(u => u.user.name);
                    
                    for (var username of messageTo) {
                        
                        if (to.indexOf(username) >= 0) {
                         
                            this.getReply(response, message).then(reply =>
                                deferred.resolve(() => 
                                    this.rtmClient.sendMessage(reply, message.channel)
                                )
                            );
                            
                            break;   
                        }    
                    }  
                });
            }
            else {
                
                this.getReply(response, message).then(reply => 
                    deferred.resolve(() => 
                        this.rtmClient.sendMessage(reply, message.channel)
                    )
                );
            }
        }
        
        return deferred.promise;
    }
    
    getReply(response, message) {
        
        const deferred = Promise.defer();
        
        if (typeof response.reply === 'string') {
            
            deferred.resolve(response.reply);
        }
        else if (typeof response.reply === 'object' && response.reply.length >= 0) {
            
            deferred.resolve(response.reply[Math.floor(Math.random() * response.reply.length)]);
        }
        else if (typeof response.reply === 'function' && response.reply.length <= 1) {
            
            this.handleResponseReply(response, message, null, deferred);
        }
        else if (typeof response.reply === 'function' && response.reply.length >= 2) {
           
            this.userService.getUserInfo(message.user).then(userInfo => 
                this.handleResponseReply(response, message, userInfo, deferred)
            );
        }
        else {
            
            deferred.resolve(this.generateError(response));
        }
            
        return deferred.promise;
    }
    
    handleResponseReply(response, message, userInfo, deferred) {
        
        try {
            
            const reply = response.reply(message, userInfo.user);
            
            if (typeof reply === 'string') {
                
                deferred.resolve(reply);
            }
            else if (typeof reply === 'object' && reply.then) {
                
                reply.then(r => deferred.resolve(r));
            }
            else {
                
                deferred.resolve(this.generateError(response));
            }
        }
        catch(e) {
            
            deferred.resolve(this.generateError(response));
        }
    }
    
    generateError(response) {
        return 'Beep Boop. "' + response.name + '" is broken. Fix it ' +
            ((response.author && '@' + response.author) || 'puny humans') + '!';
    }
    
}

const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

module.exports = {
    name: 'autoResponder',
    dependencies: ['slackRtmClient', 'userService', 'easyDb', 'responses'],
    factory: (rtmClient, userService, easyDb, responses) => 
        new AutoResponder(rtmClient, userService, easyDb, responses),
    events: [
        {
            name: RTM_EVENTS.MESSAGE,
            invoker: (autoResponder, message) => autoResponder.message(message)
        }  
    ],
    author: 'chriscaruso'  
};