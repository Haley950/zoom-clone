import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);  //wss://localhost:3000, http://localhost:3000

// 아래 코드로 http 서버와 websocket 서버 둘 다 돌릴 수 있다.
// 두 프로토콜이 같은 포트에 있었으면 좋겠어서 이렇게 만든 것 뿐이지, 굳이 두개를 다 돌리지 않아도 됨.
const server = http.createServer(app); //http 서버
const wss = new WebSocket.Server({ server }); //websocket 서버

//서버에서의 socket은 연결된 브라우저를 의미한다.
wss.on("connection", (socket) => {
    console.log('Connected to Browser 🙂');
    socket.on("close", () => console.log("Disconnected from the Browser 💀"));
    socket.on("message", (message) => {
        console.log(message.toString());
    })
    socket.send("hello");
});


server.listen(3000, handleListen);