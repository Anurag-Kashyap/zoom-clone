
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
let myVideoStream;

myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then( stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, myVideoStream);
});

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}

socket.emit('join-room');