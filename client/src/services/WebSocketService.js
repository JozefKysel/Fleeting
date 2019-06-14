import socketIOClient from "socket.io-client";

import {
  SOCKET_SERVER_BASE_URL
} from '../config';

const socket = socketIOClient(SOCKET_SERVER_BASE_URL);
