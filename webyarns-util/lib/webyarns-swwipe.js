"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*

See https://github.com/DaveSeidman/StarWarsWipe

	To Do
	------------------------------------------
	Fix diagonal wipe
	fix radial wipe


Webyarns version:
- Added "destroy" flag and method
- Added support for `data-startAt` to set start percentage
- on destroy remove created elements
*/
var Mode;

(function (Mode) {
  Mode[Mode["AUTO"] = 0] = "AUTO";
  Mode[Mode["MULTI_SECTION"] = 1] = "MULTI_SECTION";
})(Mode || (Mode = {}));

var SWWipe =
/*#__PURE__*/
function () {
  _createClass(SWWipe, [{
    key: "curImg",
    // width of container (banner)
    // height of container
    // aspect ratio of container
    get: function get() {
      return this.imageArray[this.currentIdx];
    }
  }, {
    key: "nxtImg",
    get: function get() {
      return this.imageArray[(this.currentIdx + 1) % this.imageArray.length];
    }
  }]);

  function SWWipe(banner, owner) {
    var _this = this;

    var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Mode.AUTO;
    var loop = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    _classCallCheck(this, SWWipe);

    this.banner = banner;
    this.owner = owner;
    this.mode = mode;
    this.loop = loop;

    _defineProperty(this, "currentIdx", -1);

    _defineProperty(this, "width", window.innerWidth);

    _defineProperty(this, "height", window.innerHeight);

    _defineProperty(this, "aspect", this.width / this.height);

    _defineProperty(this, "imageArray", void 0);

    _defineProperty(this, "_backCanvas", document.createElement('canvas'));

    _defineProperty(this, "_foreCanvas", document.createElement('canvas'));

    _defineProperty(this, "_backContext", void 0);

    _defineProperty(this, "_foregroundContext", void 0);

    _defineProperty(this, "percent", 0);

    _defineProperty(this, "startTime", new Date());

    _defineProperty(this, "nextFadeTimer", null);

    _defineProperty(this, "nextFade", function () {
      // advance indices
      _this.currentIdx = ++_this.currentIdx % _this.imageArray.length;

      _this.drawImage(); // clear the foreground


      _this._foregroundContext.clearRect(0, 0, _this.width, _this.height); // setup and start the fade


      _this.percent = -_this.curImg.fadeWidth;
      _this.startTime = new Date();

      _this.redraw();
    });

    _defineProperty(this, "redraw", function () {
      // calculate percent completion of wipe
      var currentTime = new Date();

      var elapsed = currentTime.getTime() - _this.startTime.getTime();

      _this.percent = _this.curImg.startPercentage + elapsed / _this.curImg.fadeDuration;

      _this._foregroundContext.save();

      _this._foregroundContext.clearRect(0, 0, _this.width, _this.height);

      var fadeWidth = _this.curImg.fadeWidth;

      switch (_this.curImg.fadeType) {
        case "cross-lr":
          {
            var gradient = _this._foregroundContext.createLinearGradient((_this.percent * (1 + fadeWidth) - fadeWidth) * _this.width, 0, (_this.percent * (1 + fadeWidth) + fadeWidth) * _this.width, 0);

            gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
            gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
            _this._foregroundContext.fillStyle = gradient;

            _this._foregroundContext.fillRect(0, 0, _this.width, _this.height);

            break;
          }

        case "cross-rl":
          {
            var _gradient = _this._foregroundContext.createLinearGradient(((1 - _this.percent) * (1 + fadeWidth) + fadeWidth) * _this.width, 0, ((1 - _this.percent) * (1 + fadeWidth) - fadeWidth) * _this.width, 0);

            _gradient.addColorStop(0.0, 'rgba(0,0,0,1)');

            _gradient.addColorStop(1.0, 'rgba(0,0,0,0)');

            _this._foregroundContext.fillStyle = _gradient;

            _this._foregroundContext.fillRect(0, 0, _this.width, _this.height);

            break;
          }

        case "cross-ud":
          {
            var _gradient2 = _this._foregroundContext.createLinearGradient(0, (_this.percent * (1 + fadeWidth) - fadeWidth) * _this.width, 0, (_this.percent * (1 + fadeWidth) + fadeWidth) * _this.width);

            _gradient2.addColorStop(0.0, 'rgba(0,0,0,1)');

            _gradient2.addColorStop(1.0, 'rgba(0,0,0,0)');

            _this._foregroundContext.fillStyle = _gradient2;

            _this._foregroundContext.fillRect(0, 0, _this.width, _this.height);

            break;
          }

        case "cross-du":
          {
            var _gradient3 = _this._foregroundContext.createLinearGradient(0, ((1 - _this.percent) * (1 + fadeWidth) + fadeWidth) * _this.width, 0, ((1 - _this.percent) * (1 + fadeWidth) - fadeWidth) * _this.width);

            _gradient3.addColorStop(0.0, 'rgba(0,0,0,1)');

            _gradient3.addColorStop(1.0, 'rgba(0,0,0,0)');

            _this._foregroundContext.fillStyle = _gradient3;

            _this._foregroundContext.fillRect(0, 0, _this.width, _this.height);

            break;
          }

        case "diagonal-tl-br":
          {
            // DS: This diagonal not working properly
            var _gradient4 = _this._foregroundContext.createLinearGradient((_this.percent * (2 + fadeWidth) - fadeWidth) * _this.width, 0, (_this.percent * (2 + fadeWidth) + fadeWidth) * _this.width, fadeWidth * (_this.width / (_this.height / 2)) * _this.width);

            _gradient4.addColorStop(0.0, 'rgba(0,0,0,1)');

            _gradient4.addColorStop(1.0, 'rgba(0,0,0,0)');

            _this._foregroundContext.fillStyle = _gradient4;

            _this._foregroundContext.fillRect(0, 0, _this.width, _this.height);

            break;
          }

        case "diagonal-tr-bl":
          {
            var _gradient5 = _this._foregroundContext.createLinearGradient((_this.percent * (1 + fadeWidth) - fadeWidth) * _this.width, 0, (_this.percent * (1 + fadeWidth) + fadeWidth) * _this.width + _this.width, _this.height);

            _gradient5.addColorStop(0.0, 'rgba(0,0,0,1)');

            _gradient5.addColorStop(1.0, 'rgba(0,0,0,0)');

            _this._foregroundContext.fillStyle = _gradient5;

            _this._foregroundContext.fillRect(0, 0, _this.width, _this.height);

            break;
          }

        case "radial-btm":
          {
            var segments = 300; // the amount of segments to split the semi circle into, DS: adjust this for performance

            var len = Math.PI / segments;
            var step = 1 / segments; // expand percent to cover fadeWidth

            var adjustedPercent = _this.percent * (1 + fadeWidth) - fadeWidth; // iterate a percent

            for (var prct = -fadeWidth; prct < 1 + fadeWidth; prct += step) {
              // convert percent to angle
              var angle = prct * Math.PI; // calculate coordinates for wedge

              var x1 = Math.cos(angle + Math.PI) * (_this.height * 2) + _this.width / 2;

              var y1 = Math.sin(angle + Math.PI) * (_this.height * 2) + _this.height;

              var x2 = Math.cos(angle + len + Math.PI) * (_this.height * 2) + _this.width / 2;

              var y2 = Math.sin(angle + len + Math.PI) * (_this.height * 2) + _this.height; // calculate alpha for wedge


              var alpha = (adjustedPercent - prct + fadeWidth) / fadeWidth; // draw wedge

              _this._foregroundContext.beginPath();

              _this._foregroundContext.moveTo(_this.width / 2 - 2, _this.height);

              _this._foregroundContext.lineTo(x1, y1);

              _this._foregroundContext.lineTo(x2, y2);

              _this._foregroundContext.lineTo(_this.width / 2 + 2, _this.height);

              _this._foregroundContext.fillStyle = 'rgba(0,0,0,' + alpha + ')';

              _this._foregroundContext.fill();
            }

            break;
          }

        case "radial-top":
          {
            var _segments = 300; // the amount of segments to split the semi circle into, DS: adjust this for performance

            var _len = Math.PI / _segments;

            var _step = 1 / _segments; // expand percent to cover fadeWidth


            var _adjustedPercent = _this.percent * (1 + fadeWidth) - fadeWidth; // iterate a percent


            for (var percent = -fadeWidth; percent < 1 + fadeWidth; percent += _step) {
              // convert percent to angle
              var _angle = percent * Math.PI; // calculate coordinates for wedge


              var _x = Math.cos(_angle + _len + 2 * Math.PI) * (_this.height * 2) + _this.width / 2;

              var _y = Math.sin(_angle + _len + 2 * Math.PI) * (_this.height * 2);

              var _x2 = Math.cos(_angle + 2 * Math.PI) * (_this.height * 2) + _this.width / 2;

              var _y2 = Math.sin(_angle + 2 * Math.PI) * (_this.height * 2); // calculate alpha for wedge


              var _alpha = (_adjustedPercent - percent + fadeWidth) / fadeWidth; // draw wedge


              _this._foregroundContext.beginPath();

              _this._foregroundContext.moveTo(_this.width / 2 - 2, 0);

              _this._foregroundContext.lineTo(_x, _y);

              _this._foregroundContext.lineTo(_x2, _y2);

              _this._foregroundContext.lineTo(_this.width / 2 + 2, 0);

              _this._foregroundContext.fillStyle = 'rgba(0,0,0,' + _alpha + ')';

              _this._foregroundContext.fill();
            }

            break;
          }

        case "radial-out":
        case "radial-in":
          {
            var _percent = _this.curImg.fadeType === "radial-in" ? 1 - _this.percent : _this.percent;

            var width = 100;
            var endState = 0.01;
            var innerRadius = _percent * _this.height - width < 0 ? endState : _percent * _this.height - width;
            var outerRadius = _percent * _this.height + width;
            /*if (this.curImg.fadeType === "radial-in"){
                console.table({"percent": percent,"innerRadius": innerRadius, "outerRadius": outerRadius })
            }*/

            var _gradient6 = _this._foregroundContext.createRadialGradient(_this.width / 2, _this.height / 2, innerRadius, _this.width / 2, _this.height / 2, outerRadius);

            if (_this.curImg.fadeType === "radial-in") {
              _gradient6.addColorStop(1.0, 'rgba(0,0,0,1)');

              _gradient6.addColorStop(0.0, 'rgba(0,0,0,0)');
            } else {
              _gradient6.addColorStop(0.0, 'rgba(0,0,0,1)');

              _gradient6.addColorStop(1.0, 'rgba(0,0,0,0)');
            }

            _this._foregroundContext.fillStyle = _gradient6;

            _this._foregroundContext.fillRect(0, 0, _this.width, _this.height);

            break;
          }

        default:
          break;
      }

      _this._foregroundContext.globalCompositeOperation = "source-in";

      _this._draw(_this.nxtImg, _this._foregroundContext);

      _this._foregroundContext.restore();

      if (elapsed < _this.curImg.fadeDuration) window.requestAnimationFrame(_this.redraw);else if (_this.mode === Mode.AUTO) if (_this.loop || _this.currentIdx < _this.imageArray.length - 1) _this.nextFadeTimer = setTimeout(_this.nextFade, _this.curImg.fadeDelay);
    });

    var images = Array.from(this.banner.querySelectorAll("img"));
    this.imageArray = images.map(function (img) {
      var aspect = img.width / img.height;
      var fadeDuration = img.hasAttribute("data-fadeDuration") ? Number(img.getAttribute("data-fadeDuration")) * 1000 : 1000;
      var fadeDelay = img.hasAttribute("data-fadeDelay") ? Number(img.getAttribute("data-fadeDelay")) * 1000 : 1000;
      var fadeType = img.hasAttribute("data-fadeType") ? img.getAttribute("data-fadeType") : "cross-lr";
      var fadeWidth = img.hasAttribute("data-fadeWidth") ? Number(img.getAttribute("data-fadeWidth")) : .1;
      var startPercentage = img.hasAttribute("data-startAt") ? Number(img.getAttribute("data-startAt")) : 0;
      var noResize = img.hasAttribute("data-no-resize");
      return {
        img: img,
        aspect: aspect,
        fadeDuration: fadeDuration,
        fadeDelay: fadeDelay,
        fadeType: fadeType,
        fadeWidth: fadeWidth,
        startPercentage: startPercentage,
        noResize: noResize
      };
    });
    this.banner.appendChild(this._backCanvas);
    this.banner.appendChild(this._foreCanvas);

    var backContext = this._backCanvas.getContext("2d");

    var foreContext = this._foreCanvas.getContext("2d");

    if (backContext === null || foreContext === null) throw Error("2d context not supported");
    this._backContext = backContext;
    this._foregroundContext = foreContext;
    window.addEventListener('resize', this.resize);
  }

  _createClass(SWWipe, [{
    key: "_draw",
    value: function _draw(i, ctx) {
      if (i.noResize) {
        var h = i.img.height;
        var w = i.img.width;
        ctx.drawImage(i.img, this.width / 2 - w / 2, this.height / 2 - h / 2, w, h);
      } else if (this.aspect > i.aspect) {
        ctx.drawImage(i.img, 0, (this.height - this.width / i.aspect) / 2, this.width, this.width / i.aspect);
      } else {
        ctx.drawImage(i.img, (this.width - this.height * i.aspect) / 2, 0, this.height * i.aspect, this.height);
      }
    }
  }, {
    key: "resize",
    value: function resize() {
      this.width = window.innerWidth;
      this.height = document.documentElement.clientHeight; // DS: fix for iOS 9 bug

      this.aspect = this.width / this.height;
      this._backContext.canvas.width = this.width;
      this._backContext.canvas.height = this.height;
      this._foregroundContext.canvas.width = this.width;
      this._foregroundContext.canvas.height = this.height;
      this.drawImage();
    }
  }, {
    key: "drawImage",
    value: function drawImage() {
      if (this.curImg) {
        this._draw(this.curImg, this._backContext);
      } else {
        throw Error("no image " + this.currentIdx + " " + this.imageArray.length);
      }
    }
  }, {
    key: "start",
    value: function start() {
      this.currentIdx = -1;
      this.nextFade();
      this.resize();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.nextFadeTimer && clearTimeout(this.nextFadeTimer);
    }
  }, {
    key: "next",
    value: function next() {
      if (this.mode !== Mode.MULTI_SECTION) throw Error("This swwipe operates in AUTO mode");
      this.nextFade();
    }
  }, {
    key: "numberOfFades",
    get: function get() {
      return this.imageArray.length;
    }
  }]);

  return SWWipe;
}();

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".banner").forEach(function (b) {
      var mode = b.hasAttribute("data-multi-swipe") ? Mode.MULTI_SECTION : Mode.AUTO;
      var noLoop = b.hasAttribute("data-no-loop");
      var owner = b.closest("section");
      if (!owner) throw Error("banner element not part of a section");
      var wipe = new SWWipe(b, owner, mode, !noLoop); // @ts-ignore

      b.sswipe = wipe;
    });
    Reveal.addEventListener("slidechanged", function (e) {
      var _e$previousSlide;

      var prevBanner = (_e$previousSlide = e.previousSlide) === null || _e$previousSlide === void 0 ? void 0 : _e$previousSlide.querySelector(".banner");

      if (prevBanner) {
        var wipe = prevBanner.sswipe;
        if (wipe.mode === Mode.AUTO) wipe.stop();else {
          var ownerIndex = Reveal.getIndices(wipe.owner);
          var currentIndex = Reveal.getIndices(e.currentSlide);
          var distance = e.currentSlide.indexV ? currentIndex.v - (ownerIndex.v || 0) : currentIndex.h - ownerIndex.h;
          console.log(distance);

          if (distance > 0 && distance < wipe.numberOfFades) {
            e.currentSlide.appendChild(wipe.banner);
          } else {
            wipe.stop();
            wipe.owner.appendChild(wipe.banner);
          }
        }
      }

      var nextBanner = e.currentSlide.querySelector(".banner");

      if (nextBanner) {
        var sswipe = nextBanner.sswipe;
        if (sswipe.mode === Mode.AUTO || sswipe.owner === e.currentSlide) sswipe.start();else sswipe.next();
      }
    });
  });
})(); // `closest` Polyfill for IE


