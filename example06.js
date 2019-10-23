const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const firmata = require("firmata");

const wss = new WebSocket.Server({ port: 8888 });

let board = new firmata.Board("/dev/ttyACM0", () => {
  board.pinMode(0, board.MODES.ANALOG);
});

fs.readFile("./example06.html", (err, html) => {
  if (!err) {
    const server = http
      .createServer((req, res) => {
        res.writeHeader(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
      })
      .listen(8080, "192.168.1.223", () => {
        console.log("Server running ...");
      });
  }
});

let valueToSend = 0;
let sendValue = function() {};

board.on("ready", () => {
  board.analogRead(0, value => {
    sendValue(value.toString());
  });
});

wss.on("connection", ws => {
  sendValue = value => {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(value);
      } catch (e) {
        console.log("Something went wrong ... " + e);
      }
    }
  };
});
