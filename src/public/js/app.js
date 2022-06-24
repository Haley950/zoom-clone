//프론트에서 웹소켓 연결 요청 코드
//프론트에서의 socket은 서버로의 연결을 의미한다.
const socket = new WebSocket(url = `ws://${window.location.host}`);


//연결
socket.addEventListener('open', () => {
    console.log('Connected to Server 🙂');
})

//메시지 받기
socket.addEventListener('message', (message) => {
    console.log('New message: ', message.data);
})

//서버로의 연결이 끊어졌을 때
socket.addEventListener('close', () => {
    console.log("Disconnected to Server 💀");
})

//메시지 보내기
setTimeout(() => {
    socket.send("hello from the browser!!");
}, 10000);

