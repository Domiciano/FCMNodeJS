import { google } from 'googleapis';
import fs from 'fs';
import fetch from 'node-fetch';
import express from 'express';
import bodyparser from 'body-parser';

const app = express();
app.use(bodyparser.json())

const PORT = 3000;
const PROJECT_NAME = 'facelogprueba';
const KEY_FILE_NAME = 'fcmkey.json';

app.post('/fcm/send', async (req, res) => {
    let response = await sendPushNotification(req.body);
    res.status(200).send(response);
});
  
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

async function sendPushNotification(data){
    const credentials = JSON.parse(fs.readFileSync(KEY_FILE_NAME));
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: 'https://www.googleapis.com/auth/firebase.messaging',
    });
    const authToken = await auth.getAccessToken();
    console.log(authToken);

    let response = await fetch(`https://fcm.googleapis.com/v1/projects/${PROJECT_NAME}/messages:send`, {
        method:'POST',
        headers:{
            'Content-Type':'application/json; UTF-8',
            'Authorization':`Bearer ${authToken}`
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}
