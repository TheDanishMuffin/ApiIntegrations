const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const fs = require('fs');
const WebSocket = require('ws');
const morgan = require('morgan');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan('combined'));

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
    watchFile('your-file-id');
  });
}

function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
}

async function watchFile(fileId) {
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  try {
    const res = await drive.files.watch({
      fileId: fileId,
      requestBody: {
        id: 'unique-channel-id',
        type: 'web_hook',
        address: 'https://your-app-name.herokuapp.com/webhook', // MAKE SURE TO REPLACE or use digital ocean
      },
    });
    console.log('Watch response:', res.data);
  } catch (error) {
    console.error('Error watching file :((( :', error);
  }
}

app.post('/webhook', (req, res) => {
  console.log('Webhook received!:', req.body);
  res.status(200).send('Notification received!!');
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(req.body));
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke, bruh!');
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port 3000');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send(JSON.stringify({ message: 'Connected to server' }));
});

wss.on('close', () => {
  console.log('Client disconnected');
});