if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;

    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy1zd3dpcGUudHMiXSwibmFtZXMiOlsiTW9kZSIsIlNXV2lwZSIsImltYWdlQXJyYXkiLCJjdXJyZW50SWR4IiwibGVuZ3RoIiwiYmFubmVyIiwib3duZXIiLCJtb2RlIiwiQVVUTyIsImxvb3AiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJ3aWR0aCIsImhlaWdodCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIkRhdGUiLCJkcmF3SW1hZ2UiLCJfZm9yZWdyb3VuZENvbnRleHQiLCJjbGVhclJlY3QiLCJwZXJjZW50IiwiY3VySW1nIiwiZmFkZVdpZHRoIiwic3RhcnRUaW1lIiwicmVkcmF3IiwiY3VycmVudFRpbWUiLCJlbGFwc2VkIiwiZ2V0VGltZSIsInN0YXJ0UGVyY2VudGFnZSIsImZhZGVEdXJhdGlvbiIsInNhdmUiLCJmYWRlVHlwZSIsImdyYWRpZW50IiwiY3JlYXRlTGluZWFyR3JhZGllbnQiLCJhZGRDb2xvclN0b3AiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsInNlZ21lbnRzIiwibGVuIiwiTWF0aCIsIlBJIiwic3RlcCIsImFkanVzdGVkUGVyY2VudCIsInByY3QiLCJhbmdsZSIsIngxIiwiY29zIiwieTEiLCJzaW4iLCJ4MiIsInkyIiwiYWxwaGEiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJmaWxsIiwiZW5kU3RhdGUiLCJpbm5lclJhZGl1cyIsIm91dGVyUmFkaXVzIiwiY3JlYXRlUmFkaWFsR3JhZGllbnQiLCJnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24iLCJfZHJhdyIsIm54dEltZyIsInJlc3RvcmUiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJuZXh0RmFkZVRpbWVyIiwic2V0VGltZW91dCIsIm5leHRGYWRlIiwiZmFkZURlbGF5IiwiaW1hZ2VzIiwiQXJyYXkiLCJmcm9tIiwicXVlcnlTZWxlY3RvckFsbCIsIm1hcCIsImltZyIsImFzcGVjdCIsImhhc0F0dHJpYnV0ZSIsIk51bWJlciIsImdldEF0dHJpYnV0ZSIsIm5vUmVzaXplIiwiYXBwZW5kQ2hpbGQiLCJfYmFja0NhbnZhcyIsIl9mb3JlQ2FudmFzIiwiYmFja0NvbnRleHQiLCJnZXRDb250ZXh0IiwiZm9yZUNvbnRleHQiLCJFcnJvciIsIl9iYWNrQ29udGV4dCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZXNpemUiLCJpIiwiY3R4IiwiaCIsInciLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRIZWlnaHQiLCJjYW52YXMiLCJjbGVhclRpbWVvdXQiLCJNVUxUSV9TRUNUSU9OIiwiZm9yRWFjaCIsImIiLCJub0xvb3AiLCJjbG9zZXN0Iiwid2lwZSIsInNzd2lwZSIsIlJldmVhbCIsImUiLCJwcmV2QmFubmVyIiwicHJldmlvdXNTbGlkZSIsInF1ZXJ5U2VsZWN0b3IiLCJzdG9wIiwib3duZXJJbmRleCIsImdldEluZGljZXMiLCJjdXJyZW50SW5kZXgiLCJjdXJyZW50U2xpZGUiLCJkaXN0YW5jZSIsImluZGV4ViIsInYiLCJjb25zb2xlIiwibG9nIiwibnVtYmVyT2ZGYWRlcyIsIm5leHRCYW5uZXIiLCJzdGFydCIsIm5leHQiLCJFbGVtZW50IiwicHJvdG90eXBlIiwibWF0Y2hlcyIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwid2Via2l0TWF0Y2hlc1NlbGVjdG9yIiwicyIsImVsIiwiY2FsbCIsInBhcmVudEVsZW1lbnQiLCJwYXJlbnROb2RlIiwibm9kZVR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0lBZ0JLQSxJOztXQUFBQSxJO0FBQUFBLEVBQUFBLEksQ0FBQUEsSTtBQUFBQSxFQUFBQSxJLENBQUFBLEk7R0FBQUEsSSxLQUFBQSxJOztJQWVDQyxNOzs7OztBQUdvQztBQUNFO0FBQ007d0JBYVo7QUFDOUIsYUFBTyxLQUFLQyxVQUFMLENBQWdCLEtBQUtDLFVBQXJCLENBQVA7QUFDSDs7O3dCQUVpQztBQUM5QixhQUFPLEtBQUtELFVBQUwsQ0FBZ0IsQ0FB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NEIsVUFBVTJCLENBQVYsRUFBYTtBQUNyQyxRQUFJQyxFQUFFLEdBQUcsSUFBVDs7QUFFQSxPQUFHO0FBQ0MsVUFBSU4sT0FBTyxDQUFDQyxTQUFSLENBQWtCQyxPQUFsQixDQUEwQkssSUFBMUIsQ0FBK0JELEVBQS9CLEVBQW1DRCxDQUFuQyxDQUFKLEVBQTJDLE9BQU9DLEVBQVA7QUFDM0NBLE1BQUFBLEVBQUUsR0FBR0EsRUFBRSxDQUFDRSxhQUFILElBQW9CRixFQUFFLENBQUNHLFVBQTVCO0FBQ0gsS0FIRCxRQUdTSCxFQUFFLEtBQUssSUFBUCxJQUFlQSxFQUFFLENBQUNJLFFBQUgsS0FBZ0IsQ0FIeEM7O0FBSUEsV0FBTyxJQUFQO0FBQ0gsR0FSRDtBQVNIIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZlU2VpZG1hbi9TdGFyV2Fyc1dpcGVcblxuXHRUbyBEb1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Rml4IGRpYWdvbmFsIHdpcGVcblx0Zml4IHJhZGlhbCB3aXBlXG5cblxuV2VieWFybnMgdmVyc2lvbjpcbi0gQWRkZWQgXCJkZXN0cm95XCIgZmxhZyBhbmQgbWV0aG9kXG4tIEFkZGVkIHN1cHBvcnQgZm9yIGBkYXRhLXN0YXJ0QXRgIHRvIHNldCBzdGFydCBwZXJjZW50YWdlXG4tIG9uIGRlc3Ryb3kgcmVtb3ZlIGNyZWF0ZWQgZWxlbWVudHNcbiovXG5cbmVudW0gTW9kZSB7XG4gICAgQVVUTywgTVVMVElfU0VDVElPTlxufVxuXG5pbnRlcmZhY2UgSW1hZ2VPYmplY3Qge1xuICAgIHN0YXJ0UGVyY2VudGFnZTogbnVtYmVyO1xuICAgIGZhZGVXaWR0aDogbnVtYmVyO1xuICAgIGZhZGVUeXBlOiBzdHJpbmcgfCBudWxsO1xuICAgIGZhZGVEZWxheTogbnVtYmVyO1xuICAgIGZhZGVEdXJhdGlvbjogbnVtYmVyO1xuICAgIGFzcGVjdDogbnVtYmVyO1xuICAgIGltZzogSFRNTEltYWdlRWxlbWVudDtcbiAgICBub1Jlc2l6ZTogYm9vbGVhbjtcbn1cblxuY2xhc3MgU1dXaXBlIHtcblxuICAgIGN1cnJlbnRJZHggPSAtMTtcbiAgICB3aWR0aDogbnVtYmVyID0gd2luZG93LmlubmVyV2lkdGg7XHRcdFx0XHQvLyB3aWR0aCBvZiBjb250YWluZXIgKGJhbm5lcilcbiAgICBoZWlnaHQ6IG51bWJlciA9IHdpbmRvdy5pbm5lckhlaWdodDtcdFx0XHRcdC8vIGhlaWdodCBvZiBjb250YWluZXJcbiAgICBhc3BlY3Q6IG51bWJlciA9IHRoaXMud2lkdGggLyB0aGlzLmhlaWdodDtcdFx0XHRcdC8vIGFzcGVjdCByYXRpbyBvZiBjb250YWluZXJcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgaW1hZ2VBcnJheTogSW1hZ2VPYmplY3RbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9iYWNrQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZvcmVDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfYmFja0NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9mb3JlZ3JvdW5kQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgcHJpdmF0ZSBwZXJjZW50OiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgc3RhcnRUaW1lOiBEYXRlID0gbmV3IERhdGU7XG4gICAgcHJpdmF0ZSBuZXh0RmFkZVRpbWVyOiBOb2RlSlMuVGltZW91dCB8IG51bGwgPSBudWxsO1xuXG5cbiAgICBwcml2YXRlIGdldCBjdXJJbWcoKTogSW1hZ2VPYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZUFycmF5W3RoaXMuY3VycmVudElkeF07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgbnh0SW1nKCk6IEltYWdlT2JqZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VBcnJheVsodGhpcy5jdXJyZW50SWR4ICsgMSkgJSB0aGlzLmltYWdlQXJyYXkubGVuZ3RoXTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBiYW5uZXI6IEhUTUxFbGVtZW50LCByZWFkb25seSBvd25lcjogSFRNTEVsZW1lbnQsIHJlYWRvbmx5IG1vZGU6IE1vZGUgPSBNb2RlLkFVVE8sIHJlYWRvbmx5IGxvb3AgPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGltYWdlcyA9IEFycmF5LmZyb20odGhpcy5iYW5uZXIucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKSk7XG4gICAgICAgIHRoaXMuaW1hZ2VBcnJheSA9IGltYWdlcy5tYXAoaW1nID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFzcGVjdCA9IGltZy53aWR0aCAvIGltZy5oZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBmYWRlRHVyYXRpb24gPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1mYWRlRHVyYXRpb25cIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtZmFkZUR1cmF0aW9uXCIpKSAqIDEwMDAgOiAxMDAwO1xuICAgICAgICAgICAgY29uc3QgZmFkZURlbGF5ID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZURlbGF5XCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZhZGVEZWxheVwiKSkgKiAxMDAwIDogMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVUeXBlID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZVR5cGVcIikgPyBpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlVHlwZVwiKSA6IFwiY3Jvc3MtbHJcIjtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVXaWR0aCA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZhZGVXaWR0aFwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlV2lkdGhcIikpIDogLjE7XG4gICAgICAgICAgICBjb25zdCBzdGFydFBlcmNlbnRhZ2UgPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1zdGFydEF0XCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0YXJ0QXRcIikpIDogMDtcbiAgICAgICAgICAgIGNvbnN0IG5vUmVzaXplID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtbm8tcmVzaXplXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgYXNwZWN0LFxuICAgICAgICAgICAgICAgIGZhZGVEdXJhdGlvbixcbiAgICAgICAgICAgICAgICBmYWRlRGVsYXksXG4gICAgICAgICAgICAgICAgZmFkZVR5cGUsXG4gICAgICAgICAgICAgICAgZmFkZVdpZHRoLFxuICAgICAgICAgICAgICAgIHN0YXJ0UGVyY2VudGFnZSxcbiAgICAgICAgICAgICAgICBub1Jlc2l6ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuYmFubmVyLmFwcGVuZENoaWxkKHRoaXMuX2JhY2tDYW52YXMpO1xuICAgICAgICB0aGlzLmJhbm5lci5hcHBlbmRDaGlsZCh0aGlzLl9mb3JlQ2FudmFzKTtcbiAgICAgICAgY29uc3QgYmFja0NvbnRleHQgPSB0aGlzLl9iYWNrQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgICAgICBjb25zdCBmb3JlQ29udGV4dCA9IHRoaXMuX2ZvcmVDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICBpZiAoYmFja0NvbnRleHQgPT09IG51bGwgfHwgZm9yZUNvbnRleHQgPT09IG51bGwpIHRocm93IEVycm9yKFwiMmQgY29udGV4dCBub3Qgc3VwcG9ydGVkXCIpXG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0ID0gYmFja0NvbnRleHQ7XG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0ID0gZm9yZUNvbnRleHQ7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG5leHRGYWRlID0gKCkgPT4ge1xuICAgICAgICAvLyBhZHZhbmNlIGluZGljZXNcbiAgICAgICAgdGhpcy5jdXJyZW50SWR4ID0gKyt0aGlzLmN1cnJlbnRJZHggJSB0aGlzLmltYWdlQXJyYXkubGVuZ3RoO1xuICAgICAgICB0aGlzLmRyYXdJbWFnZSgpO1xuXG4gICAgICAgIC8vIGNsZWFyIHRoZSBmb3JlZ3JvdW5kXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgLy8gc2V0dXAgYW5kIHN0YXJ0IHRoZSBmYWRlXG4gICAgICAgIHRoaXMucGVyY2VudCA9IC10aGlzLmN1ckltZy5mYWRlV2lkdGg7XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGU7XG4gICAgICAgIHRoaXMucmVkcmF3KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWRyYXcgPSAoKSA9PiB7XG4gICAgICAgIC8vIGNhbGN1bGF0ZSBwZXJjZW50IGNvbXBsZXRpb24gb2Ygd2lwZVxuICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IG5ldyBEYXRlO1xuICAgICAgICBjb25zdCBlbGFwc2VkID0gY3VycmVudFRpbWUuZ2V0VGltZSgpIC0gdGhpcy5zdGFydFRpbWUuZ2V0VGltZSgpO1xuICAgICAgICB0aGlzLnBlcmNlbnQgPSB0aGlzLmN1ckltZy5zdGFydFBlcmNlbnRhZ2UgKyBlbGFwc2VkIC8gdGhpcy5jdXJJbWcuZmFkZUR1cmF0aW9uO1xuXG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuc2F2ZSgpO1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICBjb25zdCBmYWRlV2lkdGggPSB0aGlzLmN1ckltZy5mYWRlV2lkdGhcblxuICAgICAgICBzd2l0Y2ggKHRoaXMuY3VySW1nLmZhZGVUeXBlKSB7XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1sclwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDApO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1ybFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDApO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy11ZFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgMCwgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAwLCAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1kdVwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgMCwgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAwLCAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJkaWFnb25hbC10bC1iclwiOiB7Ly8gRFM6IFRoaXMgZGlhZ29uYWwgbm90IHdvcmtpbmcgcHJvcGVybHlcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMiArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgyICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCBmYWRlV2lkdGggKiAodGhpcy53aWR0aCAvICh0aGlzLmhlaWdodCAvIDIpKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImRpYWdvbmFsLXRyLWJsXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDAsXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCArIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtYnRtXCI6IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzID0gMzAwOyAvLyB0aGUgYW1vdW50IG9mIHNlZ21lbnRzIHRvIHNwbGl0IHRoZSBzZW1pIGNpcmNsZSBpbnRvLCBEUzogYWRqdXN0IHRoaXMgZm9yIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSAxIC8gc2VnbWVudHM7XG5cbiAgICAgICAgICAgICAgICAvLyBleHBhbmQgcGVyY2VudCB0byBjb3ZlciBmYWRlV2lkdGhcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFBlcmNlbnQgPSB0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIGEgcGVyY2VudFxuICAgICAgICAgICAgICAgIGZvciAobGV0IHByY3QgPSAtZmFkZVdpZHRoOyBwcmN0IDwgMSArIGZhZGVXaWR0aDsgcHJjdCArPSBzdGVwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCBwZXJjZW50IHRvIGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gcHJjdCAqIE1hdGguUEk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGNvb3JkaW5hdGVzIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MSA9IE1hdGguY29zKGFuZ2xlICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MSA9IE1hdGguc2luKGFuZ2xlICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MiA9IE1hdGguY29zKGFuZ2xlICsgbGVuICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MiA9IE1hdGguc2luKGFuZ2xlICsgbGVuICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBhbHBoYSBmb3Igd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxwaGEgPSAoYWRqdXN0ZWRQZXJjZW50IC0gcHJjdCArIGZhZGVXaWR0aCkgLyBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZHJhdyB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubW92ZVRvKHRoaXMud2lkdGggLyAyIC0gMiwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8oeDEsIHkxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgyLCB5Mik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh0aGlzLndpZHRoIC8gMiArIDIsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsJyArIGFscGhhICsgJyknO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtdG9wXCI6IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzID0gMzAwOyAvLyB0aGUgYW1vdW50IG9mIHNlZ21lbnRzIHRvIHNwbGl0IHRoZSBzZW1pIGNpcmNsZSBpbnRvLCBEUzogYWRqdXN0IHRoaXMgZm9yIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSAxIC8gc2VnbWVudHM7XG5cbiAgICAgICAgICAgICAgICAvLyBleHBhbmQgcGVyY2VudCB0byBjb3ZlciBmYWRlV2lkdGhcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFBlcmNlbnQgPSB0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIGEgcGVyY2VudFxuICAgICAgICAgICAgICAgIGZvciAobGV0IHBlcmNlbnQgPSAtZmFkZVdpZHRoOyBwZXJjZW50IDwgMSArIGZhZGVXaWR0aDsgcGVyY2VudCArPSBzdGVwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCBwZXJjZW50IHRvIGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gcGVyY2VudCAqIE1hdGguUEk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGNvb3JkaW5hdGVzIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MSA9IE1hdGguY29zKGFuZ2xlICsgbGVuICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTEgPSBNYXRoLnNpbihhbmdsZSArIGxlbiArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MiA9IE1hdGguY29zKGFuZ2xlICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTIgPSBNYXRoLnNpbihhbmdsZSArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGFscGhhIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbHBoYSA9IChhZGp1c3RlZFBlcmNlbnQgLSBwZXJjZW50ICsgZmFkZVdpZHRoKSAvIGZhZGVXaWR0aDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBkcmF3IHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5tb3ZlVG8odGhpcy53aWR0aCAvIDIgLSAyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgxLCB5MSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh4MiwgeTIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8odGhpcy53aWR0aCAvIDIgKyAyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsJyArIGFscGhhICsgJyknO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtb3V0XCI6XG4gICAgICAgICAgICBjYXNlIFwicmFkaWFsLWluXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwZXJjZW50ID0gdGhpcy5jdXJJbWcuZmFkZVR5cGUgPT09IFwicmFkaWFsLWluXCIgPyAgKDEgLSB0aGlzLnBlcmNlbnQpIDogdGhpcy5wZXJjZW50XG4gICAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSAxMDA7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kU3RhdGUgPSAgMC4wMVxuICAgICAgICAgICAgICAgIGNvbnN0IGlubmVyUmFkaXVzID0gKHBlcmNlbnQpICogdGhpcy5oZWlnaHQgLSB3aWR0aCA8IDAgPyBlbmRTdGF0ZSA6IChwZXJjZW50KSAqIHRoaXMuaGVpZ2h0IC0gd2lkdGg7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0ZXJSYWRpdXMgPSBwZXJjZW50ICogdGhpcy5oZWlnaHQgKyB3aWR0aFxuICAgICAgICAgICAgICAgIC8qaWYgKHRoaXMuY3VySW1nLmZhZGVUeXBlID09PSBcInJhZGlhbC1pblwiKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS50YWJsZSh7XCJwZXJjZW50XCI6IHBlcmNlbnQsXCJpbm5lclJhZGl1c1wiOiBpbm5lclJhZGl1cywgXCJvdXRlclJhZGl1c1wiOiBvdXRlclJhZGl1cyB9KVxuICAgICAgICAgICAgICAgIH0qL1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIDIsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0IC8gMiwgaW5uZXJSYWRpdXMsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyAyLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAvIDIsIG91dGVyUmFkaXVzKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJJbWcuZmFkZVR5cGUgPT09IFwicmFkaWFsLWluXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJzb3VyY2UtaW5cIjtcbiAgICAgICAgdGhpcy5fZHJhdyh0aGlzLm54dEltZywgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQpXG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQucmVzdG9yZSgpO1xuXG5cbiAgICAgICAgaWYgKGVsYXBzZWQgPCB0aGlzLmN1ckltZy5mYWRlRHVyYXRpb24pXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVkcmF3KTtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5tb2RlID09PSBNb2RlLkFVVE8pXG4gICAgICAgICAgICBpZiAodGhpcy5sb29wIHx8IHRoaXMuY3VycmVudElkeCA8IHRoaXMuaW1hZ2VBcnJheS5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICAgIHRoaXMubmV4dEZhZGVUaW1lciA9IHNldFRpbWVvdXQodGhpcy5uZXh0RmFkZSwgdGhpcy5jdXJJbWcuZmFkZURlbGF5KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9kcmF3KGk6IEltYWdlT2JqZWN0LCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCl7XG4gICAgICAgIGlmIChpLm5vUmVzaXplKSB7XG4gICAgICAgICAgICBjb25zdCBoID0gaS5pbWcuaGVpZ2h0XG4gICAgICAgICAgICBjb25zdCB3ID0gaS5pbWcud2lkdGhcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoXG4gICAgICAgICAgICAgICAgaS5pbWcsXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIDIgLSB3IC8gMixcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAvMiAtIGggLyAyLFxuICAgICAgICAgICAgICAgIHcsIGgpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hc3BlY3QgPiBpLmFzcGVjdCkge1xuXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKGkuaW1nLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgKHRoaXMuaGVpZ2h0IC0gdGhpcy53aWR0aCAvIGkuYXNwZWN0KSAvIDIsXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoIC8gaS5hc3BlY3QpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKGkuaW1nLFxuICAgICAgICAgICAgICAgICh0aGlzLndpZHRoIC0gdGhpcy5oZWlnaHQgKiBpLmFzcGVjdCkgLyAyLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgKiBpLmFzcGVjdCxcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByaXZhdGUgcmVzaXplKCkge1xuXG4gICAgICAgIHRoaXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyAvLyBEUzogZml4IGZvciBpT1MgOSBidWdcbiAgICAgICAgdGhpcy5hc3BlY3QgPSB0aGlzLndpZHRoIC8gdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5fYmFja0NvbnRleHQuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5fYmFja0NvbnRleHQuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuICAgICAgICB0aGlzLmRyYXdJbWFnZSgpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGRyYXdJbWFnZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VySW1nKSB7XG4gICAgICAgICAgICB0aGlzLl9kcmF3KHRoaXMuY3VySW1nLCB0aGlzLl9iYWNrQ29udGV4dClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwibm8gaW1hZ2UgXCIgKyB0aGlzLmN1cnJlbnRJZHggKyBcIiBcIiArIHRoaXMuaW1hZ2VBcnJheS5sZW5ndGgpXG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRJZHggPSAtMVxuICAgICAgICB0aGlzLm5leHRGYWRlKCk7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5uZXh0RmFkZVRpbWVyICYmIGNsZWFyVGltZW91dCh0aGlzLm5leHRGYWRlVGltZXIpXG4gICAgfVxuXG4gICAgbmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMubW9kZSAhPT0gTW9kZS5NVUxUSV9TRUNUSU9OKVxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJUaGlzIHN3d2lwZSBvcGVyYXRlcyBpbiBBVVRPIG1vZGVcIilcbiAgICAgICAgdGhpcy5uZXh0RmFkZSgpXG4gICAgfVxuXG5cbiAgICBnZXQgbnVtYmVyT2ZGYWRlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VBcnJheS5sZW5ndGhcbiAgICB9XG59XG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmJhbm5lclwiKS5mb3JFYWNoKGIgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZTogTW9kZSA9IGIuaGFzQXR0cmlidXRlKFwiZGF0YS1tdWx0aS1zd2lwZVwiKSA/IE1vZGUuTVVMVElfU0VDVElPTiA6IE1vZGUuQVVUT1xuICAgICAgICAgICAgY29uc3Qgbm9Mb29wOiBib29sZWFuID0gYi5oYXNBdHRyaWJ1dGUoXCJkYXRhLW5vLWxvb3BcIilcbiAgICAgICAgICAgIGNvbnN0IG93bmVyID0gYi5jbG9zZXN0KFwic2VjdGlvblwiKVxuICAgICAgICAgICAgaWYgKCFvd25lcikgdGhyb3cgRXJyb3IoXCJiYW5uZXIgZWxlbWVudCBub3QgcGFydCBvZiBhIHNlY3Rpb25cIilcbiAgICAgICAgICAgIGNvbnN0IHdpcGUgPSBuZXcgU1dXaXBlKGIsIG93bmVyLCBtb2RlLCAhbm9Mb29wKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGIuc3N3aXBlID0gd2lwZTtcbiAgICAgICAgfSlcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihcInNsaWRlY2hhbmdlZFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJldkJhbm5lciA9IGUucHJldmlvdXNTbGlkZT8ucXVlcnlTZWxlY3RvcihcIi5iYW5uZXJcIik7XG4gICAgICAgICAgICBpZiAocHJldkJhbm5lcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdpcGUgPSBwcmV2QmFubmVyLnNzd2lwZSBhcyBTV1dpcGU7XG4gICAgICAgICAgICAgICAgaWYgKHdpcGUubW9kZSA9PT0gTW9kZS5BVVRPKVxuICAgICAgICAgICAgICAgICAgICB3aXBlLnN0b3AoKTtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3duZXJJbmRleDogeyBoOiBudW1iZXI7IHY6IG51bWJlcjsgfSA9IFJldmVhbC5nZXRJbmRpY2VzKHdpcGUub3duZXIpXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleDogeyBoOiBudW1iZXI7IHY6IG51bWJlcjsgfSA9IFJldmVhbC5nZXRJbmRpY2VzKGUuY3VycmVudFNsaWRlKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IGUuY3VycmVudFNsaWRlLmluZGV4ViA/XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXgudiAtIChvd25lckluZGV4LnYgfHwgMCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4LmggLSBvd25lckluZGV4LmhcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPiAwICYmIGRpc3RhbmNlIDwgd2lwZS5udW1iZXJPZkZhZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLmN1cnJlbnRTbGlkZS5hcHBlbmRDaGlsZCh3aXBlLmJhbm5lcilcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpcGUuc3RvcCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB3aXBlLm93bmVyLmFwcGVuZENoaWxkKHdpcGUuYmFubmVyKVxuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5leHRCYW5uZXIgPSBlLmN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yKFwiLmJhbm5lclwiKTtcbiAgICAgICAgICAgIGlmIChuZXh0QmFubmVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNzd2lwZSA9IG5leHRCYW5uZXIuc3N3aXBlIGFzIFNXV2lwZTtcbiAgICAgICAgICAgICAgICBpZiAoc3N3aXBlLm1vZGUgPT09IE1vZGUuQVVUTyB8fCBzc3dpcGUub3duZXIgPT09IGUuY3VycmVudFNsaWRlKVxuICAgICAgICAgICAgICAgICAgICBzc3dpcGUuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHNzd2lwZS5uZXh0KCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9KVxuXG5cbn0pKClcblxuLy8gYGNsb3Nlc3RgIFBvbHlmaWxsIGZvciBJRVxuXG5pZiAoIUVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMpIHtcbiAgICBFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzID1cbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yO1xufVxuXG5pZiAoIUVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QpIHtcbiAgICBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0ID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgdmFyIGVsID0gdGhpcztcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBpZiAoRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcy5jYWxsKGVsLCBzKSkgcmV0dXJuIGVsO1xuICAgICAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50IHx8IGVsLnBhcmVudE5vZGU7XG4gICAgICAgIH0gd2hpbGUgKGVsICE9PSBudWxsICYmIGVsLm5vZGVUeXBlID09PSAxKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbn1cblxuIl19