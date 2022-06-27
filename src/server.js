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
//ex) 이 코드는 두번 작동한다. chrome에 연결될 때와 firefox에 연결될 때.
//같은 코드가 두개의 브라우저와 연결된 것. 하지만 몇 명이 연결되었는지는 모름.

//그래서 빈 배열을 생성하고,
const sockets = [];
wss.on("connection", (socket) => {
    //연결될 때마다 해당 데이터를 push 해줌.
    sockets.push(socket);
    socket["nickname"] = "Anon"; //익명일 때를 대비

    //그리고 어떤 브라우저에서 보낸 메시지든 연결된 브라우저메 모두 send.
    //메시지를 구분할 수 있는 데이터가 필요.
    socket.on("message", (msg) => {
        const message = JSON.parse(msg.toString());
        switch(message.type) {
            case "New_message" :
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`))
                break;
            case "nickname" : //socket이 누군지 알아야 돼서 닉네임 값을 socket에 넣어줘야 됨.
                socket["nickname"] = message.payload;
                break;
        }
    })

    console.log('Connected to Browser 🙂');
    socket.on("close", () => console.log("Disconnected Browser 💀"));
});

server.listen(3000, handleListen);