import { io } from 'socket.io-client';

const URL = 'https://extractify-production.up.railway.app';

export const socket = io(URL as string);