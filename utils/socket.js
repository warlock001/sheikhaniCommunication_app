import { io } from 'socket.io-client';
const socket = io.connect('http://52.9.129.21:4000');

export default socket;
