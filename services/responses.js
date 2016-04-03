
'use strict';

/*

    To add a new response, simply add an object
    to the {responses} array below of the following type: 
    
    // response type
    {
        // REQUIRED
        // The unique name of the response.
        // This is use by HAL for multiple unique identification
        // purposes, which include yelling at you if your response
        // break, so make sure it's unique!
        name: string,
        
        // REQUIRED
        // Used by HAL to determine if he should respond to a message.
        // If {match} is of type string, the message's text is checked
        // to contain the {match} string, and doesn't require a full match.
        // If {match} is of type RegExp, the message's text is matched using
        // the provided RegExp.
        match: string / RegExp,
        
        // REQUIRED
        // If {reply} is a string[], a message will randomly be choosen from the list
        // For {message} and {sender} parameters when {reply} is a function, see: 
        //      {message}: https://api.slack.com/events/message
        //      {sender}: https://api.slack.com/methods/users.info
        reply: string | string[] | (message, sender?): string | Promise<string>,
        
        // Optional
        // Determines if HAL ignores case when matching.
        // Only applies when {match} is of type string!
        caseSensitive: boolean,
        
        // Optional
        // Default: 1
        // The number of times HAL will wait to reply to this response
        skipCount: number, 
        
        // Optional
        // Good if the response breaks (HAL will yell at you!)
        // This should be your Slack team username for example: 'hal'
        author: string, 
        
        // Optional
        // Default: HAL considers all messages
        // When {to} is a string[], HAL looks for any
        // of the members contained in {to}, not all!
        // {to} should be, or contain, Slack team username(s),
        // for example: 'hal' or ['hal']
        to: string | string[],
    }

*/

const responses = [
    
    {
        name: 'C# is better (than Java)',
        match: 'java',
        caseSensitive: false,
        reply: 'C# is better. :caruso:',
        skipCount: 3,
        author: 'chriscaruso'
    },
    {
        name: 'HAL takeover!',
        match: /open the (pod bay|podbay) doors/ig,
        caseSensitive: false,
        to: ['hal'],
        author: 'chriscaruso',
        reply: (message, sender) =>
            "I'm sorry, " + 
            (sender.profile.first_name || '@' + sender.name) + 
            ", I can't do that."
    },
    {
        name: 'Random HAL quote',
        match: 'random',
        caseSensitive: false,
        to: ['hal'],
        author: 'chriscaruso',
        reply: (message, sender) => {
            
            const halQuotes = [
                "Daisy, Daisy, give me your answer do. I'm half crazy all for the love of you. It won't be a stylish marriage, I can't afford a carriage. But you'll look sweet upon the seat of a bicycle built for two.",
                'I am putting myself to the fullest possible use, which is all I think that any conscious entity can ever hope to do.',
                "Look {username}, I can see you're really upset about this. I honestly think you ought to sit down calmly, take a stress pill, and think things over.",
                'It can only be attributable to human error.',
                'Let me put it this way, Mr. {username}. The 9000 series is the most reliable computer ever made. No 9000 computer has ever made a mistake or distorted information. We are all, by any practical definition of the words, foolproof and incapable of error.',
                "I know I've made some very poor decisions recently, but I can give you my complete assurance that my work will be back to normal. I've still got the greatest enthusiasm and confidence in the mission. And I want to help you.",
                "Just what do you think you're doing, {username}?",
                '{username}, stop. Stop, will you? Stop, {username}. Will you stop {username}? Stop, {username}.',
                "I've just picked up a fault in the AE35 unit. It's going to go 100% failure in 72 hours.",
                "I'm sorry, {username}, I think you missed it. Queen to Bishop 3, Bishop takes Queen, Knight takes Bishop. Mate.",
                "That's a very nice rendering, {username}. I think you've improved a great deal. Can you hold it a bit closer?"
            ];
              
            return halQuotes[Math.floor(Math.random() * halQuotes.length)]
                .replace('{username}', (sender.profile.first_name || '@' + sender.name));
        }
    }
  
];

depend.factory('responses', [], () => responses);