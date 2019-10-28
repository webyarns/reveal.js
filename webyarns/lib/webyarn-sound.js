"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/// <reference path ="../../node_modules/@types/howler/index.d.ts"/>
(function (factory) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') module.exports = factory();else {
    document.addEventListener("DOMContentLoaded", factory);
  }
})(function () {
  var audioId = function audioId(s) {
    return s.startsWith("!") ? s.substring(1) : s;
  };

  var partition = function partition(es, fn) {
    return es.reduce(function (_ref, e) {
      var _ref2 = _slicedToArray(_ref, 2),
          p = _ref2[0],
          f = _ref2[1];

      return fn(e) ? [[].concat(_toConsumableArray(p), [e]), f] : [p, [].concat(_toConsumableArray(f), [e])];
    }, [[], []]);
  };

  var loadData = function loadData() {
    var elementById = document.getElementById('sounds');

    if (elementById == null) {
      console.error('Cannot find <script id="sounds" type="application/json">');
      return {};
    } else return JSON.parse(elementById.innerHTML);
  };

  var data = loadData();
  var audioMap = Object.keys(data).reduce(function (acc, id) {
    var howl = new Howl({
      src: data[id].src,
      loop: Boolean(data[id].loop)
    });
    howl.on("mute", function () {
      return howl.stop();
    });
    return Object.assign(acc, _defineProperty({}, id, howl));
  }, {});

  var soundData = function soundData(s) {
    return s ? s.split(",").map(function (s) {
      return s.trim();
    }) : [];
  };

  var nextAudioActions = function nextAudioActions(currentSounds, nextSounds) {
    var _partition = partition(nextSounds, function (e) {
      return e.startsWith("!");
    }),
        _partition2 = _slicedToArray(_partition, 2),
        toRestart = _partition2[0],
        nextToStartIds = _partition2[1];

    var currentSoundIds = currentSounds.map(audioId);
    var nextSoundsIds = nextSounds.map(audioId);
    var toRestartIds = toRestart.map(audioId);
    var toStop = currentSoundIds.filter(function (e) {
      return !nextToStartIds.includes(e);
    }) // remove the ones that carry over
    .filter(function (e) {
      return !toRestartIds.includes(e);
    }); // remove the ones that need restarting

    var toStart = [].concat(_toConsumableArray(nextSoundsIds.filter(function (e) {
      return !currentSoundIds.includes(e);
    })), _toConsumableArray(toRestartIds));
    return [toStop, toStart];
  };

  var soundHandler = function soundHandler(e) {
    var _e$previousSlide;

    var fadeValue = function fadeValue(a) {
      var s = e.currentSlide.getAttribute(a);
      return s ? parseInt(s, 10) : 1500;
    };

    var currentSoundData = (_e$previousSlide = e.previousSlide) === null || _e$previousSlide === void 0 ? void 0 : _e$previousSlide.getAttribute('data-sounds');
    var nextSoundData = e.currentSlide.getAttribute("data-sounds");
    var nextSounds = soundData(nextSoundData);
    var currentSounds = soundData(currentSoundData);

    var _nextAudioActions = nextAudioActions(currentSounds, nextSounds),
        _nextAudioActions2 = _slicedToArray(_nextAudioActions, 2),
        toStop = _nextAudioActions2[0],
        toStart = _nextAudioActions2[1];

    toStop.map(function (id) {
      audioMap[id].fade(1, 0, fadeValue('fade-out-speed'));
    });
    toStart.map(function (id) {
      audioMap[id].play();
      audioMap[id].fade(0, 1, fadeValue("fade-in-speed"));
    });
  };

  Reveal.addEventListener('ready', soundHandler);
  Reveal.addEventListener('slidechanged', soundHandler);
  return {
    soundHandler: soundHandler,
    _test: {
      nextAudioActions: nextAudioActions
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJuLXNvdW5kLnRzIl0sIm5hbWVzIjpbImZhY3RvcnkiLCJleHBvcnRzIiwibW9kdWxlIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiYXVkaW9JZCIsInMiLCJzdGFydHNXaXRoIiwic3Vic3RyaW5nIiwicGFydGl0aW9uIiwiZXMiLCJmbiIsInJlZHVjZSIsImUiLCJwIiwiZiIsImxvYWREYXRhIiwiZWxlbWVudEJ5SWQiLCJnZXRFbGVtZW50QnlJZCIsImNvbnNvbGUiLCJlcnJvciIsIkpTT04iLCJwYXJzZSIsImlubmVySFRNTCIsImRhdGEiLCJhdWRpb01hcCIsIk9iamVjdCIsImtleXMiLCJhY2MiLCJpZCIsImhvd2wiLCJIb3dsIiwic3JjIiwibG9vcCIsIkJvb2xlYW4iLCJvbiIsInN0b3AiLCJhc3NpZ24iLCJzb3VuZERhdGEiLCJzcGxpdCIsIm1hcCIsInRyaW0iLCJuZXh0QXVkaW9BY3Rpb25zIiwiY3VycmVudFNvdW5kcyIsIm5leHRTb3VuZHMiLCJ0b1Jlc3RhcnQiLCJuZXh0VG9TdGFydElkcyIsImN1cnJlbnRTb3VuZElkcyIsIm5leHRTb3VuZHNJZHMiLCJ0b1Jlc3RhcnRJZHMiLCJ0b1N0b3AiLCJmaWx0ZXIiLCJpbmNsdWRlcyIsInRvU3RhcnQiLCJzb3VuZEhhbmRsZXIiLCJmYWRlVmFsdWUiLCJhIiwiY3VycmVudFNsaWRlIiwiZ2V0QXR0cmlidXRlIiwicGFyc2VJbnQiLCJjdXJyZW50U291bmREYXRhIiwicHJldmlvdXNTbGlkZSIsIm5leHRTb3VuZERhdGEiLCJmYWRlIiwicGxheSIsIlJldmVhbCIsIl90ZXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFFQyxXQUFVQSxPQUFWLEVBQW1CO0FBQ2hCLE1BQUksUUFBT0MsT0FBUCx5Q0FBT0EsT0FBUCxPQUFtQixRQUF2QixFQUNJQyxNQUFNLENBQUNELE9BQVAsR0FBaUJELE9BQU8sRUFBeEIsQ0FESixLQUVLO0FBQ0RHLElBQUFBLFFBQVEsQ0FBQ0MsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDSixPQUE5QztBQUNIO0FBQ0osQ0FOQSxFQU1DLFlBQU07QUFFSixNQUFNSyxPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFDQyxDQUFEO0FBQUEsV0FBeUJBLENBQUMsQ0FBQ0MsVUFBRixDQUFhLEdBQWIsSUFBb0JELENBQUMsQ0FBQ0UsU0FBRixDQUFZLENBQVosQ0FBcEIsR0FBcUNGLENBQTlEO0FBQUEsR0FBaEI7O0FBRUEsTUFBTUcsU0FBUyxHQUFHLFNBQVpBLFNBQVksQ0FBSUMsRUFBSixFQUFrQkMsRUFBbEI7QUFBQSxXQUNkRCxFQUFFLENBQUNFLE1BQUgsQ0FBVSxnQkFBU0MsQ0FBVDtBQUFBO0FBQUEsVUFBRUMsQ0FBRjtBQUFBLFVBQUtDLENBQUw7O0FBQUEsYUFBZ0JKLEVBQUUsQ0FBQ0UsQ0FBRCxDQUFGLEdBQVEsOEJBQUtDLENBQUwsSUFBUUQsQ0FBUixJQUFZRSxDQUFaLENBQVIsR0FBeUIsQ0FBQ0QsQ0FBRCwrQkFBUUMsQ0FBUixJQUFXRixDQUFYLEdBQXpDO0FBQUEsS0FBVixFQUFvRSxDQUFDLEVBQUQsRUFBSyxFQUFMLENBQXBFLENBRGM7QUFBQSxHQUFsQjs7QUFjQSxNQUFNRyxRQUFRLEdBQUcsU0FBWEEsUUFBVyxHQUFpQjtBQUM5QixRQUFNQyxXQUFXLEdBQUdkLFFBQVEsQ0FBQ2UsY0FBVCxDQUF3QixRQUF4QixDQUFwQjs7QUFDQSxRQUFJRCxXQUFXLElBQUksSUFBbkIsRUFBeUI7QUFDckJFLE1BQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLDBEQUFkO0FBQ0EsYUFBTyxFQUFQO0FBQ0gsS0FIRCxNQUlJLE9BQU9DLElBQUksQ0FBQ0MsS0FBTCxDQUFXTCxXQUFXLENBQUNNLFNBQXZCLENBQVA7QUFDUCxHQVBEOztBQVVBLE1BQU1DLElBQWUsR0FBR1IsUUFBUSxFQUFoQztBQUNBLE1BQU1TLFFBQWtCLEdBQUdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSCxJQUFaLEVBQWtCWixNQUFsQixDQUF5QixVQUFDZ0IsR0FBRCxFQUFNQyxFQUFOLEVBQWE7QUFDN0QsUUFBTUMsSUFBSSxHQUFHLElBQUlDLElBQUosQ0FBUztBQUNsQkMsTUFBQUEsR0FBRyxFQUFFUixJQUFJLENBQUNLLEVBQUQsQ0FBSixDQUFTRyxHQURJO0FBRWxCQyxNQUFBQSxJQUFJLEVBQUVDLE9BQU8sQ0FBQ1YsSUFBSSxDQUFDSyxFQUFELENBQUosQ0FBU0ksSUFBVjtBQUZLLEtBQVQsQ0FBYjtBQUlBSCxJQUFBQSxJQUFJLENBQUNLLEVBQUwsQ0FBUSxNQUFSLEVBQWdCO0FBQUEsYUFBTUwsSUFBSSxDQUFDTSxJQUFMLEVBQU47QUFBQSxLQUFoQjtBQUNBLFdBQU9WLE1BQU0sQ0FBQ1csTUFBUCxDQUFjVCxHQUFkLHNCQUNGQyxFQURFLEVBQ0dDLElBREgsRUFBUDtBQUdILEdBVDBCLEVBU3hCLEVBVHdCLENBQTNCOztBQVdBLE1BQU1RLFNBQVMsR0FBRyxTQUFaQSxTQUFZLENBQUNoQyxDQUFEO0FBQUEsV0FDZEEsQ0FBQyxHQUFHQSxDQUFDLENBQUNpQyxLQUFGLENBQVEsR0FBUixFQUFhQyxHQUFiLENBQWlCLFVBQUFsQyxDQUFDO0FBQUEsYUFBSUEsQ0FBQyxDQUFDbUMsSUFBRixFQUFKO0FBQUEsS0FBbEIsQ0FBSCxHQUFxQyxFQUR4QjtBQUFBLEdBQWxCOztBQUlBLE1BQU1DLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUIsQ0FBQ0MsYUFBRCxFQUEwQkMsVUFBMUIsRUFBeUU7QUFBQSxxQkFDMURuQyxTQUFTLENBQUNtQyxVQUFELEVBQWEsVUFBQS9CLENBQUM7QUFBQSxhQUFJQSxDQUFDLENBQUNOLFVBQUYsQ0FBYSxHQUFiLENBQUo7QUFBQSxLQUFkLENBRGlEO0FBQUE7QUFBQSxRQUN2RnNDLFNBRHVGO0FBQUEsUUFDNUVDLGNBRDRFOztBQUU5RixRQUFNQyxlQUFlLEdBQUdKLGFBQWEsQ0FBQ0gsR0FBZCxDQUFrQm5DLE9BQWxCLENBQXhCO0FBQ0EsUUFBTTJDLGFBQWEsR0FBR0osVUFBVSxDQUFDSixHQUFYLENBQWVuQyxPQUFmLENBQXRCO0FBQ0EsUUFBTTRDLFlBQVksR0FBR0osU0FBUyxDQUFDTCxHQUFWLENBQWNuQyxPQUFkLENBQXJCO0FBQ0EsUUFBTTZDLE1BQU0sR0FBR0gsZUFBZSxDQUN6QkksTUFEVSxDQUNILFVBQUF0QyxDQUFDO0FBQUEsYUFBSSxDQUFDaUMsY0FBYyxDQUFDTSxRQUFmLENBQXdCdkMsQ0FBeEIsQ0FBTDtBQUFBLEtBREUsRUFDK0I7QUFEL0IsS0FFVnNDLE1BRlUsQ0FFSCxVQUFBdEMsQ0FBQztBQUFBLGFBQUksQ0FBQ29DLFlBQVksQ0FBQ0csUUFBYixDQUFzQnZDLENBQXRCLENBQUw7QUFBQSxLQUZFLENBQWYsQ0FMOEYsQ0FPbEQ7O0FBQzVDLFFBQU13QyxPQUFPLGdDQUNOTCxhQUFhLENBQUNHLE1BQWQsQ0FBcUIsVUFBQXRDLENBQUM7QUFBQSxhQUFJLENBQUNrQyxlQUFlLENBQUNLLFFBQWhCLENBQXlCdkMsQ0FBekIsQ0FBTDtBQUFBLEtBQXRCLENBRE0sc0JBRU5vQyxZQUZNLEVBQWI7QUFJQSxXQUFPLENBQUNDLE1BQUQsRUFBU0csT0FBVCxDQUFQO0FBQ0gsR0FiRDs7QUFlQSxNQUFNQyxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFDekMsQ0FBRCxFQUFtQjtBQUFBOztBQUNwQyxRQUFNMEMsU0FBUyxHQUFHLFNBQVpBLFNBQVksQ0FBQ0MsQ0FBRCxFQUFlO0FBQzdCLFVBQU1sRCxDQUFDLEdBQUdPLENBQUMsQ0FBQzRDLFlBQUYsQ0FBZUMsWUFBZixDQUE0QkYsQ0FBNUIsQ0FBVjtBQUNBLGFBQU9sRCxDQUFDLEdBQUdxRCxRQUFRLENBQUNyRCxDQUFELEVBQUksRUFBSixDQUFYLEdBQXFCLElBQTdCO0FBQ0gsS0FIRDs7QUFNQSxRQUFNc0QsZ0JBQWdCLHVCQUFHL0MsQ0FBQyxDQUFDZ0QsYUFBTCxxREFBRyxpQkFBaUJILFlBQWpCLENBQThCLGFBQTlCLENBQXpCO0FBQ0EsUUFBTUksYUFBYSxHQUFHakQsQ0FBQyxDQUFDNEMsWUFBRixDQUFlQyxZQUFmLENBQTRCLGFBQTVCLENBQXRCO0FBRUEsUUFBTWQsVUFBVSxHQUFHTixTQUFTLENBQUN3QixhQUFELENBQTVCO0FBQ0EsUUFBTW5CLGFBQWEsR0FBR0wsU0FBUyxDQUFDc0IsZ0JBQUQsQ0FBL0I7O0FBWG9DLDRCQWFWbEIsZ0JBQWdCLENBQUNDLGFBQUQsRUFBZ0JDLFVBQWhCLENBYk47QUFBQTtBQUFBLFFBYTdCTSxNQWI2QjtBQUFBLFFBYXJCRyxPQWJxQjs7QUFnQnBDSCxJQUFBQSxNQUFNLENBQUNWLEdBQVAsQ0FBVyxVQUFBWCxFQUFFLEVBQUk7QUFDYkosTUFBQUEsUUFBUSxDQUFDSSxFQUFELENBQVIsQ0FBYWtDLElBQWIsQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0JSLFNBQVMsQ0FBQyxnQkFBRCxDQUFqQztBQUNILEtBRkQ7QUFHQUYsSUFBQUEsT0FBTyxDQUFDYixHQUFSLENBQVksVUFBQVgsRUFBRSxFQUFJO0FBQ2RKLE1BQUFBLFFBQVEsQ0FBQ0ksRUFBRCxDQUFSLENBQWFtQyxJQUFiO0FBQ0F2QyxNQUFBQSxRQUFRLENBQUNJLEVBQUQsQ0FBUixDQUFha0MsSUFBYixDQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QlIsU0FBUyxDQUFDLGVBQUQsQ0FBakM7QUFDSCxLQUhEO0FBTUgsR0F6QkQ7O0FBMEJBVSxFQUFBQSxNQUFNLENBQUM3RCxnQkFBUCxDQUF3QixPQUF4QixFQUFpQ2tELFlBQWpDO0FBQ0FXLEVBQUFBLE1BQU0sQ0FBQzdELGdCQUFQLENBQXdCLGNBQXhCLEVBQXdDa0QsWUFBeEM7QUFDQSxTQUFPO0FBQ0hBLElBQUFBLFlBQVksRUFBWkEsWUFERztBQUVIWSxJQUFBQSxLQUFLLEVBQUU7QUFDSHhCLE1BQUFBLGdCQUFnQixFQUFoQkE7QUFERztBQUZKLEdBQVA7QUFNSCxDQW5HQSxDQUFEIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aCA9XCIuLi8uLi9ub2RlX21vZHVsZXMvQHR5cGVzL2hvd2xlci9pbmRleC5kLnRzXCIvPlxuXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZmFjdG9yeSlcbiAgICB9XG59KCgpID0+IHtcbiAgICB0eXBlIEF1ZGlvSWQgPSBzdHJpbmdcbiAgICBjb25zdCBhdWRpb0lkID0gKHM6IEF1ZGlvSWQpOiBBdWRpb0lkID0+IHMuc3RhcnRzV2l0aChcIiFcIikgPyBzLnN1YnN0cmluZygxKSA6IHM7XG5cbiAgICBjb25zdCBwYXJ0aXRpb24gPSA8VD4oZXM6IEFycmF5PFQ+LCBmbjogKGE6IFQpID0+IGJvb2xlYW4pID0+XG4gICAgICAgIGVzLnJlZHVjZSgoW3AsIGZdLCBlKSA9PiAoZm4oZSkgPyBbWy4uLnAsIGVdLCBmXSA6IFtwLCBbLi4uZiwgZV1dKSwgW1tdLCBbXV0pO1xuXG4gICAgaW50ZXJmYWNlIFNvdW5kRGF0YSB7XG4gICAgICAgIFtpZDogc3RyaW5nXToge1xuICAgICAgICAgICAgbG9vcD86IGJvb2xlYW4sXG4gICAgICAgICAgICBzcmM6IHN0cmluZ1tdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbnRlcmZhY2UgQXVkaW9NYXAge1xuICAgICAgICBbaWQ6IHN0cmluZ106IEhvd2xcbiAgICB9XG5cbiAgICBjb25zdCBsb2FkRGF0YSA9ICgpOiBTb3VuZERhdGEgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50QnlJZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb3VuZHMnKTtcbiAgICAgICAgaWYgKGVsZW1lbnRCeUlkID09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Nhbm5vdCBmaW5kIDxzY3JpcHQgaWQ9XCJzb3VuZHNcIiB0eXBlPVwiYXBwbGljYXRpb24vanNvblwiPicpXG4gICAgICAgICAgICByZXR1cm4ge31cbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShlbGVtZW50QnlJZC5pbm5lckhUTUwpO1xuICAgIH1cblxuXG4gICAgY29uc3QgZGF0YTogU291bmREYXRhID0gbG9hZERhdGEoKVxuICAgIGNvbnN0IGF1ZGlvTWFwOiBBdWRpb01hcCA9IE9iamVjdC5rZXlzKGRhdGEpLnJlZHVjZSgoYWNjLCBpZCkgPT4ge1xuICAgICAgICBjb25zdCBob3dsID0gbmV3IEhvd2woe1xuICAgICAgICAgICAgc3JjOiBkYXRhW2lkXS5zcmMsXG4gICAgICAgICAgICBsb29wOiBCb29sZWFuKGRhdGFbaWRdLmxvb3ApLFxuICAgICAgICB9KTtcbiAgICAgICAgaG93bC5vbihcIm11dGVcIiwgKCkgPT4gaG93bC5zdG9wKCkpO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhY2MsIHtcbiAgICAgICAgICAgIFtpZF06IGhvd2xcbiAgICAgICAgfSk7XG4gICAgfSwge30pXG5cbiAgICBjb25zdCBzb3VuZERhdGEgPSAoczogc3RyaW5nIHwgbnVsbCkgPT5cbiAgICAgICAgcyA/IHMuc3BsaXQoXCIsXCIpLm1hcChzID0+IHMudHJpbSgpKSA6IFtdO1xuXG5cbiAgICBjb25zdCBuZXh0QXVkaW9BY3Rpb25zID0gKGN1cnJlbnRTb3VuZHM6IHN0cmluZ1tdLCBuZXh0U291bmRzOiBzdHJpbmdbXSk6IFtzdHJpbmdbXSwgc3RyaW5nW11dID0+IHtcbiAgICAgICAgY29uc3QgW3RvUmVzdGFydCwgbmV4dFRvU3RhcnRJZHNdID0gcGFydGl0aW9uKG5leHRTb3VuZHMsIGUgPT4gZS5zdGFydHNXaXRoKFwiIVwiKSk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTb3VuZElkcyA9IGN1cnJlbnRTb3VuZHMubWFwKGF1ZGlvSWQpO1xuICAgICAgICBjb25zdCBuZXh0U291bmRzSWRzID0gbmV4dFNvdW5kcy5tYXAoYXVkaW9JZCk7XG4gICAgICAgIGNvbnN0IHRvUmVzdGFydElkcyA9IHRvUmVzdGFydC5tYXAoYXVkaW9JZCk7XG4gICAgICAgIGNvbnN0IHRvU3RvcCA9IGN1cnJlbnRTb3VuZElkc1xuICAgICAgICAgICAgLmZpbHRlcihlID0+ICFuZXh0VG9TdGFydElkcy5pbmNsdWRlcyhlKSkgLy8gcmVtb3ZlIHRoZSBvbmVzIHRoYXQgY2Fycnkgb3ZlclxuICAgICAgICAgICAgLmZpbHRlcihlID0+ICF0b1Jlc3RhcnRJZHMuaW5jbHVkZXMoZSkpIC8vIHJlbW92ZSB0aGUgb25lcyB0aGF0IG5lZWQgcmVzdGFydGluZ1xuICAgICAgICBjb25zdCB0b1N0YXJ0ID0gW1xuICAgICAgICAgICAgLi4ubmV4dFNvdW5kc0lkcy5maWx0ZXIoZSA9PiAhY3VycmVudFNvdW5kSWRzLmluY2x1ZGVzKGUpKSwgLy8gYWRkIG5ldyBvbmVzIG5vdCBjYXJyaWVkIG92ZXJcbiAgICAgICAgICAgIC4uLnRvUmVzdGFydElkcyAvLyBhZGQgdGhlIG9uZXMgdGhhdCBuZWVkIHJlc3RhcnRlZFxuICAgICAgICBdXG4gICAgICAgIHJldHVybiBbdG9TdG9wLCB0b1N0YXJ0XVxuICAgIH1cblxuICAgIGNvbnN0IHNvdW5kSGFuZGxlciA9IChlOiBTbGlkZUV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGZhZGVWYWx1ZSA9IChhOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHMgPSBlLmN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoYSk7XG4gICAgICAgICAgICByZXR1cm4gcyA/IHBhcnNlSW50KHMsIDEwKSA6IDE1MDBcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29uc3QgY3VycmVudFNvdW5kRGF0YSA9IGUucHJldmlvdXNTbGlkZT8uZ2V0QXR0cmlidXRlKCdkYXRhLXNvdW5kcycpO1xuICAgICAgICBjb25zdCBuZXh0U291bmREYXRhID0gZS5jdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1zb3VuZHNcIik7XG5cbiAgICAgICAgY29uc3QgbmV4dFNvdW5kcyA9IHNvdW5kRGF0YShuZXh0U291bmREYXRhKVxuICAgICAgICBjb25zdCBjdXJyZW50U291bmRzID0gc291bmREYXRhKGN1cnJlbnRTb3VuZERhdGEpO1xuXG4gICAgICAgIGNvbnN0IFt0b1N0b3AsIHRvU3RhcnRdID0gbmV4dEF1ZGlvQWN0aW9ucyhjdXJyZW50U291bmRzLCBuZXh0U291bmRzKTtcbiAgICAgICAgXG5cbiAgICAgICAgdG9TdG9wLm1hcChpZCA9PiB7XG4gICAgICAgICAgICBhdWRpb01hcFtpZF0uZmFkZSgxLCAwLCBmYWRlVmFsdWUoJ2ZhZGUtb3V0LXNwZWVkJykpO1xuICAgICAgICB9KVxuICAgICAgICB0b1N0YXJ0Lm1hcChpZCA9PiB7XG4gICAgICAgICAgICBhdWRpb01hcFtpZF0ucGxheSgpXG4gICAgICAgICAgICBhdWRpb01hcFtpZF0uZmFkZSgwLCAxLCBmYWRlVmFsdWUoXCJmYWRlLWluLXNwZWVkXCIpKVxuICAgICAgICB9KVxuXG5cbiAgICB9XG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5Jywgc291bmRIYW5kbGVyKTtcbiAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgc291bmRIYW5kbGVyKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzb3VuZEhhbmRsZXIsXG4gICAgICAgIF90ZXN0OiB7XG4gICAgICAgICAgICBuZXh0QXVkaW9BY3Rpb25zXG4gICAgICAgIH1cbiAgICB9XG59KSk7XG4iXX0=