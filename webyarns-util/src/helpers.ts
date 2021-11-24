(function (factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS.
        module.exports = factory(true);
    } else {
        // Browser globals.

        // @ts-ignore
        window.Webyarns = factory();
    }
}((exposeAllForTests: boolean = false) => {

    const compose = <A, B, C>(f: (arg: A) => B, g: (arg: B) => C): (arg: A) => C => x => g(f(x));
    const attributeNames: (e: Element) => string[] = (e: Element) => Array.from(e.attributes).map(a => a.name);
    const oneOfContainedIn = <T>(a2: Array<T>) => (a1: Array<T>) => a1.some(r => a2.includes(r));
    const containsOneOfAttributes = (names: string[]) => compose(attributeNames, oneOfContainedIn(names));

    // @ts-ignore
    const isTouchDevice: boolean = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

    /******
     * Count the number of direct siblings matching a selector,
     ******/
    const count = (sb: (e: Element) => Element | null) => {
        const fn = (e: Element, attributeNames: string[], i = 0): number => {
            const next = sb(e);
            return next && containsOneOfAttributes(attributeNames)(next) ? fn(next, attributeNames, i + 1) : i;
        };
        return fn
    };


    const countNext: (e: Element, names: string[]) => number = count(n => n.nextElementSibling);
    const countPrev: (e: Element, names: string[]) => number = count(n => n.previousElementSibling);

    /******
     * Count the number of direct hidden sections
     ******/
    const genericHidingElements = [
        "data-hidden-section",
        isTouchDevice ? "data-non-touch-only-section" : "data-touch-only-section"
    ];
    const countHiddenSiblings = (fn: (e: Element, names: string[]) => number) => (e: Element) => fn(e, genericHidingElements);

    const noOfHiddenLeft = (e: Element) => {
        if (e.getAttribute("data-autoslide"))
            return countPrev(e, ["data-hide-from-autoslide"]);
        return countPrev(e, ["data-right-only-section", ...genericHidingElements]);
    }
    const noOfHiddenRight = (e: Element) => {
        if (e.getAttribute("data-autoslide"))
            return countNext(e, ["data-hide-from-autoslide"]);
        return countNext(e, ["data-left-only-section", ...genericHidingElements]);
    }


    function getIdx(s: string | null) {
        if (!s) return  null
        if (s?.startsWith("#")) {
            const id = s.substring(1);
            return lookupIndex(id)
        } else {
            try {
                return s ? parseInt(s, 10) : null
            } catch (e) {
                throw Error(`data-next-slide-indexh, must be a number, got ${s}`);
            }
        }
    }

    /******
     * Support for next-slide-idx
     ******/

    const getNextSlideIndexH = (e: Element): number | null => {
        const s = e.getAttribute("data-next-slide-indexh");
        return getIdx(s);
    };

    /******
     * Support for previous-slide-idx
     ******/

    const getPrevSlideIndexH = (e: Element): number | null => {
        const s = e.getAttribute("data-previous-slide-indexh");
       return getIdx(s);


    };


    const lookupIndex = (id: string): number => {
        const slides = document.querySelector(".slides");
        const f = document.getElementById(id);
        return (slides && f) ? Array.from(slides.children).indexOf(f) : -1;
    };


    /******
     * Exports
     ******/
    const Webyarns: any = {
        noOfHiddenLeft,
        noOfHiddenRight,
        getNextSlideIndexH,
        getPrevSlideIndexH,
        lookupIndex,
    };


    if (exposeAllForTests) {
        // For Jest
        Webyarns.countNext = countNext;
        Webyarns.countPrev = countPrev;
    }

    return Webyarns;
}));






