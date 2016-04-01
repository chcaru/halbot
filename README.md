# Halbot
Halbot is a custom Slack bot.

Halbot must be configured with the following environment variables:
```sh
NEDB_FILE_LOCATION = Your database file location here
SLACK_API_TOKEN = Your Slack API token here
```

For development purposes:

1. One should create a dev only Slack team and work from there.

2. Install dependencies:
```sh
npm install
```

To start Halbot:
```sh
node halbot
```

# Bot Responses
Add any custom responses to ```responses.js ```
