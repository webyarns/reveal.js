/*
 * Example Map:
     const navMap1 = {
        buttons: {
            "moby": {
                showId:"d",
                to: 6,
            },
            "1984": 16,
            "write": 18,
        },
        "end": 68
    }

 *
 *
 */


function initScienceButtons(svg: HTMLObjectElement) {
    const map = getMap(svg)

    // @ts-ignore
    svg.contentDocument.querySelectorAll<HTMLAnchorElement>("a").forEach(a => {
        a.addEventListener("click", (e: MouseEvent) => {
            // @ts-ignore
            e.preventDefault();
            const target: HTMLElement= <HTMLElement>e.currentTarget;
            if (!target)
                throw new Error("Event has no currentTarget")
            target.classList.remove("unclicked")
            svg.blur()
            const btnId = target.getAttribute("id");
            if (!btnId)
                throw new Error(`cannot find id attribute on ${target}`)
            const navTo = map.buttons[btnId];
            if (navTo) {
                Reveal.slide(navTo.to || navTo)
            } else
                console.warn("No navigation available in ", map.buttons)
            if (navTo?.showId) {
                let btn2 = svgContentDocument(svg).getElementById(navTo.showId);
                if (!btn2)
                    throw new Error(`Could not find element with id ${navTo.showId}`)
                btn2.classList.remove("invisible")
            }
            if (noButtonsLeft(svg)) {
                const end = map.end;
                if (!end) {
                    const parentNode = svg.parentNode;
                    parentNode?.removeChild(svg);
                } else {
                    end && document.getElementById("science-home")?.setAttribute("data-auto-move-to", end)
                    end && document.getElementById("science-home")?.setAttribute("data-auto-move-time-sec", "0.1")
                    end && document.getElementById("science-home")?.setAttribute("data-next-slide-indexh", end)
                }

            }
        })
    })

}

function getMap(svg: HTMLObjectElement) {
    let attribute = svg.getAttribute("data-map");
    if (!attribute)
        throw new Error("object with svg requires data-map attribute  ")
    return eval(attribute);
}


function noButtonsLeft(svg: HTMLObjectElement) {
    const contentDocument = svg.contentDocument;
    if (!contentDocument)
        throw new Error("No contentDocument on svg ")
    return svgContentDocument(svg).querySelectorAll("a.unclicked").length === 0;
}

const svgContentDocument = (svg: HTMLObjectElement): Document  => {
    const contentDocument = svg.contentDocument;
    if (!contentDocument)
        throw new Error("No contentDocument on svg ")
    return contentDocument
}
