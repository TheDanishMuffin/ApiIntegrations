const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const fs = require('fs');
const WebSocket = require('ws');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';
let oAuth2Client;

fs.readFile('credentials.json', (err, content) => {
  if (err) return console.error('Error loading client secret file:', err);
  authorize(JSON.parse(content));
});

function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client);
    oAuth2Client.setCredentials(JSON.parse(token));
    watchFile('your-file-id'); // Replace with your file ID
  });
}

function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  // After visiting the URL, obtain the token and store it in token.json
}

async function watchFile(fileId) {
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  const res = await drive.files.watch({
    fileId: fileId,
    requestBody: {
      id: 'unique-channel-id',
      type: 'web_hook',
      address: 'https://your-app-name.herokuapp.com/webhook',
    },
  });
  console.log('Watch response:', res.data);
}

app.post('/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  res.status(200).send('Notification received');
});

const wss = new WebSocket.Server({ server: app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
}) });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send(JSON.stringify({ message: 'Connected to server' }));
});
