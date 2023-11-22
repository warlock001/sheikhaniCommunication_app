import { io } from 'socket.io-client';
const socket = io.connect('http://api.sheikhanigroup.com:4000');

export default socket;
