import { io } from 'socket.io-client';
const socket = io.connect('http://18.144.29.58:4000');

export default socket;
