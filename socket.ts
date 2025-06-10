// socket.ts
import { io } from 'socket.io-client';

const socket = io('http://192.168.100.23:3000');

export default socket;
