(() => {
    const video = document.querySelector("[data-hero-video]");
    if (!video) return;

    const mobile = window.matchMedia("(max-width: 680px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator.connection;
    video.addEventListener("playing", () => { video.hidden = false; });
    video.addEventListener("error", () => { video.hidden = true; });
    const updateVideo = () => {
        if (reducedMotion.matches || connection?.saveData) {
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
            video.hidden = true;
            video.src = source;
            video.play().catch(() => {});
        }
    };

    mobile.addEventListener("change", updateVideo);
    reducedMotion.addEventListener("change", updateVideo);
    connection?.addEventListener("change", updateVideo);
    updateVideo();
})();