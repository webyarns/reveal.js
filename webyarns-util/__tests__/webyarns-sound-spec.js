import SoundPlugin from "../src/webyarns-sound"

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

    test("Start a persistent one", () => {
        const s1 = ["def"];
        const s2 = [">abc","toto"];
        const [_, toStart] = SoundPlugin._test.nextAudioActions(s1, s2);
        expect(toStart).toEqual(["abc","toto"]);
    })

    test("Keep a persistent one playing", () => {
        const s1 = [];
        const s2 = [">abc","toto"];
        const s3 = [];
        SoundPlugin._test.nextAudioActions(s1, s2);
        const [toStop, toStart] = SoundPlugin._test.nextAudioActions(s2, s3);
        expect(toStop).toEqual(["toto"]);
    })

    test("Stop a persistent one", () => {
        const s1 = [];
        const s2 = [">abc","toto"];
        const s3 = [];
        const s4 = ["#abc"];
        SoundPlugin._test.nextAudioActions(s1, s2);
        SoundPlugin._test.nextAudioActions(s2, s3);
        const [toStop, _] = SoundPlugin._test.nextAudioActions(s3, s4);
        expect(toStop).toEqual(["abc"]);
    })

    test("Don't start a audio intended to stop", () => {
        const s1 = [];
        const s2 = [">abc","toto"];
        const s3 = [];
        const s4 = ["#abc"];
        SoundPlugin._test.nextAudioActions(s1, s2);
        SoundPlugin._test.nextAudioActions(s2, s3);
        const [_, toStart] = SoundPlugin._test.nextAudioActions(s3, s4);
        expect(toStart).toEqual([]);
    })

})
