"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    // Node. Does not work with strict CommonJS.
    module.exports = factory();
  } else {
    // Browser globals.
    Object.assign(window, factory());
    window.addEventListener("DOMContentLoaded", function () {
      // @ts-ignore
      Reveal.addEventListener('ready', window.autoplayVideo); // @ts-ignore

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXRvLXZpZGVvLXBsYXkudHMiXSwibmFtZXMiOlsiZmFjdG9yeSIsImV4cG9ydHMiLCJtb2R1bGUiLCJPYmplY3QiLCJhc3NpZ24iLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiUmV2ZWFsIiwiYXV0b3BsYXlWaWRlbyIsImNvbnNvbGUiLCJsb2ciLCJldmVudCIsImN1cnJlbnRTbGlkZSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZSIsIkhUTUxWaWRlb0VsZW1lbnQiLCJwbGF5IiwicHJldmlvdXNTbGlkZSIsInBhdXNlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQ0MsV0FBVUEsT0FBVixFQUFtQjtBQUNoQixNQUFJLFFBQU9DLE9BQVAseUNBQU9BLE9BQVAsT0FBbUIsUUFBdkIsRUFBaUM7QUFDN0I7QUFDQUMsSUFBQUEsTUFBTSxDQUFDRCxPQUFQLEdBQWlCRCxPQUFPLEVBQXhCO0FBQ0gsR0FIRCxNQUdPO0FBQ0g7QUFDQUcsSUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWNDLE1BQWQsRUFBcUJMLE9BQU8sRUFBNUI7QUFDQUssSUFBQUEsTUFBTSxDQUFDQyxnQkFBUCxDQUF3QixrQkFBeEIsRUFBNEMsWUFBSTtBQUM1QztBQUNBQyxNQUFBQSxNQUFNLENBQUNELGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDRCxNQUFNLENBQUNHLGFBQXhDLEVBRjRDLENBRzVDOztBQUNBRCxNQUFBQSxNQUFNLENBQUNELGdCQUFQLENBQXdCLGNBQXhCLEVBQXdDRCxNQUFNLENBQUNHLGFBQS9DO0FBQ0gsS0FMRDtBQU1IO0FBQ0osQ0FkQSxFQWNDLFlBQU07QUFDSkMsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksNEhBQVo7O0FBQ0EsV0FBU0YsYUFBVCxDQUF1QkcsS0FBdkIsRUFBMEM7QUFDdENBLElBQUFBLEtBQUssQ0FBQ0MsWUFBTixDQUFtQkMsZ0JBQW5CLENBQW9DLHVCQUFwQyxFQUE2REMsT0FBN0QsQ0FBcUUsVUFBQUMsQ0FBQyxFQUFJO0FBQ3RFLFVBQUksRUFBRUEsQ0FBQyxZQUFZQyxnQkFBZixDQUFKLEVBQXNDO0FBQ2xDO0FBQ0gsT0FIcUUsQ0FJdEU7OztBQUNBRCxNQUFBQSxDQUFDLENBQUNFLElBQUYsR0FMc0UsQ0FNdEU7QUFDSCxLQVBEO0FBUUEsUUFBSU4sS0FBSyxDQUFDTyxhQUFWLEVBQ0lQLEtBQUssQ0FBQ08sYUFBTixDQUFvQkwsZ0JBQXBCLENBQXFDLHVCQUFyQyxFQUE4REMsT0FBOUQsQ0FBc0UsVUFBQUMsQ0FBQyxFQUFJO0FBQ3ZFLFVBQUksRUFBRUEsQ0FBQyxZQUFZQyxnQkFBZixDQUFKLEVBQXNDO0FBQ2xDO0FBQ0gsT0FIc0UsQ0FJdkU7OztBQUNBRCxNQUFBQSxDQUFDLENBQUNJLEtBQUYsR0FMdUUsQ0FNdkU7QUFDSCxLQVBEO0FBVVA7O0FBR0QsU0FBTztBQUNIWCxJQUFBQSxhQUFhLEVBQWJBO0FBREcsR0FBUDtBQUdILENBMUNBLENBQUQiLCJzb3VyY2VzQ29udGVudCI6WyJcbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUy5cbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzLlxuICAgICAgICBPYmplY3QuYXNzaWduKHdpbmRvdyxmYWN0b3J5KCkpXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKT0+e1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5Jywgd2luZG93LmF1dG9wbGF5VmlkZW8pXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgd2luZG93LmF1dG9wbGF5VmlkZW8pXG4gICAgICAgIH0pXG4gICAgfVxufSgoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJEZXByZWNhdGVkIHNjcmlwdDogYXV0by12aWRlby1wbGF5LnRzLiBVc2UgcmV2ZWFsJ3MgYnVpbHQtaW4gc3VwcG9ydCBodHRwczovL3JldmVhbGpzLmNvbS9tZWRpYS8jYXV0b3BsYXkgIChkYXRhLWF1dG9wbGF5KVwiKVxuICAgIGZ1bmN0aW9uIGF1dG9wbGF5VmlkZW8oZXZlbnQ6IFNsaWRlRXZlbnQpIHtcbiAgICAgICAgZXZlbnQuY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ2aWRlb1tkYXRhLWF1dG9zdGFydF1cIikuZm9yRWFjaChlID0+IHtcbiAgICAgICAgICAgIGlmICghKGUgaW5zdGFuY2VvZiBIVE1MVmlkZW9FbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU0lnbm9yZWRQcm9taXNlRnJvbUNhbGxcbiAgICAgICAgICAgIGUucGxheSgpXG4gICAgICAgICAgICAvLyBlLmFkZEV2ZW50TGlzdGVuZXIoXCJlbmRlZFwiLClcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKGV2ZW50LnByZXZpb3VzU2xpZGUpXG4gICAgICAgICAgICBldmVudC5wcmV2aW91c1NsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ2aWRlb1tkYXRhLWF1dG9zdGFydF1cIikuZm9yRWFjaChlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIShlIGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNJZ25vcmVkUHJvbWlzZUZyb21DYWxsXG4gICAgICAgICAgICAgICAgZS5wYXVzZSgpXG4gICAgICAgICAgICAgICAgLy8gZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiZW5kZWRcIixwcm9jZWVkVG9OZXh0KVxuICAgICAgICAgICAgfSlcblxuXG4gICAgfVxuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBhdXRvcGxheVZpZGVvLFxuICAgIH1cbn0pKTtcbiJdfQ==