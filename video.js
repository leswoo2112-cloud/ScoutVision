function back5() {
    const video = document.getElementById("video");
    video.currentTime = Math.max(0, video.currentTime - 5);
}

function forward5() {
    const video = document.getElementById("video");
    video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
}

function playPause() {
    const video = document.getElementById("video");

    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function slow() {
    document.getElementById("video").playbackRate = 0.5;
}

function normal() {
    document.getElementById("video").playbackRate = 1;
}

function fast() {
    document.getElementById("video").playbackRate = 2;
}