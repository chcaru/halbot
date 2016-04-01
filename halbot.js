
// Load in all services
require('./services/services')

// Abstract these out into message observers
require('./autoResponder');
require('./commandDispatcher');