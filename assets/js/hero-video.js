(() => {
    const video = document.querySelector("[data-hero-video]");
    if (!video) return;

    const mobile = window.matchMedia("(max-width: 680px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator.connection;
    const debugMode = window.location && new URLSearchParams(window.location.search).get("video-debug") === "1";
    const playResults = [];
    let renderDiagnostics = () => {};
    const recordPlayback = result => {
        if (!debugMode) return;
        playResults.push(result);
        if (playResults.length > 6) playResults.shift();
        renderDiagnostics();
    };

    if (debugMode) {
        const report = document.createElement("pre");
        report.id = "hero-video-diagnostics";
        Object.assign(report.style, {
            position: "fixed", inset: "auto 8px 8px", zIndex: "2147483647",
            maxHeight: "65vh", overflow: "auto", margin: "0", padding: "12px",
            background: "#111", color: "#fff", font: "12px/1.4 monospace",
            whiteSpace: "pre-wrap", overflowWrap: "anywhere", userSelect: "text"
        });
        document.body.appendChild(report);
        renderDiagnostics = () => {
            const bounds = video.getBoundingClientRect();
            const style = window.getComputedStyle(video);
            report.textContent = JSON.stringify({
                revision: "ios-diag-2",
                page: window.location.pathname,
                playResults,
                error: video.error ? { code: video.error.code, message: video.error.message } : null,
                paused: video.paused,
                currentTime: Number(video.currentTime.toFixed(2)),
                readyState: video.readyState,
                networkState: video.networkState,
                hidden: video.hidden,
                visibility: document.visibilityState,
                reducedMotion: reducedMotion.matches,
                saveData: Boolean(connection?.saveData),
                muted: video.muted,
                playsInline: video.playsInline,
                source: video.currentSrc || video.getAttribute("src"),
                bufferedEnd: video.buffered.length ? Number(video.buffered.end(video.buffered.length - 1).toFixed(2)) : 0,
                decodedFrames: video.getVideoPlaybackQuality?.().totalVideoFrames ?? null,
                videoSize: [video.videoWidth, video.videoHeight],
                display: style.display,
                opacity: style.opacity,
                bounds: [bounds.x, bounds.y, bounds.width, bounds.height].map(Math.round),
                userAgent: navigator.userAgent
            }, null, 2);
        };
        renderDiagnostics();
        window.setInterval(renderDiagnostics, 1000);
    }

    const playVideo = () => {
        if (connection?.saveData || !video.hasAttribute("src")) return;
        recordPlayback({ result: "requested" });
        video.play().then(
            () => recordPlayback({ result: "playing" }),
            error => recordPlayback({ result: "rejected", name: error.name, message: error.message })
        );
    };
    const retryMobilePlayback = () => {
        if (mobile.matches && video.paused && document.visibilityState === "visible") playVideo();
    };

    video.addEventListener("playing", () => {
        video.hidden = false;
    });
    video.addEventListener("error", () => {
        video.hidden = true;
    });
    video.addEventListener("canplay", retryMobilePlayback);
    document.addEventListener("visibilitychange", retryMobilePlayback);
    window.addEventListener("pageshow", retryMobilePlayback);
    const updateVideo = () => {
        if (connection?.saveData) {
            video.hidden = true;
            if (video.hasAttribute("src")) {
                video.pause();
                video.removeAttribute("src");
                video.load();
            }
            return;
        }

        const source = mobile.matches ? video.dataset.mobileSrc : video.dataset.desktopSrc;
        if (video.getAttribute("src") !== source) {
            if (mobile.matches) {
                video.poster = video.previousElementSibling.querySelector("source").srcset;
                video.muted = true;
                video.playsInline = true;
                video.hidden = false;
            } else {
                video.removeAttribute("poster");
                video.hidden = true;
            }
            video.src = source;
            if (mobile.matches) video.load();
            playVideo();
        }
    };

    mobile.addEventListener("change", updateVideo);
    connection?.addEventListener("change", updateVideo);
    updateVideo();
})();