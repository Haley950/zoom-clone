//프론트에서 socket IO 사용할 준비 | 이 코드를 통해 프론트는 socket.io를 실행하고 있는 서버를 찾는다.
const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector("form");
const room = document.getElementById('room');

room.hidden = true;

let roomName = "";

function addMessage(msg) {
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = msg;
    ul.appendChild(li);
}

//브라우저 인풋에 입력된 메시지를 서버로 전달
//(방 이름과 메시지 전달이 완료됐을 때 실행시킬 함수도 같이 보냄)
function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('#msg input');
    socket.emit('new_message', input.value, roomName, () => {
        addMessage(`You: ${input.value}`)
        input.value = "";
    });
}

function handleNameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('#name input');
    socket.emit('nickName', input.value);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = roomName;

    //닉네임
    const nameForm = room.querySelector('#name');
    nameForm.addEventListener('submit', handleNameSubmit);

    //메시지 보내기
    const msgForm = room.querySelector('#msg');
    msgForm.addEventListener('submit', handleMessageSubmit);
}

function handleSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');

    //메시지 보내기(event, object, 함수 등 전달 가능..)
    socket.emit(
        "enter_room", 
        input.value,  
        showRoom
    );
    roomName = input.value;
    input.value = '';
}
form.addEventListener("submit", handleSubmit);

//방 입장
socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector('h3');
    h3.innerText = roomName + "[" + newCount + "명]";
    addMessage(`${user}가 입장했습니다.`);
})
//방 퇴장
socket.on("bye", (user, newCount) => {
    const h3 = room.querySelector('h3');
    h3.innerText = roomName + "[" + newCount + "명]";
    addMessage(`${user}가 방을 나갔습니다.`);
})
//받은 메시지 띄우기
socket.on('new_message', addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector('ul');
    roomList.innerHTML = ""; //룸이 누적되기 때문에 룸 목록은 항상 비워줘야 됨. 

    //한번 실행할 때 화면에 방 목록을 paint 해주는데,
    //재실행 했을 때 목록이 비어있으면 아무것도 실행 안함.
    if(rooms.length === 0){ //그래서 if문으로 예외처리를 해줘야 됨.
        return;
    };
    rooms.forEach(room => {
        const li = document.createElement('li');
        li.innerText = room;
        roomList.append(li);
    });
});



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


