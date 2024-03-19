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

have the audio received from the front end sent to an Ai module then the reply gets sent back to the user in a speech formate

# Installs:

you will need to install the following dependencies to achieve that `npm install $$` change the `$$` with one of the following:

    `@google-cloud/speech`
    `cors`
    `dotenv`
    `express`
    `fs`
    `multer`
    `openai`
    `pg`

    you will need to install a devDependencies`nodemon` to achieve that `npm install -D nodemon`

# routes:

there is a receive route that will take in a sound and then will transcript it send it to the ai and then send speech back
<br>
there is a conversation Array route that will show the open AI array of conversation user input and a ai response
