"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    // Node. Does not work with strict CommonJS.
    module.exports = factory(true);
  } else {
    // Browser globals.
    window.Webyarns = factory();
  }
})(function () {
  var exposeAllForTests = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  var compose = function compose(f, g) {
    return function (x) {
      return g(f(x));
    };
  };

  var attributeNames = function attributeNames(e) {
    return Array.from(e.attributes).map(function (a) {
      return a.name;
    });
  };

  var oneOfContainedIn = function oneOfContainedIn(a2) {
    return function (a1) {
      return a1.some(function (r) {
        return a2.includes(r);
      });
    };
  };

  var containsOneOfAttributes = function containsOneOfAttributes(names) {
    return compose(attributeNames, oneOfContainedIn(names));
  };

  var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  /******
   * Count the number of direct siblings matching a selector,
   ******/

  var count = function count(sb) {
    var fn = function fn(e, attributeNames) {
      var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var next = sb(e);
      return next && containsOneOfAttributes(attributeNames)(next) ? fn(next, attributeNames, i + 1) : i;
    };

    return fn;
  };

  var countNext = count(function (n) {
    return n.nextElementSibling;
  });
  var countPrev = count(function (n) {
    return n.previousElementSibling;
  });
  /******
   * Count the number of direct hidden sections
   ******/

  var genericHidingElements = ["data-hidden-section", isTouchDevice ? "data-non-touch-only-section" : "data-touch-only-section"];

  var countHiddenSiblings = function countHiddenSiblings(fn) {
    return function (e) {
      return fn(e, genericHidingElements);
    };
  };

  var noOfHiddenLeft = function noOfHiddenLeft(e) {
    return countPrev(e, ["data-right-only-section"].concat(genericHidingElements));
  };

  var noOfHiddenRight = function noOfHiddenRight(e) {
    return countNext(e, ["data-left-only-section"].concat(genericHidingElements));
  };
  /******
   * Support for next-slide-idx
   ******/


  var getNextSlideIndexH = function getNextSlideIndexH(e) {
    var s = e.getAttribute("data-next-slide-indexh");

    try {
      return s ? parseInt(s, 10) : null;
    } catch (e) {
      throw Error("data-next-slide-indexh, must be a number, got ".concat(s));
    }
  };
  /******
   * Exports
   ******/


  var Webyarns = {
    noOfHiddenLeft: noOfHiddenLeft,
    noOfHiddenRight: noOfHiddenRight,
    getNextSlideIndexH: getNextSlideIndexH
  };

  if (exposeAllForTests) {
    // For Jest
    Webyarns.countNext = countNext;
    Webyarns.countPrev = countPrev;
  }

  return Webyarns;
});