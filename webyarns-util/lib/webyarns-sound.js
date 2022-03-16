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
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') module.exports = factory(false)();else {
    document.addEventListener("DOMContentLoaded", factory(true));
  }
})(function (addToGlobal) {
  return function () {
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

    if (addToGlobal) {
      // @ts-ignore
      window.audioHandler = soundHandler;
    }

    Reveal.addEventListener('ready', soundHandler);
    Reveal.addEventListener('slidechanged', soundHandler);
    return {
      soundHandler: soundHandler,
      _test: {
        nextAudioActions: nextAudioActions
      }
    };
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy1zb3VuZC50cyJdLCJuYW1lcyI6WyJmYWN0b3J5IiwiZXhwb3J0cyIsIm1vZHVsZSIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImFkZFRvR2xvYmFsIiwiYXVkaW9JZCIsInMiLCJzdGFydHNXaXRoIiwic3Vic3RyaW5nIiwicGFydGl0aW9uIiwiZXMiLCJmbiIsInJlZHVjZSIsImUiLCJwIiwiZiIsImxvYWREYXRhIiwiZWxlbWVudEJ5SWQiLCJnZXRFbGVtZW50QnlJZCIsImNvbnNvbGUiLCJlcnJvciIsIkpTT04iLCJwYXJzZSIsImlubmVySFRNTCIsImRhdGEiLCJhdWRpb01hcCIsIk9iamVjdCIsImtleXMiLCJhY2MiLCJpZCIsImhvd2wiLCJIb3dsIiwic3JjIiwibG9vcCIsIkJvb2xlYW4iLCJvbiIsIm4iLCJ2b2x1bWUiLCJzdG9wIiwiYXNzaWduIiwic291bmREYXRhIiwic3BsaXQiLCJtYXAiLCJ0cmltIiwicGVyc2lzdGVudEF1ZGlvcyIsIm5leHRBdWRpb0FjdGlvbnMiLCJjdXJyZW50U291bmRzIiwibmV4dFNvdW5kcyIsInRvUmVzdGFydCIsIm5leHRUb1N0YXJ0SWRzIiwicGVyc2lzdGVudFRvU3RvcCIsImZpbHRlciIsInBlcnNpc3RlbnRTdGFydCIsImN1cnJlbnRTb3VuZElkcyIsIm5leHRTb3VuZHNJZHMiLCJ0b1Jlc3RhcnRJZHMiLCJ0b1N0b3AiLCJpbmNsdWRlcyIsImluZGV4T2YiLCJ0b1N0YXJ0Iiwidm9sdW1lSGFuZGxlciIsInZvbHVtZUNoYW5nZSIsImN1cnJlbnRTbGlkZSIsImdldEF0dHJpYnV0ZSIsInYiLCJwYXJzZUZsb2F0Iiwic291bmRIYW5kbGVyIiwiZmFkZVZhbHVlIiwiYSIsInBhcnNlSW50IiwiY3VycmVudFNvdW5kRGF0YSIsInByZXZpb3VzU2xpZGUiLCJuZXh0U291bmREYXRhIiwiZmFkZSIsInBsYXkiLCJ3aW5kb3ciLCJhdWRpb0hhbmRsZXIiLCJSZXZlYWwi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LENBQWtCLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCTixTQUFTLENBQUMsZ0JBQUQsQ0FBakM7QUFDUCxPQUxEO0FBTUFSLE1BQUFBLE9BQU8sQ0FBQ2pCLEdBQVIsQ0FBWSxVQUFBYixFQUFFLEVBQUk7QUFDZCxZQUFJLENBQUNKLFFBQVEsQ0FBQ0ksRUFBRCxDQUFiLEVBQ0lWLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLDZCQUE2QlMsRUFBM0MsRUFESixLQUVLO0FBQ0RKLFVBQUFBLFFBQVEsQ0FBQ0ksRUFBRCxDQUFSLENBQWFTLElBQWI7QUFDQWIsVUFBQUEsUUFBUSxDQUFDSSxFQUFELENBQVIsQ0FBYTZDLElBQWI7QUFDQWpELFVBQUFBLFFBQVEsQ0FBQ0ksRUFBRCxDQUFSLENBQWE0QyxJQUFiLENBQWtCLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCTixTQUFTLENBQUMsZUFBRCxDQUFqQztBQUNIO0FBQ0osT0FSRDtBQVdILEtBbENEOztBQW1DQSxRQUFJL0QsV0FBSixFQUFnQjtBQUNaO0FBQ0F1RSxNQUFBQSxNQUFNLENBQUNDLFlBQVAsR0FBc0JWLFlBQXRCO0FBQ0g7O0FBRURXLElBQUFBLE1BQU0sQ0FBQzFFLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDK0QsWUFBakM7QUFDQVcsSUFBQUEsTUFBTSxDQUFDMUUsZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MrRCxZQUF4QztBQUNBLFdBQU87QUFDSEEsTUFBQUEsWUFBWSxFQUFaQSxZQURHO0FBRUhZLE1BQUFBLEtBQUssRUFBRTtBQUNIakMsUUFBQUEsZ0JBQWdCLEVBQWhCQTtBQURHO0FBRkosS0FBUDtBQU1ILEdBcElDO0FBQUEsQ0FORCxDQUFEIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aCA9XCIuLi8uLi9ub2RlX21vZHVsZXMvQHR5cGVzL2hvd2xlci9pbmRleC5kLnRzXCIvPlxuXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoZmFsc2UpKCk7XG4gICAgZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZhY3RvcnkodHJ1ZSkpXG4gICAgfVxufSgoYWRkVG9HbG9iYWw6IGJvb2xlYW4pPT4oKSA9PiB7XG4gICAgdHlwZSBBdWRpb0lkID0gc3RyaW5nXG4gICAgY29uc3QgYXVkaW9JZCA9IChzOiBBdWRpb0lkKTogQXVkaW9JZCA9PiAocy5zdGFydHNXaXRoKFwiIVwiKSB8fCBzLnN0YXJ0c1dpdGgoXCI+XCIpIHx8IHMuc3RhcnRzV2l0aChcIiNcIikpID8gcy5zdWJzdHJpbmcoMSkgOiBzO1xuXG4gICAgY29uc3QgcGFydGl0aW9uID0gPFQ+KGVzOiBBcnJheTxUPiwgZm46IChhOiBUKSA9PiBib29sZWFuKSA9PlxuICAgICAgICBlcy5yZWR1Y2UoKFtwLCBmXSwgZSkgPT4gKGZuKGUpID8gW1suLi5wLCBlXSwgZl0gOiBbcCwgWy4uLmYsIGVdXSksIFtbXSwgW11dKTtcblxuICAgIGludGVyZmFjZSBTb3VuZERhdGEge1xuICAgICAgICBbaWQ6IHN0cmluZ106IHtcbiAgICAgICAgICAgIGxvb3A/OiBib29sZWFuLFxuICAgICAgICAgICAgc3JjOiBzdHJpbmdbXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIEF1ZGlvTWFwIHtcbiAgICAgICAgW2lkOiBzdHJpbmddOiBIb3dsXG4gICAgfVxuXG4gICAgY29uc3QgbG9hZERhdGEgPSAoKTogU291bmREYXRhID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudEJ5SWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc291bmRzJyk7XG4gICAgICAgIGlmIChlbGVtZW50QnlJZCA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDYW5ub3QgZmluZCA8c2NyaXB0IGlkPVwic291bmRzXCIgdHlwZT1cImFwcGxpY2F0aW9uL2pzb25cIj4nKVxuICAgICAgICAgICAgcmV0dXJuIHt9XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZWxlbWVudEJ5SWQuaW5uZXJIVE1MKTtcbiAgICB9XG5cblxuICAgIGNvbnN0IGRhdGE6IFNvdW5kRGF0YSA9IGxvYWREYXRhKClcbiAgICBjb25zdCBhdWRpb01hcDogQXVkaW9NYXAgPSBPYmplY3Qua2V5cyhkYXRhKS5yZWR1Y2UoKGFjYywgaWQpID0+IHtcbiAgICAgICAgY29uc3QgaG93bCA9IG5ldyBIb3dsKHtcbiAgICAgICAgICAgIHNyYzogZGF0YVtpZF0uc3JjLFxuICAgICAgICAgICAgbG9vcDogQm9vbGVhbihkYXRhW2lkXS5sb29wKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGhvd2wub24oXCJmYWRlXCIsIChuKSA9PiB7XG4gICAgICAgICAgICBpZiAoaG93bC52b2x1bWUoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGhvd2wuc3RvcChuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFjYywge1xuICAgICAgICAgICAgW2lkXTogaG93bFxuICAgICAgICB9KTtcbiAgICB9LCB7fSlcblxuICAgIGNvbnN0IHNvdW5kRGF0YSA9IChzOiBzdHJpbmcgfCBudWxsKSA9PlxuICAgICAgICBzID8gcy5zcGxpdChcIixcIikubWFwKHMgPT4gcy50cmltKCkpIDogW107XG5cbiAgICBsZXQgcGVyc2lzdGVudEF1ZGlvczogc3RyaW5nW10gPSBbXVxuICAgIGNvbnN0IG5leHRBdWRpb0FjdGlvbnMgPSAoY3VycmVudFNvdW5kczogc3RyaW5nW10sIG5leHRTb3VuZHM6IHN0cmluZ1tdKTogW3N0cmluZ1tdLCBzdHJpbmdbXV0gPT4ge1xuICAgICAgICBjb25zdCBbdG9SZXN0YXJ0LCBuZXh0VG9TdGFydElkc106IFtzdHJpbmdbXSwgc3RyaW5nW11dID0gcGFydGl0aW9uKG5leHRTb3VuZHMsIGUgPT4gZS5zdGFydHNXaXRoKFwiIVwiKSk7XG5cbiAgICAgICAgY29uc3QgcGVyc2lzdGVudFRvU3RvcCA9IG5leHRUb1N0YXJ0SWRzLmZpbHRlcihlID0+IGUuc3RhcnRzV2l0aChcIiNcIikpLm1hcChhdWRpb0lkKTtcbiAgICAgICAgY29uc3QgcGVyc2lzdGVudFN0YXJ0ID0gbmV4dFRvU3RhcnRJZHMuZmlsdGVyKGUgPT4gZS5zdGFydHNXaXRoKFwiPlwiKSkubWFwKGF1ZGlvSWQpO1xuICAgICAgICBwZXJzaXN0ZW50QXVkaW9zID0gWy4uLnBlcnNpc3RlbnRBdWRpb3MsIC4uLnBlcnNpc3RlbnRTdGFydF0gLy8gYWRkIHRvIGdsb2JhbCBzdGF0ZVxuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTb3VuZElkcyA9IGN1cnJlbnRTb3VuZHMubWFwKGF1ZGlvSWQpO1xuICAgICAgICBjb25zdCBuZXh0U291bmRzSWRzID0gbmV4dFNvdW5kcy5tYXAoYXVkaW9JZCk7XG4gICAgICAgIGNvbnN0IHRvUmVzdGFydElkcyA9IHRvUmVzdGFydC5tYXAoYXVkaW9JZCk7XG4gICAgICAgIGNvbnN0IHRvU3RvcCA9IFtcbiAgICAgICAgICAgIC4uLmN1cnJlbnRTb3VuZElkc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoZSA9PiAhbmV4dFRvU3RhcnRJZHMuaW5jbHVkZXMoZSkpIC8vIHJlbW92ZSB0aGUgb25lcyB0aGF0IGNhcnJ5IG92ZXJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGUgPT4gIXRvUmVzdGFydElkcy5pbmNsdWRlcyhlKSkgLy8gcmVtb3ZlIHRoZSBvbmVzIHRoYXQgbmVlZCByZXN0YXJ0aW5nXG4gICAgICAgICAgICAgICAgLmZpbHRlcihlID0+IHBlcnNpc3RlbnRBdWRpb3MuaW5kZXhPZihlKSA9PT0gLTEpLFxuICAgICAgICAgICAgLi4ucGVyc2lzdGVudFRvU3RvcF1cbiAgICAgICAgY29uc3QgdG9TdGFydCA9IFtcbiAgICAgICAgICAgIC4uLm5leHRTb3VuZHNJZHNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGUgPT4gIWN1cnJlbnRTb3VuZElkcy5pbmNsdWRlcyhlKSkgLy8gYWRkIG5ldyBvbmVzIG5vdCBjYXJyaWVkIG92ZXJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGUgPT4gIXBlcnNpc3RlbnRUb1N0b3AuaW5jbHVkZXMoZSkpLCAvLyByZW1vdmUgdGhlIG9uZXMgaW50ZW5kZWQgdG8gc3RvcFxuICAgICAgICAgICAgLi4udG9SZXN0YXJ0SWRzLCAvLyBhZGQgdGhlIG9uZXMgdGhhdCBuZWVkIHJlc3RhcnRlZFxuICAgICAgICBdXG4gICAgICAgIHJldHVybiBbdG9TdG9wLCB0b1N0YXJ0XVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZvbHVtZUhhbmRsZXIoZTogU2xpZGVFdmVudCkge1xuICAgICAgICBjb25zdCB2b2x1bWVDaGFuZ2UgPSBlLmN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc291bmRzLXZvbHVtZS1jaGFuZ2UnKTtcbiAgICAgICAgaWYgKCF2b2x1bWVDaGFuZ2UpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgY29uc3QgW2lkLHZdID0gdm9sdW1lQ2hhbmdlPy5zcGxpdChcIjpcIik7XG4gICAgICAgIGNvbnN0IHZvbHVtZSA9IHBhcnNlRmxvYXQodilcbiAgICAgICAgYXVkaW9NYXBbaWRdLnZvbHVtZSh2b2x1bWUpXG5cblxuICAgIH1cblxuICAgIGNvbnN0IHNvdW5kSGFuZGxlciA9IChlOiBTbGlkZUV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGZhZGVWYWx1ZSA9IChhOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHMgPSBlLmN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNvdW5kcy1cIithKSB8fCBlLmN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoYSk7XG4gICAgICAgICAgICByZXR1cm4gcyA/IHBhcnNlSW50KHMsIDEwKSA6IDE1MDBcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29uc3QgY3VycmVudFNvdW5kRGF0YSA9IGUucHJldmlvdXNTbGlkZT8uZ2V0QXR0cmlidXRlKCdkYXRhLXNvdW5kcycpO1xuICAgICAgICBjb25zdCBuZXh0U291bmREYXRhID0gZS5jdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1zb3VuZHNcIik7XG5cbiAgICAgICAgY29uc3QgbmV4dFNvdW5kcyA9IHNvdW5kRGF0YShuZXh0U291bmREYXRhKVxuICAgICAgICBjb25zdCBjdXJyZW50U291bmRzID0gc291bmREYXRhKGN1cnJlbnRTb3VuZERhdGEpO1xuXG4gICAgICAgIGNvbnN0IFt0b1N0b3AsIHRvU3RhcnRdID0gbmV4dEF1ZGlvQWN0aW9ucyhjdXJyZW50U291bmRzLCBuZXh0U291bmRzKTtcblxuICAgICAgICB2b2x1bWVIYW5kbGVyKGUpXG5cbiAgICAgICAgdG9TdG9wLm1hcChpZCA9PiB7XG4gICAgICAgICAgICBpZiAoIWF1ZGlvTWFwW2lkXSlcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwibm8gaW52YWxpZCBhdWRpb01hcCBmb3IgXCIgKyBpZClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBhdWRpb01hcFtpZF0uZmFkZSgxLCAwLCBmYWRlVmFsdWUoJ2ZhZGUtb3V0LXNwZWVkJykpO1xuICAgICAgICB9KVxuICAgICAgICB0b1N0YXJ0Lm1hcChpZCA9PiB7XG4gICAgICAgICAgICBpZiAoIWF1ZGlvTWFwW2lkXSlcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwibm8gaW52YWxpZCBhdWRpb01hcCBmb3IgXCIgKyBpZClcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGF1ZGlvTWFwW2lkXS5zdG9wKClcbiAgICAgICAgICAgICAgICBhdWRpb01hcFtpZF0ucGxheSgpXG4gICAgICAgICAgICAgICAgYXVkaW9NYXBbaWRdLmZhZGUoMCwgMSwgZmFkZVZhbHVlKFwiZmFkZS1pbi1zcGVlZFwiKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuXG4gICAgfVxuICAgIGlmIChhZGRUb0dsb2JhbCl7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgd2luZG93LmF1ZGlvSGFuZGxlciA9IHNvdW5kSGFuZGxlclxuICAgIH1cblxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeScsIHNvdW5kSGFuZGxlcik7XG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIHNvdW5kSGFuZGxlcik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc291bmRIYW5kbGVyLFxuICAgICAgICBfdGVzdDoge1xuICAgICAgICAgICAgbmV4dEF1ZGlvQWN0aW9uc1xuICAgICAgICB9XG4gICAgfVxufSkpO1xuIl19