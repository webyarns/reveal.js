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


    function isIndex(value: string): boolean {
        return /^\d+$/.test(value);
    }

    /**
     * Automatically moves to a section after a timeout
     * Possible values for data-auto-move-to:
     *  - 'next' and 'prev'
     *  - a url hash value ('#/some-id')
     *  - id of a section ('some-id')
     *  - an position (one-based) of a section ('12')
     */
    function addSupportForTimedSections() {
        Reveal.addEventListener('slidechanged', function (event) {
            const curAutoMove = event.currentSlide.getAttribute("data-auto-move-to");
            if (curAutoMove) {
                const timeout = event.currentSlide.getAttribute("data-auto-move-time-sec") * 1000 | 3000;
                const timer = setTimeout(function () {
                    if (curAutoMove === "next") {
                        Reveal.next()
                    } else if (curAutoMove === "prev") {
                        Reveal.prev()
                    } else if (curAutoMove.charAt(0) === "#") {
                        document.location.hash = curAutoMove;
                    } else if (isIndex(curAutoMove)) {
                        const slide = parseInt(curAutoMove, 10) - 1;
                        Reveal.slide(slide);
                    } else {
                        const i = Webyarns.lookupIndex(curAutoMove)
                        if (i === -1){
                            console.error("get not find slide with id",curAutoMove)
                        }
                        Reveal.slide(i)
                    }
                }, timeout);
                Reveal.addEventListener('slidechanged', () => clearTimeout(timer))
            }
        })
    }

    Reveal.registerPlugin('WebyarnPlugin', plugin);
})()
