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
    if (e.getAttribute("data-autoslide"))
      return 0
    return countPrev(e, ["data-right-only-section"].concat(genericHidingElements));
  };

  var noOfHiddenRight = function noOfHiddenRight(e) {
    if (e.getAttribute("data-autoslide"))
      return 0
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

  var lookupIndex = function lookupIndex(id) {
    var slides = document.querySelector(".slides");
    var f = document.getElementById(id);
    return slides && f ? Array.from(slides.children).indexOf(f) : -1;
  };
  /******
   * Exports
   ******/


  var Webyarns = {
    noOfHiddenLeft: noOfHiddenLeft,
    noOfHiddenRight: noOfHiddenRight,
    getNextSlideIndexH: getNextSlideIndexH,
    lookupIndex: lookupIndex
  };

  if (exposeAllForTests) {
    // For Jest
    Webyarns.countNext = countNext;
    Webyarns.countPrev = countPrev;
  }

  return Webyarns;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXJzLnRzIl0sIm5hbWVzIjpbImZhY3RvcnkiLCJleHBvcnRzIiwibW9kdWxlIiwid2luZG93IiwiV2VieWFybnMiLCJleHBvc2VBbGxGb3JUZXN0cyIsImNvbXBvc2UiLCJmIiwiZyIsIngiLCJhdHRyaWJ1dGVOYW1lcyIsImUiLCJBcnJheSIsImZyb20iLCJhdHRyaWJ1dGVzIiwibWFwIiwiYSIsIm5hbWUiLCJvbmVPZkNvbnRhaW5lZEluIiwiYTIiLCJhMSIsInNvbWUiLCJyIiwiaW5jbHVkZXMiLCJjb250YWluc09uZU9mQXR0cmlidXRlcyIsIm5hbWVzIiwiaXNUb3VjaERldmljZSIsIm5hdmlnYXRvciIsIm1heFRvdWNoUG9pbnRzIiwibXNNYXhUb3VjaFBvaW50cyIsImNvdW50Iiwic2IiLCJmbiIsImkiLCJuZXh0IiwiY291bnROZXh0IiwibiIsIm5leHRFbGVtZW50U2libGluZyIsImNvdW50UHJldiIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJnZW5lcmljSGlkaW5nRWxlbWVudHMiLCJjb3VudEhpZGRlblNpYmxpbmdzIiwibm9PZkhpZGRlbkxlZnQiLCJub09mSGlkZGVuUmlnaHQiLCJnZXROZXh0U2xpZGVJbmRleEgiLCJzIiwiZ2V0QXR0cmlidXRlIiwicGFyc2VJbnQiLCJFcnJvciIsImxvb2t1cEluZGV4IiwiaWQiLCJzbGlkZXMiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRFbGVtZW50QnlJZCIsImNoaWxkcmVuIiwiaW5kZXhPZiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFDLFdBQVVBLE9BQVYsRUFBbUI7QUFDaEIsTUFBSSxRQUFPQyxPQUFQLHlDQUFPQSxPQUFQLE9BQW1CLFFBQXZCLEVBQWlDO0FBQzdCO0FBQ0FDLElBQUFBLE1BQU0sQ0FBQ0QsT0FBUCxHQUFpQkQsT0FBTyxDQUFDLElBQUQsQ0FBeEI7QUFDSCxHQUhELE1BR087QUFDSDtBQUVBRyxJQUFBQSxNQUFNLENBQUNDLFFBQVAsR0FB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QUFxQkEsU0FBckI7QUFDSDs7QUFFRCxTQUFPbEMsUUFBUDtBQUNILENBdkZBLENBQUQiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMuXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSh0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHMuXG5cbiAgICAgICAgd2luZG93LldlYnlhcm5zID0gZmFjdG9yeSgpO1xuICAgIH1cbn0oKGV4cG9zZUFsbEZvclRlc3RzOiBib29sZWFuID0gZmFsc2UpID0+IHtcblxuICAgIGNvbnN0IGNvbXBvc2UgPSA8QSwgQiwgQz4oZjogKGFyZzogQSkgPT4gQiwgZzogKGFyZzogQikgPT4gQyk6IChhcmc6IEEpID0+IEMgPT4geCA9PiBnKGYoeCkpO1xuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWVzOiAoZTogRWxlbWVudCkgPT4gc3RyaW5nW10gPSAoZTogRWxlbWVudCkgPT4gQXJyYXkuZnJvbShlLmF0dHJpYnV0ZXMpLm1hcChhID0+IGEubmFtZSk7XG4gICAgY29uc3Qgb25lT2ZDb250YWluZWRJbiA9IDxUPihhMjogQXJyYXk8VD4pID0+IChhMTogQXJyYXk8VD4pID0+IGExLnNvbWUociA9PiBhMi5pbmNsdWRlcyhyKSk7XG4gICAgY29uc3QgY29udGFpbnNPbmVPZkF0dHJpYnV0ZXMgPSAobmFtZXM6IHN0cmluZ1tdKSA9PiBjb21wb3NlKGF0dHJpYnV0ZU5hbWVzLCBvbmVPZkNvbnRhaW5lZEluKG5hbWVzKSk7XG5cbiAgICBjb25zdCBpc1RvdWNoRGV2aWNlOiBib29sZWFuID0gKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykgfHxcbiAgICAgICAgKG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDApIHx8XG4gICAgICAgIChuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyA+IDApO1xuXG4gICAgLyoqKioqKlxuICAgICAqIENvdW50IHRoZSBudW1iZXIgb2YgZGlyZWN0IHNpYmxpbmdzIG1hdGNoaW5nIGEgc2VsZWN0b3IsXG4gICAgICoqKioqKi9cbiAgICBjb25zdCBjb3VudCA9IChzYjogKGU6IEVsZW1lbnQpID0+IEVsZW1lbnQgfCBudWxsKSA9PiB7XG4gICAgICAgIGNvbnN0IGZuID0gKGU6IEVsZW1lbnQsIGF0dHJpYnV0ZU5hbWVzOiBzdHJpbmdbXSwgaSA9IDApOiBudW1iZXIgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV4dCA9IHNiKGUpO1xuICAgICAgICAgICAgcmV0dXJuIG5leHQgJiYgY29udGFpbnNPbmVPZkF0dHJpYnV0ZXMoYXR0cmlidXRlTmFtZXMpKG5leHQpID8gZm4obmV4dCwgYXR0cmlidXRlTmFtZXMsIGkgKyAxKSA6IGk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmblxuICAgIH07XG5cblxuICAgIGNvbnN0IGNvdW50TmV4dDogKGU6IEVsZW1lbnQsIG5hbWVzOiBzdHJpbmdbXSkgPT4gbnVtYmVyID0gY291bnQobiA9PiBuLm5leHRFbGVtZW50U2libGluZyk7XG4gICAgY29uc3QgY291bnRQcmV2OiAoZTogRWxlbWVudCwgbmFtZXM6IHN0cmluZ1tdKSA9PiBudW1iZXIgPSBjb3VudChuID0+IG4ucHJldmlvdXNFbGVtZW50U2libGluZyk7XG5cbiAgICAvKioqKioqXG4gICAgICogQ291bnQgdGhlIG51bWJlciBvZiBkaXJlY3QgaGlkZGVuIHNlY3Rpb25zXG4gICAgICoqKioqKi9cbiAgICBjb25zdCBnZW5lcmljSGlkaW5nRWxlbWVudHMgPSBbXG4gICAgICAgIFwiZGF0YS1oaWRkZW4tc2VjdGlvblwiLFxuICAgICAgICBpc1RvdWNoRGV2aWNlID8gXCJkYXRhLW5vbi10b3VjaC1vbmx5LXNlY3Rpb25cIiA6IFwiZGF0YS10b3VjaC1vbmx5LXNlY3Rpb25cIlxuICAgIF07XG4gICAgY29uc3QgY291bnRIaWRkZW5TaWJsaW5ncyA9IChmbjogKGU6IEVsZW1lbnQsIG5hbWVzOiBzdHJpbmdbXSkgPT4gbnVtYmVyKSA9PiAoZTogRWxlbWVudCkgPT4gZm4oZSwgZ2VuZXJpY0hpZGluZ0VsZW1lbnRzKTtcblxuICAgIGNvbnN0IG5vT2ZIaWRkZW5MZWZ0ID0gKGU6IEVsZW1lbnQpID0+IGNvdW50UHJldihlLCBbXCJkYXRhLXJpZ2h0LW9ubHktc2VjdGlvblwiLCAuLi5nZW5lcmljSGlkaW5nRWxlbWVudHNdKTtcbiAgICBjb25zdCBub09mSGlkZGVuUmlnaHQgPSAoZTogRWxlbWVudCkgPT4gY291bnROZXh0KGUsIFtcImRhdGEtbGVmdC1vbmx5LXNlY3Rpb25cIiwgLi4uZ2VuZXJpY0hpZGluZ0VsZW1lbnRzXSk7XG5cblxuICAgIC8qKioqKipcbiAgICAgKiBTdXBwb3J0IGZvciBuZXh0LXNsaWRlLWlkeFxuICAgICAqKioqKiovXG5cbiAgICBjb25zdCBnZXROZXh0U2xpZGVJbmRleEggPSAoZTogRWxlbWVudCk6IG51bWJlciB8IG51bGwgPT4ge1xuICAgICAgICBjb25zdCBzID0gZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLW5leHQtc2xpZGUtaW5kZXhoXCIpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIHMgPyBwYXJzZUludChzLCAxMCkgOiBudWxsXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBkYXRhLW5leHQtc2xpZGUtaW5kZXhoLCBtdXN0IGJlIGEgbnVtYmVyLCBnb3QgJHtzfWApO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgY29uc3QgbG9va3VwSW5kZXggPSAoaWQ6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgICAgIGNvbnN0IHNsaWRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVzXCIpO1xuICAgICAgICBjb25zdCBmID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICByZXR1cm4gKHNsaWRlcyAmJiBmKSA/ICBBcnJheS5mcm9tKHNsaWRlcy5jaGlsZHJlbikuaW5kZXhPZihmKSA6IC0xO1xuICAgIH07XG5cblxuICAgIC8qKioqKipcbiAgICAgKiBFeHBvcnRzXG4gICAgICoqKioqKi9cbiAgICBjb25zdCBXZWJ5YXJucyAgOiBhbnkgPSB7XG4gICAgICAgIG5vT2ZIaWRkZW5MZWZ0LFxuICAgICAgICBub09mSGlkZGVuUmlnaHQsXG4gICAgICAgIGdldE5leHRTbGlkZUluZGV4SCxcbiAgICAgICAgbG9va3VwSW5kZXgsXG4gICAgfTtcblxuXG4gICAgaWYgKGV4cG9zZUFsbEZvclRlc3RzKSB7XG4gICAgICAgIC8vIEZvciBKZXN0XG4gICAgICAgIFdlYnlhcm5zLmNvdW50TmV4dCA9IGNvdW50TmV4dDtcbiAgICAgICAgV2VieWFybnMuY291bnRQcmV2ID0gY291bnRQcmV2O1xuICAgIH1cblxuICAgIHJldHVybiBXZWJ5YXJucztcbn0pKTtcblxuXG5cblxuXG5cbiJdfQ==
