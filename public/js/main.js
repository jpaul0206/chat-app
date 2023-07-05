const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');                    // see the html
const userList = document.getElementById('users');

// get username and room from URL
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});
//console.log(username,room);



const socket = io();

//join chatroom
socket.emit('joinRoom',{ username, room});

socket.on('roomUsers',({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});


// message from server
socket.on('message', message => {
    console.log(message);               // takes message attribute from all the emit in server.js
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener('submit',(e) => {
    e.preventDefault();                        // prevent the default behaviour from happening which is the form contents submitting to a file

    const msg = e.target.elements.msg.value;    // msg is the id // get message text
    console.log(msg);
    socket.emit('chatMessage',msg);            // emit
    //outputMessage(msg);

    // to clear the message box after the message has been sent
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// output message to DOM
// output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>  ${message.time}  </span></p>
      <p class="text">${message.text}</p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
  }
  

// room name in DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// add users in DOM
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
