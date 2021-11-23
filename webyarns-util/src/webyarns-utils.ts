
(function (factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS.
        module.exports = factory();
    } else {
        // Browser globals.
        Object.assign(window,factory())
    }
}(() => {

    function disableKeyboardSupport(e: KeyboardEvent){
        return !Reveal.getCurrentSlide().hasAttribute("data-disable-keyboard")
    }
    return {
        disableKeyboardSupport,
    }
}));
