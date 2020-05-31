"use strict";

/// <reference path ="../../node_modules/@types/reveal/index.d.ts"/>
(function () {
  var plugin = {
    init: function init() {
      var style = document.createElement('style');
      document.head.appendChild(style);
      Reveal.addEventListener('slidechanged', function (event) {
        addSupportForTimedSections(event);
        addSupportForOneTimeSections(event);
      });
      addSupportForAnchorWithDataLink(style.sheet);
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

  function isIndex(value) {
    return /^\d+$/.test(value);
  }
  /**
   *
   * Syntax
   * <section data-auto-move-to="..." data-auto-move-time-sec="..>
   *
   * Automatically moves to a section after a timeout
   * Possible values for data-auto-move-to:
   *  - 'next' and 'prev'
   *  - a url hash value ('#/some-id')
   *  - id of a section ('some-id')
   *  - an position (one-based) of a section ('12')
   *
   *  data-auto-move-time-sec is optional. Defaults to 1 second
   */


  function addSupportForTimedSections(event) {
    var curAutoMove = event.currentSlide.getAttribute("data-auto-move-to");

    if (curAutoMove) {
      var providedValue = event.currentSlide.getAttribute("data-auto-move-time-sec");
      var timeout = providedValue ? Number.parseInt(providedValue, 10) * 1000 : 1;
      var timer = setTimeout(function () {
        if (curAutoMove === "next") {
          Reveal.next();
        } else if (curAutoMove === "prev") {
          Reveal.prev();
        } else if (curAutoMove.charAt(0) === "#") {
          document.location.hash = curAutoMove;
        } else if (isIndex(curAutoMove)) {
          var slide = parseInt(curAutoMove, 10) - 1;
          Reveal.slide(slide);
        } else {
          var i = Webyarns.lookupIndex(curAutoMove);

          if (i === -1) {
            console.error("get not find slide with id", curAutoMove);
          }

          Reveal.slide(i);
        }
      }, timeout);
      Reveal.addEventListener('slidechanged', function () {
        return clearTimeout(timer);
      });
    }
  }
  /**
   * syntax <section one-time>
   *
   * Section is shown only one time
   */


  function addSupportForOneTimeSections(event) {
    var prevSlide = event.previousSlide;
    if (!prevSlide) return;
    var onetime = prevSlide.getAttribute("data-one-time");
    if (onetime) prevSlide.setAttribute("data-hidden-section", "true");
  }

  Reveal.registerPlugin('WebyarnPlugin', plugin);
})();