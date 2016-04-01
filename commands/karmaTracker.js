
"use strict";

class KarmaTracker {
    
    constructor(easyDb) {
        this.easyDb = easyDb;
    }
    
    identifies(message) {
        return message.text.match(/<@U[a-z0-9]*>(\+\+|--)/ig);
    }
    
    act(message, identity) {
        
        var karmaCommands = 
            (identity || message.text.match(/<@U[a-z0-9]*>(\+\+|--)/ig) || [])
            .filter(c => !c.match(message.user));
            
        var messageToHandles = karmaCommands
            .map(u => u.substr(2, u.length - 5));
            
        var karmaChanges = karmaCommands
            .map(u => u.match(/(\+\+|--)/ig)[0] == '++' ? 1 : -1);
        
        var items = _.zip(messageToHandles, karmaChanges);
        
        for (var item of items) {
            
            const userKarmaIdentitier = item[1] + '-karma';
            
            this.easyDb.get(userKarmaIdentitier, 0).then(userKarmaPoints => {
                
                 userKarmaPoints += item[2];
                 console.log(item[1], userKarmaPoints)
                 this.easyDb.set(userKarmaIdentitier, userKarmaPoints);
            });
        }
    }
}

const commandName = 'karmaTracker';

module.exports = {
    name: commandName,
    dependencies: ['easyDb'],
    factory: easyDb => new KarmaTracker(easyDb),
    author: 'chriscaruso'  
};