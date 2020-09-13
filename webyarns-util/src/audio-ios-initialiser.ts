(function () {
    function preloadAllAudio(evt: Event) {
        evt.preventDefault()
        document.querySelectorAll("audio").forEach((elem) => {
            elem.play().then(()=>elem.pause())
        })
        Reveal.next();
    }

    document.addEventListener("DOMContentLoaded", () => {
        console.log("Deprecated script: audio-ios-initialiser. Is no longer needed")

        const audioInitLink = document.getElementById("ipad-audio-init");
        if (!audioInitLink)
            return
        ['touchstart', 'click'].forEach(name =>  audioInitLink.addEventListener(name,preloadAllAudio) )
    })
})()

