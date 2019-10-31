"use strict";

/// <reference path ="../../node_modules/@types/reveal/index.d.ts"/>
(function () {
  var plugin = {
    init: function init() {
      var style = document.createElement('style');
      document.head.appendChild(style);
      addSupportForAnchorWithDataLink(style.sheet);
      addSupportForTimedSections();
    }
  };
  /**
   * allows for
   * `<a data-link-indexh="1">link to slide</a>`
   * @param webyarnsCSS
   */

  function addSupportForAnchorWithDataLink(webyarnsCSS) {
    webyarnsCSS.insertRule("a[data-link-indexh] { cursor: pointer }", 0);
    document.querySelectorAll("a[data-link-indexh]").forEach(function (e) {
      return e.addEventListener("click", function (evt) {
        evt.preventDefault();
        var s = e.getAttribute("data-link-indexh");

        if (s) {
          var idx = parseInt(s, 10);
          Reveal.slide(idx);
        }
      });
    });
  }

  function addSupportForTimedSections() {
    Reveal.addEventListener('slidechanged', function (event) {
      var curAutoMove = event.currentSlide.getAttribute("data-auto-move-to");

      if (curAutoMove) {
        var timeout = event.currentSlide.getAttribute("data-auto-move-time-sec") * 1000 | 3000;
        var timer = setTimeout(function () {
          var slide = parseInt(curAutoMove, 10) - 1;
          Reveal.slide(slide);
        }, timeout);
        Reveal.addEventListener('slidechanged', function () {
          return clearTimeout(timer);
        });
      }
    });
  }

  Reveal.registerPlugin('WebyarnPlugin', plugin);
})();