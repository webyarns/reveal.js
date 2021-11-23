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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YW5ycy11dGlscy50cyJdLCJuYW1lcyI6WyJmYWN0b3J5IiwiZXhwb3J0cyIsIm1vZHVsZSIsIk9iamVjdCIsImFzc2lnbiIsIndpbmRvdyIsImRpc2FibGVLZXlib2FyZFN1cHBvcnQiLCJlIiwiUmV2ZWFsIiwiZ2V0Q3VycmVudFNsaWRlIiwiaGFzQXR0cmlidXRlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQ0MsV0FBVUEsT0FBVixFQUFtQjtBQUNoQixNQUFJLFFBQU9DLE9BQVAseUNBQU9BLE9BQVAsT0FBbUIsUUFBdkIsRUFBaUM7QUFDN0I7QUFDQUMsSUFBQUEsTUFBTSxDQUFDRCxPQUFQLEdBQWlCRCxPQUFPLEVBQXhCO0FBQ0gsR0FIRCxNQUdPO0FBQ0g7QUFDQUcsSUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWNDLE1BQWQsRUFBcUJMLE9BQU8sRUFBNUI7QUFDSDtBQUNKLENBUkEsRUFRQyxZQUFNO0FBRUosV0FBU00sc0JBQVQsQ0FBZ0NDLENBQWhDLEVBQWlEO0FBQzdDLFdBQU8sQ0FBQ0MsTUFBTSxDQUFDQyxlQUFQLEdBQXlCQyxZQUF6QixDQUFzQyx1QkFBdEMsQ0FBUjtBQUNIOztBQUNELFNBQU87QUFDSEosSUFBQUEsc0JBQXNCLEVBQXRCQTtBQURHLEdBQVA7QUFHSCxDQWhCQSxDQUFEIiwic291cmNlc0NvbnRlbnQiOlsiXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMuXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFscy5cbiAgICAgICAgT2JqZWN0LmFzc2lnbih3aW5kb3csZmFjdG9yeSgpKVxuICAgIH1cbn0oKCkgPT4ge1xuXG4gICAgZnVuY3Rpb24gZGlzYWJsZUtleWJvYXJkU3VwcG9ydChlOiBLZXlib2FyZEV2ZW50KXtcbiAgICAgICAgcmV0dXJuICFSZXZlYWwuZ2V0Q3VycmVudFNsaWRlKCkuaGFzQXR0cmlidXRlKFwiZGF0YS1kaXNhYmxlLWtleWJvYXJkXCIpXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGRpc2FibGVLZXlib2FyZFN1cHBvcnQsXG4gICAgfVxufSkpO1xuIl19