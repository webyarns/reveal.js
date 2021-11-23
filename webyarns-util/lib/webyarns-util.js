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
  function disableKeyboardSupport(e) {
    return !Reveal.getCurrentSlide().hasAttribute("data-disable-keyboard");
  }

  return {
    disableKeyboardSupport: disableKeyboardSupport
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy11dGlsLnRzIl0sIm5hbWVzIjpbImZhY3RvcnkiLCJleHBvcnRzIiwibW9kdWxlIiwiT2JqZWN0IiwiYXNzaWduIiwid2luZG93IiwiZGlzYWJsZUtleWJvYXJkU3VwcG9ydCIsImUiLCJSZXZlYWwiLCJnZXRDdXJyZW50U2xpZGUiLCJoYXNBdHRyaWJ1dGUiXSwibWFwcGluZ3MiOiI7Ozs7QUFDQyxXQUFVQSxPQUFWLEVBQW1CO0FBQ2hCLE1BQUksUUFBT0MsT0FBUCx5Q0FBT0EsT0FBUCxPQUFtQixRQUF2QixFQUFpQztBQUM3QjtBQUNBQyxJQUFBQSxNQUFNLENBQUNELE9BQVAsR0FBaUJELE9BQU8sRUFBeEI7QUFDSCxHQUhELE1BR087QUFDSDtBQUNBRyxJQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBY0MsTUFBZCxFQUFxQkwsT0FBTyxFQUE1QjtBQUNIO0FBQ0osQ0FSQSxFQVFDLFlBQU07QUFFSixXQUFTTSxzQkFBVCxDQUFnQ0MsQ0FBaEMsRUFBaUQ7QUFDN0MsV0FBTyxDQUFDQyxNQUFNLENBQUNDLGVBQVAsR0FBeUJDLFlBQXpCLENBQXNDLHVCQUF0QyxDQUFSO0FBQ0g7O0FBQ0QsU0FBTztBQUNISixJQUFBQSxzQkFBc0IsRUFBdEJBO0FBREcsR0FBUDtBQUdILENBaEJBLENBQUQiLCJzb3VyY2VzQ29udGVudCI6WyJcbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUy5cbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzLlxuICAgICAgICBPYmplY3QuYXNzaWduKHdpbmRvdyxmYWN0b3J5KCkpXG4gICAgfVxufSgoKSA9PiB7XG5cbiAgICBmdW5jdGlvbiBkaXNhYmxlS2V5Ym9hcmRTdXBwb3J0KGU6IEtleWJvYXJkRXZlbnQpe1xuICAgICAgICByZXR1cm4gIVJldmVhbC5nZXRDdXJyZW50U2xpZGUoKS5oYXNBdHRyaWJ1dGUoXCJkYXRhLWRpc2FibGUta2V5Ym9hcmRcIilcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGlzYWJsZUtleWJvYXJkU3VwcG9ydCxcbiAgICB9XG59KSk7XG4iXX0=