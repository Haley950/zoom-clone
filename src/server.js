import http from "http";
// import WebSocket from "ws";
import SocketIO from "socket.io";
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
const httpServer = http.createServer(app); //http 서버
const wsServer = SocketIO(httpServer); //SocketIO 서버
// const wss = new WebSocket.Server({ server }); //websocket 서버

function publicRooms() {
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    })
    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

//백엔드에서 socket IO connection 받을 준비
wsServer.on('connection', socket => {
    socket["nickname"] = 'Anon';
    socket.onAny((event) => { 
        console.log(`Socket Event: ${event}`); 
    })

    //방 입장
    socket.on('enter_room', (roomName, done) => {
        socket.join(roomName);
        done();
        //roomName 방에 참가하면 나를 제외한 안에 있는 모두에게 welcome event를 emit함.
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));

        //방 입장 시 모든 socket(방)에 알림
        wsServer.sockets.emit('room_change', publicRooms());
    });
    
    //서버와 연결이 끊겼을 때
    socket.on('disconnecting', () => {
        socket.rooms.forEach(room => 
            socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1 )
        );
    })
    socket.on('disconnect', () => {
        wsServer.sockets.emit('room_change', publicRooms());
    })

    //브라우저로부터 받은 메시지를 방에 보내주고 done함수 실행
    socket.on('new_message', (msg, room, done) => {
        socket.to(room).emit('new_message', `${socket.nickname} : ${msg}`);
        done();
    })

    //nickname이벤트가 발생하면 name을 가져와서 socket에 저장
    socket.on('nickName', name => socket["nickname"] = name);
})











// ********************* (( Websocket Code )) *********************
//서버에서의 socket은 연결된 브라우저를 의미한다.
//ex) 이 코드는 두번 작동한다. chrome에 연결될 때와 firefox에 연결될 때.
//같은 코드가 두개의 브라우저와 연결된 것. 하지만 몇 명이 연결되었는지는 모름.

//그래서 빈 배열을 생성하고,
// const sockets = [];
// wss.on("connection", (socket) => {
//     //연결될 때마다 해당 데이터를 push 해줌.
//     sockets.push(socket);
//     socket["nickname"] = "Anon"; //익명일 때를 대비

//     //그리고 어떤 브라우저에서 보낸 메시지든 연결된 브라우저에 모두 send.
//     //메시지를 구분할 수 있는 데이터가 필요.
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg.toString());
//         switch(message.type) {
//             case "New_message" :
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`))
//                 break;
//             case "nickname" : //socket이 누군지 알아야 돼서 닉네임 값을 socket에 넣어줘야 됨.
//                 socket["nickname"] = message.payload;
//                 break;
//         }
//     })

//     console.log('Connected to Browser 🙂');
//     socket.on("close", () => console.log("Disconnected Browser 💀"));
// });
// ********************* (( Websocket Code )) *********************



httpServer.listen(3000, handleListen);