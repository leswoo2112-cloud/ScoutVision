/* =========================================================
   ScoutVision 4.0
   YouTube 영상 분석 시스템
========================================================= */

(function () {
    "use strict";

    let player = null;
    let apiReady = false;
    let pendingVideoId = "";
    let videoMode = "local";


    /* =====================================================
       유튜브 주소에서 영상 ID 추출
    ===================================================== */

    function extractYouTubeId(value) {
        if (!value) return "";

        const text = String(value).trim();

        const patterns = [
            /youtu\.be\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
            /^([a-zA-Z0-9_-]{11})$/
        ];

        for (const pattern of patterns) {
            const result = text.match(pattern);

            if (result && result[1]) {
                return result[1];
            }
        }

        try {
            const url = new URL(text);
            const id = url.searchParams.get("v");

            if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
                return id;
            }
        } catch (error) {
            // 주소 형식이 아니면 무시
        }

        return "";
    }


    /* =====================================================
       화면 전환
    ===================================================== */

    function showYouTubePlayer() {
        videoMode = "youtube";

        const localVideo = document.getElementById("video");
        const youtubeWrap =
            document.getElementById("youtubePlayerWrap");

        if (localVideo) {
            localVideo.pause();
            localVideo.style.display = "none";
        }

        if (youtubeWrap) {
            youtubeWrap.style.display = "block";
        }
    }


    function showLocalVideo() {
        videoMode = "local";

        const localVideo = document.getElementById("video");
        const youtubeWrap =
            document.getElementById("youtubePlayerWrap");

        if (
            player &&
            typeof player.pauseVideo === "function"
        ) {
            player.pauseVideo();
        }

        if (youtubeWrap) {
            youtubeWrap.style.display = "none";
        }

        if (localVideo) {
            localVideo.style.display = "block";
        }
    }


    /* =====================================================
       유튜브 플레이어 생성
    ===================================================== */

    function createYouTubePlayer() {
        if (
            player ||
            !window.YT ||
            typeof window.YT.Player !== "function"
        ) {
            return;
        }

        const playerElement =
            document.getElementById("youtubePlayer");

        if (!playerElement) {
            console.error(
                "youtubePlayer 요소를 찾을 수 없습니다."
            );
            return;
        }

        player = new window.YT.Player("youtubePlayer", {
            width: "100%",
            height: "100%",

            playerVars: {
                playsinline: 1,
                controls: 1,
                rel: 0,
                modestbranding: 1
            },

            events: {
                onReady: function () {
                    apiReady = true;

                    if (pendingVideoId) {
                        player.loadVideoById(
                            pendingVideoId
                        );
                    }
                },

                onStateChange: function () {
                    // 필요하면 나중에 재생 상태 분석 가능
                },

                onError: function (event) {
                    let message =
                        "유튜브 영상을 불러올 수 없습니다.";

                    if (event.data === 2) {
                        message =
                            "유튜브 주소 또는 영상 ID가 올바르지 않습니다.";
                    }

                    if (event.data === 5) {
                        message =
                            "이 영상은 HTML5 플레이어에서 재생할 수 없습니다.";
                    }

                    if (
                        event.data === 100 ||
                        event.data === 101 ||
                        event.data === 150
                    ) {
                        message =
                            "비공개·삭제 영상이거나 외부 사이트 재생이 제한된 영상입니다.";
                    }

                    alert(message);
                }
            }
        });
    }


    /* 유튜브 API에서 자동으로 호출하는 함수 */
    window.onYouTubeIframeAPIReady = function () {
        apiReady = true;
        createYouTubePlayer();
    };


    /* 이미 API가 준비된 경우도 처리 */
    function checkYouTubeApi() {
        if (
            window.YT &&
            typeof window.YT.Player === "function"
        ) {
            apiReady = true;
            createYouTubePlayer();
        }
    }


    /* =====================================================
       유튜브 영상 불러오기
    ===================================================== */

    window.loadYouTubeVideo = function () {
        const input =
            document.getElementById("youtubeUrl");

        if (!input) {
            alert(
                "유튜브 주소 입력창을 찾을 수 없습니다."
            );
            return;
        }

        const videoId =
            extractYouTubeId(input.value);

        if (!videoId) {
            alert(
                "올바른 유튜브 영상 주소를 입력해주세요."
            );
            return;
        }

        pendingVideoId = videoId;

        showYouTubePlayer();
        checkYouTubeApi();

        if (
            player &&
            typeof player.loadVideoById === "function"
        ) {
            player.loadVideoById(videoId);
        } else if (!apiReady) {
            alert(
                "유튜브 플레이어를 준비하고 있습니다. 잠시 후 다시 눌러주세요."
            );
        }
    };


    /* =====================================================
       로컬 영상 모드
    ===================================================== */

    window.useLocalVideoMode = function () {
        showLocalVideo();
    };


    /* =====================================================
       현재 영상 시간
    ===================================================== */

    window.getAnalysisTime = function () {
        if (
            videoMode === "youtube" &&
            player &&
            typeof player.getCurrentTime === "function"
        ) {
            const youtubeTime =
                Number(player.getCurrentTime());

            return Number.isFinite(youtubeTime)
                ? youtubeTime
                : 0;
        }

        const localVideo =
            document.getElementById("video");

        if (!localVideo) return 0;

        const localTime =
            Number(localVideo.currentTime);

        return Number.isFinite(localTime)
            ? localTime
            : 0;
    };


    /* =====================================================
       특정 시간으로 이동
    ===================================================== */

    window.seekAnalysisTime = function (time) {
        const targetTime = Math.max(
            0,
            Number(time) || 0
        );

        if (
            videoMode === "youtube" &&
            player &&
            typeof player.seekTo === "function"
        ) {
            player.seekTo(targetTime, true);
            return;
        }

        const localVideo =
            document.getElementById("video");

        if (localVideo) {
            localVideo.currentTime = targetTime;
        }
    };


    /* =====================================================
       재생
    ===================================================== */

    window.playAnalysisVideo = function () {
        if (
            videoMode === "youtube" &&
            player &&
            typeof player.playVideo === "function"
        ) {
            player.playVideo();
            return;
        }

        const localVideo =
            document.getElementById("video");

        if (localVideo) {
            localVideo.play().catch(function () {
                // Safari 자동재생 제한 무시
            });
        }
    };


    /* =====================================================
       일시정지
    ===================================================== */

    window.pauseAnalysisVideo = function () {
        if (
            videoMode === "youtube" &&
            player &&
            typeof player.pauseVideo === "function"
        ) {
            player.pauseVideo();
            return;
        }

        const localVideo =
            document.getElementById("video");

        if (localVideo) {
            localVideo.pause();
        }
    };


    /* =====================================================
       재생·정지 전환
    ===================================================== */

    window.toggleAnalysisVideo = function () {
        if (
            videoMode === "youtube" &&
            player &&
            typeof player.getPlayerState === "function"
        ) {
            const state =
                player.getPlayerState();

            if (
                window.YT &&
                state === window.YT.PlayerState.PLAYING
            ) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }

            return;
        }

        const localVideo =
            document.getElementById("video");

        if (!localVideo) return;

        if (localVideo.paused) {
            localVideo.play().catch(function () {
                // Safari 자동재생 제한 무시
            });
        } else {
            localVideo.pause();
        }
    };


    /* =====================================================
       배속
    ===================================================== */

    window.setAnalysisPlaybackRate = function (rate) {
        const playbackRate =
            Number(rate) || 1;

        if (
            videoMode === "youtube" &&
            player &&
            typeof player.setPlaybackRate === "function"
        ) {
            player.setPlaybackRate(playbackRate);
            return;
        }

        const localVideo =
            document.getElementById("video");

        if (localVideo) {
            localVideo.playbackRate =
                playbackRate;
        }
    };


    /* =====================================================
       기존 HTML 버튼과 연결
    ===================================================== */

    window.back5 = function () {
        window.seekAnalysisTime(
            window.getAnalysisTime() - 5
        );
    };


    window.forward5 = function () {
        window.seekAnalysisTime(
            window.getAnalysisTime() + 5
        );
    };


    window.playPause = function () {
        window.toggleAnalysisVideo();
    };


    window.slow = function () {
        window.setAnalysisPlaybackRate(0.5);
    };


    window.normal = function () {
        window.setAnalysisPlaybackRate(1);
    };


    window.fast = function () {
        window.setAnalysisPlaybackRate(2);
    };


    /* =====================================================
       현재 영상 모드 확인
    ===================================================== */

    window.getAnalysisVideoMode = function () {
        return videoMode;
    };


    /* =====================================================
       페이지 로드
    ===================================================== */

    window.addEventListener("load", function () {
        checkYouTubeApi();

        const localInput = document.querySelector(
            'input[type="file"][accept*="video"]'
        );

        if (localInput) {
            localInput.addEventListener(
                "change",
                function () {
                    showLocalVideo();
                }
            );
        }
    });
})();