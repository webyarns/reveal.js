/// <reference path ="../../node_modules/@types/reveal/index.d.ts"/>
(function (){

    const plugin = {
        init: () => {
            const style = document.createElement('style');
            document.head.appendChild(style);
            addSupportForAnchorWithDataLink(style.sheet as CSSStyleSheet);
        }
    };

    /**
     * allows for
     * `<a data-link-indexh="1">link to slide</a>`
     * @param webyarnsCSS
     */
    function addSupportForAnchorWithDataLink(webyarnsCSS: CSSStyleSheet) {
        webyarnsCSS.insertRule("a[data-link-indexh] { cursor: pointer }",0);
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

    Reveal.registerPlugin('WebyarnPlugin', plugin);


})()
