"use strict";

window.addEventListener('load', function () {
  document.querySelectorAll(".preloader").forEach(function (e) {
    var _e$parentNode;

    return (_e$parentNode = e.parentNode) === null || _e$parentNode === void 0 ? void 0 : _e$parentNode.removeChild(e);
  });
  document.querySelectorAll(".reveal").forEach(function (e) {
    e.style.opacity = "1";
  });
});