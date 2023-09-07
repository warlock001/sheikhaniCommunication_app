import { io } from 'socket.io-client';
const socket = io.connect('http://52.53.197.201:4000');

export default socket;
