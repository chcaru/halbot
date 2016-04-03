
"use strict";

class StatTracker {
    
    constructor(statService) {
        this.statService = statService;
    }
    
    message(message) {
        
        if (!message.subtype && message.text) {
            this.statService.addMessage(message.user);
        }
    }
    
    reaction(reaction) {
        
        if (reaction.item_user !== reaction.user) {
            this.statService.addReaction(reaction.item_user);
        }
    }
}

const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

module.exports = {
    name: 'statTracker',
    dependencies: ['statService'],
    factory: statService => new StatTracker(statService),
    events: [
        {
            name: RTM_EVENTS.MESSAGE,
            invoker: (statTracker, message) => statTracker.message(message)
        },
        {
            name: RTM_EVENTS.REACTION_ADDED,
            invoker: (statTracker, reaction) => statTracker.reaction(reaction)
        }
    ],
    author: 'chriscaruso'
};