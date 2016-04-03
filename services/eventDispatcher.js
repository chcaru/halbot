
'use strict';

depend.on(['slackRtmClient', 'listeners'], (rtmClient, listeners) => {

    listeners.forEach(listener => {
        
        depend.factory(
            listener.name,
            (listener.dependencies || []),
            listener.factory
        );
        
        depend.on(listener.name, listenerInstance => {
        
            listener.events.forEach(event => 
                rtmClient.on(event.name, eventData => 
                    event.invoker(listenerInstance, eventData)
                )
            );
        });
    });
});