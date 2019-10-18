import Webyarns from "../src/helpers"

describe('counting matching siblings', () => {

    beforeEach(() => {
        document.body.innerHTML = `
            <section>
                <section>lorem</section>
                <section data-hidden-section>lorem</section>
                <section>lorem</section>
                <section data-hidden-section>lorem</section>
                <section data-hidden-section>lorem</section>
                <section data-hidden-section>lorem</section>
                <section class="present">lorem</section>
                <section data-hidden-section>lorem</section>
                <section data-hidden-section>lorem</section>
                <section data-toto>lorem</section>
                <section>lorem</section>
                <section data-hidden-section>lorem</section>
            </section>`;
    });


    test('Count next siblings', () => {
        const presentSection = document.querySelector("section.present");
        const i  = Webyarns.countNext(presentSection, ["data-hidden-section"]);
        expect(i).toBe(2)

    });
    test('Count prev siblings', () => {
        const presentSection = document.querySelector("section.present");
        const i  = Webyarns.countPrev(presentSection, ["data-hidden-section"]);
        expect(i).toBe(3)
    });
    test('Count next siblings with array', () => {
        const presentSection = document.querySelector("section.present");
        const i  = Webyarns.countNext(presentSection, ["data-hidden-section","data-toto"]);
        expect(i).toBe(3)

    });
});

describe('get number of hidden sections', ()=>{
    beforeEach(() => {
        document.body.innerHTML = `
            <section>
                <section>lorem</section>
                <section data-hidden-section>lorem</section>
                <section>lorem</section>
                <section data-right-only-section>lorem</section>
                <section data-hidden-section>lorem</section>
                <section data-hidden-section>lorem</section>
                <section class="present">lorem</section>
                <section data-left-only-section>lorem</section>
                <section data-hidden-section>lorem</section>
                <section>lorem</section>
                <section data-hidden-section>lorem</section>
            </section>`;
    });

    test('Count number of hidden on the left siblings', () => {
        const presentSection = document.querySelector("section.present");
        const i  = Webyarns.noOfHiddenLeft(presentSection);
        expect(i).toBe(3)
    });

    test('Count number of hidden on the right siblings', () => {
        const presentSection = document.querySelector("section.present");
        const i  = Webyarns.noOfHiddenRight(presentSection);
        expect(i).toBe(2)
    });

});

