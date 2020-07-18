
(function (factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS.
        module.exports = factory();
    } else {
        // Browser globals.
        Object.assign(window,factory())
        window.addEventListener("DOMContentLoaded", ()=>{
            Reveal.addEventListener('ready', window.autoplayVideo)
            Reveal.addEventListener('slidechanged', window.autoplayVideo)
        })
    }
}(() => {
    console.log("Deprecated script: auto-video-play.ts. Use reveal's built-in support https://revealjs.com/media/#autoplay  (data-autoplay)")
    function autoplayVideo(event: SlideEvent) {
        event.currentSlide.querySelectorAll("video[data-autostart]").forEach(e => {
            if (!(e instanceof HTMLVideoElement)) {
                return;
            }
            // noinspection JSIgnoredPromiseFromCall
            e.play()
            // e.addEventListener("ended",)
        })
        if (event.previousSlide)
            event.previousSlide.querySelectorAll("video[data-autostart]").forEach(e => {
                if (!(e instanceof HTMLVideoElement)) {
                    return;
                }
                // noinspection JSIgnoredPromiseFromCall
                e.pause()
                // e.removeEventListener("ended",proceedToNext)
            })


    }


    return {
        autoplayVideo,
    }
}));
