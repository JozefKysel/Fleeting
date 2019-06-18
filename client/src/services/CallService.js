import { SERVER_BASE_URL } from '../config';

let localStream;
let remoteStream;
let peerConnection;
let uuid;
let globalCb;

const peerConnectionConfig = {
  'iceServers': [
    { 'urls': 'stun:stun.stunprotocol.org:3478' },
    { 'urls': 'stun:stun.l.google.com:19302' },
  ]
};

uuid = createUUID();

const io = require('socket.io-client')
const socket = io(SERVER_BASE_URL);

socket.on('message', data => gotMessageFromServer(data));
socket.on('error', error => console.log('error observed', error));

const constraints = {
  video: true,
  audio: true,
};

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia(constraints).then(getUserMediaSuccess).catch(errorHandler);
} else {
  alert('Your browser does not support getUserMedia API');
}

function getUserMediaSuccess(stream) {
  localStream = stream;
}

export function setSrcObject(localVideo) {
  localVideo.srcObject = localStream;
}

// ===================================================================

//  CALL ONCLICK
export function start(isCaller, cb) {
  console.log('start');
  remoteStream = null;
  peerConnection = new RTCPeerConnection(peerConnectionConfig);
  peerConnection.onicecandidate = gotIceCandidate;
  peerConnection.ontrack = (event) => {
    remoteStream = event.streams[0];
    if(typeof cb === 'function') cb(remoteStream);
    if(typeof globalCb === 'function') globalCb(remoteStream);
  }
  peerConnection.addStream(localStream);
  if (isCaller) {
    peerConnection.createOffer().then(createdDescription).catch(errorHandler);
  }
}


export function getRemoteStream(cb) {
  if(remoteStream!==null) return cb(remoteStream);
  globalCb = cb;
}

// ===================================================================

function gotMessageFromServer(data) {
  if (!peerConnection) start(false);

  var signal = JSON.parse(data);

  // Ignore messages from ourself
  if (signal.uuid === uuid) return;

  if (signal.sdp) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function () {
      // Only create answers in response to offers
      if (signal.sdp.type === 'offer') {
        peerConnection.createAnswer().then(createdDescription).catch(errorHandler);
      }
    }).catch(errorHandler);
  } else if (signal.ice) {
    peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(errorHandler);
  }
}

function gotIceCandidate(event) {
  if (event.candidate != null) {
    socket.emit('message', JSON.stringify({ 'ice': event.candidate, 'uuid': uuid }));
  }
}

function createdDescription(description) {
  console.log('got description');
  peerConnection.setLocalDescription(description).then(function () {
    socket.emit('message', JSON.stringify({ 'sdp': peerConnection.localDescription, 'uuid': uuid }));
  }).catch(errorHandler);
}

function errorHandler(error) {
  console.error(error);
}
// Taken from http://stackoverflow.com/a/105074/515584
function createUUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export const makeOutGoing = (data, message) => {
  socket.emit('outgoing call', data);
}

export const listenForIncomingCall = () => {
  socket.on("incoming call", data => {
    window.confirm(`Tom is calling you, do you want to answer?`) && socket.emit('accepted call', data);
  })
}

export const listenForCallLength = toggleFlag => {
  socket.on('callLength', data => toggleFlag(data));
};
