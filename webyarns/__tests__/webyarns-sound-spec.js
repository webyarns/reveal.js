import SoundPlugin from "../src/webyarn-sound"

describe("determining sound actions", () => {

    test("Stop one, start another", () => {
        const c = ["abc", "def"];
        const n = ["abc", "toto"];
        const [toStop, toStart] = SoundPlugin._test.nextAudioActions(c, n);
        expect(toStart).toEqual(["toto"]);
        expect(toStop).toEqual(["def"]);
    })

    test("Stop all", () => {
        const c = ["abc", "def"];
        const n = [];
        const [toStop, toStart] = SoundPlugin._test.nextAudioActions(c, n);
        expect(toStart).toEqual([]);
        expect(toStop).toEqual(["abc", "def"]);
    })
    test("Continue one", () => {
        const c = ["abc", "def"];
        const n = ["abc"];
        const [toStop, toStart] = SoundPlugin._test.nextAudioActions(c, n);
        expect(toStart).toEqual([]);
        expect(toStop).toEqual(["def"]);
    })

    test("Restart one on next", () => {
        const c = ["abc", "def"];
        const n = ["!abc"];
        const [toStop, toStart] = SoundPlugin._test.nextAudioActions(c, n);
        expect(toStart).toEqual(["abc"]);
        expect(toStop).toEqual(["def"]);
    })
    test("Restarted one on next", () => {
        const c = ["!abc", "def"];
        const n = ["abc"];
        const [toStop, toStart] = SoundPlugin._test.nextAudioActions(c, n);
        expect(toStart).toEqual([]);
        expect(toStop).toEqual(["def"]);
    })

    test("Restarted one restarted on next", () => {
        const c = ["!abc", "def"];
        const n = ["!abc"];
        const [toStop, toStart] = SoundPlugin._test.nextAudioActions(c, n);
        expect(toStart).toEqual(["abc"]);
        expect(toStop).toEqual(["def"]);
    })
})
