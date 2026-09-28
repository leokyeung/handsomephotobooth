(() => {
    const video = document.querySelector("[data-hero-video]");
    if (!video) return;

    const mobile = window.matchMedia("(max-width: 680px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator.connection;
    const motionDisabled = () => reducedMotion.matches || connection?.saveData;
    const playVideo = () => {
        if (motionDisabled() || !video.hasAttribute("src")) return;
        video.play().catch(() => {});
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
        if (motionDisabled()) {
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
    reducedMotion.addEventListener("change", updateVideo);
    connection?.addEventListener("change", updateVideo);
    updateVideo();
})();