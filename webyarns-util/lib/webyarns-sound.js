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

    var _ref3 = volumeChange === null || volumeChange === void 0 ? void 0 : volumeChange.split(":"),
        _ref4 = _slicedToArray(_ref3, 2),
        id = _ref4[0],
        v = _ref4[1];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy1zb3VuZC50cyJdLCJuYW1lcyI6WyJmYWN0b3J5IiwiZXhwb3J0cyIsIm1vZHVsZSIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImF1ZGlvSWQiLCJzIiwic3RhcnRzV2l0aCIsInN1YnN0cmluZyIsInBhcnRpdGlvbiIsImVzIiwiZm4iLCJyZWR1Y2UiLCJlIiwicCIsImYiLCJsb2FkRGF0YSIsImVsZW1lbnRCeUlkIiwiZ2V0RWxlbWVudEJ5SWQiLCJjb25zb2xlIiwiZXJyb3IiLCJKU09OIiwicGFyc2UiLCJpbm5lckhUTUwiLCJkYXRhIiwiYXVkaW9NYXAiLCJPYmplY3QiLCJrZXlzIiwiYWNjIiwiaWQiLCJob3dsIiwiSG93bCIsInNyYyIsImxvb3AiLCJCb29sZWFuIiwib24iLCJuIiwidm9sdW1lIiwic3RvcCIsImFzc2lnbiIsInNvdW5kRGF0YSIsInNwbGl0IiwibWFwIiwidHJpbSIsInBlcnNpc3RlbnRBdWRpb3MiLCJuZXh0QXVkaW9BY3Rpb25zIiwiY3VycmVudFNvdW5kcyIsIm5leHRTb3VuZHMiLCJ0b1Jlc3RhcnQiLCJuZXh0VG9TdGFydElkcyIsInBlcnNpc3RlbnRUb1N0b3AiLCJmaWx0ZXIiLCJwZXJzaXN0ZW50U3RhcnQiLCJjdXJyZW50U291bmRJZHMiLCJuZXh0U291bmRzSWRzIiwidG9SZXN0YXJ0SWRzIiwidG9TdG9wIiwiaW5jbHVkZXMiLCJpbmRleE9mIiwidG9TdGFydCIsInZvbHVtZUhhbmRsZXIiLCJ2b2x1bWVDaGFuZ2UiLCJjdXJyZW50U2xpZGUiLCJnZXRBdHRyaWJ1dGUiLCJ2IiwicGFyc2VGbG9hdCIsInNvdW5kSGFuZGxlciIsImZhZGVWYWx1ZSIsImEiLCJwYXJzZUludCIsImN1cnJlbnRTb3VuZERhdGEiLCJwcmV2aW91c1NsaWRlIiwibmV4dFNvdW5kRGF0YSIsImZhZGUiLCJwbGF5IiwiUmV2ZWFsIiwiX3Rlc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7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QU8sQ0FBQ2pCLEdBQVIsQ0FBWSxVQUFBYixFQUFFLEVBQUk7QUFDZCxVQUFJLENBQUNKLFFBQVEsQ0FBQ0ksRUFBRCxDQUFiLEVBQ0lWLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLDZCQUE2QlMsRUFBM0MsRUFESixLQUVLO0FBQ0RKLFFBQUFBLFFBQVEsQ0FBQ0ksRUFBRCxDQUFSLENBQWFTLElBQWI7QUFDQWIsUUFBQUEsUUFBUSxDQUFDSSxFQUFELENBQVIsQ0FBYTZDLElBQWI7QUFDQWpELFFBQUFBLFFBQVEsQ0FBQ0ksRUFBRCxDQUFSLENBQWE0QyxJQUFiLENBQWtCLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCTixTQUFTLENBQUMsZUFBRCxDQUFqQztBQUNIO0FBQ0osS0FSRDtBQVdILEdBbENEOztBQW1DQVEsRUFBQUEsTUFBTSxDQUFDdkUsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUM4RCxZQUFqQztBQUNBUyxFQUFBQSxNQUFNLENBQUN2RSxnQkFBUCxDQUF3QixjQUF4QixFQUF3QzhELFlBQXhDO0FBQ0EsU0FBTztBQUNIQSxJQUFBQSxZQUFZLEVBQVpBLFlBREc7QUFFSFUsSUFBQUEsS0FBSyxFQUFFO0FBQ0gvQixNQUFBQSxnQkFBZ0IsRUFBaEJBO0FBREc7QUFGSixHQUFQO0FBTUgsQ0FySUEsQ0FBRCIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGggPVwiLi4vLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9ob3dsZXIvaW5kZXguZC50c1wiLz5cblxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JylcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZhY3RvcnkpXG4gICAgfVxufSgoKSA9PiB7XG4gICAgdHlwZSBBdWRpb0lkID0gc3RyaW5nXG4gICAgY29uc3QgYXVkaW9JZCA9IChzOiBBdWRpb0lkKTogQXVkaW9JZCA9PiAocy5zdGFydHNXaXRoKFwiIVwiKSB8fCBzLnN0YXJ0c1dpdGgoXCI+XCIpIHx8IHMuc3RhcnRzV2l0aChcIiNcIikpID8gcy5zdWJzdHJpbmcoMSkgOiBzO1xuXG4gICAgY29uc3QgcGFydGl0aW9uID0gPFQ+KGVzOiBBcnJheTxUPiwgZm46IChhOiBUKSA9PiBib29sZWFuKSA9PlxuICAgICAgICBlcy5yZWR1Y2UoKFtwLCBmXSwgZSkgPT4gKGZuKGUpID8gW1suLi5wLCBlXSwgZl0gOiBbcCwgWy4uLmYsIGVdXSksIFtbXSwgW11dKTtcblxuICAgIGludGVyZmFjZSBTb3VuZERhdGEge1xuICAgICAgICBbaWQ6IHN0cmluZ106IHtcbiAgICAgICAgICAgIGxvb3A/OiBib29sZWFuLFxuICAgICAgICAgICAgc3JjOiBzdHJpbmdbXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIEF1ZGlvTWFwIHtcbiAgICAgICAgW2lkOiBzdHJpbmddOiBIb3dsXG4gICAgfVxuXG4gICAgY29uc3QgbG9hZERhdGEgPSAoKTogU291bmREYXRhID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudEJ5SWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc291bmRzJyk7XG4gICAgICAgIGlmIChlbGVtZW50QnlJZCA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDYW5ub3QgZmluZCA8c2NyaXB0IGlkPVwic291bmRzXCIgdHlwZT1cImFwcGxpY2F0aW9uL2pzb25cIj4nKVxuICAgICAgICAgICAgcmV0dXJuIHt9XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZWxlbWVudEJ5SWQuaW5uZXJIVE1MKTtcbiAgICB9XG5cblxuICAgIGNvbnN0IGRhdGE6IFNvdW5kRGF0YSA9IGxvYWREYXRhKClcbiAgICBjb25zdCBhdWRpb01hcDogQXVkaW9NYXAgPSBPYmplY3Qua2V5cyhkYXRhKS5yZWR1Y2UoKGFjYywgaWQpID0+IHtcbiAgICAgICAgY29uc3QgaG93bCA9IG5ldyBIb3dsKHtcbiAgICAgICAgICAgIHNyYzogZGF0YVtpZF0uc3JjLFxuICAgICAgICAgICAgbG9vcDogQm9vbGVhbihkYXRhW2lkXS5sb29wKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGhvd2wub24oXCJmYWRlXCIsIChuKSA9PiB7XG4gICAgICAgICAgICBpZiAoaG93bC52b2x1bWUoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGhvd2wuc3RvcChuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFjYywge1xuICAgICAgICAgICAgW2lkXTogaG93bFxuICAgICAgICB9KTtcbiAgICB9LCB7fSlcblxuICAgIGNvbnN0IHNvdW5kRGF0YSA9IChzOiBzdHJpbmcgfCBudWxsKSA9PlxuICAgICAgICBzID8gcy5zcGxpdChcIixcIikubWFwKHMgPT4gcy50cmltKCkpIDogW107XG5cbiAgICBsZXQgcGVyc2lzdGVudEF1ZGlvczogc3RyaW5nW10gPSBbXVxuICAgIGNvbnN0IG5leHRBdWRpb0FjdGlvbnMgPSAoY3VycmVudFNvdW5kczogc3RyaW5nW10sIG5leHRTb3VuZHM6IHN0cmluZ1tdKTogW3N0cmluZ1tdLCBzdHJpbmdbXV0gPT4ge1xuICAgICAgICBjb25zdCBbdG9SZXN0YXJ0LCBuZXh0VG9TdGFydElkc106IFtzdHJpbmdbXSwgc3RyaW5nW11dID0gcGFydGl0aW9uKG5leHRTb3VuZHMsIGUgPT4gZS5zdGFydHNXaXRoKFwiIVwiKSk7XG5cbiAgICAgICAgY29uc3QgcGVyc2lzdGVudFRvU3RvcCA9IG5leHRUb1N0YXJ0SWRzLmZpbHRlcihlID0+IGUuc3RhcnRzV2l0aChcIiNcIikpLm1hcChhdWRpb0lkKTtcbiAgICAgICAgY29uc3QgcGVyc2lzdGVudFN0YXJ0ID0gbmV4dFRvU3RhcnRJZHMuZmlsdGVyKGUgPT4gZS5zdGFydHNXaXRoKFwiPlwiKSkubWFwKGF1ZGlvSWQpO1xuICAgICAgICBwZXJzaXN0ZW50QXVkaW9zID0gWy4uLnBlcnNpc3RlbnRBdWRpb3MsIC4uLnBlcnNpc3RlbnRTdGFydF0gLy8gYWRkIHRvIGdsb2JhbCBzdGF0ZVxuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTb3VuZElkcyA9IGN1cnJlbnRTb3VuZHMubWFwKGF1ZGlvSWQpO1xuICAgICAgICBjb25zdCBuZXh0U291bmRzSWRzID0gbmV4dFNvdW5kcy5tYXAoYXVkaW9JZCk7XG4gICAgICAgIGNvbnN0IHRvUmVzdGFydElkcyA9IHRvUmVzdGFydC5tYXAoYXVkaW9JZCk7XG4gICAgICAgIGNvbnN0IHRvU3RvcCA9IFtcbiAgICAgICAgICAgIC4uLmN1cnJlbnRTb3VuZElkc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoZSA9PiAhbmV4dFRvU3RhcnRJZHMuaW5jbHVkZXMoZSkpIC8vIHJlbW92ZSB0aGUgb25lcyB0aGF0IGNhcnJ5IG92ZXJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGUgPT4gIXRvUmVzdGFydElkcy5pbmNsdWRlcyhlKSkgLy8gcmVtb3ZlIHRoZSBvbmVzIHRoYXQgbmVlZCByZXN0YXJ0aW5nXG4gICAgICAgICAgICAgICAgLmZpbHRlcihlID0+IHBlcnNpc3RlbnRBdWRpb3MuaW5kZXhPZihlKSA9PT0gLTEpLFxuICAgICAgICAgICAgLi4ucGVyc2lzdGVudFRvU3RvcF1cbiAgICAgICAgY29uc3QgdG9TdGFydCA9IFtcbiAgICAgICAgICAgIC4uLm5leHRTb3VuZHNJZHNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGUgPT4gIWN1cnJlbnRTb3VuZElkcy5pbmNsdWRlcyhlKSkgLy8gYWRkIG5ldyBvbmVzIG5vdCBjYXJyaWVkIG92ZXJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGUgPT4gIXBlcnNpc3RlbnRUb1N0b3AuaW5jbHVkZXMoZSkpLCAvLyByZW1vdmUgdGhlIG9uZXMgaW50ZW5kZWQgdG8gc3RvcFxuICAgICAgICAgICAgLi4udG9SZXN0YXJ0SWRzLCAvLyBhZGQgdGhlIG9uZXMgdGhhdCBuZWVkIHJlc3RhcnRlZFxuICAgICAgICBdXG4gICAgICAgIHJldHVybiBbdG9TdG9wLCB0b1N0YXJ0XVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZvbHVtZUhhbmRsZXIoZTogU2xpZGVFdmVudCkge1xuICAgICAgICBjb25zdCB2b2x1bWVDaGFuZ2UgPSBlLmN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc291bmRzLXZvbHVtZS1jaGFuZ2UnKTtcbiAgICAgICAgaWYgKCF2b2x1bWVDaGFuZ2UpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgY29uc3QgW2lkLHZdID0gdm9sdW1lQ2hhbmdlPy5zcGxpdChcIjpcIik7XG4gICAgICAgIGNvbnN0IHZvbHVtZSA9IHBhcnNlRmxvYXQodilcbiAgICAgICAgYXVkaW9NYXBbaWRdLnZvbHVtZSh2b2x1bWUpXG5cblxuICAgIH1cblxuICAgIGNvbnN0IHNvdW5kSGFuZGxlciA9IChlOiBTbGlkZUV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGZhZGVWYWx1ZSA9IChhOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHMgPSBlLmN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNvdW5kcy1cIithKSB8fCBlLmN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoYSk7XG4gICAgICAgICAgICByZXR1cm4gcyA/IHBhcnNlSW50KHMsIDEwKSA6IDE1MDBcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29uc3QgY3VycmVudFNvdW5kRGF0YSA9IGUucHJldmlvdXNTbGlkZT8uZ2V0QXR0cmlidXRlKCdkYXRhLXNvdW5kcycpO1xuICAgICAgICBjb25zdCBuZXh0U291bmREYXRhID0gZS5jdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1zb3VuZHNcIik7XG5cbiAgICAgICAgY29uc3QgbmV4dFNvdW5kcyA9IHNvdW5kRGF0YShuZXh0U291bmREYXRhKVxuICAgICAgICBjb25zdCBjdXJyZW50U291bmRzID0gc291bmREYXRhKGN1cnJlbnRTb3VuZERhdGEpO1xuXG4gICAgICAgIGNvbnN0IFt0b1N0b3AsIHRvU3RhcnRdID0gbmV4dEF1ZGlvQWN0aW9ucyhjdXJyZW50U291bmRzLCBuZXh0U291bmRzKTtcblxuICAgICAgICB2b2x1bWVIYW5kbGVyKGUpXG5cbiAgICAgICAgdG9TdG9wLm1hcChpZCA9PiB7XG4gICAgICAgICAgICBpZiAoIWF1ZGlvTWFwW2lkXSlcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwibm8gaW52YWxpZCBhdWRpb01hcCBmb3IgXCIgKyBpZClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBhdWRpb01hcFtpZF0uZmFkZSgxLCAwLCBmYWRlVmFsdWUoJ2ZhZGUtb3V0LXNwZWVkJykpO1xuICAgICAgICB9KVxuICAgICAgICB0b1N0YXJ0Lm1hcChpZCA9PiB7XG4gICAgICAgICAgICBpZiAoIWF1ZGlvTWFwW2lkXSlcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwibm8gaW52YWxpZCBhdWRpb01hcCBmb3IgXCIgKyBpZClcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGF1ZGlvTWFwW2lkXS5zdG9wKClcbiAgICAgICAgICAgICAgICBhdWRpb01hcFtpZF0ucGxheSgpXG4gICAgICAgICAgICAgICAgYXVkaW9NYXBbaWRdLmZhZGUoMCwgMSwgZmFkZVZhbHVlKFwiZmFkZS1pbi1zcGVlZFwiKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuXG4gICAgfVxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeScsIHNvdW5kSGFuZGxlcik7XG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIHNvdW5kSGFuZGxlcik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc291bmRIYW5kbGVyLFxuICAgICAgICBfdGVzdDoge1xuICAgICAgICAgICAgbmV4dEF1ZGlvQWN0aW9uc1xuICAgICAgICB9XG4gICAgfVxufSkpO1xuIl19