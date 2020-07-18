"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    // Node. Does not work with strict CommonJS.
    module.exports = factory();
  } else {
    // Browser globals.
    Object.assign(window, factory());
    window.addEventListener("DOMContentLoaded", function () {
      Reveal.addEventListener('ready', window.autoplayVideo);
      Reveal.addEventListener('slidechanged', window.autoplayVideo);
    });
  }
})(function () {
  console.log("Deprecated script: auto-video-play.ts. Use reveal's built-in support https://revealjs.com/media/#autoplay  (data-autoplay)");

  function autoplayVideo(event) {
    event.currentSlide.querySelectorAll("video[data-autostart]").forEach(function (e) {
      if (!(e instanceof HTMLVideoElement)) {
        return;
      } // noinspection JSIgnoredPromiseFromCall


      e.play(); // e.addEventListener("ended",)
    });
    if (event.previousSlide) event.previousSlide.querySelectorAll("video[data-autostart]").forEach(function (e) {
      if (!(e instanceof HTMLVideoElement)) {
        return;
      } // noinspection JSIgnoredPromiseFromCall


      e.pause(); // e.removeEventListener("ended",proceedToNext)
    });
  }

  return {
    autoplayVideo: autoplayVideo
  };
});