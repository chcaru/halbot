
/*

    To add a command, please add a command object to
    the {commands} array below.
    
    // {command} type
    {
        
        // REQUIRED
        // A name that uniquely identifies this command
        // This name is used to load
        name: string,
        
        // REQUIRED
        // A factory to create the Command
        // The Command type should implement:
        //      constructor(...dependencies: any[])
        //      identifies(message): Truthy<any>?
        //      act(message, identity?: Truthy<any>)
        // Where:
        //      {message}: https://api.slack.com/events/message
        //      {identity}: The Truthy<any> value returned by {identifies}
        factory: (...dependencies): Command,
        
        // Optional
        // Default: [] (no dependencies)
        // The name(s) of the dependencies to inject into
        // the command
        dependencies: string[],
        
        // Optional
        author: string
    }

*/

const commands = [
    
    require('./karmaTracker')
    
];

module.exports = commands;