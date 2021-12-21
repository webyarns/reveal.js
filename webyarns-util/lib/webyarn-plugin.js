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
        addSupportForUnhideSections(event);
        addSupportToHideControls(event);
        addSupportToHideOtherSections(event);
        addSupportToUnHideOtherSections(event);
        addSupportToHideAfterVisit(event);
      });
      addSupportToUnlockAfterVisits();
      addSupportForAnchorWithDataLink(style.sheet);
      addSupportForProceedToNextAfterVideoPlayed();
    }
  };
  /**
   * Automatic proceed to next slide  once a video has completed
   */

  function addSupportForProceedToNextAfterVideoPlayed() {
    document.querySelectorAll("video[data-auto-next]").forEach(function (v) {
      v.addEventListener('ended', function (_) {
        return Reveal.next();
      });
    });
  }
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
    var rx = /random\(([0-9,\s]+)\)/;
    var curAutoMove = event.currentSlide.getAttribute("data-auto-move-to");

    if (curAutoMove) {
      var providedValue = event.currentSlide.getAttribute("data-auto-move-time-sec");
      var timeout = providedValue ? Number.parseFloat(providedValue) * 1000 : 1;
      var match = curAutoMove.match(rx);
      var timer = setTimeout(function () {
        if (curAutoMove === "next") {
          Reveal.next();
        } else if (curAutoMove === "prev") {
          Reveal.prev();
        } else if (curAutoMove.charAt(0) === "#") {
          document.location.hash = curAutoMove;
        } else if (match) {
          var values = match[1].split(",").map(function (e) {
            return e.trim();
          }).map(function (i) {
            return Number.parseInt(i, 10);
          });
          var random = values[Math.floor(Math.random() * values.length)];
          Reveal.slide(random);
        } else {
          if (isIndex(curAutoMove)) {
            var slide = parseInt(curAutoMove, 10) - 1;
            Reveal.slide(slide);
          } else {
            // @ts-ignore
            var i = Webyarns.lookupIndex(curAutoMove);

            if (i === -1) {
              console.error("get not find slide with id", curAutoMove);
            }

            Reveal.slide(i);
          }
        }
      }, timeout);
      Reveal.addEventListener('slidechanged', function () {
        return clearTimeout(timer);
      });
    }
  }
  /**
   * syntax data-one-time
   *
   * Section is shown only one time
   */


  function addSupportForOneTimeSections(event) {
    var prevSlide = event.previousSlide;
    if (!prevSlide) return;
    var onetime = prevSlide.getAttribute("data-one-time");
    if (onetime) prevSlide.setAttribute("data-hidden-section", "true");
  }
  /**
   * syntax <section data-unhide="toggle | once"->
   *
   * Section is shown only one time
   */


  function addSupportForUnhideSections(event) {
    var unhide = event.currentSlide.getAttribute("data-unhide");
    if (!unhide) return;

    switch (unhide) {
      case "toggle":
        event.currentSlide.toggleAttribute("data-hidden-section");
        break;

      case "":
      case "once":
        event.currentSlide.removeAttribute("data-hidden-section");
        break;

      default:
        console.error("webyarn's @data-unhide unknown value ".concat(unhide, ", must be one of: \"toggle\" | \"once\" | \"\""));
    }
  }
  /**
   * syntax: data-hide-controls
   *
   * hides controls on slide
   * @param event
   */


  function addSupportToHideControls(event) {
    var _event$previousSlide;

    var controls = document.querySelector(".controls");
    var hideOnPrev = (_event$previousSlide = event.previousSlide) === null || _event$previousSlide === void 0 ? void 0 : _event$previousSlide.hasAttribute("data-hide-controls");
    var hideOnCurrent = event.currentSlide.hasAttribute("data-hide-controls");

    if (controls && hideOnPrev) {
      controls.style.display = 'block';
      controls.querySelectorAll("button:not(.navigate-left)").forEach(function (e) {
        e.style.display = "block";
        e.classList.remove("impair");
        e.disabled = false;
      });
    }

    if (controls && hideOnCurrent) {
      var action = event.currentSlide.getAttribute("data-hide-controls");

      if (!action || action === "") {
        controls.style.display = 'none';
      } else {
        var actions = action.split(",").map(function (s) {
          return s.trim();
        });

        if (actions.includes("keep-left")) {
          controls.querySelectorAll("button:not(.navigate-left)").forEach(function (e) {
            return e.style.display = "none";
          });
        }

        if (actions.includes("impair-right")) {
          var rightBtn = controls.querySelector(".navigate-right");
          setTimeout(function () {
            rightBtn.classList.remove("enabled");
            rightBtn.classList.add("impair");
            rightBtn.style.display = "block";
            rightBtn.style.visibility = "visible";
            rightBtn.style.opacity = "1";
            rightBtn.disabled = true;
          }, 0);
        }
      }
    }
  }
  /**
   *  syntax data-hide-section="«id»,«id»"
   * @param event
   */


  function addSupportToHideOtherSections(event) {
    var a = event.currentSlide.getAttribute("data-hide-section");
    if (!a) return;
    a.split(",").forEach(function (id) {
      var section = document.getElementById(id);
      if (!section) console.warn("cannot find element with id ".concat(id, " to hide"));else section.setAttribute("data-hidden-section", "");
    });
  }
  /**
   *  syntax data-unhide-section="«id»,«id»"
   * @param event
   */


  function addSupportToUnHideOtherSections(event) {
    var a = event.currentSlide.getAttribute("data-unhide-section");
    if (!a) return;
    a.split(",").forEach(function (id) {
      var section = document.getElementById(id);
      if (!section) console.warn("cannot find element with id ".concat(id, " to hide"));else section.removeAttribute("data-hidden-section");
    });
  }
  /**
   * data-hide-after-visit
   */


  function addSupportToHideAfterVisit(event) {
    if (event.currentSlide.hasAttribute("data-hide-after-visit")) {
      event.currentSlide.setAttribute("data-hidden-section", "");
    }
  }
  /**
   * data-unlock-after-visited="a,b"
   */


  function addSupportToUnlockAfterVisits() {
    var data = new Map();
    var attributeName = "data-unlock-after-visited";
    document.querySelectorAll("section[".concat(attributeName, "]")).forEach(function (e) {
      var unlockSections = e.getAttribute(attributeName).split("&").map(function (s) {
        return s.trim();
      });
      unlockSections.forEach(function (id) {
        var sectionToUnlockId = e.getAttribute("id");
        if (!sectionToUnlockId) console.error("section with [".concat(attributeName, "] requires an id"));else {
          var _data$get;

          var set = (_data$get = data.get(id)) !== null && _data$get !== void 0 ? _data$get : new Set();
          set.add(sectionToUnlockId);
          data.set(id, set);
        }
      });
      e.setAttribute("data-hidden-section", "");
    });
    Reveal.addEventListener('slidechanged', function (event) {
      var id = event.currentSlide.getAttribute("id");

      if (id && data.has(id)) {
        data.get(id).forEach(function (sectionToUnhideId) {
          var sectionToUnhide = document.getElementById(sectionToUnhideId);
          var sectionsToVisitRemaining = sectionToUnhide.getAttribute(attributeName).split("&").map(function (s) {
            return s.trim();
          }).filter(function (s) {
            return s != id;
          });

          if (sectionsToVisitRemaining.length === 0) {
            sectionToUnhide.removeAttribute(attributeName);
            sectionToUnhide.removeAttribute("data-hidden-section");
          } else sectionToUnhide.setAttribute(attributeName, sectionsToVisitRemaining.join("&"));
        });
        data["delete"](id);
      }
    });
  } // @ts-ignore


  Reveal.registerPlugin('WebyarnPlugin', plugin); // Polyfills

  if (!Element.prototype.toggleAttribute) {
    Element.prototype.toggleAttribute = function (name, force) {
      if (force !== void 0) force = !!force;

      if (this.hasAttribute(name)) {
        if (force) return true;
        this.removeAttribute(name);
        return false;
      }

      if (force === false) return false;
      this.setAttribute(name, "");
      return true;
    };
  }
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJuLXBsdWdpbi50cyJdLCJuYW1lcyI6WyJwbHVnaW4iLCJpbml0Iiwic3R5bGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJoZWFkIiwiYXBwZW5kQ2hpbGQiLCJSZXZlYWwiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJhZGRTdXBwb3J0Rm9yVGltZWRTZWN0aW9ucyIsImFkZFN1cHBvcnRGb3JPbmVUaW1lU2VjdGlvbnMiLCJhZGRTdXBwb3J0Rm9yVW5oaWRlU2VjdGlvbnMiLCJhZGRTdXBwb3J0VG9IaWRlQ29udHJvbHMiLCJhZGRTdXBwb3J0VG9IaWRlT3RoZXJTZWN0aW9ucyIsImFkZFN1cHBvcnRUb1VuSGlkZU90aGVyU2VjdGlvbnMiLCJhZGRTdXBwb3J0VG9IaWRlQWZ0ZXJWaXNpdCIsImFkZFN1cHBvcnRUb1VubG9ja0FmdGVyVmlzaXRzIiwiYWRkU3VwcG9ydEZvckFuY2hvcldpdGhEYXRhTGluayIsInNoZWV0IiwiYWRkU3VwcG9ydEZvclByb2NlZWRUb05leHRBZnRlclZpZGVvUGxheWVkIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJ2IiwiXyIsIm5leHQiLCJ3ZWJ5YXJuc0NTUyIsImluc2VydFJ1bGUiLCJlIiwiZXZ0IiwicHJldmVudERlZmF1bHQiLCJzIiwiZ2V0QXR0cmlidXRlIiwiaWR4IiwicGFyc2VJbnQiLCJzbGlkZSIsImlzSW5kZXgiLCJ2YWx1ZSIsInRlc3QiLCJyeCIsImN1ckF1dG9Nb3ZlIiwiY3VycmVudFNsaWRlIiwicHJvdmlkZWRWYWx1ZSIsInRpbWVvdXQiLCJOdW1iZXIiLCJwYXJzZUZsb2F0IiwibWF0Y2giLCJ0aW1lciIsInNldFRpbWVvdXQiLCJwcmV2IiwiY2hhckF0IiwibG9jYXRpb24iLCJoYXNoIiwidmFsdWVzIiwic3BsaXQiLCJtYXAiLCJ0cmltIiwiaSIsInJhbmRvbSIsIk1hdGgiLCJmbG9vciIsImxlbmd0aCIsIldlYnlhcm5zIiwibG9va3VwSW5kZXgiLCJjb25zb2xlIiwiZXJyb3IiLCJjbGVhclRpbWVvdXQiLCJwcmV2U2xpZGUiLCJwcmV2aW91c1NsaWRlIiwib25ldGltZSIsInNldEF0dHJpYnV0ZSIsInVuaGlkZSIsInRvZ2dsZUF0dHJpYnV0ZSIsInJlbW92ZUF0dHJpYnV0ZSIsImNvbnRyb2xzIiwicXVlcnlTZWxlY3RvciIsImhpZGVPblByZXYiLCJoYXNBdHRyaWJ1dGUiLCJoaWRlT25DdXJyZW50IiwiZGlzcGxheSIsImNsYXNzTGlzdCIsInJlbW92ZSIsImRpc2FibGVkIiwiYWN0aW9uIiwiYWN0aW9ucyIsImluY2x1ZGVzIiwicmlnaHRCdG4iLCJhZGQiLCJ2aXNpYmlsaXR5Iiwib3BhY2l0eSIsImEiLCJpZCIsInNlY3Rpb24iLCJnZXRFbGVtZW50QnlJZCIsIndhcm4iLCJkYXRhIiwiTWFwIiwiYXR0cmlidXRlTmFtZSIsInVubG9ja1NlY3Rpb25zIiwic2VjdGlvblRvVW5sb2NrSWQiLCJzZXQiLCJnZXQiLCJTZXQiLCJoYXMiLCJzZWN0aW9uVG9VbmhpZGVJZCIsInNlY3Rpb25Ub1VuaGlkZSIsInNlY3Rpb25zVG9WaXNpdFJlbWFpbmluZyIsImZpbHRlciIsImpvaW4iLCJyZWdpc3RlclBsdWdpbiIsIkVsZW1lbnQiLCJwcm90b3R5cGUiLCJuYW1lIiwiZm9yY2UiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFFQSxDQUFDLFlBQVk7QUFFVCxNQUFNQSxNQUFNLEdBQUc7QUFDWEMsSUFBQUEsSUFBSSxFQUFFLGdCQUFNO0FBQ1IsVUFBTUMsS0FBSyxHQUFHQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBZDtBQUNBRCxNQUFBQSxRQUFRLENBQUNFLElBQVQsQ0FBY0MsV0FBZCxDQUEwQkosS0FBMUI7QUFDQUssTUFBQUEsTUFBTSxDQUFDQyxnQkFBUCxDQUF3QixjQUF4QixFQUF3QyxVQUFBQyxLQUFLLEVBQUk7QUFDN0NDLFFBQUFBLDBCQUEwQixDQUFDRCxLQUFELENBQTFCO0FBQ0FFLFFBQUFBLDRCQUE0QixDQUFD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QUFDekIsWUFBSUMsS0FBSixFQUFXLE9BQU8sSUFBUDtBQUVYLGFBQUt4QyxlQUFMLENBQXFCdUMsSUFBckI7QUFDQSxlQUFPLEtBQVA7QUFDSDs7QUFDRCxVQUFJQyxLQUFLLEtBQUssS0FBZCxFQUFxQixPQUFPLEtBQVA7QUFFckIsV0FBSzNDLFlBQUwsQ0FBa0IwQyxJQUFsQixFQUF3QixFQUF4QjtBQUNBLGFBQU8sSUFBUDtBQUNILEtBYkQ7QUFjSDtBQUdKLENBNVREIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aCA9XCIuLi8uLi9ub2RlX21vZHVsZXMvQHR5cGVzL3JldmVhbC9pbmRleC5kLnRzXCIvPlxuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgY29uc3QgcGx1Z2luID0ge1xuICAgICAgICBpbml0OiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgYWRkU3VwcG9ydEZvclRpbWVkU2VjdGlvbnMoZXZlbnQpXG4gICAgICAgICAgICAgICAgYWRkU3VwcG9ydEZvck9uZVRpbWVTZWN0aW9ucyhldmVudClcbiAgICAgICAgICAgICAgICBhZGRTdXBwb3J0Rm9yVW5oaWRlU2VjdGlvbnMoZXZlbnQpXG4gICAgICAgICAgICAgICAgYWRkU3VwcG9ydFRvSGlkZUNvbnRyb2xzKGV2ZW50KVxuICAgICAgICAgICAgICAgIGFkZFN1cHBvcnRUb0hpZGVPdGhlclNlY3Rpb25zKGV2ZW50KVxuICAgICAgICAgICAgICAgIGFkZFN1cHBvcnRUb1VuSGlkZU90aGVyU2VjdGlvbnMoZXZlbnQpXG4gICAgICAgICAgICAgICAgYWRkU3VwcG9ydFRvSGlkZUFmdGVyVmlzaXQoZXZlbnQpXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYWRkU3VwcG9ydFRvVW5sb2NrQWZ0ZXJWaXNpdHMoKVxuICAgICAgICAgICAgYWRkU3VwcG9ydEZvckFuY2hvcldpdGhEYXRhTGluayhzdHlsZS5zaGVldCBhcyBDU1NTdHlsZVNoZWV0KTtcbiAgICAgICAgICAgIGFkZFN1cHBvcnRGb3JQcm9jZWVkVG9OZXh0QWZ0ZXJWaWRlb1BsYXllZCgpXG5cblxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEF1dG9tYXRpYyBwcm9jZWVkIHRvIG5leHQgc2xpZGUgIG9uY2UgYSB2aWRlbyBoYXMgY29tcGxldGVkXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBhZGRTdXBwb3J0Rm9yUHJvY2VlZFRvTmV4dEFmdGVyVmlkZW9QbGF5ZWQoKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTFZpZGVvRWxlbWVudD4oXCJ2aWRlb1tkYXRhLWF1dG8tbmV4dF1cIikuZm9yRWFjaCh2ID0+IHtcbiAgICAgICAgICAgIHYuYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCBfID0+IFJldmVhbC5uZXh0KCkpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWxsb3dzIGZvclxuICAgICAqIGA8YSBkYXRhLWxpbmstaW5kZXhoPVwiMVwiPmxpbmsgdG8gc2xpZGU8L2E+YFxuICAgICAqIEBwYXJhbSB3ZWJ5YXJuc0NTU1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZFN1cHBvcnRGb3JBbmNob3JXaXRoRGF0YUxpbmsod2VieWFybnNDU1M6IENTU1N0eWxlU2hlZXQpIHtcbiAgICAgICAgd2VieWFybnNDU1MuaW5zZXJ0UnVsZShcImFbZGF0YS1saW5rLWluZGV4aF0geyBjdXJzb3I6IHBvaW50ZXIgfVwiLCAwKTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImFbZGF0YS1saW5rLWluZGV4aF1cIilcbiAgICAgICAgICAgIC5mb3JFYWNoKGUgPT4gZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHMgPSBlLmdldEF0dHJpYnV0ZShcImRhdGEtbGluay1pbmRleGhcIik7XG4gICAgICAgICAgICAgICAgaWYgKHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWR4ID0gcGFyc2VJbnQocywgMTApO1xuICAgICAgICAgICAgICAgICAgICBSZXZlYWwuc2xpZGUoaWR4KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSkpXG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBpc0luZGV4KHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIC9eXFxkKyQvLnRlc3QodmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogU3ludGF4XG4gICAgICogPHNlY3Rpb24gZGF0YS1hdXRvLW1vdmUtdG89XCIuLi5cIiBkYXRhLWF1dG8tbW92ZS10aW1lLXNlYz1cIi4uPlxuICAgICAqXG4gICAgICogQXV0b21hdGljYWxseSBtb3ZlcyB0byBhIHNlY3Rpb24gYWZ0ZXIgYSB0aW1lb3V0XG4gICAgICogUG9zc2libGUgdmFsdWVzIGZvciBkYXRhLWF1dG8tbW92ZS10bzpcbiAgICAgKiAgLSAnbmV4dCcgYW5kICdwcmV2J1xuICAgICAqICAtIGEgdXJsIGhhc2ggdmFsdWUgKCcjL3NvbWUtaWQnKVxuICAgICAqICAtIGlkIG9mIGEgc2VjdGlvbiAoJ3NvbWUtaWQnKVxuICAgICAqICAtIGFuIHBvc2l0aW9uIChvbmUtYmFzZWQpIG9mIGEgc2VjdGlvbiAoJzEyJylcbiAgICAgKlxuICAgICAqICBkYXRhLWF1dG8tbW92ZS10aW1lLXNlYyBpcyBvcHRpb25hbC4gRGVmYXVsdHMgdG8gMSBzZWNvbmRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGRTdXBwb3J0Rm9yVGltZWRTZWN0aW9ucyhldmVudDogU2xpZGVFdmVudCkge1xuXG4gICAgICAgIGNvbnN0IHJ4ID0gL3JhbmRvbVxcKChbMC05LFxcc10rKVxcKS87XG4gICAgICAgIGNvbnN0IGN1ckF1dG9Nb3ZlID0gZXZlbnQuY3VycmVudFNsaWRlLmdldEF0dHJpYnV0ZShcImRhdGEtYXV0by1tb3ZlLXRvXCIpO1xuICAgICAgICBpZiAoY3VyQXV0b01vdmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb3ZpZGVkVmFsdWUgPSBldmVudC5jdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1hdXRvLW1vdmUtdGltZS1zZWNcIik7XG4gICAgICAgICAgICBjb25zdCB0aW1lb3V0ID0gcHJvdmlkZWRWYWx1ZSA/IE51bWJlci5wYXJzZUZsb2F0KHByb3ZpZGVkVmFsdWUpICogMTAwMCA6IDE7XG4gICAgICAgICAgICBjb25zdCBtYXRjaCA9IGN1ckF1dG9Nb3ZlLm1hdGNoKHJ4KVxuICAgICAgICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyQXV0b01vdmUgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIFJldmVhbC5uZXh0KClcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1ckF1dG9Nb3ZlID09PSBcInByZXZcIikge1xuICAgICAgICAgICAgICAgICAgICBSZXZlYWwucHJldigpXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJBdXRvTW92ZS5jaGFyQXQoMCkgPT09IFwiI1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhhc2ggPSBjdXJBdXRvTW92ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IG1hdGNoWzFdLnNwbGl0KFwiLFwiKS5tYXAoZSA9PiBlLnRyaW0oKSkubWFwKGkgPT4gTnVtYmVyLnBhcnNlSW50KGksIDEwKSlcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tID0gdmFsdWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHZhbHVlcy5sZW5ndGgpXVxuICAgICAgICAgICAgICAgICAgICBSZXZlYWwuc2xpZGUocmFuZG9tKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNJbmRleChjdXJBdXRvTW92ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNsaWRlID0gcGFyc2VJbnQoY3VyQXV0b01vdmUsIDEwKSAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXZlYWwuc2xpZGUoc2xpZGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaSA9IFdlYnlhcm5zLmxvb2t1cEluZGV4KGN1ckF1dG9Nb3ZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImdldCBub3QgZmluZCBzbGlkZSB3aXRoIGlkXCIsIGN1ckF1dG9Nb3ZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgUmV2ZWFsLnNsaWRlKGkpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCAoKSA9PiBjbGVhclRpbWVvdXQodGltZXIpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3ludGF4IGRhdGEtb25lLXRpbWVcbiAgICAgKlxuICAgICAqIFNlY3Rpb24gaXMgc2hvd24gb25seSBvbmUgdGltZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZFN1cHBvcnRGb3JPbmVUaW1lU2VjdGlvbnMoZXZlbnQ6IFNsaWRlRXZlbnQpIHtcbiAgICAgICAgbGV0IHByZXZTbGlkZSA9IGV2ZW50LnByZXZpb3VzU2xpZGU7XG4gICAgICAgIGlmICghcHJldlNsaWRlKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIGNvbnN0IG9uZXRpbWUgPSBwcmV2U2xpZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1vbmUtdGltZVwiKTtcbiAgICAgICAgaWYgKG9uZXRpbWUpXG4gICAgICAgICAgICBwcmV2U2xpZGUuc2V0QXR0cmlidXRlKFwiZGF0YS1oaWRkZW4tc2VjdGlvblwiLCBcInRydWVcIilcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHN5bnRheCA8c2VjdGlvbiBkYXRhLXVuaGlkZT1cInRvZ2dsZSB8IG9uY2VcIi0+XG4gICAgICpcbiAgICAgKiBTZWN0aW9uIGlzIHNob3duIG9ubHkgb25lIHRpbWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGRTdXBwb3J0Rm9yVW5oaWRlU2VjdGlvbnMoZXZlbnQ6IFNsaWRlRXZlbnQpIHtcbiAgICAgICAgY29uc3QgdW5oaWRlID0gZXZlbnQuY3VycmVudFNsaWRlLmdldEF0dHJpYnV0ZShcImRhdGEtdW5oaWRlXCIpXG4gICAgICAgIGlmICghdW5oaWRlKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgc3dpdGNoICh1bmhpZGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0b2dnbGVcIjpcbiAgICAgICAgICAgICAgICBldmVudC5jdXJyZW50U2xpZGUudG9nZ2xlQXR0cmlidXRlKFwiZGF0YS1oaWRkZW4tc2VjdGlvblwiKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIFwiXCI6XG4gICAgICAgICAgICBjYXNlIFwib25jZVwiOlxuICAgICAgICAgICAgICAgIGV2ZW50LmN1cnJlbnRTbGlkZS5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWhpZGRlbi1zZWN0aW9uXCIpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgd2VieWFybidzIEBkYXRhLXVuaGlkZSB1bmtub3duIHZhbHVlICR7dW5oaWRlfSwgbXVzdCBiZSBvbmUgb2Y6IFwidG9nZ2xlXCIgfCBcIm9uY2VcIiB8IFwiXCJgLClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHN5bnRheDogZGF0YS1oaWRlLWNvbnRyb2xzXG4gICAgICpcbiAgICAgKiBoaWRlcyBjb250cm9scyBvbiBzbGlkZVxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZFN1cHBvcnRUb0hpZGVDb250cm9scyhldmVudDogU2xpZGVFdmVudCkge1xuICAgICAgICBjb25zdCBjb250cm9scyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvbnRyb2xzXCIpXG4gICAgICAgIGxldCBoaWRlT25QcmV2ID0gZXZlbnQucHJldmlvdXNTbGlkZT8uaGFzQXR0cmlidXRlKFwiZGF0YS1oaWRlLWNvbnRyb2xzXCIpO1xuICAgICAgICBsZXQgaGlkZU9uQ3VycmVudCA9IGV2ZW50LmN1cnJlbnRTbGlkZS5oYXNBdHRyaWJ1dGUoXCJkYXRhLWhpZGUtY29udHJvbHNcIik7XG5cbiAgICAgICAgaWYgKGNvbnRyb2xzICYmIGhpZGVPblByZXYpIHtcbiAgICAgICAgICAgIGNvbnRyb2xzLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgY29udHJvbHMucXVlcnlTZWxlY3RvckFsbDxIVE1MQnV0dG9uRWxlbWVudD4oXCJidXR0b246bm90KC5uYXZpZ2F0ZS1sZWZ0KVwiKS5mb3JFYWNoKGUgPT4ge1xuICAgICAgICAgICAgICAgIGUuc3R5bGUuZGlzcGxheSA9IGBibG9ja2BcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5yZW1vdmUoXCJpbXBhaXJcIilcbiAgICAgICAgICAgICAgICBlLmRpc2FibGVkID0gZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbnRyb2xzICYmIGhpZGVPbkN1cnJlbnQpIHtcbiAgICAgICAgICAgIGxldCBhY3Rpb24gPSBldmVudC5jdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1oaWRlLWNvbnRyb2xzXCIpO1xuICAgICAgICAgICAgaWYgKCFhY3Rpb24gfHwgYWN0aW9uID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgY29udHJvbHMuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aW9ucyA9IGFjdGlvbiEuc3BsaXQoKFwiLFwiKSkubWFwKHMgPT4gcy50cmltKCkpXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbnMuaW5jbHVkZXMoXCJrZWVwLWxlZnRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbHMucXVlcnlTZWxlY3RvckFsbDxIVE1MQnV0dG9uRWxlbWVudD4oXCJidXR0b246bm90KC5uYXZpZ2F0ZS1sZWZ0KVwiKS5mb3JFYWNoKGUgPT4gZS5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9ucy5pbmNsdWRlcyhcImltcGFpci1yaWdodFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByaWdodEJ0biA9IGNvbnRyb2xzLnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiLm5hdmlnYXRlLXJpZ2h0XCIpIVxuXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHRCdG4uY2xhc3NMaXN0LnJlbW92ZShcImVuYWJsZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0QnRuLmNsYXNzTGlzdC5hZGQoXCJpbXBhaXJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0QnRuLnN0eWxlLmRpc3BsYXkgPSBgYmxvY2tgXG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodEJ0bi5zdHlsZS52aXNpYmlsaXR5ID0gYHZpc2libGVgXG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodEJ0bi5zdHlsZS5vcGFjaXR5ID0gXCIxXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0QnRuLmRpc2FibGVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9LCAwKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAgc3ludGF4IGRhdGEtaGlkZS1zZWN0aW9uPVwiwqtpZMK7LMKraWTCu1wiXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gYWRkU3VwcG9ydFRvSGlkZU90aGVyU2VjdGlvbnMoZXZlbnQ6IFNsaWRlRXZlbnQpIHtcbiAgICAgICAgY29uc3QgYSA9IGV2ZW50LmN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWhpZGUtc2VjdGlvblwiKTtcbiAgICAgICAgaWYgKCFhKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgYS5zcGxpdChcIixcIikuZm9yRWFjaChpZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBzZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICAgICAgaWYgKCFzZWN0aW9uKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgY2Fubm90IGZpbmQgZWxlbWVudCB3aXRoIGlkICR7aWR9IHRvIGhpZGVgKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHNlY3Rpb24uc2V0QXR0cmlidXRlKFwiZGF0YS1oaWRkZW4tc2VjdGlvblwiLCBcIlwiKVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIHN5bnRheCBkYXRhLXVuaGlkZS1zZWN0aW9uPVwiwqtpZMK7LMKraWTCu1wiXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gYWRkU3VwcG9ydFRvVW5IaWRlT3RoZXJTZWN0aW9ucyhldmVudDogU2xpZGVFdmVudCkge1xuICAgICAgICBjb25zdCBhID0gZXZlbnQuY3VycmVudFNsaWRlLmdldEF0dHJpYnV0ZShcImRhdGEtdW5oaWRlLXNlY3Rpb25cIik7XG4gICAgICAgIGlmICghYSlcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGEuc3BsaXQoXCIsXCIpLmZvckVhY2goaWQgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2VjdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgICAgIGlmICghc2VjdGlvbilcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYGNhbm5vdCBmaW5kIGVsZW1lbnQgd2l0aCBpZCAke2lkfSB0byBoaWRlYClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzZWN0aW9uLnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtaGlkZGVuLXNlY3Rpb25cIilcbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGRhdGEtaGlkZS1hZnRlci12aXNpdFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZFN1cHBvcnRUb0hpZGVBZnRlclZpc2l0KGV2ZW50OiBTbGlkZUV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5jdXJyZW50U2xpZGUuaGFzQXR0cmlidXRlKFwiZGF0YS1oaWRlLWFmdGVyLXZpc2l0XCIpKSB7XG4gICAgICAgICAgICBldmVudC5jdXJyZW50U2xpZGUuc2V0QXR0cmlidXRlKFwiZGF0YS1oaWRkZW4tc2VjdGlvblwiLCBcIlwiKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZGF0YS11bmxvY2stYWZ0ZXItdmlzaXRlZD1cImEsYlwiXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWRkU3VwcG9ydFRvVW5sb2NrQWZ0ZXJWaXNpdHMoKSB7XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBNYXA8c3RyaW5nLCBTZXQ8c3RyaW5nPj4oKVxuICAgICAgICBsZXQgYXR0cmlidXRlTmFtZSA9IFwiZGF0YS11bmxvY2stYWZ0ZXItdmlzaXRlZFwiO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBzZWN0aW9uWyR7YXR0cmlidXRlTmFtZX1dYClcbiAgICAgICAgICAgIC5mb3JFYWNoKGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVubG9ja1NlY3Rpb25zID0gZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSkhLnNwbGl0KFwiJlwiKS5tYXAocz0+cy50cmltKCkpXG4gICAgICAgICAgICAgICAgdW5sb2NrU2VjdGlvbnMuZm9yRWFjaChpZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlY3Rpb25Ub1VubG9ja0lkID0gZS5nZXRBdHRyaWJ1dGUoXCJpZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWN0aW9uVG9VbmxvY2tJZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYHNlY3Rpb24gd2l0aCBbJHthdHRyaWJ1dGVOYW1lfV0gcmVxdWlyZXMgYW4gaWRgKVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNldCA9IGRhdGEuZ2V0KGlkKSA/PyBuZXcgU2V0KClcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0LmFkZChzZWN0aW9uVG9VbmxvY2tJZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuc2V0KGlkLHNldClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWhpZGRlbi1zZWN0aW9uXCIsIFwiXCIpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCAoZXZlbnQ6IFNsaWRlRXZlbnQpID0+IHtcblxuICAgICAgICAgICAgY29uc3QgaWQgPSBldmVudC5jdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKFwiaWRcIilcblxuICAgICAgICAgICAgaWYgKGlkICYmIGRhdGEuaGFzKGlkKSkge1xuXG4gICAgICAgICAgICAgICAgZGF0YS5nZXQoaWQpIS5mb3JFYWNoKHNlY3Rpb25Ub1VuaGlkZUlkPT57XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VjdGlvblRvVW5oaWRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VjdGlvblRvVW5oaWRlSWQpITtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VjdGlvbnNUb1Zpc2l0UmVtYWluaW5nID0gc2VjdGlvblRvVW5oaWRlXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpIVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KChcIiZcIikpLm1hcChzPT5zLnRyaW0oKSkuZmlsdGVyKHM9PnMhPWlkKVxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VjdGlvbnNUb1Zpc2l0UmVtYWluaW5nLmxlbmd0aCA9PT0wKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY3Rpb25Ub1VuaGlkZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY3Rpb25Ub1VuaGlkZS5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWhpZGRlbi1zZWN0aW9uXCIpXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgICAgc2VjdGlvblRvVW5oaWRlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLHNlY3Rpb25zVG9WaXNpdFJlbWFpbmluZy5qb2luKFwiJlwiKSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGRhdGEuZGVsZXRlKGlkKVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuXG4gICAgfVxuXG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgUmV2ZWFsLnJlZ2lzdGVyUGx1Z2luKCdXZWJ5YXJuUGx1Z2luJywgcGx1Z2luKTtcblxuICAgIC8vIFBvbHlmaWxsc1xuICAgIGlmICghRWxlbWVudC5wcm90b3R5cGUudG9nZ2xlQXR0cmlidXRlKSB7XG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnRvZ2dsZUF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChuYW1lLCBmb3JjZSkge1xuICAgICAgICAgICAgaWYgKGZvcmNlICE9PSB2b2lkIDApIGZvcmNlID0gISFmb3JjZVxuXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNBdHRyaWJ1dGUobmFtZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZm9yY2UpIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZvcmNlID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCBcIlwiKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgIH1cblxuXG59KVxuKClcbiJdfQ==