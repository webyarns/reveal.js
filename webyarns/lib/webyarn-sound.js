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
  console.log("start");

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
      src: data[id],
      loop: true
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

    console.log([toStop, toStart]);
    toStop.map(function (id) {
      audioMap[id].fade(1, 0, fadeValue('fade-out-speed'));
    });
    toStart.map(function (id) {
      audioMap[id].play();
      console.log("starting ", id);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJuLXNvdW5kLnRzIl0sIm5hbWVzIjpbImZhY3RvcnkiLCJleHBvcnRzIiwibW9kdWxlIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiY29uc29sZSIsImxvZyIsImF1ZGlvSWQiLCJzIiwic3RhcnRzV2l0aCIsInN1YnN0cmluZyIsInBhcnRpdGlvbiIsImVzIiwiZm4iLCJyZWR1Y2UiLCJlIiwicCIsImYiLCJsb2FkRGF0YSIsImVsZW1lbnRCeUlkIiwiZ2V0RWxlbWVudEJ5SWQiLCJlcnJvciIsIkpTT04iLCJwYXJzZSIsImlubmVySFRNTCIsImRhdGEiLCJhdWRpb01hcCIsIk9iamVjdCIsImtleXMiLCJhY2MiLCJpZCIsImhvd2wiLCJIb3dsIiwic3JjIiwibG9vcCIsIm9uIiwic3RvcCIsImFzc2lnbiIsInNvdW5kRGF0YSIsInNwbGl0IiwibWFwIiwidHJpbSIsIm5leHRBdWRpb0FjdGlvbnMiLCJjdXJyZW50U291bmRzIiwibmV4dFNvdW5kcyIsInRvUmVzdGFydCIsIm5leHRUb1N0YXJ0SWRzIiwiY3VycmVudFNvdW5kSWRzIiwibmV4dFNvdW5kc0lkcyIsInRvUmVzdGFydElkcyIsInRvU3RvcCIsImZpbHRlciIsImluY2x1ZGVzIiwidG9TdGFydCIsInNvdW5kSGFuZGxlciIsImZhZGVWYWx1ZSIsImEiLCJjdXJyZW50U2xpZGUiLCJnZXRBdHRyaWJ1dGUiLCJwYXJzZUludCIsImN1cnJlbnRTb3VuZERhdGEiLCJwcmV2aW91c1NsaWRlIiwibmV4dFNvdW5kRGF0YSIsImZhZGUiLCJwbGF5IiwiUmV2ZWFsIiwiX3Rlc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUVDLFdBQVVBLE9BQVYsRUFBbUI7QUFDaEIsTUFBSSxRQUFPQyxPQUFQLHlDQUFPQSxPQUFQLE9BQW1CLFFBQXZCLEVBQ0lDLE1BQU0sQ0FBQ0QsT0FBUCxHQUFpQkQsT0FBTyxFQUF4QixDQURKLEtBRUs7QUFD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QUQiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoID1cIi4uLy4uL25vZGVfbW9kdWxlcy9AdHlwZXMvaG93bGVyL2luZGV4LmQudHNcIi8+XG5cbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmYWN0b3J5KVxuICAgIH1cbn0oKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwic3RhcnRcIik7XG4gICAgdHlwZSBBdWRpb0lkID0gc3RyaW5nXG4gICAgY29uc3QgYXVkaW9JZCA9IChzOiBBdWRpb0lkKTogQXVkaW9JZCA9PiBzLnN0YXJ0c1dpdGgoXCIhXCIpID8gcy5zdWJzdHJpbmcoMSkgOiBzO1xuXG4gICAgY29uc3QgcGFydGl0aW9uID0gPFQ+KGVzOiBBcnJheTxUPiwgZm46IChhOiBUKSA9PiBib29sZWFuKSA9PlxuICAgICAgICBlcy5yZWR1Y2UoKFtwLCBmXSwgZSkgPT4gKGZuKGUpID8gW1suLi5wLCBlXSwgZl0gOiBbcCwgWy4uLmYsIGVdXSksIFtbXSwgW11dKTtcblxuICAgIGludGVyZmFjZSBTb3VuZERhdGEge1xuICAgICAgICBbaWQ6IHN0cmluZ106IHN0cmluZ1tdXG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIEF1ZGlvTWFwIHtcbiAgICAgICAgW2lkOiBzdHJpbmddOiBIb3dsXG4gICAgfVxuXG4gICAgY29uc3QgbG9hZERhdGEgPSAoKTogU291bmREYXRhID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudEJ5SWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc291bmRzJyk7XG4gICAgICAgIGlmIChlbGVtZW50QnlJZCA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDYW5ub3QgZmluZCA8c2NyaXB0IGlkPVwic291bmRzXCIgdHlwZT1cImFwcGxpY2F0aW9uL2pzb25cIj4nKVxuICAgICAgICAgICAgcmV0dXJuIHt9XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZWxlbWVudEJ5SWQuaW5uZXJIVE1MKTtcbiAgICB9XG5cblxuICAgIGNvbnN0IGRhdGE6IFNvdW5kRGF0YSA9IGxvYWREYXRhKClcbiAgICBjb25zdCBhdWRpb01hcDogQXVkaW9NYXAgPSBPYmplY3Qua2V5cyhkYXRhKS5yZWR1Y2UoKGFjYywgaWQpID0+IHtcbiAgICAgICAgY29uc3QgaG93bCA9IG5ldyBIb3dsKHtcbiAgICAgICAgICAgIHNyYzogZGF0YVtpZF0sXG4gICAgICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgaG93bC5vbihcIm11dGVcIiwgKCkgPT4gaG93bC5zdG9wKCkpO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhY2MsIHtcbiAgICAgICAgICAgIFtpZF06IGhvd2xcbiAgICAgICAgfSk7XG4gICAgfSwge30pXG5cbiAgICBjb25zdCBzb3VuZERhdGEgPSAoczogc3RyaW5nIHwgbnVsbCkgPT5cbiAgICAgICAgcyA/IHMuc3BsaXQoXCIsXCIpLm1hcChzID0+IHMudHJpbSgpKSA6IFtdO1xuXG5cbiAgICBjb25zdCBuZXh0QXVkaW9BY3Rpb25zID0gKGN1cnJlbnRTb3VuZHM6IHN0cmluZ1tdLCBuZXh0U291bmRzOiBzdHJpbmdbXSk6IFtzdHJpbmdbXSwgc3RyaW5nW11dID0+IHtcbiAgICAgICAgY29uc3QgW3RvUmVzdGFydCwgbmV4dFRvU3RhcnRJZHNdID0gcGFydGl0aW9uKG5leHRTb3VuZHMsIGUgPT4gZS5zdGFydHNXaXRoKFwiIVwiKSk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTb3VuZElkcyA9IGN1cnJlbnRTb3VuZHMubWFwKGF1ZGlvSWQpO1xuICAgICAgICBjb25zdCBuZXh0U291bmRzSWRzID0gbmV4dFNvdW5kcy5tYXAoYXVkaW9JZCk7XG4gICAgICAgIGNvbnN0IHRvUmVzdGFydElkcyA9IHRvUmVzdGFydC5tYXAoYXVkaW9JZCk7XG4gICAgICAgIGNvbnN0IHRvU3RvcCA9IGN1cnJlbnRTb3VuZElkc1xuICAgICAgICAgICAgLmZpbHRlcihlID0+ICFuZXh0VG9TdGFydElkcy5pbmNsdWRlcyhlKSkgLy8gcmVtb3ZlIHRoZSBvbmVzIHRoYXQgY2Fycnkgb3ZlclxuICAgICAgICAgICAgLmZpbHRlcihlID0+ICF0b1Jlc3RhcnRJZHMuaW5jbHVkZXMoZSkpIC8vIHJlbW92ZSB0aGUgb25lcyB0aGF0IG5lZWQgcmVzdGFydGluZ1xuICAgICAgICBjb25zdCB0b1N0YXJ0ID0gW1xuICAgICAgICAgICAgLi4ubmV4dFNvdW5kc0lkcy5maWx0ZXIoZSA9PiAhY3VycmVudFNvdW5kSWRzLmluY2x1ZGVzKGUpKSwgLy8gYWRkIG5ldyBvbmVzIG5vdCBjYXJyaWVkIG92ZXJcbiAgICAgICAgICAgIC4uLnRvUmVzdGFydElkcyAvLyBhZGQgdGhlIG9uZXMgdGhhdCBuZWVkIHJlc3RhcnRlZFxuICAgICAgICBdXG4gICAgICAgIHJldHVybiBbdG9TdG9wLCB0b1N0YXJ0XVxuICAgIH1cblxuICAgIGNvbnN0IHNvdW5kSGFuZGxlciA9IChlOiBTbGlkZUV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGZhZGVWYWx1ZSA9IChhOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHMgPSBlLmN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoYSk7XG4gICAgICAgICAgICByZXR1cm4gcyA/IHBhcnNlSW50KHMsIDEwKSA6IDE1MDBcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29uc3QgY3VycmVudFNvdW5kRGF0YSA9IGUucHJldmlvdXNTbGlkZT8uZ2V0QXR0cmlidXRlKCdkYXRhLXNvdW5kcycpO1xuICAgICAgICBjb25zdCBuZXh0U291bmREYXRhID0gZS5jdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1zb3VuZHNcIik7XG5cbiAgICAgICAgY29uc3QgbmV4dFNvdW5kcyA9IHNvdW5kRGF0YShuZXh0U291bmREYXRhKVxuICAgICAgICBjb25zdCBjdXJyZW50U291bmRzID0gc291bmREYXRhKGN1cnJlbnRTb3VuZERhdGEpO1xuXG4gICAgICAgIGNvbnN0IFt0b1N0b3AsIHRvU3RhcnRdID0gbmV4dEF1ZGlvQWN0aW9ucyhjdXJyZW50U291bmRzLCBuZXh0U291bmRzKTtcbiAgICAgICAgY29uc29sZS5sb2coW3RvU3RvcCwgdG9TdGFydF0pO1xuXG4gICAgICAgIHRvU3RvcC5tYXAoaWQgPT4ge1xuICAgICAgICAgICAgYXVkaW9NYXBbaWRdLmZhZGUoMSwgMCwgZmFkZVZhbHVlKCdmYWRlLW91dC1zcGVlZCcpKTtcbiAgICAgICAgfSlcbiAgICAgICAgdG9TdGFydC5tYXAoaWQgPT4ge1xuICAgICAgICAgICAgYXVkaW9NYXBbaWRdLnBsYXkoKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdGFydGluZyBcIiwgaWQpO1xuICAgICAgICAgICAgYXVkaW9NYXBbaWRdLmZhZGUoMCwgMSwgZmFkZVZhbHVlKFwiZmFkZS1pbi1zcGVlZFwiKSlcbiAgICAgICAgfSlcblxuXG4gICAgfVxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeScsIHNvdW5kSGFuZGxlcik7XG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIHNvdW5kSGFuZGxlcik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc291bmRIYW5kbGVyLFxuICAgICAgICBfdGVzdDoge1xuICAgICAgICAgICAgbmV4dEF1ZGlvQWN0aW9uc1xuICAgICAgICB9XG4gICAgfVxufSkpO1xuIl19