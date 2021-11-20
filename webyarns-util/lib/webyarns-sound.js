"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/// <reference path ="../../node_modules/@types/howler/index.d.ts"/>
(function (factory) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') module.exports = factory();else {
    document.addEventListener("DOMContentLoaded", factory);
  }
})(function () {
  var audioId = function audioId(s) {
    return s.startsWith("!") || s.startsWith(">") || s.startsWith("#") ? s.substring(1) : s;
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
    howl.on("fade", function (n) {
      if (howl.volume() === 0) {
        howl.stop(n);
      }
    });
    return Object.assign(acc, _defineProperty({}, id, howl));
  }, {});

  var soundData = function soundData(s) {
    return s ? s.split(",").map(function (s) {
      return s.trim();
    }) : [];
  };

  var persistentAudios = [];

  var nextAudioActions = function nextAudioActions(currentSounds, nextSounds) {
    var _partition = partition(nextSounds, function (e) {
      return e.startsWith("!");
    }),
        _partition2 = _slicedToArray(_partition, 2),
        toRestart = _partition2[0],
        nextToStartIds = _partition2[1];

    var persistentToStop = nextToStartIds.filter(function (e) {
      return e.startsWith("#");
    }).map(audioId);
    var persistentStart = nextToStartIds.filter(function (e) {
      return e.startsWith(">");
    }).map(audioId);
    persistentAudios = [].concat(_toConsumableArray(persistentAudios), _toConsumableArray(persistentStart)); // add to global state

    var currentSoundIds = currentSounds.map(audioId);
    var nextSoundsIds = nextSounds.map(audioId);
    var toRestartIds = toRestart.map(audioId);
    var toStop = [].concat(_toConsumableArray(currentSoundIds.filter(function (e) {
      return !nextToStartIds.includes(e);
    }) // remove the ones that carry over
    .filter(function (e) {
      return !toRestartIds.includes(e);
    }) // remove the ones that need restarting
    .filter(function (e) {
      return persistentAudios.indexOf(e) === -1;
    })), _toConsumableArray(persistentToStop));
    var toStart = [].concat(_toConsumableArray(nextSoundsIds.filter(function (e) {
      return !currentSoundIds.includes(e);
    }) // add new ones not carried over
    .filter(function (e) {
      return !persistentToStop.includes(e);
    })), _toConsumableArray(toRestartIds));
    return [toStop, toStart];
  };

  function volumeHandler(e) {
    var volumeChange = e.currentSlide.getAttribute('data-sounds-volume-change');
    if (!volumeChange) return;

    var _volumeChange$split = volumeChange === null || volumeChange === void 0 ? void 0 : volumeChange.split(":"),
        _volumeChange$split2 = _slicedToArray(_volumeChange$split, 2),
        id = _volumeChange$split2[0],
        v = _volumeChange$split2[1];

    var volume = parseFloat(v);
    audioMap[id].volume(volume);
  }

  var soundHandler = function soundHandler(e) {
    var _e$previousSlide;

    var fadeValue = function fadeValue(a) {
      var s = e.currentSlide.getAttribute("data-sounds-" + a) || e.currentSlide.getAttribute(a);
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

    volumeHandler(e);
    toStop.map(function (id) {
      if (!audioMap[id]) console.error("no invalid audioMap for " + id);else audioMap[id].fade(1, 0, fadeValue('fade-out-speed'));
    });
    toStart.map(function (id) {
      if (!audioMap[id]) console.error("no invalid audioMap for " + id);else {
        audioMap[id].stop();
        audioMap[id].play();
        audioMap[id].fade(0, 1, fadeValue("fade-in-speed"));
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy1zb3VuZC50cyJdLCJuYW1lcyI6WyJmYWN0b3J5IiwiZXhwb3J0cyIsIm1vZHVsZSIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImF1ZGlvSWQiLCJzIiwic3RhcnRzV2l0aCIsInN1YnN0cmluZyIsInBhcnRpdGlvbiIsImVzIiwiZm4iLCJyZWR1Y2UiLCJlIiwicCIsImYiLCJsb2FkRGF0YSIsImVsZW1lbnRCeUlkIiwiZ2V0RWxlbWVudEJ5SWQiLCJjb25zb2xlIiwiZXJyb3IiLCJKU09OIiwicGFyc2UiLCJpbm5lckhUTUwiLCJkYXRhIiwiYXVkaW9NYXAiLCJPYmplY3QiLCJrZXlzIiwiYWNjIiwiaWQiLCJob3dsIiwiSG93bCIsInNyYyIsImxvb3AiLCJCb29sZWFuIiwib24iLCJuIiwidm9sdW1lIiwic3RvcCIsImFzc2lnbiIsInNvdW5kRGF0YSIsInNwbGl0IiwibWFwIiwidHJpbSIsInBlcnNpc3RlbnRBdWRpb3MiLCJuZXh0QXVkaW9BY3Rpb25zIiwiY3VycmVudFNvdW5kcyIsIm5leHRTb3VuZHMiLCJ0b1Jlc3RhcnQiLCJuZXh0VG9TdGFydElkcyIsInBlcnNpc3RlbnRUb1N0b3AiLCJmaWx0ZXIiLCJwZXJzaXN0ZW50U3RhcnQiLCJjdXJyZW50U291bmRJZHMiLCJuZXh0U291bmRzSWRzIiwidG9SZXN0YXJ0SWRzIiwidG9TdG9wIiwiaW5jbHVkZXMiLCJpbmRleE9mIiwidG9TdGFydCIsInZvbHVtZUhhbmRsZXIiLCJ2b2x1bWVDaGFuZ2UiLCJjdXJyZW50U2xpZGUiLCJnZXRBdHRyaWJ1dGUiLCJ2IiwicGFyc2VGbG9hdCIsInNvdW5kSGFuZGxlciIsImZhZGVWYWx1ZSIsImEiLCJwYXJzZUludCIsImN1cnJlbnRTb3VuZERhdGEiLCJwcmV2aW91c1NsaWRlIiwibmV4dFNvdW5kRGF0YSIsImZhZGUiLCJwbGF5IiwiUmV2ZWFsIiwiX3Rlc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7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LENBQVksVUFBQWIsRUFBRSxFQUFJO0FBQ2QsVUFBSSxDQUFDSixRQUFRLENBQUNJLEVBQUQsQ0FBYixFQUNJVixPQUFPLENBQUNDLEtBQVIsQ0FBYyw2QkFBNkJTLEVBQTNDLEVBREosS0FFSztBQUNESixRQUFBQSxRQUFRLENBQUNJLEVBQUQsQ0FBUixDQUFhUyxJQUFiO0FBQ0FiLFFBQUFBLFFBQVEsQ0FBQ0ksRUFBRCxDQUFSLENBQWE2QyxJQUFiO0FBQ0FqRCxRQUFBQSxRQUFRLENBQUNJLEVBQUQsQ0FBUixDQUFhNEMsSUFBYixDQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3Qk4sU0FBUyxDQUFDLGVBQUQsQ0FBakM7QUFDSDtBQUNKLEtBUkQ7QUFXSCxHQWxDRDs7QUFtQ0FRLEVBQUFBLE1BQU0sQ0FBQ3ZFLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDOEQsWUFBakM7QUFDQVMsRUFBQUEsTUFBTSxDQUFDdkUsZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0M4RCxZQUF4QztBQUNBLFNBQU87QUFDSEEsSUFBQUEsWUFBWSxFQUFaQSxZQURHO0FBRUhVLElBQUFBLEtBQUssRUFBRTtBQUNIL0IsTUFBQUEsZ0JBQWdCLEVBQWhCQTtBQURHO0FBRkosR0FBUDtBQU1ILENBcklBLENBQUQiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoID1cIi4uLy4uL25vZGVfbW9kdWxlcy9AdHlwZXMvaG93bGVyL2luZGV4LmQudHNcIi8+XG5cbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmYWN0b3J5KVxuICAgIH1cbn0oKCkgPT4ge1xuICAgIHR5cGUgQXVkaW9JZCA9IHN0cmluZ1xuICAgIGNvbnN0IGF1ZGlvSWQgPSAoczogQXVkaW9JZCk6IEF1ZGlvSWQgPT4gKHMuc3RhcnRzV2l0aChcIiFcIikgfHwgcy5zdGFydHNXaXRoKFwiPlwiKSB8fCBzLnN0YXJ0c1dpdGgoXCIjXCIpKSA/IHMuc3Vic3RyaW5nKDEpIDogcztcblxuICAgIGNvbnN0IHBhcnRpdGlvbiA9IDxUPihlczogQXJyYXk8VD4sIGZuOiAoYTogVCkgPT4gYm9vbGVhbikgPT5cbiAgICAgICAgZXMucmVkdWNlKChbcCwgZl0sIGUpID0+IChmbihlKSA/IFtbLi4ucCwgZV0sIGZdIDogW3AsIFsuLi5mLCBlXV0pLCBbW10sIFtdXSk7XG5cbiAgICBpbnRlcmZhY2UgU291bmREYXRhIHtcbiAgICAgICAgW2lkOiBzdHJpbmddOiB7XG4gICAgICAgICAgICBsb29wPzogYm9vbGVhbixcbiAgICAgICAgICAgIHNyYzogc3RyaW5nW11cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGludGVyZmFjZSBBdWRpb01hcCB7XG4gICAgICAgIFtpZDogc3RyaW5nXTogSG93bFxuICAgIH1cblxuICAgIGNvbnN0IGxvYWREYXRhID0gKCk6IFNvdW5kRGF0YSA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRCeUlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvdW5kcycpO1xuICAgICAgICBpZiAoZWxlbWVudEJ5SWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ2Fubm90IGZpbmQgPHNjcmlwdCBpZD1cInNvdW5kc1wiIHR5cGU9XCJhcHBsaWNhdGlvbi9qc29uXCI+JylcbiAgICAgICAgICAgIHJldHVybiB7fVxuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKGVsZW1lbnRCeUlkLmlubmVySFRNTCk7XG4gICAgfVxuXG5cbiAgICBjb25zdCBkYXRhOiBTb3VuZERhdGEgPSBsb2FkRGF0YSgpXG4gICAgY29uc3QgYXVkaW9NYXA6IEF1ZGlvTWFwID0gT2JqZWN0LmtleXMoZGF0YSkucmVkdWNlKChhY2MsIGlkKSA9PiB7XG4gICAgICAgIGNvbnN0IGhvd2wgPSBuZXcgSG93bCh7XG4gICAgICAgICAgICBzcmM6IGRhdGFbaWRdLnNyYyxcbiAgICAgICAgICAgIGxvb3A6IEJvb2xlYW4oZGF0YVtpZF0ubG9vcCksXG4gICAgICAgIH0pO1xuICAgICAgICBob3dsLm9uKFwiZmFkZVwiLCAobikgPT4ge1xuICAgICAgICAgICAgaWYgKGhvd2wudm9sdW1lKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBob3dsLnN0b3Aobik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhY2MsIHtcbiAgICAgICAgICAgIFtpZF06IGhvd2xcbiAgICAgICAgfSk7XG4gICAgfSwge30pXG5cbiAgICBjb25zdCBzb3VuZERhdGEgPSAoczogc3RyaW5nIHwgbnVsbCkgPT5cbiAgICAgICAgcyA/IHMuc3BsaXQoXCIsXCIpLm1hcChzID0+IHMudHJpbSgpKSA6IFtdO1xuXG4gICAgbGV0IHBlcnNpc3RlbnRBdWRpb3M6IHN0cmluZ1tdID0gW11cbiAgICBjb25zdCBuZXh0QXVkaW9BY3Rpb25zID0gKGN1cnJlbnRTb3VuZHM6IHN0cmluZ1tdLCBuZXh0U291bmRzOiBzdHJpbmdbXSk6IFtzdHJpbmdbXSwgc3RyaW5nW11dID0+IHtcbiAgICAgICAgY29uc3QgW3RvUmVzdGFydCwgbmV4dFRvU3RhcnRJZHNdOiBbc3RyaW5nW10sIHN0cmluZ1tdXSA9IHBhcnRpdGlvbihuZXh0U291bmRzLCBlID0+IGUuc3RhcnRzV2l0aChcIiFcIikpO1xuXG4gICAgICAgIGNvbnN0IHBlcnNpc3RlbnRUb1N0b3AgPSBuZXh0VG9TdGFydElkcy5maWx0ZXIoZSA9PiBlLnN0YXJ0c1dpdGgoXCIjXCIpKS5tYXAoYXVkaW9JZCk7XG4gICAgICAgIGNvbnN0IHBlcnNpc3RlbnRTdGFydCA9IG5leHRUb1N0YXJ0SWRzLmZpbHRlcihlID0+IGUuc3RhcnRzV2l0aChcIj5cIikpLm1hcChhdWRpb0lkKTtcbiAgICAgICAgcGVyc2lzdGVudEF1ZGlvcyA9IFsuLi5wZXJzaXN0ZW50QXVkaW9zLCAuLi5wZXJzaXN0ZW50U3RhcnRdIC8vIGFkZCB0byBnbG9iYWwgc3RhdGVcblxuICAgICAgICBjb25zdCBjdXJyZW50U291bmRJZHMgPSBjdXJyZW50U291bmRzLm1hcChhdWRpb0lkKTtcbiAgICAgICAgY29uc3QgbmV4dFNvdW5kc0lkcyA9IG5leHRTb3VuZHMubWFwKGF1ZGlvSWQpO1xuICAgICAgICBjb25zdCB0b1Jlc3RhcnRJZHMgPSB0b1Jlc3RhcnQubWFwKGF1ZGlvSWQpO1xuICAgICAgICBjb25zdCB0b1N0b3AgPSBbXG4gICAgICAgICAgICAuLi5jdXJyZW50U291bmRJZHNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGUgPT4gIW5leHRUb1N0YXJ0SWRzLmluY2x1ZGVzKGUpKSAvLyByZW1vdmUgdGhlIG9uZXMgdGhhdCBjYXJyeSBvdmVyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihlID0+ICF0b1Jlc3RhcnRJZHMuaW5jbHVkZXMoZSkpIC8vIHJlbW92ZSB0aGUgb25lcyB0aGF0IG5lZWQgcmVzdGFydGluZ1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoZSA9PiBwZXJzaXN0ZW50QXVkaW9zLmluZGV4T2YoZSkgPT09IC0xKSxcbiAgICAgICAgICAgIC4uLnBlcnNpc3RlbnRUb1N0b3BdXG4gICAgICAgIGNvbnN0IHRvU3RhcnQgPSBbXG4gICAgICAgICAgICAuLi5uZXh0U291bmRzSWRzXG4gICAgICAgICAgICAgICAgLmZpbHRlcihlID0+ICFjdXJyZW50U291bmRJZHMuaW5jbHVkZXMoZSkpIC8vIGFkZCBuZXcgb25lcyBub3QgY2FycmllZCBvdmVyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihlID0+ICFwZXJzaXN0ZW50VG9TdG9wLmluY2x1ZGVzKGUpKSwgLy8gcmVtb3ZlIHRoZSBvbmVzIGludGVuZGVkIHRvIHN0b3BcbiAgICAgICAgICAgIC4uLnRvUmVzdGFydElkcywgLy8gYWRkIHRoZSBvbmVzIHRoYXQgbmVlZCByZXN0YXJ0ZWRcbiAgICAgICAgXVxuICAgICAgICByZXR1cm4gW3RvU3RvcCwgdG9TdGFydF1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2b2x1bWVIYW5kbGVyKGU6IFNsaWRlRXZlbnQpIHtcbiAgICAgICAgY29uc3Qgdm9sdW1lQ2hhbmdlID0gZS5jdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXNvdW5kcy12b2x1bWUtY2hhbmdlJyk7XG4gICAgICAgIGlmICghdm9sdW1lQ2hhbmdlKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIGNvbnN0IFtpZCx2XSA9IHZvbHVtZUNoYW5nZT8uc3BsaXQoXCI6XCIpO1xuICAgICAgICBjb25zdCB2b2x1bWUgPSBwYXJzZUZsb2F0KHYpXG4gICAgICAgIGF1ZGlvTWFwW2lkXS52b2x1bWUodm9sdW1lKVxuXG5cbiAgICB9XG5cbiAgICBjb25zdCBzb3VuZEhhbmRsZXIgPSAoZTogU2xpZGVFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCBmYWRlVmFsdWUgPSAoYTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzID0gZS5jdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1zb3VuZHMtXCIrYSkgfHwgZS5jdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKGEpO1xuICAgICAgICAgICAgcmV0dXJuIHMgPyBwYXJzZUludChzLCAxMCkgOiAxNTAwXG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTb3VuZERhdGEgPSBlLnByZXZpb3VzU2xpZGU/LmdldEF0dHJpYnV0ZSgnZGF0YS1zb3VuZHMnKTtcbiAgICAgICAgY29uc3QgbmV4dFNvdW5kRGF0YSA9IGUuY3VycmVudFNsaWRlLmdldEF0dHJpYnV0ZShcImRhdGEtc291bmRzXCIpO1xuXG4gICAgICAgIGNvbnN0IG5leHRTb3VuZHMgPSBzb3VuZERhdGEobmV4dFNvdW5kRGF0YSlcbiAgICAgICAgY29uc3QgY3VycmVudFNvdW5kcyA9IHNvdW5kRGF0YShjdXJyZW50U291bmREYXRhKTtcblxuICAgICAgICBjb25zdCBbdG9TdG9wLCB0b1N0YXJ0XSA9IG5leHRBdWRpb0FjdGlvbnMoY3VycmVudFNvdW5kcywgbmV4dFNvdW5kcyk7XG5cbiAgICAgICAgdm9sdW1lSGFuZGxlcihlKVxuXG4gICAgICAgIHRvU3RvcC5tYXAoaWQgPT4ge1xuICAgICAgICAgICAgaWYgKCFhdWRpb01hcFtpZF0pXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm5vIGludmFsaWQgYXVkaW9NYXAgZm9yIFwiICsgaWQpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXVkaW9NYXBbaWRdLmZhZGUoMSwgMCwgZmFkZVZhbHVlKCdmYWRlLW91dC1zcGVlZCcpKTtcbiAgICAgICAgfSlcbiAgICAgICAgdG9TdGFydC5tYXAoaWQgPT4ge1xuICAgICAgICAgICAgaWYgKCFhdWRpb01hcFtpZF0pXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm5vIGludmFsaWQgYXVkaW9NYXAgZm9yIFwiICsgaWQpXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBhdWRpb01hcFtpZF0uc3RvcCgpXG4gICAgICAgICAgICAgICAgYXVkaW9NYXBbaWRdLnBsYXkoKVxuICAgICAgICAgICAgICAgIGF1ZGlvTWFwW2lkXS5mYWRlKDAsIDEsIGZhZGVWYWx1ZShcImZhZGUtaW4tc3BlZWRcIikpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cblxuICAgIH1cbiAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHknLCBzb3VuZEhhbmRsZXIpO1xuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCBzb3VuZEhhbmRsZXIpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHNvdW5kSGFuZGxlcixcbiAgICAgICAgX3Rlc3Q6IHtcbiAgICAgICAgICAgIG5leHRBdWRpb0FjdGlvbnNcbiAgICAgICAgfVxuICAgIH1cbn0pKTtcbiJdfQ==