
"use strict";

class KarmaTracker {
    
    constructor(karmaService) {
        this.karmaService = karmaService;
        this.throttler = {};
        this.throttleTimeout = 60000;
    }
    
    message(message) {
        
        if (!message.text || message.subtype) {
            return;
        }
        
        const matches = message.text.match(/<@U[a-z0-9]*>:?(\+\+|--)/ig);
        
        if (!matches) {
            return;
        }
        
        const karmaCommands = matches.filter(c => !c.match(message.user));
            
        const messageToHandles = 
            karmaCommands
            .map(u => u.substr(2, u.length - (u.match(':') ? 6 : 5)));
            
        const karmaChanges = 
            karmaCommands
            .map(u => u.match(/(\+\+|--)/ig)[0] === '++' ? 1 : -1);
        
        const items = _.zip(messageToHandles, karmaChanges);
        
        for (var item of items) {
            
            this.changeKarma(message.user, item[1], item[2]);
        }
    }
    
    changeKarma(senderHandle, userHandle, karmaChange) {
        
        const throttleId = senderHandle + userHandle;
        if (this.throttler[throttleId]) {
            return;
        }
        
        this.throttler[throttleId] = 1;
        setTimeout(() => this.throttler[throttleId] = null, this.throttleTimeout);
        
        this.karmaService.changeKarma(userHandle, karmaChange);
    }
}

const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

module.exports = {
    name: 'karmaTracker',
    dependencies: ['karmaService'],
    factory: karmaService => new KarmaTracker(karmaService),
    events: [
        {
            name: RTM_EVENTS.MESSAGE,
            invoker: (karmaTracker, message) => karmaTracker.message(message)
        }  
    ],
    author: 'chriscaruso'  
};