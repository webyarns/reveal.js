"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    // Node. Does not work with strict CommonJS.
    module.exports = factory();
  } else {
    // Browser globals.
    Object.assign(window, factory());
  }
})(function () {
  function basicNavKeyBoard(e) {
    return e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === " ";
  }

  function disableKeyboardSupport(e) {
    return !Reveal.getCurrentSlide().hasAttribute("data-disable-keyboard");
  }

  return {
    disableKeyboardSupport: disableKeyboardSupport,
    basicNavKeyBoard: basicNavKeyBoard
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy11dGlscy50cyJdLCJuYW1lcyI6WyJmYWN0b3J5IiwiZXhwb3J0cyIsIm1vZHVsZSIsIk9iamVjdCIsImFzc2lnbiIsIndpbmRvdyIsImJhc2ljTmF2S2V5Qm9hcmQiLCJlIiwia2V5IiwiZGlzYWJsZUtleWJvYXJkU3VwcG9ydCIsIlJldmVhbCIsImdldEN1cnJlbnRTbGlkZSIsImhhc0F0dHJpYnV0ZSJdLCJtYXBwaW5ncyI6Ijs7OztBQUNDLFdBQVVBLE9BQVYsRUFBbUI7QUFDaEIsTUFBSSxRQUFPQyxPQUFQLHlDQUFPQSxPQUFQLE9BQW1CLFFBQXZCLEVBQWlDO0FBQzdCO0FBQ0FDLElBQUFBLE1BQU0sQ0FBQ0QsT0FBUCxHQUFpQkQsT0FBTyxFQUF4QjtBQUNILEdBSEQsTUFHTztBQUNIO0FBQ0FHLElBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjQyxNQUFkLEVBQXFCTCxPQUFPLEVBQTVCO0FBQ0g7QUFDSixDQVJBLEVBUUMsWUFBTTtBQUVKLFdBQVNNLGdCQUFULENBQTBCQyxDQUExQixFQUEyQztBQUN2QyxXQUFPQSxDQUFDLENBQUNDLEdBQUYsS0FBVSxXQUFWLElBQXlCRCxDQUFDLENBQUNDLEdBQUYsS0FBVSxZQUFuQyxJQUFtREQsQ0FBQyxDQUFDQyxHQUFGLEtBQVUsR0FBcEU7QUFDSDs7QUFFRCxXQUFTQyxzQkFBVCxDQUFnQ0YsQ0FBaEMsRUFBaUQ7QUFDN0MsV0FBTyxDQUFDRyxNQUFNLENBQUNDLGVBQVAsR0FBeUJDLFlBQXpCLENBQXNDLHVCQUF0QyxDQUFSO0FBQ0g7O0FBQ0QsU0FBTztBQUNISCxJQUFBQSxzQkFBc0IsRUFBdEJBLHNCQURHO0FBRUhILElBQUFBLGdCQUFnQixFQUFoQkE7QUFGRyxHQUFQO0FBSUgsQ0FyQkEsQ0FBRCIsInNvdXJjZXNDb250ZW50IjpbIlxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLlxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHMuXG4gICAgICAgIE9iamVjdC5hc3NpZ24od2luZG93LGZhY3RvcnkoKSlcbiAgICB9XG59KCgpID0+IHtcblxuICAgIGZ1bmN0aW9uIGJhc2ljTmF2S2V5Qm9hcmQoZTogS2V5Ym9hcmRFdmVudCl7XG4gICAgICAgIHJldHVybiBlLmtleSA9PT0gXCJBcnJvd0xlZnRcIiB8fCBlLmtleSA9PT0gXCJBcnJvd1JpZ2h0XCIgfHwgZS5rZXkgPT09IFwiIFwiXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlzYWJsZUtleWJvYXJkU3VwcG9ydChlOiBLZXlib2FyZEV2ZW50KXtcbiAgICAgICAgcmV0dXJuICFSZXZlYWwuZ2V0Q3VycmVudFNsaWRlKCkuaGFzQXR0cmlidXRlKFwiZGF0YS1kaXNhYmxlLWtleWJvYXJkXCIpXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGRpc2FibGVLZXlib2FyZFN1cHBvcnQsXG4gICAgICAgIGJhc2ljTmF2S2V5Qm9hcmQsXG4gICAgfVxufSkpO1xuIl19