/// <reference path ="../../node_modules/@types/reveal/index.d.ts"/>
(function () {

    const plugin = {
        init: () => {
            const style = document.createElement('style');
            document.head.appendChild(style);
            addSupportForAnchorWithDataLink(style.sheet as CSSStyleSheet);
            addSupportForTimedSections()
        }
    };

    /**
     * allows for
     * `<a data-link-indexh="1">link to slide</a>`
     * @param webyarnsCSS
     */
    function addSupportForAnchorWithDataLink(webyarnsCSS: CSSStyleSheet) {
        webyarnsCSS.insertRule("a[data-link-indexh] { cursor: pointer }", 0);
        document.querySelectorAll("a[data-link-indexh]")
            .forEach(e => e.addEventListener("click", (evt) => {
                evt.preventDefault();
                const s = e.getAttribute("data-link-indexh");
                if (s) {
                    const idx = parseInt(s, 10);
                    Reveal.slide(idx)
                }

            }))
    }

    function addSupportForTimedSections() {
        Reveal.addEventListener('slidechanged', function (event) {
            const curAutoMove = event.currentSlide.getAttribute("data-auto-move-to");
            if (curAutoMove) {
                const timeout = event.currentSlide.getAttribute("data-auto-move-time-sec") * 1000 | 3000;
                const timer= setTimeout(function () {
                    const slide = parseInt(curAutoMove,10) - 1;
                    Reveal.slide(slide);
                }, timeout);
                Reveal.addEventListener('slidechanged',()=>clearTimeout(timer))
            }
        })
    }

    Reveal.registerPlugin('WebyarnPlugin', plugin);
})()
