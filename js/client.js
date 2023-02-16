// Connection of client and server
const socket = io('http://localhost:8000');

// Get DOM elements in a respective js variables 
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Audio that will play on recieving messages
var audio = new Audio('bruh.mp3');

// Function which will append event information to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == "left") {
        audio.play();
    }
}

// Ask new user for his/her name and let the server know
const naam = prompt("Enter your name to join");
socket.emit('new-user-joined', naam);

// If a new user joins, recieve their name from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right')
})

// If server sends a message, recieve it
socket.on('recieve', data => {
    append(`${data.name}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('leave', name => {
    append(`${name} left the chat`, 'right')
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault(); //Dosn't reloads website
    const message = messageInput.value;
    append(`You: ${message}`, 'right')
    socket.emit('send', message);
    messageInput.value = "";
})