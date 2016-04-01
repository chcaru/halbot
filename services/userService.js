
"use strict";

class UserService {
    
    constructor(webClient) {
        this.webClient = webClient;
    }
    
    enumerateToUsers(message) {
        
        const deferred = Promise.defer();
        
        var messageToHandles = 
            (message.text.match(/<@U[a-z0-9]*>/ig) || [])
            .map(u => u.substr(2, u.length - 3))
            .map(u => this.webClient.users.info(u));
        
        Promise.all(messageToHandles).then(messageToUsers => {
          
            messageToUsers = 
                (messageToUsers || [])
                .filter(u => u.ok)
                .map(u => u.user);  
            
            deferred.resolve(messageToUsers);
        });
        
        return deferred.promise;
    }
}

depend.factory(
    'userService',
    ['slackWebClient'],
    webClient => new UserService(webClient)
);