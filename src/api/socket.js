import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const token = localStorage.getItem('token');

export const socket = io(URL, {
  autoConnect: true,
  query: token && token !== 'null' ? { token } : {}
});

socket.on('connect', () => {
    console.log('socket connected', socket.id);
});

socket.on('disconnect', () => {
    console.log('socket disconnected');
});

socket.on('connect_error', (err) => {
    console.error('socket connection error:', err.message);
});

export const getSocket = () => socket;

export default socket;
