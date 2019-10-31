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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJuLXNvdW5kLnRzIl0sIm5hbWVzIjpbImZhY3RvcnkiLCJleHBvcnRzIiwibW9kdWxlIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiYXVkaW9JZCIsInMiLCJzdGFydHNXaXRoIiwic3Vic3RyaW5nIiwicGFydGl0aW9uIiwiZXMiLCJmbiIsInJlZHVjZSIsImUiLCJwIiwiZiIsImxvYWREYXRhIiwiZWxlbWVudEJ5SWQiLCJnZXRFbGVtZW50QnlJZCIsImNvbnNvbGUiLCJlcnJvciIsIkpTT04iLCJwYXJzZSIsImlubmVySFRNTCIsImRhdGEiLCJhdWRpb01hcCIsIk9iamVjdCIsImtleXMiLCJhY2MiLCJpZCIsImhvd2wiLCJIb3dsIiwic3JjIiwibG9vcCIsIkJvb2xlYW4iLCJvbiIsIm4iLCJ2b2x1bWUiLCJzdG9wIiwiYXNzaWduIiwic291bmREYXRhIiwic3BsaXQiLCJtYXAiLCJ0cmltIiwibmV4dEF1ZGlvQWN0aW9ucyIsImN1cnJlbnRTb3VuZHMiLCJuZXh0U291bmRzIiwidG9SZXN0YXJ0IiwibmV4dFRvU3RhcnRJZHMiLCJjdXJyZW50U291bmRJZHMiLCJuZXh0U291bmRzSWRzIiwidG9SZXN0YXJ0SWRzIiwidG9TdG9wIiwiZmlsdGVyIiwiaW5jbHVkZXMiLCJ0b1N0YXJ0Iiwic291bmRIYW5kbGVyIiwiZmFkZVZhbHVlIiwiYSIsImN1cnJlbnRTbGlkZSIsImdldEF0dHJpYnV0ZSIsInBhcnNlSW50IiwiY3VycmVudFNvdW5kRGF0YSIsInByZXZpb3VzU2xpZGUiLCJuZXh0U291bmREYXRhIiwiZmFkZSIsInBsYXkiLCJSZXZlYWwiLCJfdGVzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBRUMsV0FBVUEsT0FBVixFQUFtQjtBQUNoQixNQUFJLFFBQU9DLE9BQVAseUNBQU9BLE9BQVAsT0FBbUIsUUFBdkIsRUFDSUMsTUFBTSxDQUFDRCxPQUFQLEdBQWlCRCxPQUFPLEVB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cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aCA9XCIuLi8uLi9ub2RlX21vZHVsZXMvQHR5cGVzL2hvd2xlci9pbmRleC5kLnRzXCIvPlxuXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZmFjdG9yeSlcbiAgICB9XG59KCgpID0+IHtcbiAgICB0eXBlIEF1ZGlvSWQgPSBzdHJpbmdcbiAgICBjb25zdCBhdWRpb0lkID0gKHM6IEF1ZGlvSWQpOiBBdWRpb0lkID0+IHMuc3RhcnRzV2l0aChcIiFcIikgPyBzLnN1YnN0cmluZygxKSA6IHM7XG5cbiAgICBjb25zdCBwYXJ0aXRpb24gPSA8VD4oZXM6IEFycmF5PFQ+LCBmbjogKGE6IFQpID0+IGJvb2xlYW4pID0+XG4gICAgICAgIGVzLnJlZHVjZSgoW3AsIGZdLCBlKSA9PiAoZm4oZSkgPyBbWy4uLnAsIGVdLCBmXSA6IFtwLCBbLi4uZiwgZV1dKSwgW1tdLCBbXV0pO1xuXG4gICAgaW50ZXJmYWNlIFNvdW5kRGF0YSB7XG4gICAgICAgIFtpZDogc3RyaW5nXToge1xuICAgICAgICAgICAgbG9vcD86IGJvb2xlYW4sXG4gICAgICAgICAgICBzcmM6IHN0cmluZ1tdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbnRlcmZhY2UgQXVkaW9NYXAge1xuICAgICAgICBbaWQ6IHN0cmluZ106IEhvd2xcbiAgICB9XG5cbiAgICBjb25zdCBsb2FkRGF0YSA9ICgpOiBTb3VuZERhdGEgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50QnlJZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb3VuZHMnKTtcbiAgICAgICAgaWYgKGVsZW1lbnRCeUlkID09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Nhbm5vdCBmaW5kIDxzY3JpcHQgaWQ9XCJzb3VuZHNcIiB0eXBlPVwiYXBwbGljYXRpb24vanNvblwiPicpXG4gICAgICAgICAgICByZXR1cm4ge31cbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShlbGVtZW50QnlJZC5pbm5lckhUTUwpO1xuICAgIH1cblxuXG4gICAgY29uc3QgZGF0YTogU291bmREYXRhID0gbG9hZERhdGEoKVxuICAgIGNvbnN0IGF1ZGlvTWFwOiBBdWRpb01hcCA9IE9iamVjdC5rZXlzKGRhdGEpLnJlZHVjZSgoYWNjLCBpZCkgPT4ge1xuICAgICAgICBjb25zdCBob3dsID0gbmV3IEhvd2woe1xuICAgICAgICAgICAgc3JjOiBkYXRhW2lkXS5zcmMsXG4gICAgICAgICAgICBsb29wOiBCb29sZWFuKGRhdGFbaWRdLmxvb3ApLFxuICAgICAgICB9KTtcbiAgICAgICAgaG93bC5vbihcImZhZGVcIiwgKG4pID0+IHtcbiAgICAgICAgICAgIGlmIChob3dsLnZvbHVtZSgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaG93bC5zdG9wKG4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYWNjLCB7XG4gICAgICAgICAgICBbaWRdOiBob3dsXG4gICAgICAgIH0pO1xuICAgIH0sIHt9KVxuXG4gICAgY29uc3Qgc291bmREYXRhID0gKHM6IHN0cmluZyB8IG51bGwpID0+XG4gICAgICAgIHMgPyBzLnNwbGl0KFwiLFwiKS5tYXAocyA9PiBzLnRyaW0oKSkgOiBbXTtcblxuXG4gICAgY29uc3QgbmV4dEF1ZGlvQWN0aW9ucyA9IChjdXJyZW50U291bmRzOiBzdHJpbmdbXSwgbmV4dFNvdW5kczogc3RyaW5nW10pOiBbc3RyaW5nW10sIHN0cmluZ1tdXSA9PiB7XG4gICAgICAgIGNvbnN0IFt0b1Jlc3RhcnQsIG5leHRUb1N0YXJ0SWRzXSA9IHBhcnRpdGlvbihuZXh0U291bmRzLCBlID0+IGUuc3RhcnRzV2l0aChcIiFcIikpO1xuICAgICAgICBjb25zdCBjdXJyZW50U291bmRJZHMgPSBjdXJyZW50U291bmRzLm1hcChhdWRpb0lkKTtcbiAgICAgICAgY29uc3QgbmV4dFNvdW5kc0lkcyA9IG5leHRTb3VuZHMubWFwKGF1ZGlvSWQpO1xuICAgICAgICBjb25zdCB0b1Jlc3RhcnRJZHMgPSB0b1Jlc3RhcnQubWFwKGF1ZGlvSWQpO1xuICAgICAgICBjb25zdCB0b1N0b3AgPSBjdXJyZW50U291bmRJZHNcbiAgICAgICAgICAgIC5maWx0ZXIoZSA9PiAhbmV4dFRvU3RhcnRJZHMuaW5jbHVkZXMoZSkpIC8vIHJlbW92ZSB0aGUgb25lcyB0aGF0IGNhcnJ5IG92ZXJcbiAgICAgICAgICAgIC5maWx0ZXIoZSA9PiAhdG9SZXN0YXJ0SWRzLmluY2x1ZGVzKGUpKSAvLyByZW1vdmUgdGhlIG9uZXMgdGhhdCBuZWVkIHJlc3RhcnRpbmdcbiAgICAgICAgY29uc3QgdG9TdGFydCA9IFtcbiAgICAgICAgICAgIC4uLm5leHRTb3VuZHNJZHMuZmlsdGVyKGUgPT4gIWN1cnJlbnRTb3VuZElkcy5pbmNsdWRlcyhlKSksIC8vIGFkZCBuZXcgb25lcyBub3QgY2FycmllZCBvdmVyXG4gICAgICAgICAgICAuLi50b1Jlc3RhcnRJZHMgLy8gYWRkIHRoZSBvbmVzIHRoYXQgbmVlZCByZXN0YXJ0ZWRcbiAgICAgICAgXVxuICAgICAgICByZXR1cm4gW3RvU3RvcCwgdG9TdGFydF1cbiAgICB9XG5cbiAgICBjb25zdCBzb3VuZEhhbmRsZXIgPSAoZTogU2xpZGVFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCBmYWRlVmFsdWUgPSAoYTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzID0gZS5jdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKGEpO1xuICAgICAgICAgICAgcmV0dXJuIHMgPyBwYXJzZUludChzLCAxMCkgOiAxNTAwXG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTb3VuZERhdGEgPSBlLnByZXZpb3VzU2xpZGU/LmdldEF0dHJpYnV0ZSgnZGF0YS1zb3VuZHMnKTtcbiAgICAgICAgY29uc3QgbmV4dFNvdW5kRGF0YSA9IGUuY3VycmVudFNsaWRlLmdldEF0dHJpYnV0ZShcImRhdGEtc291bmRzXCIpO1xuXG4gICAgICAgIGNvbnN0IG5leHRTb3VuZHMgPSBzb3VuZERhdGEobmV4dFNvdW5kRGF0YSlcbiAgICAgICAgY29uc3QgY3VycmVudFNvdW5kcyA9IHNvdW5kRGF0YShjdXJyZW50U291bmREYXRhKTtcblxuICAgICAgICBjb25zdCBbdG9TdG9wLCB0b1N0YXJ0XSA9IG5leHRBdWRpb0FjdGlvbnMoY3VycmVudFNvdW5kcywgbmV4dFNvdW5kcyk7XG4gICAgICAgIFxuXG4gICAgICAgIHRvU3RvcC5tYXAoaWQgPT4ge1xuICAgICAgICAgICAgYXVkaW9NYXBbaWRdLmZhZGUoMSwgMCwgZmFkZVZhbHVlKCdmYWRlLW91dC1zcGVlZCcpKTtcbiAgICAgICAgfSlcbiAgICAgICAgdG9TdGFydC5tYXAoaWQgPT4ge1xuICAgICAgICAgICAgYXVkaW9NYXBbaWRdLnBsYXkoKVxuICAgICAgICAgICAgYXVkaW9NYXBbaWRdLmZhZGUoMCwgMSwgZmFkZVZhbHVlKFwiZmFkZS1pbi1zcGVlZFwiKSlcbiAgICAgICAgfSlcblxuXG4gICAgfVxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeScsIHNvdW5kSGFuZGxlcik7XG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIHNvdW5kSGFuZGxlcik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc291bmRIYW5kbGVyLFxuICAgICAgICBfdGVzdDoge1xuICAgICAgICAgICAgbmV4dEF1ZGlvQWN0aW9uc1xuICAgICAgICB9XG4gICAgfVxufSkpO1xuIl19