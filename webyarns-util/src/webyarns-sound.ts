/// <reference path ="../../node_modules/@types/howler/index.d.ts"/>

(function (factory) {
    if (typeof exports === 'object')
        module.exports = factory();
    else {
        document.addEventListener("DOMContentLoaded", factory)
    }
}(() => {
    type AudioId = string
    const audioId = (s: AudioId): AudioId => s.startsWith("!") ? s.substring(1) : s;

    const partition = <T>(es: Array<T>, fn: (a: T) => boolean) =>
        es.reduce(([p, f], e) => (fn(e) ? [[...p, e], f] : [p, [...f, e]]), [[], []]);

    interface SoundData {
        [id: string]: {
            loop?: boolean,
            src: string[]
        }
    }

    interface AudioMap {
        [id: string]: Howl
    }

    const loadData = (): SoundData => {
        const elementById = document.getElementById('sounds');
        if (elementById == null) {
            console.error('Cannot find <script id="sounds" type="application/json">')
            return {}
        } else
            return JSON.parse(elementById.innerHTML);
    }


    const data: SoundData = loadData()
    const audioMap: AudioMap = Object.keys(data).reduce((acc, id) => {
        const howl = new Howl({
            src: data[id].src,
            loop: Boolean(data[id].loop),
        });
        howl.on("fade", (n) => {
            if (howl.volume() === 0) {
                howl.stop(n);
            }
        });
        return Object.assign(acc, {
            [id]: howl
        });
    }, {})

    const soundData = (s: string | null) =>
        s ? s.split(",").map(s => s.trim()) : [];


    const nextAudioActions = (currentSounds: string[], nextSounds: string[]): [string[], string[]] => {
        const [toRestart, nextToStartIds] = partition(nextSounds, e => e.startsWith("!"));
        const currentSoundIds = currentSounds.map(audioId);
        const nextSoundsIds = nextSounds.map(audioId);
        const toRestartIds = toRestart.map(audioId);
        const toStop = currentSoundIds
            .filter(e => !nextToStartIds.includes(e)) // remove the ones that carry over
            .filter(e => !toRestartIds.includes(e)) // remove the ones that need restarting
        const toStart = [
            ...nextSoundsIds.filter(e => !currentSoundIds.includes(e)), // add new ones not carried over
            ...toRestartIds // add the ones that need restarted
        ]
        return [toStop, toStart]
    }

    const soundHandler = (e: SlideEvent) => {
        const fadeValue = (a: string) => {
            const s = e.currentSlide.getAttribute(a);
            return s ? parseInt(s, 10) : 1500
        }


        const currentSoundData = e.previousSlide?.getAttribute('data-sounds');
        const nextSoundData = e.currentSlide.getAttribute("data-sounds");

        const nextSounds = soundData(nextSoundData)
        const currentSounds = soundData(currentSoundData);

        const [toStop, toStart] = nextAudioActions(currentSounds, nextSounds);


        toStop.map(id => {
            if (!audioMap[id])
                console.error("no invalid audioMap for " + id)
            else
                audioMap[id].fade(1, 0, fadeValue('fade-out-speed'));
        })
        toStart.map(id => {
            if (!audioMap[id])
                console.error("no invalid audioMap for " + id)
            else {
                audioMap[id].stop()
                audioMap[id].play()
                audioMap[id].fade(0, 1, fadeValue("fade-in-speed"))
            }
        })


    }
    Reveal.addEventListener('ready', soundHandler);
    Reveal.addEventListener('slidechanged', soundHandler);
    return {
        soundHandler,
        _test: {
            nextAudioActions
        }
    }
}));
