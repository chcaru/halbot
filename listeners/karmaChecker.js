
"use strict";

class KarmaChecker {
    
    constructor(karmaService, userService, rtmClient) {
        this.karmaService = karmaService;
        this.userService = userService;
        this.rtmClient = rtmClient;
    }
    
    message(message) {
        
        if (!message.text || message.subtype) {
            return;
        }
        
        const matches = message.text.match(/\$karma/ig);
        
        if (!matches) {
            return;
        }
        
        this.userService.enumerateToUsers(message).then(toUsers => {
           
            // When specific individuals are queried
            if (toUsers.length >= 1) {
                
                const responses = 
                    toUsers
                    .map(toUser => 
                        new Promise(resolve =>    
                            this.karmaService.getKarma(toUser.id)
                            .then(karmaScore => 
                                resolve((toUser.profile.real_name || toUser.name) + ': ' + karmaScore)
                            )
                        )
                    );
                
                Promise.all(responses).then(responses => {
                    
                    const response = responses.join('\n');
                    
                    this.rtmClient.sendMessage(response, message.channel);
                });
            }
            // Enumerate leaderboard (top 5)
            else {
                
                this.karmaService.topUsers(5).then(topUsers => {
                   
                    const userHandles = topUsers.map(u => u.name.split('-')[0]);
                    
                    this.userService.enumerateUserHandles(userHandles).then(userInfos => {
                        
                        const response = 
                            _.zip(topUsers, userInfos)
                            .map(u => (u[2].profile.real_name || u[2].name) + ': ' + u[1].karma)
                            .join('\n');
                        
                        this.rtmClient.sendMessage(response, message.channel);
                    });
                });
            }
        });
    }
}

const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

module.exports = {
    name: 'karmaChecker',
    dependencies: ['karmaService', 'userService', 'slackRtmClient'],
    factory: (karmaService, userService, rtmClient) => 
        new KarmaChecker(karmaService, userService, rtmClient),
    events: [
        {
            name: RTM_EVENTS.MESSAGE,
            invoker: (karmaChecker, message) => karmaChecker.message(message)
        }  
    ],
    author: 'chriscaruso'  
};