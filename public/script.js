const socket = io();
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');

let myVideoStream;
let peer = new Peer( undefined, {
    path: '/peerjs',
    host: '/',
    port: 5000
}); 

myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then( stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, myVideoStream);

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    })

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    });
});

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}