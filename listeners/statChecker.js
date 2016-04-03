
'use strict';

class StatChecker {
    
    constructor(statService, userService, rtmClient) {
        this.statService = statService;
        this.userService = userService;
        this.rtmClient = rtmClient;
    }
    
    message(message) {
        
        if (!message.text || message.subtype) {
            return;
        }
        
        const matches = message.text.match(/\$(stat|stats|statistics)\s?(msgs|messages|msg|message|reaction|reactions)/ig);
        
        if (!matches) {
            return;
        }
        
        this.userService.enumerateToUsers(message).then(toUsers => {
           
            if (toUsers.length >= 1) {
                
                if (matches[0].match(/\$(stat|stats|statistics)\s?(msgs|messages|msg|message)/ig)) {
                    this.messageStatsUsers(message, toUsers);
                }
                else {
                    this.reactionStatsUsers(message, toUsers);
                }
            }
            else {
                
                if (matches[0].match(/\$(stat|stats|statistics)\s?(msgs|messages|msg|message)/ig)) {
                    this.messageStatsTop(message);
                }
                else {
                    this.reactionStatsTop(message);
                }
            }
        });
    }
    
    messageStatsUsers(message, userInfos) {
        
        this.usersStatCount(message, userInfos, u => this.statService.getUserMessageStats(u));
    }
    
    reactionStatsUsers(message, userInfos) {
        
        this.usersStatCount(message, userInfos, u => this.statService.getUserReactionStats(u));
    }
    
    messageStatsTop(message) {
        
        this.topStatCount(message, this.statService.topMessageUsers(5));
    }
    
    reactionStatsTop(message) {
        
        this.topStatCount(message, this.statService.topReactionUsers(5));
    }
    
    usersStatCount(message, userInfos, userStat) {
        
        const responses = 
            userInfos
            .map(toUser => 
                new Promise(resolve =>    
                    userStat(toUser.id)
                    .then(statCount => 
                        resolve((toUser.profile.real_name || toUser.name) + ': ' + statCount)
                    )
                )
            );
        
        Promise.all(responses).then(responses => {
            
            const response = responses.join('\n');
            
            this.rtmClient.sendMessage(response, message.channel);
        });
    }
    
    topStatCount(message, userStat) {
        
        userStat.then(topUsers => {
            
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
}

const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

module.exports = {
    name: 'statChecker',
    dependencies: ['statService', 'userService', 'slackRtmClient'],
    factory: (statService, userService, rtmClient) => 
        new StatChecker(statService, userService, rtmClient),
    events: [
        {
            name: RTM_EVENTS.MESSAGE,
            invoker: (statChecker, message) => statChecker.message(message)
        }
    ],
    author: 'chriscaruso'
};