
'use strict';

class UserService {
    
    constructor(webClient) {
        this.webClient = webClient;
    }
    
    enumerateToUsers(message) {
        
        const messageToHandles = 
            (message.text.match(/<@U[a-z0-9]*>/ig) || [])
            .map(u => u.substr(2, u.length - 3));
        
        return this.enumerateUserHandles(messageToHandles);
    }
    
    enumerateUserHandles(handles) {
        
        handles = handles === 'string' ? [handles] : handles;
        
        return Promise.all(
            handles.map(u => 
                this.getUserInfo(u)
            )
        )
        .then(userInfos => 
            (userInfos || [])
            .filter(u => u.ok).map(u => u.user)
        );
    }
    
    getUserInfo(userHandle) {
        
        return this.webClient.users.info(userHandle);
    }
}

depend.factory(
    'userService',
    ['slackWebClient'],
    webClient => new UserService(webClient)
);