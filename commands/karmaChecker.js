
"use strict";

class KarmaChecker {
    
    constructor(karmaService, userService, rtmClient) {
        this.karmaService = karmaService;
        this.userService = userService;
        this.rtmClient = rtmClient;
    }
    
    identifies(message) {
        return message.text.match(/\$karma/ig)
    }
    
    act(message, identity) {
        
        var self = this;
        this.userService.enumerateToUsers(message).then(toUsers => {
           
            if (toUsers.length >= 1) {
                
                var responses = 
                    toUsers
                    .map(toUser => 
                        new Promise(resolve =>    
                            self.karmaService.getKarma(toUser.id)
                            .then(karmaScore => 
                                resolve((toUser.profile.real_name || '@' + toUser.name) + ': ' + karmaScore)
                            )
                        )
                    );
                
                Promise.all(responses).then(responses => {
                    
                    var response = responses.join('\n');
                    
                    self.rtmClient.sendMessage(response, message.channel) 
                });
            }
            else {
                
                // Todo top 10
            }
        });
    }
}

module.exports = {
    name: 'karmaChecker',
    dependencies: ['karmaService', 'userService', 'slackRtmClient'],
    factory: (karmaService, userService, rtmClient) => 
        new KarmaChecker(karmaService, userService, rtmClient),
    author: 'chriscaruso'  
};