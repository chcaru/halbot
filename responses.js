
/*

    To add a new response, simply add an object
    to the responses array below of the type: 
    
    {
        name: string, 
        match: string / regex string,
        caseSensitive: boolean, (optional, default: false)
        reply: string,
        skipCount: number, (optional, default: 1)
    }

*/

responses = [
    
    {
        name: 'C# is better (than Java)',
        match: 'java',
        caseSensitive: false,
        reply: 'C# is better. :caruso:',
        skipCount: 3
    }
  
];

module.exports = responses;