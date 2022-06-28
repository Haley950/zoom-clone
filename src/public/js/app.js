//프론트에서 socket IO 사용할 준비 | 이 코드를 통해 프론트는 socket.io를 실행하고 있는 서버를 찾는다.
const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector("form");
const room = document.getElementById('room');

room.hidden = true;

let roomName = "";

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = roomName;
}

function handleSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');

    //메시지 보내기(event, object, 함수 등 전달 가능..)
    socket.emit(
        "enter_room", 
        {payload: input.value},  
        showRoom
    );
    roomName = input.value;
    input.value = '';
}
form.addEventListener("submit", handleSubmit);





// ********************* (( Websocket Code )) *********************
// //프론트에서 웹소켓 연결 요청 코드
// //프론트에서의 socket은 서버로의 연결을 의미한다.
// const socket = new WebSocket(url = `ws://${window.location.host}`);

// //연결
// socket.addEventListener('open', () => {
//     console.log('Connected to Server 🙂');
// })

// //메시지 받기
// socket.addEventListener('message', (message) => {
//     // console.log('New message: ', message.data);
//     const li = document.createElement('li');
//     li.innerText = message.data;
//     messageList.append(li);
// })

// //서버로의 연결이 끊어졌을 때
// socket.addEventListener('close', () => {
//     console.log("Disconnected to Server 💀");
// })

// //메시지 보내기
// function makeMessage(type, payload){
//     const msg = {type, payload};
//     return JSON.stringify(msg);
// }

// const messageList = document.querySelector("ul"); 
// const nickForm = document.querySelector("#nick");
// const messageForm = document.querySelector("#message");

// function handleNickSubmit(event) {
//     event.preventDefault();
//     const input = nickForm.querySelector('input');
//     socket.send(makeMessage("nickname", input.value));
// }
// function handleSubmit (event) {
//     event.preventDefault();
//     const input = messageForm.querySelector('input');
//     socket.send(makeMessage("New_message", input.value));
//     input.value = '';
// }
// nickForm.addEventListener('submit', handleNickSubmit);
// messageForm.addEventListener('submit', handleSubmit);
// ********************* (( Websocket Code )) *********************


