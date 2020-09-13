"use strict";

(function () {
  function preloadAllAudio(evt) {
    evt.preventDefault();
    document.querySelectorAll("audio").forEach(function (elem) {
      elem.play().then(function () {
        return elem.pause();
      });
    });
    Reveal.next();
  }

  document.addEventListener("DOMContentLoaded", function () {
    console.log("Deprecated script: audio-ios-initialiser. Is no longer needed");
    var audioInitLink = document.getElementById("ipad-audio-init");
    if (!audioInitLink) return;
    ['touchstart', 'click'].forEach(function (name) {
      return audioInitLink.addEventListener(name, preloadAllAudio);
    });
  });
})();