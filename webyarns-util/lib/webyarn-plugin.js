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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJuLXBsdWdpbi50cyJdLCJuYW1lcyI6WyJwbHVnaW4iLCJpbml0Iiwic3R5bGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJoZWFkIiwiYXBwZW5kQ2hpbGQiLCJSZXZlYWwiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJhZGRTdXBwb3J0Rm9yVGltZWRTZWN0aW9ucyIsImFkZFN1cHBvcnRGb3JPbmVUaW1lU2VjdGlvbnMiLCJhZGRTdXBwb3J0Rm9yVW5oaWRlU2VjdGlvbnMiLCJhZGRTdXBwb3J0VG9IaWRlQ29udHJvbHMiLCJhZGRTdXBwb3J0Rm9yQW5jaG9yV2l0aERhdGFMaW5rIiwic2hlZXQiLCJhZGRTdXBwb3J0Rm9yUHJvY2VlZFRvTmV4dEFmdGVyVmlkZW9QbGF5ZWQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsInYiLCJfIiwibmV4dCIsIndlYnlhcm5zQ1NTIiwiaW5zZXJ0UnVsZSIsImUiLCJldnQiLCJwcmV2ZW50RGVmYXVsdCIsInMiLCJnZXRBdHRyaWJ1dGUiLCJpZHgiLCJwYXJzZUludCIsInNsaWRlIiwiaXNJbmRleCIsInZhbHVlIiwidGVzdCIsInJ4IiwiY3VyQXV0b01vdmUiLCJjdXJyZW50U2xpZGUiLCJwcm92aWRlZFZhbHVlIiwidGltZW91dCIsIk51bWJlciIsInBhcnNlRmxvYXQiLCJtYXRjaCIsInRpbWVyIiwic2V0VGltZW91dCIsInByZXYiLCJjaGFyQXQiLCJsb2NhdGlvbiIsImhhc2giLCJ2YWx1ZXMiLCJzcGxpdCIsIm1hcCIsInRyaW0iLCJpIiwicmFuZG9tIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwiV2VieWFybnMiLCJsb29rdXBJbmRleCIsImNvbnNvbGUiLCJlcnJvciIsImNsZWFyVGltZW91dCIsInByZXZTbGlkZSIsInByZXZpb3VzU2xpZGUiLCJvbmV0aW1lIiwic2V0QXR0cmlidXRlIiwidW5oaWRlIiwidG9nZ2xlQXR0cmlidXRlIiwicmVtb3ZlQXR0cmlidXRlIiwiY29udHJvbHMiLCJxdWVyeVNlbGVjdG9yIiwiaGlkZU9uUHJldiIsImhhc0F0dHJpYnV0ZSIsImhpZGVPbkN1cnJlbnQiLCJkaXNwbGF5IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiZGlzYWJsZWQiLCJhY3Rpb24iLCJsb2ciLCJhY3Rpb25zIiwiaW5jbHVkZXMiLCJyaWdodEJ0biIsImFkZCIsInZpc2liaWxpdHkiLCJvcGFjaXR5IiwicmVnaXN0ZXJQbHVnaW4iLCJFbGVtZW50IiwicHJvdG90eXBlIiwibmFtZSIsImZvcmNlIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBRUEsQ0FBQyxZQUFZO0FBRVQsTUFBTUEsTUFBTSxHQUFHO0FBQ1hDLElBQUFBLElBQUksRUFBRSxnQkFBTTtBQUNSLFVBQU1DLEtBQUssR0FBR0MsUUFBUSxDQUFDQyxhQUFULENBQXVCLE9BQXZCLENBQWQ7QUFDQUQsTUFBQUEsUUFBUSxDQUFDRSxJQUFULENBQWNDLFdBQWQsQ0FBMEJKLEtBQTFCO0FBQ0FLLE1BQUFBLE1BQU0sQ0FBQ0MsZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsVUFBQUMsS0FBSyxFQUFJO0FBQzdDQyxRQUFBQSwwQkFBMEIsQ0FBQ0QsS0FBRCxDQUExQjtBQUNBRSxRQUFBQSw0QkFBNEIsQ0FBQ0YsS0FBRCxDQUE1QjtBQUNBRyxRQUFBQSwyQkFBMkIsQ0FBQ0gsS0FBRCxDQUEzQjtBQUNBSSxRQUFBQSx3QkFBd0IsQ0FBQ0osS0FBRCxDQUF4QjtBQUNILE9BTEQ7QUFNQUssTUFBQUEsK0JBQStCLENBQUNaLEtBQUssQ0FBQ2EsS0FBUCxDQUEvQjtBQUNBQyxNQUFBQSwwQ0FBMEM7QUFDN0M7QUFaVSxHQUFmO0FBZUE7QUFDSjtBQUNBOztBQUVJLFdBQVNBLDBDQUFULEdBQXNEO0FBQ2xEYixJQUFBQSxRQUFRLENBQUNjLGdCQUFULENBQTRDLHVCQUE1QyxFQUFxRUMsT0FBckUsQ0FBNkUsVUFBQUMsQ0FBQyxFQUFJO0FBQzlFQSxNQUFBQSxDQUFDLENBQUNYLGdCQUFGLENBQW1CLE9BQW5CLEVBQTRCLFVBQUFZLENBQUM7QUFBQSxlQUFJYixNQUFNLENBQUNjLElBQVAsRUFBSjtBQUFBLE9BQTdCO0FBQ0gsS0FGRDtBQUdIO0FBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0ksV0FBU1AsK0JBQVQsQ0FBeUNRLFdBQXpDLEVBQXFFO0FBQ2pFQSxJQUFBQSxXQUFXLENBQUNDLFVBQVosQ0FBdUIseUNBQXZCLEVBQWtFLENBQWxFO0FBQ0FwQixJQUFBQSxRQUFRLENBQUNjLGdCQUFULENBQTBCLHFCQUExQixFQUNLQyxPQURMLENBQ2EsVUFBQU0sQ0FBQztBQUFBLGFBQUlBLENBQUMsQ0FBQ2hCLGdCQUFGLENBQW1CLE9BQW5CLEVBQTRCLFVBQUNpQixHQUFELEVBQVM7QUFDL0NBLFFBQUFBLEdBQUcsQ0FBQ0MsY0FBSjtBQUNBLFlBQU1DLENBQUMsR0FBR0gsQ0FBQyxDQUFDSSxZQUFGLENBQWUsa0JBQWYsQ0FBVjs7QUFDQSxZQUFJRCxDQUFKLEVBQU87QUFDSCxjQUFNRSxHQUFHLEdBQUdDLFFBQVEsQ0FBQ0gsQ0FBRCxFQUFJLEVBQUosQ0FBcEI7QUFDQXBCLFVBQUFBLE1BQU0sQ0FBQ3dCLEtBQVAsQ0FBYUYsR0FBYjtBQUNIO0FBRUosT0FSYSxDQUFKO0FBQUEsS0FEZDtBQVVIOztBQUdELFdBQVNHLE9BQVQsQ0FBaUJDLEtBQWpCLEVBQXlDO0FBQ3JDLFdBQU8sUUFBUUMsSUFBUixDQUFhRCxLQUFiLENBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNJLFdBQVN2QiwwQkFBVCxDQUFvQ0QsS0FBcEMsRUFBdUQ7QUFFbkQsUUFBTTBCLEVBQUUsR0FBRyx1QkFBWDtBQUNBLFFBQU1DLFdBQVcsR0FBRzNCLEtBQUssQ0FBQzRCLFlBQU4sQ0FBbUJULFlBQW5CLENBQWdDLG1CQUFoQyxDQUFwQjs7QUFDQSxRQUFJUSxXQUFKLEVBQWlCO0FBQ2IsVUFBTUUsYUFBYSxHQUFHN0IsS0FBSyxDQUFDNEIsWUFBTixDQUFtQlQsWUFBbkIsQ0FBZ0MseUJBQWhDLENBQXRCO0FBQ0EsVUFBTVcsT0FBTyxHQUFHRCxhQUFhLEdBQUdFLE1BQU0sQ0FBQ0MsVUFBUCxDQUFrQkgsYUFBbEIsSUFBbUMsSUFBdEMsR0FBNkMsQ0FBMUU7QUFDQSxVQUFNSSxLQUFLLEdBQUdOLFdBQVcsQ0FBQ00sS0FBWixDQUFrQlAsRUFBbEIsQ0FBZDtBQUNBLFVBQU1RLEtBQUssR0FBR0MsVUFBVSxDQUFDLFlBQVk7QUFDakMsWUFBSVIsV0FBVyxLQUFLLE1BQXBCLEVBQTRCO0FBQ3hCN0IsVUFBQUEsTUFBTSxDQUFDYyxJQUFQO0FBQ0gsU0FGRCxNQUVPLElBQUllLFdBQVcsS0FBSyxNQUFwQixFQUE0QjtBQUMvQjdCLFVBQUFBLE1BQU0sQ0FBQ3NDLElBQVA7QUFDSCxTQUZNLE1BRUEsSUFBSVQsV0FBVyxDQUFDVSxNQUFaLENBQW1CLENBQW5CLE1BQTBCLEdBQTlCLEVBQW1DO0FBQ3RDM0MsVUFBQUEsUUFBUSxDQUFDNEMsUUFBVCxDQUFrQkMsSUFBbEIsR0FBeUJaLFdBQXpCO0FBQ0gsU0FGTSxNQUVBLElBQUlNLEtBQUosRUFBVztBQUNkLGNBQU1PLE1BQU0sR0FBR1AsS0FBSyxDQUFDLENBQUQsQ0FBTCxDQUFTUSxLQUFULENBQWUsR0FBZixFQUFvQkMsR0FBcEIsQ0FBd0IsVUFBQTNCLENBQUM7QUFBQSxtQkFBSUEsQ0FBQyxDQUFDNEIsSUFBRixFQUFKO0FBQUEsV0FBekIsRUFBdUNELEdBQXZDLENBQTJDLFVBQUFFLENBQUM7QUFBQSxtQkFBSWIsTUFBTSxDQUFDVixRQUFQLENBQWdCdUIsQ0FBaEIsRUFBbUIsRUFBbkIsQ0FBSjtBQUFBLFdBQTVDLENBQWY7QUFDQSxjQUFNQyxNQUFNLEdBQUdMLE1BQU0sQ0FBQ00sSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0QsTUFBTCxLQUFnQkwsTUFBTSxDQUFDUSxNQUFsQyxDQUFELENBQXJCO0FBQ0FsRCxVQUFBQSxNQUFNLENBQUN3QixLQUFQLENBQWF1QixNQUFiO0FBQ0gsU0FKTSxNQUlBO0FBQ0gsY0FBSXRCLE9BQU8sQ0FBQ0ksV0FBRCxDQUFYLEVBQTBCO0FBQ3RCLGdCQUFNTCxLQUFLLEdBQUdELFFBQVEsQ0FBQ00sV0FBRCxFQUFjLEVBQWQsQ0FBUixHQUE0QixDQUExQztBQUNBN0IsWUFBQUEsTUFBTSxDQUFDd0IsS0FBUCxDQUFhQSxLQUFiO0FBQ0gsV0FIRCxNQUdPO0FBQ0g7QUFDQSxnQkFBTXNCLENBQUMsR0FBR0ssUUFBUSxDQUFDQyxXQUFULENBQXFCdkIsV0FBckIsQ0FBVjs7QUFDQSxnQkFBSWlCLENBQUMsS0FBSyxDQUFDLENBQVgsRUFBYztBQUNWTyxjQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyw0QkFBZCxFQUE0Q3pCLFdBQTVDO0FBQ0g7O0FBQ0Q3QixZQUFBQSxNQUFNLENBQUN3QixLQUFQLENBQWFzQixDQUFiO0FBQ0g7QUFDSjtBQUNKLE9BeEJ1QixFQXdCckJkLE9BeEJxQixDQUF4QjtBQXlCQWhDLE1BQUFBLE1BQU0sQ0FBQ0MsZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0M7QUFBQSxlQUFNc0QsWUFBWSxDQUFDbkIsS0FBRCxDQUFsQjtBQUFBLE9BQXhDO0FBQ0g7QUFDSjtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7OztBQUNJLFdBQVNoQyw0QkFBVCxDQUFzQ0YsS0FBdEMsRUFBeUQ7QUFDckQsUUFBSXNELFNBQVMsR0FBR3RELEtBQUssQ0FBQ3VELGFBQXRCO0FBQ0EsUUFBSSxDQUFDRCxTQUFMLEVBQ0k7QUFDSixRQUFNRSxPQUFPLEdBQUdGLFNBQVMsQ0FBQ25DLFlBQVYsQ0FBdUIsZUFBdkIsQ0FBaEI7QUFDQSxRQUFJcUMsT0FBSixFQUNJRixTQUFTLENBQUNHLFlBQVYsQ0FBdUIscUJBQXZCLEVBQThDLE1BQTlDO0FBRVA7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBOzs7QUFDSSxXQUFTdEQsMkJBQVQsQ0FBcUNILEtBQXJDLEVBQXdEO0FBQ3BELFFBQU0wRCxNQUFNLEdBQUcxRCxLQUFLLENBQUM0QixZQUFOLENBQW1CVCxZQUFuQixDQUFnQyxhQUFoQyxDQUFmO0FBQ0EsUUFBSSxDQUFDdUMsTUFBTCxFQUNJOztBQUVKLFlBQVFBLE1BQVI7QUFDSSxXQUFLLFFBQUw7QUFDSTFELFFBQUFBLEtBQUssQ0FBQzRCLFlBQU4sQ0FBbUIrQixlQUFuQixDQUFtQyxxQkFBbkM7QUFDQTs7QUFDSixXQUFLLEVBQUw7QUFDQSxXQUFLLE1BQUw7QUFDSTNELFFBQUFBLEtBQUssQ0FBQzRCLFlBQU4sQ0FBbUJnQyxlQUFuQixDQUFtQyxxQkFBbkM7QUFDQTs7QUFDSjtBQUNJVCxRQUFBQSxPQUFPLENBQUNDLEtBQVIsZ0RBQXNETSxNQUF0RDtBQVRSO0FBV0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNJLFdBQVN0RCx3QkFBVCxDQUFrQ0osS0FBbEMsRUFBcUQ7QUFBQTs7QUFDakQsUUFBTTZELFFBQVEsR0FBR25FLFFBQVEsQ0FBQ29FLGFBQVQsQ0FBb0MsV0FBcEMsQ0FBakI7QUFDQSxRQUFJQyxVQUFVLDJCQUFHL0QsS0FBSyxDQUFDdUQsYUFBVCx5REFBRyxxQkFBcUJTLFlBQXJCLENBQWtDLG9CQUFsQyxDQUFqQjtBQUNBLFFBQUlDLGFBQWEsR0FBR2pFLEtBQUssQ0FBQzRCLFlBQU4sQ0FBbUJvQyxZQUFuQixDQUFnQyxvQkFBaEMsQ0FBcEI7O0FBRUEsUUFBSUgsUUFBUSxJQUFJRSxVQUFoQixFQUE0QjtBQUN4QkYsTUFBQUEsUUFBUSxDQUFDcEUsS0FBVCxDQUFleUUsT0FBZixHQUF5QixPQUF6QjtBQUNBTCxNQUFBQSxRQUFRLENBQUNyRCxnQkFBVCxDQUE2Qyw0QkFBN0MsRUFBMkVDLE9BQTNFLENBQW1GLFVBQUFNLENBQUMsRUFBSTtBQUNwRkEsUUFBQUEsQ0FBQyxDQUFDdEIsS0FBRixDQUFReUUsT0FBUjtBQUNBbkQsUUFBQUEsQ0FBQyxDQUFDb0QsU0FBRixDQUFZQyxNQUFaLENBQW1CLFFBQW5CO0FBQ0FyRCxRQUFBQSxDQUFDLENBQUNzRCxRQUFGLEdBQWEsS0FBYjtBQUNILE9BSkQ7QUFLSDs7QUFDRCxRQUFJUixRQUFRLElBQUlJLGFBQWhCLEVBQStCO0FBQzNCLFVBQUlLLE1BQU0sR0FBR3RFLEtBQUssQ0FBQzRCLFlBQU4sQ0FBbUJULFlBQW5CLENBQWdDLG9CQUFoQyxDQUFiOztBQUNBLFVBQUksQ0FBQ21ELE1BQUQsSUFBV0EsTUFBTSxLQUFLLEVBQTFCLEVBQThCO0FBQzFCbkIsUUFBQUEsT0FBTyxDQUFDb0IsR0FBUixDQUFZLE1BQVo7QUFDQVYsUUFBQUEsUUFBUSxDQUFDcEUsS0FBVCxDQUFleUUsT0FBZixHQUF5QixNQUF6QjtBQUVILE9BSkQsTUFJTztBQUVILFlBQU1NLE9BQU8sR0FBR0YsTUFBTSxDQUFFN0IsS0FBUixDQUFlLEdBQWYsRUFBcUJDLEdBQXJCLENBQXlCLFVBQUF4QixDQUFDO0FBQUEsaUJBQUlBLENBQUMsQ0FBQ3lCLElBQUYsRUFBSjtBQUFBLFNBQTFCLENBQWhCOztBQUNBLFlBQUk2QixPQUFPLENBQUNDLFFBQVIsQ0FBaUIsV0FBakIsQ0FBSixFQUFtQztBQUMvQlosVUFBQUEsUUFBUSxDQUFDckQsZ0JBQVQsQ0FBNkMsNEJBQTdDLEVBQTJFQyxPQUEzRSxDQUFtRixVQUFBTSxDQUFDO0FBQUEsbUJBQUlBLENBQUMsQ0FBQ3RCLEtBQUYsQ0FBUXlFLE9BQVIsU0FBSjtBQUFBLFdBQXBGO0FBQ0g7O0FBQ0QsWUFBSU0sT0FBTyxDQUFDQyxRQUFSLENBQWlCLGNBQWpCLENBQUosRUFBc0M7QUFDbEMsY0FBTUMsUUFBUSxHQUFHYixRQUFRLENBQUNDLGFBQVQsQ0FBMEMsaUJBQTFDLENBQWpCO0FBRUEzQixVQUFBQSxVQUFVLENBQUMsWUFBTTtBQUNidUMsWUFBQUEsUUFBUSxDQUFDUCxTQUFULENBQW1CQyxNQUFuQixDQUEwQixTQUExQjtBQUNBTSxZQUFBQSxRQUFRLENBQUNQLFNBQVQsQ0FBbUJRLEdBQW5CLENBQXVCLFFBQXZCO0FBQ0FELFlBQUFBLFFBQVEsQ0FBQ2pGLEtBQVQsQ0FBZXlFLE9BQWY7QUFDQVEsWUFBQUEsUUFBUSxDQUFDakYsS0FBVCxDQUFlbUYsVUFBZjtBQUNBRixZQUFBQSxRQUFRLENBQUNqRixLQUFULENBQWVvRixPQUFmLEdBQXlCLEdBQXpCO0FBQ0FILFlBQUFBLFFBQVEsQ0FBQ0wsUUFBVCxHQUFvQixJQUFwQjtBQUNILFdBUFMsRUFPUCxDQVBPLENBQVY7QUFRSDtBQUNKO0FBR0o7QUFDSixHQTNMUSxDQThMVDs7O0FBQ0F2RSxFQUFBQSxNQUFNLENBQUNnRixjQUFQLENBQXNCLGVBQXRCLEVBQXVDdkYsTUFBdkMsRUEvTFMsQ0FpTVQ7O0FBQ0EsTUFBSSxDQUFDd0YsT0FBTyxDQUFDQyxTQUFSLENBQWtCckIsZUFBdkIsRUFBd0M7QUFDcENvQixJQUFBQSxPQUFPLENBQUNDLFNBQVIsQ0FBa0JyQixlQUFsQixHQUFvQyxVQUFVc0IsSUFBVixFQUFnQkMsS0FBaEIsRUFBdUI7QUFDdkQsVUFBSUEsS0FBSyxLQUFLLEtBQUssQ0FBbkIsRUFBc0JBLEtBQUssR0FBRyxDQUFDLENBQUNBLEtBQVY7O0FBRXRCLFVBQUksS0FBS2xCLFlBQUwsQ0FBa0JpQixJQUFsQixDQUFKLEVBQTZCO0FBQ3pCLFlBQUlDLEtBQUosRUFBVyxPQUFPLElBQVA7QUFFWCxhQUFLdEIsZUFBTCxDQUFxQnFCLElBQXJCO0FBQ0EsZUFBTyxLQUFQO0FBQ0g7O0FBQ0QsVUFBSUMsS0FBSyxLQUFLLEtBQWQsRUFBcUIsT0FBTyxLQUFQO0FBRXJCLFdBQUt6QixZQUFMLENBQWtCd0IsSUFBbEIsRUFBd0IsRUFBeEI7QUFDQSxhQUFPLElBQVA7QUFDSCxLQWJEO0FBY0g7QUFHSixDQXBORCIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGggPVwiLi4vLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9yZXZlYWwvaW5kZXguZC50c1wiLz5cblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IHBsdWdpbiA9IHtcbiAgICAgICAgaW5pdDogKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIGFkZFN1cHBvcnRGb3JUaW1lZFNlY3Rpb25zKGV2ZW50KVxuICAgICAgICAgICAgICAgIGFkZFN1cHBvcnRGb3JPbmVUaW1lU2VjdGlvbnMoZXZlbnQpXG4gICAgICAgICAgICAgICAgYWRkU3VwcG9ydEZvclVuaGlkZVNlY3Rpb25zKGV2ZW50KVxuICAgICAgICAgICAgICAgIGFkZFN1cHBvcnRUb0hpZGVDb250cm9scyhldmVudClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYWRkU3VwcG9ydEZvckFuY2hvcldpdGhEYXRhTGluayhzdHlsZS5zaGVldCBhcyBDU1NTdHlsZVNoZWV0KTtcbiAgICAgICAgICAgIGFkZFN1cHBvcnRGb3JQcm9jZWVkVG9OZXh0QWZ0ZXJWaWRlb1BsYXllZCgpXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQXV0b21hdGljIHByb2NlZWQgdG8gbmV4dCBzbGlkZSAgb25jZSBhIHZpZGVvIGhhcyBjb21wbGV0ZWRcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIGFkZFN1cHBvcnRGb3JQcm9jZWVkVG9OZXh0QWZ0ZXJWaWRlb1BsYXllZCgpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MVmlkZW9FbGVtZW50PihcInZpZGVvW2RhdGEtYXV0by1uZXh0XVwiKS5mb3JFYWNoKHYgPT4ge1xuICAgICAgICAgICAgdi5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsIF8gPT4gUmV2ZWFsLm5leHQoKSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhbGxvd3MgZm9yXG4gICAgICogYDxhIGRhdGEtbGluay1pbmRleGg9XCIxXCI+bGluayB0byBzbGlkZTwvYT5gXG4gICAgICogQHBhcmFtIHdlYnlhcm5zQ1NTXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWRkU3VwcG9ydEZvckFuY2hvcldpdGhEYXRhTGluayh3ZWJ5YXJuc0NTUzogQ1NTU3R5bGVTaGVldCkge1xuICAgICAgICB3ZWJ5YXJuc0NTUy5pbnNlcnRSdWxlKFwiYVtkYXRhLWxpbmstaW5kZXhoXSB7IGN1cnNvcjogcG9pbnRlciB9XCIsIDApO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYVtkYXRhLWxpbmstaW5kZXhoXVwiKVxuICAgICAgICAgICAgLmZvckVhY2goZSA9PiBlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcyA9IGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1saW5rLWluZGV4aFwiKTtcbiAgICAgICAgICAgICAgICBpZiAocykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZHggPSBwYXJzZUludChzLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIFJldmVhbC5zbGlkZShpZHgpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KSlcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGlzSW5kZXgodmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gL15cXGQrJC8udGVzdCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTeW50YXhcbiAgICAgKiA8c2VjdGlvbiBkYXRhLWF1dG8tbW92ZS10bz1cIi4uLlwiIGRhdGEtYXV0by1tb3ZlLXRpbWUtc2VjPVwiLi4+XG4gICAgICpcbiAgICAgKiBBdXRvbWF0aWNhbGx5IG1vdmVzIHRvIGEgc2VjdGlvbiBhZnRlciBhIHRpbWVvdXRcbiAgICAgKiBQb3NzaWJsZSB2YWx1ZXMgZm9yIGRhdGEtYXV0by1tb3ZlLXRvOlxuICAgICAqICAtICduZXh0JyBhbmQgJ3ByZXYnXG4gICAgICogIC0gYSB1cmwgaGFzaCB2YWx1ZSAoJyMvc29tZS1pZCcpXG4gICAgICogIC0gaWQgb2YgYSBzZWN0aW9uICgnc29tZS1pZCcpXG4gICAgICogIC0gYW4gcG9zaXRpb24gKG9uZS1iYXNlZCkgb2YgYSBzZWN0aW9uICgnMTInKVxuICAgICAqXG4gICAgICogIGRhdGEtYXV0by1tb3ZlLXRpbWUtc2VjIGlzIG9wdGlvbmFsLiBEZWZhdWx0cyB0byAxIHNlY29uZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZFN1cHBvcnRGb3JUaW1lZFNlY3Rpb25zKGV2ZW50OiBTbGlkZUV2ZW50KSB7XG5cbiAgICAgICAgY29uc3QgcnggPSAvcmFuZG9tXFwoKFswLTksXFxzXSspXFwpLztcbiAgICAgICAgY29uc3QgY3VyQXV0b01vdmUgPSBldmVudC5jdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1hdXRvLW1vdmUtdG9cIik7XG4gICAgICAgIGlmIChjdXJBdXRvTW92ZSkge1xuICAgICAgICAgICAgY29uc3QgcHJvdmlkZWRWYWx1ZSA9IGV2ZW50LmN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWF1dG8tbW92ZS10aW1lLXNlY1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVvdXQgPSBwcm92aWRlZFZhbHVlID8gTnVtYmVyLnBhcnNlRmxvYXQocHJvdmlkZWRWYWx1ZSkgKiAxMDAwIDogMTtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gY3VyQXV0b01vdmUubWF0Y2gocngpXG4gICAgICAgICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJBdXRvTW92ZSA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgUmV2ZWFsLm5leHQoKVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyQXV0b01vdmUgPT09IFwicHJldlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIFJldmVhbC5wcmV2KClcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1ckF1dG9Nb3ZlLmNoYXJBdCgwKSA9PT0gXCIjXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaGFzaCA9IGN1ckF1dG9Nb3ZlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gbWF0Y2hbMV0uc3BsaXQoXCIsXCIpLm1hcChlID0+IGUudHJpbSgpKS5tYXAoaSA9PiBOdW1iZXIucGFyc2VJbnQoaSwgMTApKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCByYW5kb20gPSB2YWx1ZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdmFsdWVzLmxlbmd0aCldXG4gICAgICAgICAgICAgICAgICAgIFJldmVhbC5zbGlkZShyYW5kb20pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0luZGV4KGN1ckF1dG9Nb3ZlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2xpZGUgPSBwYXJzZUludChjdXJBdXRvTW92ZSwgMTApIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJldmVhbC5zbGlkZShzbGlkZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpID0gV2VieWFybnMubG9va3VwSW5kZXgoY3VyQXV0b01vdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZ2V0IG5vdCBmaW5kIHNsaWRlIHdpdGggaWRcIiwgY3VyQXV0b01vdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXZlYWwuc2xpZGUoaSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsICgpID0+IGNsZWFyVGltZW91dCh0aW1lcikpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzeW50YXggPHNlY3Rpb24gb25lLXRpbWU+XG4gICAgICpcbiAgICAgKiBTZWN0aW9uIGlzIHNob3duIG9ubHkgb25lIHRpbWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGRTdXBwb3J0Rm9yT25lVGltZVNlY3Rpb25zKGV2ZW50OiBTbGlkZUV2ZW50KSB7XG4gICAgICAgIGxldCBwcmV2U2xpZGUgPSBldmVudC5wcmV2aW91c1NsaWRlO1xuICAgICAgICBpZiAoIXByZXZTbGlkZSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBjb25zdCBvbmV0aW1lID0gcHJldlNsaWRlLmdldEF0dHJpYnV0ZShcImRhdGEtb25lLXRpbWVcIik7XG4gICAgICAgIGlmIChvbmV0aW1lKVxuICAgICAgICAgICAgcHJldlNsaWRlLnNldEF0dHJpYnV0ZShcImRhdGEtaGlkZGVuLXNlY3Rpb25cIiwgXCJ0cnVlXCIpXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzeW50YXggPHNlY3Rpb24gZGF0YS11bmhpZGU9XCJ0b2dnbGUgfCBvbmNlXCItPlxuICAgICAqXG4gICAgICogU2VjdGlvbiBpcyBzaG93biBvbmx5IG9uZSB0aW1lXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWRkU3VwcG9ydEZvclVuaGlkZVNlY3Rpb25zKGV2ZW50OiBTbGlkZUV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHVuaGlkZSA9IGV2ZW50LmN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVuaGlkZVwiKVxuICAgICAgICBpZiAoIXVuaGlkZSlcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHN3aXRjaCAodW5oaWRlKSB7XG4gICAgICAgICAgICBjYXNlIFwidG9nZ2xlXCI6XG4gICAgICAgICAgICAgICAgZXZlbnQuY3VycmVudFNsaWRlLnRvZ2dsZUF0dHJpYnV0ZShcImRhdGEtaGlkZGVuLXNlY3Rpb25cIilcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSBcIlwiOlxuICAgICAgICAgICAgY2FzZSBcIm9uY2VcIjpcbiAgICAgICAgICAgICAgICBldmVudC5jdXJyZW50U2xpZGUucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1oaWRkZW4tc2VjdGlvblwiKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYHdlYnlhcm4ncyBAZGF0YS11bmhpZGUgdW5rbm93biB2YWx1ZSAke3VuaGlkZX0sIG11c3QgYmUgb25lIG9mOiBcInRvZ2dsZVwiIHwgXCJvbmNlXCIgfCBcIlwiYCwpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzeW50YXg6IGRhdGEtaGlkZS1jb250cm9sc1xuICAgICAqXG4gICAgICogaGlkZXMgY29udHJvbHMgb24gc2xpZGVcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGRTdXBwb3J0VG9IaWRlQ29udHJvbHMoZXZlbnQ6IFNsaWRlRXZlbnQpIHtcbiAgICAgICAgY29uc3QgY29udHJvbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jb250cm9sc1wiKVxuICAgICAgICBsZXQgaGlkZU9uUHJldiA9IGV2ZW50LnByZXZpb3VzU2xpZGU/Lmhhc0F0dHJpYnV0ZShcImRhdGEtaGlkZS1jb250cm9sc1wiKTtcbiAgICAgICAgbGV0IGhpZGVPbkN1cnJlbnQgPSBldmVudC5jdXJyZW50U2xpZGUuaGFzQXR0cmlidXRlKFwiZGF0YS1oaWRlLWNvbnRyb2xzXCIpO1xuXG4gICAgICAgIGlmIChjb250cm9scyAmJiBoaWRlT25QcmV2KSB7XG4gICAgICAgICAgICBjb250cm9scy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIGNvbnRyb2xzLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiYnV0dG9uOm5vdCgubmF2aWdhdGUtbGVmdClcIikuZm9yRWFjaChlID0+IHtcbiAgICAgICAgICAgICAgICBlLnN0eWxlLmRpc3BsYXkgPSBgYmxvY2tgXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKFwiaW1wYWlyXCIpXG4gICAgICAgICAgICAgICAgZS5kaXNhYmxlZCA9IGZhbHNlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGlmIChjb250cm9scyAmJiBoaWRlT25DdXJyZW50KSB7XG4gICAgICAgICAgICBsZXQgYWN0aW9uID0gZXZlbnQuY3VycmVudFNsaWRlLmdldEF0dHJpYnV0ZShcImRhdGEtaGlkZS1jb250cm9sc1wiKTtcbiAgICAgICAgICAgIGlmICghYWN0aW9uIHx8IGFjdGlvbiA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGVyZVwiKTtcbiAgICAgICAgICAgICAgICBjb250cm9scy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb25zID0gYWN0aW9uIS5zcGxpdCgoXCIsXCIpKS5tYXAocyA9PiBzLnRyaW0oKSlcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9ucy5pbmNsdWRlcyhcImtlZXAtbGVmdFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250cm9scy5xdWVyeVNlbGVjdG9yQWxsPEhUTUxCdXR0b25FbGVtZW50PihcImJ1dHRvbjpub3QoLm5hdmlnYXRlLWxlZnQpXCIpLmZvckVhY2goZSA9PiBlLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb25zLmluY2x1ZGVzKFwiaW1wYWlyLXJpZ2h0XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0QnRuID0gY29udHJvbHMucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oXCIubmF2aWdhdGUtcmlnaHRcIikhXG5cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiZW5hYmxlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHRCdG4uY2xhc3NMaXN0LmFkZChcImltcGFpclwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHRCdG4uc3R5bGUuZGlzcGxheSA9IGBibG9ja2BcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0QnRuLnN0eWxlLnZpc2liaWxpdHkgPSBgdmlzaWJsZWBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0QnRuLnN0eWxlLm9wYWNpdHkgPSBcIjFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHRCdG4uZGlzYWJsZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0sIDApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIFJldmVhbC5yZWdpc3RlclBsdWdpbignV2VieWFyblBsdWdpbicsIHBsdWdpbik7XG5cbiAgICAvLyBQb2x5ZmlsbHNcbiAgICBpZiAoIUVsZW1lbnQucHJvdG90eXBlLnRvZ2dsZUF0dHJpYnV0ZSkge1xuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS50b2dnbGVBdHRyaWJ1dGUgPSBmdW5jdGlvbiAobmFtZSwgZm9yY2UpIHtcbiAgICAgICAgICAgIGlmIChmb3JjZSAhPT0gdm9pZCAwKSBmb3JjZSA9ICEhZm9yY2VcblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzQXR0cmlidXRlKG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZvcmNlKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmb3JjZSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgXCJcIik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICB9XG5cblxufSlcbigpXG4iXX0=