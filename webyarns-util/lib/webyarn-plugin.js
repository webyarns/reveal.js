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
        addSupportToHideAfterVisit(event);
      });
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
        console.log("here");
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
   * data-hide-after-visit
   */


  function addSupportToHideAfterVisit(event) {
    if (event.currentSlide.hasAttribute("data-hide-after-visit")) {
      event.currentSlide.setAttribute("data-hidden-section", "");
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJuLXBsdWdpbi50cyJdLCJuYW1lcyI6WyJwbHVnaW4iLCJpbml0Iiwic3R5bGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJoZWFkIiwiYXBwZW5kQ2hpbGQiLCJSZXZlYWwiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJhZGRTdXBwb3J0Rm9yVGltZWRTZWN0aW9ucyIsImFkZFN1cHBvcnRGb3JPbmVUaW1lU2VjdGlvbnMiLCJhZGRTdXBwb3J0Rm9yVW5oaWRlU2VjdGlvbnMiLCJhZGRTdXBwb3J0VG9IaWRlQ29udHJvbHMiLCJhZGRTdXBwb3J0VG9IaWRlT3RoZXJTZWN0aW9ucyIsImFkZFN1cHBvcnRUb0hpZGVBZnRlclZpc2l0IiwiYWRkU3VwcG9ydEZvckFuY2hvcldpdGhEYXRhTGluayIsInNoZWV0IiwiYWRkU3VwcG9ydEZvclByb2NlZWRUb05leHRBZnRlclZpZGVvUGxheWVkIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJ2IiwiXyIsIm5leHQiLCJ3ZWJ5YXJuc0NTUyIsImluc2VydFJ1bGUiLCJlIiwiZXZ0IiwicHJldmVudERlZmF1bHQiLCJzIiwiZ2V0QXR0cmlidXRlIiwiaWR4IiwicGFyc2VJbnQiLCJzbGlkZSIsImlzSW5kZXgiLCJ2YWx1ZSIsInRlc3QiLCJyeCIsImN1ckF1dG9Nb3ZlIiwiY3VycmVudFNsaWRlIiwicHJvdmlkZWRWYWx1ZSIsInRpbWVvdXQiLCJOdW1iZXIiLCJwYXJzZUZsb2F0IiwibWF0Y2giLCJ0aW1lciIsInNldFRpbWVvdXQiLCJwcmV2IiwiY2hhckF0IiwibG9jYXRpb24iLCJoYXNoIiwidmFsdWVzIiwic3BsaXQiLCJtYXAiLCJ0cmltIiwiaSIsInJhbmRvbSIsIk1hdGgiLCJmbG9vciIsImxlbmd0aCIsIldlYnlhcm5zIiwibG9va3VwSW5kZXgiLCJjb25zb2xlIiwiZXJyb3IiLCJjbGVhclRpbWVvdXQiLCJwcmV2U2xpZGUiLCJwcmV2aW91c1NsaWRlIiwib25ldGltZSIsInNldEF0dHJpYnV0ZSIsInVuaGlkZSIsInRvZ2dsZUF0dHJpYnV0ZSIsInJlbW92ZUF0dHJpYnV0ZSIsImNvbnRyb2xzIiwicXVlcnlTZWxlY3RvciIsImhpZGVPblByZXYiLCJoYXNBdHRyaWJ1dGUiLCJoaWRlT25DdXJyZW50IiwiZGlzcGxheSIsImNsYXNzTGlzdCIsInJlbW92ZSIsImRpc2FibGVkIiwiYWN0aW9uIiwibG9nIiwiYWN0aW9ucyIsImluY2x1ZGVzIiwicmlnaHRCdG4iLCJhZGQiLCJ2aXNpYmlsaXR5Iiwib3BhY2l0eSIsImEiLCJpZCIsInNlY3Rpb24iLCJnZXRFbGVtZW50QnlJZCIsIndhcm4iLCJyZWdpc3RlclBsdWdpbiIsIkVsZW1lbnQiLCJwcm90b3R5cGUiLCJuYW1lIiwiZm9yY2UiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFFQSxDQUFDLFlBQVk7QUFFVCxNQUFNQSxNQUFNLEdBQUc7QUFDWEMsSUFBQUEsSUFBSSxFQUFFLGdCQUFNO0FBQ1IsVUFBTUMsS0FBSyxHQUFHQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBZDtBQUNBRCxNQUFBQSxRQUFRLENBQUNFLElBQVQsQ0FBY0MsV0FBZCxDQUEwQkosS0FBMUI7QUFDQUssTUFBQUEsTUFBTSxDQUFDQyxnQkFBUCxDQUF3QixjQUF4QixFQUF3QyxVQUFBQyxLQUFLLEVBQUk7QUFDN0NDLFFBQUFBLDBCQUEwQixDQUFDRCxLQUFELENBQTFCO0FBQ0FFLFFBQUFBLDRCQUE0QixDQUFDRixLQUFELENBQTVCO0FBQ0FHLFFBQUFBLDJCQUEyQixDQUFDSCxLQUFELENBQTNCO0FBQ0FJLFFBQUFBLHdCQUF3QixDQUFDSixLQUFELENBQXhCO0FBQ0FLLFFBQUFBLDZCQUE2QixDQUFDTCxLQUFELENBQTdCO0FBQ0FNLFFBQUFBLDBCQUEwQixDQUFDTixLQUFELENBQTFCO0FBQ0gsT0FQRDtBQVFBTyxNQUFBQSwrQkFBK0IsQ0FBQ2QsS0FBSyxDQUFDZSxLQUFQLENBQS9CO0FBQ0FDLE1BQUFBLDBDQUEw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QUssQ0FBQzhCLFlBQU4sQ0FBbUI2QixZQUFuQixDQUFnQyxxQkFBaEMsRUFBdUQsRUFBdkQ7QUFDSDtBQUNKLEdBM05RLENBNE5UOzs7QUFDQTdELEVBQUFBLE1BQU0sQ0FBQ3VGLGNBQVAsQ0FBc0IsZUFBdEIsRUFBdUM5RixNQUF2QyxFQTdOUyxDQStOVDs7QUFDQSxNQUFJLENBQUMrRixPQUFPLENBQUNDLFNBQVIsQ0FBa0IxQixlQUF2QixFQUF3QztBQUNwQ3lCLElBQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQjFCLGVBQWxCLEdBQW9DLFVBQVUyQixJQUFWLEVBQWdCQyxLQUFoQixFQUF1QjtBQUN2RCxVQUFJQSxLQUFLLEtBQUssS0FBSyxDQUFuQixFQUFzQkEsS0FBSyxHQUFHLENBQUMsQ0FBQ0EsS0FBVjs7QUFFdEIsVUFBSSxLQUFLdkIsWUFBTCxDQUFrQnNCLElBQWxCLENBQUosRUFBNkI7QUFDekIsWUFBSUMsS0FBSixFQUFXLE9BQU8sSUFBUDtBQUVYLGFBQUszQixlQUFMLENBQXFCMEIsSUFBckI7QUFDQSxlQUFPLEtBQVA7QUFDSDs7QUFDRCxVQUFJQyxLQUFLLEtBQUssS0FBZCxFQUFxQixPQUFPLEtBQVA7QUFFckIsV0FBSzlCLFlBQUwsQ0FBa0I2QixJQUFsQixFQUF3QixFQUF4QjtBQUNBLGFBQU8sSUFBUDtBQUNILEtBYkQ7QUFjSDtBQUdKLENBbFBEIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aCA9XCIuLi8uLi9ub2RlX21vZHVsZXMvQHR5cGVzL3JldmVhbC9pbmRleC5kLnRzXCIvPlxuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgY29uc3QgcGx1Z2luID0ge1xuICAgICAgICBpbml0OiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgYWRkU3VwcG9ydEZvclRpbWVkU2VjdGlvbnMoZXZlbnQpXG4gICAgICAgICAgICAgICAgYWRkU3VwcG9ydEZvck9uZVRpbWVTZWN0aW9ucyhldmVudClcbiAgICAgICAgICAgICAgICBhZGRTdXBwb3J0Rm9yVW5oaWRlU2VjdGlvbnMoZXZlbnQpXG4gICAgICAgICAgICAgICAgYWRkU3VwcG9ydFRvSGlkZUNvbnRyb2xzKGV2ZW50KVxuICAgICAgICAgICAgICAgIGFkZFN1cHBvcnRUb0hpZGVPdGhlclNlY3Rpb25zKGV2ZW50KVxuICAgICAgICAgICAgICAgIGFkZFN1cHBvcnRUb0hpZGVBZnRlclZpc2l0KGV2ZW50KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhZGRTdXBwb3J0Rm9yQW5jaG9yV2l0aERhdGFMaW5rKHN0eWxlLnNoZWV0IGFzIENTU1N0eWxlU2hlZXQpO1xuICAgICAgICAgICAgYWRkU3VwcG9ydEZvclByb2NlZWRUb05leHRBZnRlclZpZGVvUGxheWVkKClcblxuXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQXV0b21hdGljIHByb2NlZWQgdG8gbmV4dCBzbGlkZSAgb25jZSBhIHZpZGVvIGhhcyBjb21wbGV0ZWRcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIGFkZFN1cHBvcnRGb3JQcm9jZWVkVG9OZXh0QWZ0ZXJWaWRlb1BsYXllZCgpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MVmlkZW9FbGVtZW50PihcInZpZGVvW2RhdGEtYXV0by1uZXh0XVwiKS5mb3JFYWNoKHYgPT4ge1xuICAgICAgICAgICAgdi5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsIF8gPT4gUmV2ZWFsLm5leHQoKSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhbGxvd3MgZm9yXG4gICAgICogYDxhIGRhdGEtbGluay1pbmRleGg9XCIxXCI+bGluayB0byBzbGlkZTwvYT5gXG4gICAgICogQHBhcmFtIHdlYnlhcm5zQ1NTXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWRkU3VwcG9ydEZvckFuY2hvcldpdGhEYXRhTGluayh3ZWJ5YXJuc0NTUzogQ1NTU3R5bGVTaGVldCkge1xuICAgICAgICB3ZWJ5YXJuc0NTUy5pbnNlcnRSdWxlKFwiYVtkYXRhLWxpbmstaW5kZXhoXSB7IGN1cnNvcjogcG9pbnRlciB9XCIsIDApO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYVtkYXRhLWxpbmstaW5kZXhoXVwiKVxuICAgICAgICAgICAgLmZvckVhY2goZSA9PiBlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcyA9IGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1saW5rLWluZGV4aFwiKTtcbiAgICAgICAgICAgICAgICBpZiAocykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZHggPSBwYXJzZUludChzLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIFJldmVhbC5zbGlkZShpZHgpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KSlcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGlzSW5kZXgodmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gL15cXGQrJC8udGVzdCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTeW50YXhcbiAgICAgKiA8c2VjdGlvbiBkYXRhLWF1dG8tbW92ZS10bz1cIi4uLlwiIGRhdGEtYXV0by1tb3ZlLXRpbWUtc2VjPVwiLi4+XG4gICAgICpcbiAgICAgKiBBdXRvbWF0aWNhbGx5IG1vdmVzIHRvIGEgc2VjdGlvbiBhZnRlciBhIHRpbWVvdXRcbiAgICAgKiBQb3NzaWJsZSB2YWx1ZXMgZm9yIGRhdGEtYXV0by1tb3ZlLXRvOlxuICAgICAqICAtICduZXh0JyBhbmQgJ3ByZXYnXG4gICAgICogIC0gYSB1cmwgaGFzaCB2YWx1ZSAoJyMvc29tZS1pZCcpXG4gICAgICogIC0gaWQgb2YgYSBzZWN0aW9uICgnc29tZS1pZCcpXG4gICAgICogIC0gYW4gcG9zaXRpb24gKG9uZS1iYXNlZCkgb2YgYSBzZWN0aW9uICgnMTInKVxuICAgICAqXG4gICAgICogIGRhdGEtYXV0by1tb3ZlLXRpbWUtc2VjIGlzIG9wdGlvbmFsLiBEZWZhdWx0cyB0byAxIHNlY29uZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZFN1cHBvcnRGb3JUaW1lZFNlY3Rpb25zKGV2ZW50OiBTbGlkZUV2ZW50KSB7XG5cbiAgICAgICAgY29uc3QgcnggPSAvcmFuZG9tXFwoKFswLTksXFxzXSspXFwpLztcbiAgICAgICAgY29uc3QgY3VyQXV0b01vdmUgPSBldmVudC5jdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1hdXRvLW1vdmUtdG9cIik7XG4gICAgICAgIGlmIChjdXJBdXRvTW92ZSkge1xuICAgICAgICAgICAgY29uc3QgcHJvdmlkZWRWYWx1ZSA9IGV2ZW50LmN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWF1dG8tbW92ZS10aW1lLXNlY1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVvdXQgPSBwcm92aWRlZFZhbHVlID8gTnVtYmVyLnBhcnNlRmxvYXQocHJvdmlkZWRWYWx1ZSkgKiAxMDAwIDogMTtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gY3VyQXV0b01vdmUubWF0Y2gocngpXG4gICAgICAgICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJBdXRvTW92ZSA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgUmV2ZWFsLm5leHQoKVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyQXV0b01vdmUgPT09IFwicHJldlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIFJldmVhbC5wcmV2KClcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1ckF1dG9Nb3ZlLmNoYXJBdCgwKSA9PT0gXCIjXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaGFzaCA9IGN1ckF1dG9Nb3ZlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gbWF0Y2hbMV0uc3BsaXQoXCIsXCIpLm1hcChlID0+IGUudHJpbSgpKS5tYXAoaSA9PiBOdW1iZXIucGFyc2VJbnQoaSwgMTApKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCByYW5kb20gPSB2YWx1ZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdmFsdWVzLmxlbmd0aCldXG4gICAgICAgICAgICAgICAgICAgIFJldmVhbC5zbGlkZShyYW5kb20pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0luZGV4KGN1ckF1dG9Nb3ZlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2xpZGUgPSBwYXJzZUludChjdXJBdXRvTW92ZSwgMTApIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJldmVhbC5zbGlkZShzbGlkZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpID0gV2VieWFybnMubG9va3VwSW5kZXgoY3VyQXV0b01vdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZ2V0IG5vdCBmaW5kIHNsaWRlIHdpdGggaWRcIiwgY3VyQXV0b01vdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXZlYWwuc2xpZGUoaSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsICgpID0+IGNsZWFyVGltZW91dCh0aW1lcikpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzeW50YXggPHNlY3Rpb24gb25lLXRpbWU+XG4gICAgICpcbiAgICAgKiBTZWN0aW9uIGlzIHNob3duIG9ubHkgb25lIHRpbWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGRTdXBwb3J0Rm9yT25lVGltZVNlY3Rpb25zKGV2ZW50OiBTbGlkZUV2ZW50KSB7XG4gICAgICAgIGxldCBwcmV2U2xpZGUgPSBldmVudC5wcmV2aW91c1NsaWRlO1xuICAgICAgICBpZiAoIXByZXZTbGlkZSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBjb25zdCBvbmV0aW1lID0gcHJldlNsaWRlLmdldEF0dHJpYnV0ZShcImRhdGEtb25lLXRpbWVcIik7XG4gICAgICAgIGlmIChvbmV0aW1lKVxuICAgICAgICAgICAgcHJldlNsaWRlLnNldEF0dHJpYnV0ZShcImRhdGEtaGlkZGVuLXNlY3Rpb25cIiwgXCJ0cnVlXCIpXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzeW50YXggPHNlY3Rpb24gZGF0YS11bmhpZGU9XCJ0b2dnbGUgfCBvbmNlXCItPlxuICAgICAqXG4gICAgICogU2VjdGlvbiBpcyBzaG93biBvbmx5IG9uZSB0aW1lXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWRkU3VwcG9ydEZvclVuaGlkZVNlY3Rpb25zKGV2ZW50OiBTbGlkZUV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHVuaGlkZSA9IGV2ZW50LmN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVuaGlkZVwiKVxuICAgICAgICBpZiAoIXVuaGlkZSlcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHN3aXRjaCAodW5oaWRlKSB7XG4gICAgICAgICAgICBjYXNlIFwidG9nZ2xlXCI6XG4gICAgICAgICAgICAgICAgZXZlbnQuY3VycmVudFNsaWRlLnRvZ2dsZUF0dHJpYnV0ZShcImRhdGEtaGlkZGVuLXNlY3Rpb25cIilcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSBcIlwiOlxuICAgICAgICAgICAgY2FzZSBcIm9uY2VcIjpcbiAgICAgICAgICAgICAgICBldmVudC5jdXJyZW50U2xpZGUucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1oaWRkZW4tc2VjdGlvblwiKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYHdlYnlhcm4ncyBAZGF0YS11bmhpZGUgdW5rbm93biB2YWx1ZSAke3VuaGlkZX0sIG11c3QgYmUgb25lIG9mOiBcInRvZ2dsZVwiIHwgXCJvbmNlXCIgfCBcIlwiYCwpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzeW50YXg6IGRhdGEtaGlkZS1jb250cm9sc1xuICAgICAqXG4gICAgICogaGlkZXMgY29udHJvbHMgb24gc2xpZGVcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGRTdXBwb3J0VG9IaWRlQ29udHJvbHMoZXZlbnQ6IFNsaWRlRXZlbnQpIHtcbiAgICAgICAgY29uc3QgY29udHJvbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jb250cm9sc1wiKVxuICAgICAgICBsZXQgaGlkZU9uUHJldiA9IGV2ZW50LnByZXZpb3VzU2xpZGU/Lmhhc0F0dHJpYnV0ZShcImRhdGEtaGlkZS1jb250cm9sc1wiKTtcbiAgICAgICAgbGV0IGhpZGVPbkN1cnJlbnQgPSBldmVudC5jdXJyZW50U2xpZGUuaGFzQXR0cmlidXRlKFwiZGF0YS1oaWRlLWNvbnRyb2xzXCIpO1xuXG4gICAgICAgIGlmIChjb250cm9scyAmJiBoaWRlT25QcmV2KSB7XG4gICAgICAgICAgICBjb250cm9scy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIGNvbnRyb2xzLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiYnV0dG9uOm5vdCgubmF2aWdhdGUtbGVmdClcIikuZm9yRWFjaChlID0+IHtcbiAgICAgICAgICAgICAgICBlLnN0eWxlLmRpc3BsYXkgPSBgYmxvY2tgXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKFwiaW1wYWlyXCIpXG4gICAgICAgICAgICAgICAgZS5kaXNhYmxlZCA9IGZhbHNlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGlmIChjb250cm9scyAmJiBoaWRlT25DdXJyZW50KSB7XG4gICAgICAgICAgICBsZXQgYWN0aW9uID0gZXZlbnQuY3VycmVudFNsaWRlLmdldEF0dHJpYnV0ZShcImRhdGEtaGlkZS1jb250cm9sc1wiKTtcbiAgICAgICAgICAgIGlmICghYWN0aW9uIHx8IGFjdGlvbiA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGVyZVwiKTtcbiAgICAgICAgICAgICAgICBjb250cm9scy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb25zID0gYWN0aW9uIS5zcGxpdCgoXCIsXCIpKS5tYXAocyA9PiBzLnRyaW0oKSlcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9ucy5pbmNsdWRlcyhcImtlZXAtbGVmdFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250cm9scy5xdWVyeVNlbGVjdG9yQWxsPEhUTUxCdXR0b25FbGVtZW50PihcImJ1dHRvbjpub3QoLm5hdmlnYXRlLWxlZnQpXCIpLmZvckVhY2goZSA9PiBlLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb25zLmluY2x1ZGVzKFwiaW1wYWlyLXJpZ2h0XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0QnRuID0gY29udHJvbHMucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oXCIubmF2aWdhdGUtcmlnaHRcIikhXG5cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiZW5hYmxlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHRCdG4uY2xhc3NMaXN0LmFkZChcImltcGFpclwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHRCdG4uc3R5bGUuZGlzcGxheSA9IGBibG9ja2BcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0QnRuLnN0eWxlLnZpc2liaWxpdHkgPSBgdmlzaWJsZWBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0QnRuLnN0eWxlLm9wYWNpdHkgPSBcIjFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHRCdG4uZGlzYWJsZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0sIDApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBzeW50YXggZGF0YS1oaWRlLXNlY3Rpb249XCLCq2lkwrsswqtpZMK7XCJcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGRTdXBwb3J0VG9IaWRlT3RoZXJTZWN0aW9ucyhldmVudDogU2xpZGVFdmVudCkge1xuICAgICAgICBjb25zdCBhID0gZXZlbnQuY3VycmVudFNsaWRlLmdldEF0dHJpYnV0ZShcImRhdGEtaGlkZS1zZWN0aW9uXCIpO1xuICAgICAgICBpZiAoIWEpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBhLnNwbGl0KFwiLFwiKS5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgICAgICBpZiAoIXNlY3Rpb24pXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBjYW5ub3QgZmluZCBlbGVtZW50IHdpdGggaWQgJHtpZH0gdG8gaGlkZWApXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc2VjdGlvbi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWhpZGRlbi1zZWN0aW9uXCIsIFwiXCIpXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBkYXRhLWhpZGUtYWZ0ZXItdmlzaXRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGRTdXBwb3J0VG9IaWRlQWZ0ZXJWaXNpdChldmVudDogU2xpZGVFdmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuY3VycmVudFNsaWRlLmhhc0F0dHJpYnV0ZShcImRhdGEtaGlkZS1hZnRlci12aXNpdFwiKSkge1xuICAgICAgICAgICAgZXZlbnQuY3VycmVudFNsaWRlLnNldEF0dHJpYnV0ZShcImRhdGEtaGlkZGVuLXNlY3Rpb25cIiwgXCJcIilcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgUmV2ZWFsLnJlZ2lzdGVyUGx1Z2luKCdXZWJ5YXJuUGx1Z2luJywgcGx1Z2luKTtcblxuICAgIC8vIFBvbHlmaWxsc1xuICAgIGlmICghRWxlbWVudC5wcm90b3R5cGUudG9nZ2xlQXR0cmlidXRlKSB7XG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnRvZ2dsZUF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChuYW1lLCBmb3JjZSkge1xuICAgICAgICAgICAgaWYgKGZvcmNlICE9PSB2b2lkIDApIGZvcmNlID0gISFmb3JjZVxuXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNBdHRyaWJ1dGUobmFtZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZm9yY2UpIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZvcmNlID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCBcIlwiKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgIH1cblxuXG59KVxuKClcbiJdfQ==