/// <reference path ="../../node_modules/@types/reveal/index.d.ts"/>
(function () {

    const plugin = {
        init: () => {
            const style = document.createElement('style');
            document.head.appendChild(style);
            Reveal.addEventListener('slidechanged', event => {
                addSupportForTimedSections(event)
                addSupportForOneTimeSections(event)
                addSupportForUnhideSections(event)
            });
            addSupportForAnchorWithDataLink(style.sheet as CSSStyleSheet);
            addSupportForProceedToNextAfterVideoPlayed()


        }
    };

    /**
     * Automatic proceed to next slide  once a video has completed
     */

    function addSupportForProceedToNextAfterVideoPlayed() {
        document.querySelectorAll<HTMLVideoElement>("video[data-auto-next]").forEach(v => {
            v.addEventListener('ended', _ => Reveal.next())
        })
    }

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
     *
     * Syntax
     * <section data-auto-move-to="..." data-auto-move-time-sec="..>
     *
     * Automatically moves to a section after a timeout
     * Possible values for data-auto-move-to:
     *  - 'next' and 'prev'
     *  - a url hash value ('#/some-id')
     *  - id of a section ('some-id')
     *  - an position (one-based) of a section ('12')
     *
     *  data-auto-move-time-sec is optional. Defaults to 1 second
     */
    function addSupportForTimedSections(event: SlideEvent) {

        const rx = /random\(([0-9,\s]+)\)/;
        const curAutoMove = event.currentSlide.getAttribute("data-auto-move-to");
        if (curAutoMove) {
            const providedValue = event.currentSlide.getAttribute("data-auto-move-time-sec");
            const timeout = providedValue ? Number.parseFloat(providedValue) * 1000 : 1;
            const match = curAutoMove.match(rx)
            const timer = setTimeout(function () {
                if (curAutoMove === "next") {
                    Reveal.next()
                } else if (curAutoMove === "prev") {
                    Reveal.prev()
                } else if (curAutoMove.charAt(0) === "#") {
                    document.location.hash = curAutoMove;
                } else if (match) {
                    const values = match[1].split(",").map(e => e.trim()).map(i => Number.parseInt(i, 10))
                    const random = values[Math.floor(Math.random() * values.length)]
                    Reveal.slide(random);
                } else {
                    if (isIndex(curAutoMove)) {
                        const slide = parseInt(curAutoMove, 10) - 1;
                        Reveal.slide(slide);
                    } else {
                        // @ts-ignore
                        const i = Webyarns.lookupIndex(curAutoMove)
                        if (i === -1) {
                            console.error("get not find slide with id", curAutoMove)
                        }
                        Reveal.slide(i)
                    }
                }
            }, timeout);
            Reveal.addEventListener('slidechanged', () => clearTimeout(timer))
        }
    }

    /**
     * syntax <section one-time>
     *
     * Section is shown only one time
     */
    function addSupportForOneTimeSections(event: SlideEvent) {
        let prevSlide = event.previousSlide;
        if (!prevSlide)
            return
        const onetime = prevSlide.getAttribute("data-one-time");
        if (onetime)
            prevSlide.setAttribute("data-hidden-section", "true")

    }

    /**
     * syntax <section data-unhide="toggle | once"->
     *
     * Section is shown only one time
     */
    function addSupportForUnhideSections(event: SlideEvent) {
        const unhide = event.currentSlide.getAttribute("data-unhide")
        if (!unhide)
            return

        switch (unhide) {
            case "toggle":
                event.currentSlide.toggleAttribute("data-hidden-section")
                break
            case "":
            case "once":
                event.currentSlide.removeAttribute("data-hidden-section")
                break
            default:
                console.error(`webyarn's @data-unhide unknown value ${unhide}, must be one of: "toggle" | "once" | ""`, )
        }
    }

    // @ts-ignore
    Reveal.registerPlugin('WebyarnPlugin', plugin);

    // Polyfills
    if (!Element.prototype.toggleAttribute) {
        Element.prototype.toggleAttribute = function(name, force) {
            if(force !== void 0) force = !!force

            if (this.hasAttribute(name)) {
                if (force) return true;

                this.removeAttribute(name);
                return false;
            }
            if (force === false) return false;

            this.setAttribute(name, "");
            return true;
        };
    }


})()
