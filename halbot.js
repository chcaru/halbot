
const DependOn = require('./dependOn');
global.depend = new DependOn();

const underscore = require('underscore')();
global._ = underscore;

const nedbLocation = process.env.NEDB_FILE_LOCATION;
const Datastore = require('nedb');

depend.factory('nedb', [], () => new Datastore({
    filename: nedbLocation,
    autoload: true
}));


const EasyDb = require('./easyDb');

depend.factory('easyDb', ['nedb'], nedb => new EasyDb(nedb));


const slackClient = require('@slack/client');
const RtmClient = slackClient.RtmClient;
const WebClient = slackClient.WebClient;
const token = process.env.SLACK_API_TOKEN;

depend.factory('slackWebClient', [], () => new WebClient(token));
depend.factory('slackRtmClient', [], () => {
    const rtm = new RtmClient(token);
    rtm.start();
    return rtm;
});


require('./autoResponder');
require('./commandDispatcher');