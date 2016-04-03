
'use strict';

/*

    To add a listener, please add a listener object to
    the {listeners} array below.
    
    // {listener} type
    {
        
        // REQUIRED
        // A name that uniquely identifies this listener
        // This name is used to load
        name: string,
        
        // REQUIRED
        // A factory to create the Listener
        // The dependencies are specified below
        factory: (...dependencies): Listener,
        
        // REQUIRED 
        // These specify what the listener listens for
        // and where to send each type of event
        // See: https://github.com/slackhq/node-slack-client/blob/master/lib/clients/events/rtm.js
        // And see: https://api.slack.com/events
        // The EventSelector type should implement:
        //      name: string,
        //      invoker: (listener: Listener, eventData: any): void
        // Where:
        //      {name}: is the event name (see links above)
        //      {invoker}: is a function to invoke when the event is fired.
        //          The invoker will be given {listener} as the Listener 
        //          provided by the factory.
        //      {eventData}: is the event data from the specified event
        events: EventSelector[]
        
        // Optional
        // Default: [] (no dependencies)
        // The name(s) of the dependencies to inject into
        // the listener
        dependencies: string[],
        
        // Optional
        author: string
    }

*/

const listeners = [
    
    require('../listeners/karmaTracker'),
    require('../listeners/karmaChecker'),
    require('../listeners/statTracker'),
    require('../listeners/statChecker'),
    require('../listeners/autoResponder')
    
];

depend.factory('listeners', [], () => listeners);