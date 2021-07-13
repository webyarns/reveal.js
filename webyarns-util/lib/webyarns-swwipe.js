"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*

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

            var innerRadius = _percent * _this.height - 100 < 0 ? .01 : _percent * _this.height - 100;
            var outerRadius = _percent * _this.height + 100;

            var _gradient6 = _this._foregroundContext.createRadialGradient(_this.width / 2, _this.height / 2, innerRadius, _this.width / 2, _this.height / 2, outerRadius);

            _gradient6.addColorStop(0.0, 'rgba(0,0,0,1)');

            _gradient6.addColorStop(1.0, 'rgba(0,0,0,0)');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy1zd3dpcGUudHMiXSwibmFtZXMiOlsiTW9kZSIsIlNXV2lwZSIsImltYWdlQXJyYXkiLCJjdXJyZW50SWR4IiwibGVuZ3RoIiwiYmFubmVyIiwib3duZXIiLCJtb2RlIiwiQVVUTyIsImxvb3AiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJ3aWR0aCIsImhlaWdodCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIkRhdGUiLCJkcmF3SW1hZ2UiLCJfZm9yZWdyb3VuZENvbnRleHQiLCJjbGVhclJlY3QiLCJwZXJjZW50IiwiY3VySW1nIiwiZmFkZVdpZHRoIiwic3RhcnRUaW1lIiwicmVkcmF3IiwiY3VycmVudFRpbWUiLCJlbGFwc2VkIiwiZ2V0VGltZSIsInN0YXJ0UGVyY2VudGFnZSIsImZhZGVEdXJhdGlvbiIsInNhdmUiLCJmYWRlVHlwZSIsImdyYWRpZW50IiwiY3JlYXRlTGluZWFyR3JhZGllbnQiLCJhZGRDb2xvclN0b3AiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsInNlZ21lbnRzIiwibGVuIiwiTWF0aCIsIlBJIiwic3RlcCIsImFkanVzdGVkUGVyY2VudCIsInByY3QiLCJhbmdsZSIsIngxIiwiY29zIiwieTEiLCJzaW4iLCJ4MiIsInkyIiwiYWxwaGEiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJmaWxsIiwiaW5uZXJSYWRpdXMiLCJvdXRlclJhZGl1cyIsImNyZWF0ZVJhZGlhbEdyYWRpZW50IiwiZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uIiwiX2RyYXciLCJueHRJbWciLCJyZXN0b3JlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibmV4dEZhZGVUaW1lciIsInNldFRpbWVvdXQiLCJuZXh0RmFkZSIsImZhZGVEZWxheSIsImltYWdlcyIsIkFycmF5IiwiZnJvbSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJtYXAiLCJpbWciLCJhc3BlY3QiLCJoYXNBdHRyaWJ1dGUiLCJOdW1iZXIiLCJnZXRBdHRyaWJ1dGUiLCJub1Jlc2l6ZSIsImFwcGVuZENoaWxkIiwiX2JhY2tDYW52YXMiLCJfZm9yZUNhbnZhcyIsImJhY2tDb250ZXh0IiwiZ2V0Q29udGV4dCIsImZvcmVDb250ZXh0IiwiRXJyb3IiLCJfYmFja0NvbnRleHQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVzaXplIiwiaSIsImN0eCIsImgiLCJ3IiwiZG9jdW1lbnRFbGVtZW50IiwiY2xpZW50SGVpZ2h0IiwiY2FudmFzIiwiY2xlYXJUaW1lb3V0IiwiTVVMVElfU0VDVElPTiIsImZvckVhY2giLCJiIiwibm9Mb29wIiwiY2xvc2VzdCIsIndpcGUiLCJzc3dpcGUiLCJSZXZlYWwiLCJlIiwicHJldkJhbm5lciIsInByZXZpb3VzU2xpZGUiLCJxdWVyeVNlbGVjdG9yIiwic3RvcCIsIm93bmVySW5kZXgiLCJnZXRJbmRpY2VzIiwiY3VycmVudEluZGV4IiwiY3VycmVudFNsaWRlIiwiZGlzdGFuY2UiLCJpbmRleFYiLCJ2IiwiY29uc29sZSIsImxvZyIsIm51bWJlck9mRmFkZXMiLCJuZXh0QmFubmVyIiwic3RhcnQiLCJuZXh0IiwiRWxlbWVudCIsInByb3RvdHlwZSIsIm1hdGNoZXMiLCJtc01hdGNoZXNTZWxlY3RvciIsIndlYmtpdE1hdGNoZXNTZWxlY3RvciIsInMiLCJlbCIsImNhbGwiLCJwYXJlbnRFbGVtZW50IiwicGFyZW50Tm9kZSIsIm5vZGVUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7SUFjS0EsSTs7V0FBQUEsSTtBQUFBQSxFQUFBQSxJLENBQUFBLEk7QUFBQUEsRUFBQUEsSSxDQUFBQSxJO0dBQUFBLEksS0FBQUEsSTs7SUFlQ0MsTTs7Ozs7QUFHb0M7QUFDRTtBQUNNO3dCQWFaO0FBQzlCLGFBQU8sS0FBS0MsVUFBTCxDQUFnQixLQUFLQyxVQUFyQixDQUFQO0FBQ0g7Ozt3QkFFaUM7QUFDOUIsYUFBTyxLQUFLRCxVQUFMLENBQWdCLENBQUMsS0FBS0MsVUFBTCxH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UCxJQUFlQSxFQUFFLENBQUNJLFFBQUgsS0FBZ0IsQ0FIeEM7O0FBSUEsV0FBTyxJQUFQO0FBQ0gsR0FSRDtBQVNIIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuXHRUbyBEb1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Rml4IGRpYWdvbmFsIHdpcGVcblx0Zml4IHJhZGlhbCB3aXBlXG5cblxuV2VieWFybnMgdmVyc2lvbjpcbi0gQWRkZWQgXCJkZXN0cm95XCIgZmxhZyBhbmQgbWV0aG9kXG4tIEFkZGVkIHN1cHBvcnQgZm9yIGBkYXRhLXN0YXJ0QXRgIHRvIHNldCBzdGFydCBwZXJjZW50YWdlXG4tIG9uIGRlc3Ryb3kgcmVtb3ZlIGNyZWF0ZWQgZWxlbWVudHNcbiovXG5cbmVudW0gTW9kZSB7XG4gICAgQVVUTywgTVVMVElfU0VDVElPTlxufVxuXG5pbnRlcmZhY2UgSW1hZ2VPYmplY3Qge1xuICAgIHN0YXJ0UGVyY2VudGFnZTogbnVtYmVyO1xuICAgIGZhZGVXaWR0aDogbnVtYmVyO1xuICAgIGZhZGVUeXBlOiBzdHJpbmcgfCBudWxsO1xuICAgIGZhZGVEZWxheTogbnVtYmVyO1xuICAgIGZhZGVEdXJhdGlvbjogbnVtYmVyO1xuICAgIGFzcGVjdDogbnVtYmVyO1xuICAgIGltZzogSFRNTEltYWdlRWxlbWVudDtcbiAgICBub1Jlc2l6ZTogYm9vbGVhbjtcbn1cblxuY2xhc3MgU1dXaXBlIHtcblxuICAgIGN1cnJlbnRJZHggPSAtMTtcbiAgICB3aWR0aDogbnVtYmVyID0gd2luZG93LmlubmVyV2lkdGg7XHRcdFx0XHQvLyB3aWR0aCBvZiBjb250YWluZXIgKGJhbm5lcilcbiAgICBoZWlnaHQ6IG51bWJlciA9IHdpbmRvdy5pbm5lckhlaWdodDtcdFx0XHRcdC8vIGhlaWdodCBvZiBjb250YWluZXJcbiAgICBhc3BlY3Q6IG51bWJlciA9IHRoaXMud2lkdGggLyB0aGlzLmhlaWdodDtcdFx0XHRcdC8vIGFzcGVjdCByYXRpbyBvZiBjb250YWluZXJcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgaW1hZ2VBcnJheTogSW1hZ2VPYmplY3RbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9iYWNrQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZvcmVDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfYmFja0NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9mb3JlZ3JvdW5kQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgcHJpdmF0ZSBwZXJjZW50OiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgc3RhcnRUaW1lOiBEYXRlID0gbmV3IERhdGU7XG4gICAgcHJpdmF0ZSBuZXh0RmFkZVRpbWVyOiBOb2RlSlMuVGltZW91dCB8IG51bGwgPSBudWxsO1xuXG5cbiAgICBwcml2YXRlIGdldCBjdXJJbWcoKTogSW1hZ2VPYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZUFycmF5W3RoaXMuY3VycmVudElkeF07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgbnh0SW1nKCk6IEltYWdlT2JqZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VBcnJheVsodGhpcy5jdXJyZW50SWR4ICsgMSkgJSB0aGlzLmltYWdlQXJyYXkubGVuZ3RoXTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBiYW5uZXI6IEhUTUxFbGVtZW50LCByZWFkb25seSBvd25lcjogSFRNTEVsZW1lbnQsIHJlYWRvbmx5IG1vZGU6IE1vZGUgPSBNb2RlLkFVVE8sIHJlYWRvbmx5IGxvb3AgPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGltYWdlcyA9IEFycmF5LmZyb20odGhpcy5iYW5uZXIucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKSk7XG4gICAgICAgIHRoaXMuaW1hZ2VBcnJheSA9IGltYWdlcy5tYXAoaW1nID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFzcGVjdCA9IGltZy53aWR0aCAvIGltZy5oZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBmYWRlRHVyYXRpb24gPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1mYWRlRHVyYXRpb25cIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtZmFkZUR1cmF0aW9uXCIpKSAqIDEwMDAgOiAxMDAwO1xuICAgICAgICAgICAgY29uc3QgZmFkZURlbGF5ID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZURlbGF5XCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZhZGVEZWxheVwiKSkgKiAxMDAwIDogMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVUeXBlID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZVR5cGVcIikgPyBpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlVHlwZVwiKSA6IFwiY3Jvc3MtbHJcIjtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVXaWR0aCA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZhZGVXaWR0aFwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlV2lkdGhcIikpIDogLjE7XG4gICAgICAgICAgICBjb25zdCBzdGFydFBlcmNlbnRhZ2UgPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1zdGFydEF0XCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0YXJ0QXRcIikpIDogMDtcbiAgICAgICAgICAgIGNvbnN0IG5vUmVzaXplID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtbm8tcmVzaXplXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgYXNwZWN0LFxuICAgICAgICAgICAgICAgIGZhZGVEdXJhdGlvbixcbiAgICAgICAgICAgICAgICBmYWRlRGVsYXksXG4gICAgICAgICAgICAgICAgZmFkZVR5cGUsXG4gICAgICAgICAgICAgICAgZmFkZVdpZHRoLFxuICAgICAgICAgICAgICAgIHN0YXJ0UGVyY2VudGFnZSxcbiAgICAgICAgICAgICAgICBub1Jlc2l6ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuYmFubmVyLmFwcGVuZENoaWxkKHRoaXMuX2JhY2tDYW52YXMpO1xuICAgICAgICB0aGlzLmJhbm5lci5hcHBlbmRDaGlsZCh0aGlzLl9mb3JlQ2FudmFzKTtcbiAgICAgICAgY29uc3QgYmFja0NvbnRleHQgPSB0aGlzLl9iYWNrQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgICAgICBjb25zdCBmb3JlQ29udGV4dCA9IHRoaXMuX2ZvcmVDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICBpZiAoYmFja0NvbnRleHQgPT09IG51bGwgfHwgZm9yZUNvbnRleHQgPT09IG51bGwpIHRocm93IEVycm9yKFwiMmQgY29udGV4dCBub3Qgc3VwcG9ydGVkXCIpXG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0ID0gYmFja0NvbnRleHQ7XG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0ID0gZm9yZUNvbnRleHQ7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG5leHRGYWRlID0gKCkgPT4ge1xuICAgICAgICAvLyBhZHZhbmNlIGluZGljZXNcbiAgICAgICAgdGhpcy5jdXJyZW50SWR4ID0gKyt0aGlzLmN1cnJlbnRJZHggJSB0aGlzLmltYWdlQXJyYXkubGVuZ3RoO1xuICAgICAgICB0aGlzLmRyYXdJbWFnZSgpO1xuXG4gICAgICAgIC8vIGNsZWFyIHRoZSBmb3JlZ3JvdW5kXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgLy8gc2V0dXAgYW5kIHN0YXJ0IHRoZSBmYWRlXG4gICAgICAgIHRoaXMucGVyY2VudCA9IC10aGlzLmN1ckltZy5mYWRlV2lkdGg7XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGU7XG4gICAgICAgIHRoaXMucmVkcmF3KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWRyYXcgPSAoKSA9PiB7XG4gICAgICAgIC8vIGNhbGN1bGF0ZSBwZXJjZW50IGNvbXBsZXRpb24gb2Ygd2lwZVxuICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IG5ldyBEYXRlO1xuICAgICAgICBjb25zdCBlbGFwc2VkID0gY3VycmVudFRpbWUuZ2V0VGltZSgpIC0gdGhpcy5zdGFydFRpbWUuZ2V0VGltZSgpO1xuICAgICAgICB0aGlzLnBlcmNlbnQgPSB0aGlzLmN1ckltZy5zdGFydFBlcmNlbnRhZ2UgKyBlbGFwc2VkIC8gdGhpcy5jdXJJbWcuZmFkZUR1cmF0aW9uO1xuXG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuc2F2ZSgpO1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICBjb25zdCBmYWRlV2lkdGggPSB0aGlzLmN1ckltZy5mYWRlV2lkdGhcblxuICAgICAgICBzd2l0Y2ggKHRoaXMuY3VySW1nLmZhZGVUeXBlKSB7XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1sclwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDApO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1ybFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDApO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy11ZFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgMCwgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAwLCAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1kdVwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgMCwgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAwLCAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJkaWFnb25hbC10bC1iclwiOiB7Ly8gRFM6IFRoaXMgZGlhZ29uYWwgbm90IHdvcmtpbmcgcHJvcGVybHlcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMiArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgyICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCBmYWRlV2lkdGggKiAodGhpcy53aWR0aCAvICh0aGlzLmhlaWdodCAvIDIpKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImRpYWdvbmFsLXRyLWJsXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDAsXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCArIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtYnRtXCI6IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzID0gMzAwOyAvLyB0aGUgYW1vdW50IG9mIHNlZ21lbnRzIHRvIHNwbGl0IHRoZSBzZW1pIGNpcmNsZSBpbnRvLCBEUzogYWRqdXN0IHRoaXMgZm9yIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSAxIC8gc2VnbWVudHM7XG5cbiAgICAgICAgICAgICAgICAvLyBleHBhbmQgcGVyY2VudCB0byBjb3ZlciBmYWRlV2lkdGhcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFBlcmNlbnQgPSB0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIGEgcGVyY2VudFxuICAgICAgICAgICAgICAgIGZvciAobGV0IHByY3QgPSAtZmFkZVdpZHRoOyBwcmN0IDwgMSArIGZhZGVXaWR0aDsgcHJjdCArPSBzdGVwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCBwZXJjZW50IHRvIGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gcHJjdCAqIE1hdGguUEk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGNvb3JkaW5hdGVzIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MSA9IE1hdGguY29zKGFuZ2xlICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MSA9IE1hdGguc2luKGFuZ2xlICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MiA9IE1hdGguY29zKGFuZ2xlICsgbGVuICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MiA9IE1hdGguc2luKGFuZ2xlICsgbGVuICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBhbHBoYSBmb3Igd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxwaGEgPSAoYWRqdXN0ZWRQZXJjZW50IC0gcHJjdCArIGZhZGVXaWR0aCkgLyBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZHJhdyB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubW92ZVRvKHRoaXMud2lkdGggLyAyIC0gMiwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8oeDEsIHkxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgyLCB5Mik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh0aGlzLndpZHRoIC8gMiArIDIsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsJyArIGFscGhhICsgJyknO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtdG9wXCI6IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzID0gMzAwOyAvLyB0aGUgYW1vdW50IG9mIHNlZ21lbnRzIHRvIHNwbGl0IHRoZSBzZW1pIGNpcmNsZSBpbnRvLCBEUzogYWRqdXN0IHRoaXMgZm9yIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSAxIC8gc2VnbWVudHM7XG5cbiAgICAgICAgICAgICAgICAvLyBleHBhbmQgcGVyY2VudCB0byBjb3ZlciBmYWRlV2lkdGhcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFBlcmNlbnQgPSB0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIGEgcGVyY2VudFxuICAgICAgICAgICAgICAgIGZvciAobGV0IHBlcmNlbnQgPSAtZmFkZVdpZHRoOyBwZXJjZW50IDwgMSArIGZhZGVXaWR0aDsgcGVyY2VudCArPSBzdGVwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCBwZXJjZW50IHRvIGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gcGVyY2VudCAqIE1hdGguUEk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGNvb3JkaW5hdGVzIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MSA9IE1hdGguY29zKGFuZ2xlICsgbGVuICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTEgPSBNYXRoLnNpbihhbmdsZSArIGxlbiArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MiA9IE1hdGguY29zKGFuZ2xlICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTIgPSBNYXRoLnNpbihhbmdsZSArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGFscGhhIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbHBoYSA9IChhZGp1c3RlZFBlcmNlbnQgLSBwZXJjZW50ICsgZmFkZVdpZHRoKSAvIGZhZGVXaWR0aDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBkcmF3IHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5tb3ZlVG8odGhpcy53aWR0aCAvIDIgLSAyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgxLCB5MSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh4MiwgeTIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8odGhpcy53aWR0aCAvIDIgKyAyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsJyArIGFscGhhICsgJyknO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtb3V0XCI6XG4gICAgICAgICAgICBjYXNlIFwicmFkaWFsLWluXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwZXJjZW50ID0gdGhpcy5jdXJJbWcuZmFkZVR5cGUgPT09IFwicmFkaWFsLWluXCIgPyAgKDEgLSB0aGlzLnBlcmNlbnQpIDogdGhpcy5wZXJjZW50XG4gICAgICAgICAgICAgICAgY29uc3QgaW5uZXJSYWRpdXMgPSAocGVyY2VudCkgKiB0aGlzLmhlaWdodCAtIDEwMCA8IDAgPyAuMDEgOiAocGVyY2VudCkgKiB0aGlzLmhlaWdodCAtIDEwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBvdXRlclJhZGl1cyA9IHBlcmNlbnQgKiB0aGlzLmhlaWdodCArIDEwMFxuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQodGhpcy53aWR0aCAvIDIsIHRoaXMuaGVpZ2h0IC8gMiwgaW5uZXJSYWRpdXMsIHRoaXMud2lkdGggLyAyLCB0aGlzLmhlaWdodCAvIDIsIG91dGVyUmFkaXVzKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwic291cmNlLWluXCI7XG4gICAgICAgIHRoaXMuX2RyYXcodGhpcy5ueHRJbWcsIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0KVxuXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LnJlc3RvcmUoKTtcblxuXG4gICAgICAgIGlmIChlbGFwc2VkIDwgdGhpcy5jdXJJbWcuZmFkZUR1cmF0aW9uKVxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlZHJhdyk7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMubW9kZSA9PT0gTW9kZS5BVVRPKVxuICAgICAgICAgICAgaWYgKHRoaXMubG9vcCB8fCB0aGlzLmN1cnJlbnRJZHggPCB0aGlzLmltYWdlQXJyYXkubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRGYWRlVGltZXIgPSBzZXRUaW1lb3V0KHRoaXMubmV4dEZhZGUsIHRoaXMuY3VySW1nLmZhZGVEZWxheSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZHJhdyhpOiBJbWFnZU9iamVjdCwgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpe1xuICAgICAgICBpZiAoaS5ub1Jlc2l6ZSkge1xuICAgICAgICAgICAgY29uc3QgaCA9IGkuaW1nLmhlaWdodFxuICAgICAgICAgICAgY29uc3QgdyA9IGkuaW1nLndpZHRoXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKFxuICAgICAgICAgICAgICAgIGkuaW1nLFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyAyIC0gdyAvIDIsXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgLzIgLSBoIC8gMixcbiAgICAgICAgICAgICAgICB3LCBoKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYXNwZWN0ID4gaS5hc3BlY3QpIHtcblxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpLmltZyxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICh0aGlzLmhlaWdodCAtIHRoaXMud2lkdGggLyBpLmFzcGVjdCkgLyAyLFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIGkuYXNwZWN0KTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpLmltZyxcbiAgICAgICAgICAgICAgICAodGhpcy53aWR0aCAtIHRoaXMuaGVpZ2h0ICogaS5hc3BlY3QpIC8gMixcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICogaS5hc3BlY3QsXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2l6ZSgpIHtcblxuICAgICAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDsgLy8gRFM6IGZpeCBmb3IgaU9TIDkgYnVnXG4gICAgICAgIHRoaXMuYXNwZWN0ID0gdGhpcy53aWR0aCAvIHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0LmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5kcmF3SW1hZ2UoKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBkcmF3SW1hZ2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1ckltZykge1xuICAgICAgICAgICAgdGhpcy5fZHJhdyh0aGlzLmN1ckltZywgdGhpcy5fYmFja0NvbnRleHQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIm5vIGltYWdlIFwiICsgdGhpcy5jdXJyZW50SWR4ICsgXCIgXCIgKyB0aGlzLmltYWdlQXJyYXkubGVuZ3RoKVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50SWR4ID0gLTFcbiAgICAgICAgdGhpcy5uZXh0RmFkZSgpO1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMubmV4dEZhZGVUaW1lciAmJiBjbGVhclRpbWVvdXQodGhpcy5uZXh0RmFkZVRpbWVyKVxuICAgIH1cblxuICAgIG5leHQoKSB7XG4gICAgICAgIGlmICh0aGlzLm1vZGUgIT09IE1vZGUuTVVMVElfU0VDVElPTilcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiVGhpcyBzd3dpcGUgb3BlcmF0ZXMgaW4gQVVUTyBtb2RlXCIpXG4gICAgICAgIHRoaXMubmV4dEZhZGUoKVxuICAgIH1cblxuXG4gICAgZ2V0IG51bWJlck9mRmFkZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmltYWdlQXJyYXkubGVuZ3RoXG4gICAgfVxufVxuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi5iYW5uZXJcIikuZm9yRWFjaChiID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGU6IE1vZGUgPSBiLmhhc0F0dHJpYnV0ZShcImRhdGEtbXVsdGktc3dpcGVcIikgPyBNb2RlLk1VTFRJX1NFQ1RJT04gOiBNb2RlLkFVVE9cbiAgICAgICAgICAgIGNvbnN0IG5vTG9vcDogYm9vbGVhbiA9IGIuaGFzQXR0cmlidXRlKFwiZGF0YS1uby1sb29wXCIpXG4gICAgICAgICAgICBjb25zdCBvd25lciA9IGIuY2xvc2VzdChcInNlY3Rpb25cIilcbiAgICAgICAgICAgIGlmICghb3duZXIpIHRocm93IEVycm9yKFwiYmFubmVyIGVsZW1lbnQgbm90IHBhcnQgb2YgYSBzZWN0aW9uXCIpXG4gICAgICAgICAgICBjb25zdCB3aXBlID0gbmV3IFNXV2lwZShiLCBvd25lciwgbW9kZSwgIW5vTG9vcCk7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBiLnNzd2lwZSA9IHdpcGU7XG4gICAgICAgIH0pXG5cbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoXCJzbGlkZWNoYW5nZWRcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByZXZCYW5uZXIgPSBlLnByZXZpb3VzU2xpZGU/LnF1ZXJ5U2VsZWN0b3IoXCIuYmFubmVyXCIpO1xuICAgICAgICAgICAgaWYgKHByZXZCYW5uZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB3aXBlID0gcHJldkJhbm5lci5zc3dpcGUgYXMgU1dXaXBlO1xuICAgICAgICAgICAgICAgIGlmICh3aXBlLm1vZGUgPT09IE1vZGUuQVVUTylcbiAgICAgICAgICAgICAgICAgICAgd2lwZS5zdG9wKCk7XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG93bmVySW5kZXg6IHsgaDogbnVtYmVyOyB2OiBudW1iZXI7IH0gPSBSZXZlYWwuZ2V0SW5kaWNlcyh3aXBlLm93bmVyKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50SW5kZXg6IHsgaDogbnVtYmVyOyB2OiBudW1iZXI7IH0gPSBSZXZlYWwuZ2V0SW5kaWNlcyhlLmN1cnJlbnRTbGlkZSlcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBlLmN1cnJlbnRTbGlkZS5pbmRleFYgP1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4LnYgLSAob3duZXJJbmRleC52IHx8IDApIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleC5oIC0gb3duZXJJbmRleC5oXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRpc3RhbmNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlID4gMCAmJiBkaXN0YW5jZSA8IHdpcGUubnVtYmVyT2ZGYWRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5jdXJyZW50U2xpZGUuYXBwZW5kQ2hpbGQod2lwZS5iYW5uZXIpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aXBlLnN0b3AoKVxuICAgICAgICAgICAgICAgICAgICAgICAgd2lwZS5vd25lci5hcHBlbmRDaGlsZCh3aXBlLmJhbm5lcilcbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXh0QmFubmVyID0gZS5jdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvcihcIi5iYW5uZXJcIik7XG4gICAgICAgICAgICBpZiAobmV4dEJhbm5lcikge1xuICAgICAgICAgICAgICAgIGxldCBzc3dpcGUgPSBuZXh0QmFubmVyLnNzd2lwZSBhcyBTV1dpcGU7XG4gICAgICAgICAgICAgICAgaWYgKHNzd2lwZS5tb2RlID09PSBNb2RlLkFVVE8gfHwgc3N3aXBlLm93bmVyID09PSBlLmN1cnJlbnRTbGlkZSlcbiAgICAgICAgICAgICAgICAgICAgc3N3aXBlLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBzc3dpcGUubmV4dCgpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSlcblxuXG59KSgpXG5cbi8vIGBjbG9zZXN0YCBQb2x5ZmlsbCBmb3IgSUVcblxuaWYgKCFFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzKSB7XG4gICAgRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcyA9XG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3Rvcjtcbn1cblxuaWYgKCFFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0KSB7XG4gICAgRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHZhciBlbCA9IHRoaXM7XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgaWYgKEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMuY2FsbChlbCwgcykpIHJldHVybiBlbDtcbiAgICAgICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudCB8fCBlbC5wYXJlbnROb2RlO1xuICAgICAgICB9IHdoaWxlIChlbCAhPT0gbnVsbCAmJiBlbC5ub2RlVHlwZSA9PT0gMSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG59XG5cbiJdfQ==