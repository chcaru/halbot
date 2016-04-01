
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const commands = require('./commands/commands');

for (var command of commands) {
    depend.factory(
        command.name,
        (command.dependencies || []),
        command.factory
    );
}

depend.on('slackRtmClient', rtmClient => {
    
    rtmClient.on(RTM_EVENTS.MESSAGE, message => {
        
        for (var command of commands) {
            
            depend.on(command.name, commandService => {
                
                const identity = commandService.identifies(message);
                if (identity) {
                    commandService.act(message, identity);
                } 
            });  
        }
    });
});