# Goat Bot Site

This is a simple (and stupid) Node.js Express site to host the goat bot web chat client.

### Configuration

When running locally set following environmental variables or create a **.env** file and populate contents.
When deployed in Azure App Service, set these as App Settings
```
BOT_WEBCHAT_SECRET = <secret>
BOT_HANDLE = <bot_handle>
```