# Ikigai - a lifeline for the linguistically stranded

<div>
  <img src="https://github.com/devicons/devicon/blob/master/icons/nodejs/nodejs-original-wordmark.svg" title="NodeJS" alt="NodeJS" width="40" height="40"/>&nbsp;
  <img src="https://cdn0.iconfinder.com/data/icons/flat-design-database-set-3/24/sql-1024.png" title="SQL" alt="SQL" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/googlecloud/googlecloud-original.svg" title="Google Cloud" alt="Google CLoud" width="40" height="40"/>&nbsp;
  <img src="https://isurajitroy.com/wp-content/uploads/2023/06/ChatGPT-Logo-TM-Official.png" title="Open AI" alt="Open AI" width="40" height="40"/>&nbsp;
</div>

<br>

While the UK is a sought-after destination for new beginnings, many immigrants find themselves disconnected from their roots, including their native language and cultural heritage. Our mission is to change this narrative. Through our app, users can practice their mother tongue through lifelike conversations with AI. We bridge the gap between native English speakers from migrant families and their deep roots abroad, offering a platform to reconnect with their heritage using a seamless voice interface and natural language processing technology.

The application captures user-recorded audio from the frontend and transmits it to Google Cloud's Speech-to-Text model in the backend. Upon receiving the transcribed text, which supports both Gujarati and English, it forwards it to OpenAI for model response generation. Once the response is received, the application employs OpenAI's Audio API to convert it into speech audio, before finally delivering the generated audio back to the frontend.

# this backend is live on:

https://mt-be-s1.onrender.com/

# project Aim:

this project is the back end of a language learning app that is a speech to speech interface.
This project will take in audio that is sent from the frontend transcribe it then send it to open AI where it gets a reply then it sends it back in audio formate to the front end

# Installs:

you will need to install the following dependencies to achieve that use `npm install` or `npm install $$` change the `$$` with one of the following:

    `@google-cloud/speech`
    `cors`
    `dotenv`
    `express`
    `fs`
    `multer`
    `openai`
    `pg`

    you will need to install a devDependencies`nodemon` to achieve that `npm install -D nodemon`

# setting-up:

create a .env file that includes:
'PORT' -use a port number that you would prefer using . if no port is selected then it will default to port 3000
'DB_URL'- this is where you will include your Database url from wherever you will be hosting it
'OPENAI_API_KEY'- this is the key that you can get from open Ai platform
<br>
create a key.json file that includes:
the json key provided by google speech to text service

# routes:

there is a receive route that will take in a sound and then will transcript it send it to the ai and then send speech and transcription back
<br>
there is a conversation Array route that will show the open AI array of conversation user input and a ai response

# Database:

there is a database that will be connected the information of the user for the individual accounts as well as it will save the conversation array and audio files that the user have had with the AI

# authentication:

this project includes authentication with a token system for the individuals accounts, each individual will have their own account to store their data and conversation.
