
"use strict";

class KarmaTracker {
    
    constructor(karmaService) {
        this.karmaService = karmaService;
        this.throttler = {};
        this.throttleTimeout = 60000;
    }
    
    identifies(message) {
        return message.text.match(/<@U[a-z0-9]*>(\+\+|--)/ig);
    }
    
    act(message, identity) {
        
        if (this.throttler[message.user]) {
            return;
        }
        
        this.throttler[message.user] = message.user;
        setTimeout(() => {
            this.throttler[message.user] = null;
        }, this.throttleTimeout)
        
        const karmaCommands = 
            (identity || message.text.match(/<@U[a-z0-9]*>(\+\+|--)/ig) || [])
            .filter(c => !c.match(message.user));
            
        const messageToHandles = karmaCommands
            .map(u => u.substr(2, u.length - 5));
            
        const karmaChanges = karmaCommands
            .map(u => u.match(/(\+\+|--)/ig)[0] == '++' ? 1 : -1);
        
        const items = _.zip(messageToHandles, karmaChanges);
        
        for (var item of items) {
            
            this.karmaService.changeKarma(item[1], item[2]);
        }
    }
}

module.exports = {
    name: 'karmaTracker',
    dependencies: ['karmaService'],
    factory: karmaService => new KarmaTracker(karmaService),
    author: 'chriscaruso'  
};