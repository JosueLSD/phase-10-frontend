// socket.ts
import { io } from 'socket.io-client';

const socket = io('http://192.168.18.145:3000');

export default socket;
