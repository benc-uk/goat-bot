# Goat Bot

A silly but functional demo of the Microsoft Bot Framework.  
This project consists of two apps and their source:
- **Bot** - Main restful bot application written using the Bot Framework SDK and Node.js
- **Site** - A simple Node.js Express site called 'Goat Info Central' to host the goat bot web chat client.

## Goat Bot Functionality
The Goat Bot demonstrates several capabilities:
- The Microsoft Bot Framework and SDK
- Use of advanced cognitive services for image recognition
- Bot Framework web chat client integration
- Hosting in Azure platform services (PaaS web apps) via templates and automated deployment 

## Pre Requisites 
Register a new bot and associated Microsoft app id. Do this from the Bot Framework site  
### [https://dev.botframework.com/bots/new](https://dev.botframework.com/bots/new)  
Follow the steps on the page to create the bot and associated MS app id, make a note of the app id and password. Also make a note of the bot handle you used, don't worry about the endpoint now this will be changed later

## Running the bot locally
- Clone this repo
- [Download & install Node.js](https://nodejs.org/en/)
- [Download & install the emulator](https://github.com/Microsoft/BotFramework-Emulator/releases)
- For full functionality create a [computer vision Azure Cognitive Service account](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account) and make a note of the API key & the region your created it in. *Note. You can skip this step and still run the bot*
- Create a file called `.env` in the bot folder of the cloned repo, and populate as follows
```
MICROSOFT_APP_ID = <app_id>
MICROSOFT_APP_PASSWORD = <app_password>
MICROSOFT_VISION_API_KEY = <api_key>
MICROSOFT_VISION_API_REGION = <api_region>
```
- Run the bot
```
cd bot
npm install
node app.js
```
- Point the emulator at `http://localhost:3978/api/messages` and fill in your app id and password
- Chat away!

> Note. The website part of this project can be run locally too, however it requires a working external bot endpoint (i.e. one running in Azure, can not me localhost) for the webchat to work. 


## Running in Azure
- Deploy via the supplied template and 'Deploy To Azure' button [found here on Github](https://github.com/benc-uk/goat-bot/tree/master/azure)
- Supply your *existing* bot handle, MS app id and password.  
The 'web Site Name' and 'botSiteName' parameters are the names of the *new* Azure Web Apps that will be deployed, pick globally unique names
- Once deployed, [edit your bot details](https://dev.botframework.com/bots) and modify the 'Messaging endpoint' to point at your Azure web app hosting the bot, it will need to be suffixed with `/api/messages` and start with **https** not **http**, e.g. `https://goatbotbc.azurewebsites.net/api/messages`
- Test the bot from the bot details page
- To configure the web chat client on the deployed website
  - Click 'Edit' over on the left of the Web Chat channel section
  - Add a new site (call it anything)
  - Then click 'Show' on one of the secret keys and copy the value
  - In the Azure portal find your Web App hosting the site (not the bot)
  - Click into 'Application Settings'
  - Edit the app setting called 'BOT_WEBCHAT_SECRET' and update the value with the secret

