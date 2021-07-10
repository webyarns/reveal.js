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
            var innerRadius = _this.percent * _this.height - 100 < 0 ? .01 : _this.percent * _this.height - 100;
            var outerRadius = _this.percent * _this.height + 100;

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
      var prevBanner = e.previousSlide.querySelector(".banner");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy1zd3dpcGUudHMiXSwibmFtZXMiOlsiTW9kZSIsIlNXV2lwZSIsImltYWdlQXJyYXkiLCJjdXJyZW50SWR4IiwibGVuZ3RoIiwiYmFubmVyIiwib3duZXIiLCJtb2RlIiwiQVVUTyIsImxvb3AiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJ3aWR0aCIsImhlaWdodCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIkRhdGUiLCJkcmF3SW1hZ2UiLCJfZm9yZWdyb3VuZENvbnRleHQiLCJjbGVhclJlY3QiLCJwZXJjZW50IiwiY3VySW1nIiwiZmFkZVdpZHRoIiwic3RhcnRUaW1lIiwicmVkcmF3IiwiY3VycmVudFRpbWUiLCJlbGFwc2VkIiwiZ2V0VGltZSIsInN0YXJ0UGVyY2VudGFnZSIsImZhZGVEdXJhdGlvbiIsInNhdmUiLCJmYWRlVHlwZSIsImdyYWRpZW50IiwiY3JlYXRlTGluZWFyR3JhZGllbnQiLCJhZGRDb2xvclN0b3AiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsInNlZ21lbnRzIiwibGVuIiwiTWF0aCIsIlBJIiwic3RlcCIsImFkanVzdGVkUGVyY2VudCIsInByY3QiLCJhbmdsZSIsIngxIiwiY29zIiwieTEiLCJzaW4iLCJ4MiIsInkyIiwiYWxwaGEiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJmaWxsIiwiaW5uZXJSYWRpdXMiLCJvdXRlclJhZGl1cyIsImNyZWF0ZVJhZGlhbEdyYWRpZW50IiwiZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uIiwiX2RyYXciLCJueHRJbWciLCJyZXN0b3JlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibmV4dEZhZGVUaW1lciIsInNldFRpbWVvdXQiLCJuZXh0RmFkZSIsImZhZGVEZWxheSIsImltYWdlcyIsIkFycmF5IiwiZnJvbSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJtYXAiLCJpbWciLCJhc3BlY3QiLCJoYXNBdHRyaWJ1dGUiLCJOdW1iZXIiLCJnZXRBdHRyaWJ1dGUiLCJub1Jlc2l6ZSIsImFwcGVuZENoaWxkIiwiX2JhY2tDYW52YXMiLCJfZm9yZUNhbnZhcyIsImJhY2tDb250ZXh0IiwiZ2V0Q29udGV4dCIsImZvcmVDb250ZXh0IiwiRXJyb3IiLCJfYmFja0NvbnRleHQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVzaXplIiwiaSIsImN0eCIsImgiLCJ3IiwiZG9jdW1lbnRFbGVtZW50IiwiY2xpZW50SGVpZ2h0IiwiY2FudmFzIiwiY2xlYXJUaW1lb3V0IiwiTVVMVElfU0VDVElPTiIsImZvckVhY2giLCJiIiwibm9Mb29wIiwiY2xvc2VzdCIsIndpcGUiLCJzc3dpcGUiLCJSZXZlYWwiLCJlIiwicHJldkJhbm5lciIsInByZXZpb3VzU2xpZGUiLCJxdWVyeVNlbGVjdG9yIiwic3RvcCIsIm93bmVySW5kZXgiLCJnZXRJbmRpY2VzIiwiY3VycmVudEluZGV4IiwiY3VycmVudFNsaWRlIiwiZGlzdGFuY2UiLCJpbmRleFYiLCJ2IiwiY29uc29sZSIsImxvZyIsIm51bWJlck9mRmFkZXMiLCJuZXh0QmFubmVyIiwic3RhcnQiLCJuZXh0IiwiRWxlbWVudCIsInByb3RvdHlwZSIsIm1hdGNoZXMiLCJtc01hdGNoZXNTZWxlY3RvciIsIndlYmtpdE1hdGNoZXNTZWxlY3RvciIsInMiLCJlbCIsImNhbGwiLCJwYXJlbnRFbGVtZW50IiwicGFyZW50Tm9kZSIsIm5vZGVUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7SUFjS0EsSTs7V0FBQUEsSTtBQUFBQSxFQUFBQSxJLENBQUFBLEk7QUFBQUEsRUFBQUEsSSxDQUFBQSxJO0dBQUFBLEksS0FBQUEsSTs7SUFlQ0MsTTs7Ozs7QUFHb0M7QUFDRTtBQUNNO3dCQWFaO0FBQzlCLGFBQU8sS0FBS0MsVUFBTCxDQUFnQixLQUFLQyxVQUFyQixDQUFQO0FBQ0g7Ozt3QkFFaUM7QUFDOUIsYUFBTyxLQUFLRCxVQUFMLENBQWdCLENBQUMsS0FBS0MsVUFBTCxHQUFrQixDQUFuQixJQUF3QixLQUFLRCxVQUFMLENBQWdCRSxNQUF4RCxDQUFQO0FBQ0g7OztBQUVELGtCQUFxQkMsTUFBckIsRUFBbURDLEtBQW5ELEVBQThIO0FBQUE7O0FBQUEsUUFBOUNDLElBQThDLHVFQUFqQ1AsSUFBSSxDQUFDUSxJQUE0QjtBQUFBLFFBQWJDLElBQWEsdUVBQU4sSUFBTTs7QUFBQTs7QUFBQSxTQUF6R0osTUFBeUcsR0FBekdBLE1BQXlHO0FBQUEsU0FBM0VDLEtBQTJFLEdBQTNFQSxLQUEyRTtBQUFBLFNBQTlDQyxJQUE4QyxHQUE5Q0EsSUFBOEM7QUFBQSxTQUFiRSxJQUFhLEdBQWJBLElBQWE7O0FBQUEsd0NBeEJqSCxDQUFDLENBd0JnSDs7QUFBQSxtQ0F2QjlHQyxNQUFNLENBQUNDLFVBdUJ1Rzs7QUFBQSxvQ0F0QjdHRCxNQUFNLENBQUNFLFdBc0JzRzs7QUFBQSxvQ0FyQjdHLEtBQUtDLEtBQUwsR0FBYSxLQUFLQyxNQXFCMkY7O0FBQUE7O0FBQUEseUNBbEI1RUMsUUFBUSxDQUFDQyxhQUFULENBQXVCLFFBQXZCLENBa0I0RTs7QUFBQSx5Q0FqQjVFRCxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FpQjRFOztBQUFBOztBQUFBOztBQUFBLHFDQWJwRyxDQWFvRzs7QUFBQSx1Q0FacEcsSUFBSUMsSUFBSixFQVlvRzs7QUFBQSwyQ0FYL0UsSUFXK0U7O0FBQUEsc0NBaUMzRyxZQUFNO0FBQ3JCO0FBQ0EsTUFBQSxLQUFJLENBQUNkLFVBQUwsR0FBa0IsRUFBRSxLQUFJLENBQUNBLFVBQVAsR0FBb0IsS0FBSSxDQUFDRCxVQUFMLENBQWdCRSxNQUF0RDs7QUFDQSxNQUFBLEtBQUksQ0FBQ2MsU0FBTCxHQUhxQixDQUtyQjs7O0FBQ0EsTUFBQSxLQUFJLENBQUNDLGtCQUFMLENBQXdCQyxTQUF4QixDQUFrQyxDQUFsQyxFQUFxQyxDQUFyQyxFQUF3QyxLQUFJLENBQUNQLEtBQTdDLEVBQW9ELEtBQUksQ0FBQ0MsTUFBekQsRUFOcUIsQ0FRckI7OztBQUNBLE1BQUEsS0FBSSxDQUFDTyxPQUFMLEdBQWUsQ0FBQyxLQUFJLENBQUNDLE1BQUwsQ0FBWUMsU0FBNUI7QUFDQSxNQUFBLEtBQUksQ0FBQ0MsU0FBTCxHQUFpQixJQUFJUCxJQUFKLEVBQWpCOztBQUNBLE1BQUEsS0FBSSxDQUFDUSxNQUFMO0FBQ0gsS0E3QzZIOztBQUFBLG9DQStDN0csWUFBTTtBQUNuQjtBQUNBLFVBQU1DLFdBQVcsR0FBRyxJQUFJVCxJQUFKLEVBQXBCOztBQUNBLFVBQU1VLE9BQU8sR0FBR0QsV0FBVyxDQUFDRSxPQUFaLEtBQXdCLEtBQUksQ0FBQ0osU0FBTCxDQUFlSSxPQUFmLEVBQXhDOztBQUNBLE1BQUEsS0FBSSxDQUFDUCxPQUFMLEdBQWUsS0FBSSxDQUFDQyxNQUFMLENBQVlPLGVBQVosR0FBOEJGLE9BQU8sR0FBRyxLQUFJLENBQUNMLE1BQUwsQ0FBWVEsWUFBbkU7O0FBR0EsTUFBQSxLQUFJLENBQUNYLGtCQUFMLENBQXdCWSxJQUF4Qjs7QUFDQSxNQUFBLEtBQUksQ0FBQ1osa0JBQUwsQ0FBd0JDLFNBQXhCLENBQWtDLENBQWxDLEVBQXFDLENBQXJDLEVBQXdDLEtBQUksQ0FBQ1AsS0FBN0MsRUFBb0QsS0FBSSxDQUFDQyxNQUF6RDs7QUFDQSxVQUFNUyxTQUFTLEdBQUcsS0FBSSxDQUFDRCxNQUFMLENBQVlDLFNBQTlCOztBQUVBLGNBQVEsS0FBSSxDQUFDRCxNQUFMLENBQVlVLFFBQXBCO0FBRUksYUFBSyxVQUFMO0FBQWlCO0FBQ2IsZ0JBQU1DLFFBQVEsR0FBRyxLQUFJLENBQUNkLGtCQUFMLENBQXdCZSxvQkFBeEIsQ0FDYixDQUFDLEtBQUksQ0FBQ2IsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBbEMsSUFBK0MsS0FBSSxDQUFDVixLQUR2QyxFQUM4QyxDQUQ5QyxFQUViLENBQUMsS0FBSSxDQUFDUSxPQUFMLElBQWdCLElBQUlFLFNBQXBCLElBQWlDQSxTQUFsQyxJQUErQyxLQUFJLENBQUNWLEtBRnZDLEVBRThDLENBRjlDLENBQWpCOztBQUdBb0IsWUFBQUEsUUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCO0FBQ0FGLFlBQUFBLFFBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjtBQUNBLFlBQUEsS0FBSSxDQUFDaEIsa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQ0gsUUFBcEM7O0FBQ0EsWUFBQSxLQUFJLENBQUNkLGtCQUFMLENBQXdCa0IsUUFBeEIsQ0FBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBSSxDQUFDeEIsS0FBNUMsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFDQTtBQUNIOztBQUVELGFBQUssVUFBTDtBQUFpQjtBQUNiLGdCQUFNbUIsU0FBUSxHQUFHLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JlLG9CQUF4QixDQUNiLENBQUMsQ0FBQyxJQUFJLEtBQUksQ0FBQ2IsT0FBVixLQUFzQixJQUFJRSxTQUExQixJQUF1Q0EsU0FBeEMsSUFBcUQsS0FBSSxDQUFDVixLQUQ3QyxFQUNvRCxDQURwRCxFQUViLENBQUMsQ0FBQyxJQUFJLEtBQUksQ0FBQ1EsT0FBVixLQUFzQixJQUFJRSxTQUExQixJQUF1Q0EsU0FBeEMsSUFBcUQsS0FBSSxDQUFDVixLQUY3QyxFQUVvRCxDQUZwRCxDQUFqQjs7QUFHQW9CLFlBQUFBLFNBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsWUFBQUEsU0FBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBLFlBQUEsS0FBSSxDQUFDaEIsa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQ0gsU0FBcEM7O0FBQ0EsWUFBQSxLQUFJLENBQUNkLGtCQUFMLENBQXdCa0IsUUFBeEIsQ0FBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBSSxDQUFDeEIsS0FBNUMsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFDQTtBQUNIOztBQUVELGFBQUssVUFBTDtBQUFpQjtBQUNiLGdCQUFNbUIsVUFBUSxHQUFHLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JlLG9CQUF4QixDQUNiLENBRGEsRUFDVixDQUFDLEtBQUksQ0FBQ2IsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBbEMsSUFBK0MsS0FBSSxDQUFDVixLQUQxQyxFQUViLENBRmEsRUFFVixDQUFDLEtBQUksQ0FBQ1EsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBbEMsSUFBK0MsS0FBSSxDQUFDVixLQUYxQyxDQUFqQjs7QUFHQW9CLFlBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsWUFBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBLFlBQUEsS0FBSSxDQUFDaEIsa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQ0gsVUFBcEM7O0FBQ0EsWUFBQSxLQUFJLENBQUNkLGtCQUFMLENBQXdCa0IsUUFBeEIsQ0FBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBSSxDQUFDeEIsS0FBNUMsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFDQTtBQUNIOztBQUVELGFBQUssVUFBTDtBQUFpQjtBQUNiLGdCQUFNbUIsVUFBUSxHQUFHLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JlLG9CQUF4QixDQUNiLENBRGEsRUFDVixDQUFDLENBQUMsSUFBSSxLQUFJLENBQUNiLE9BQVYsS0FBc0IsSUFBSUUsU0FBMUIsSUFBdUNBLFNBQXhDLElBQXFELEtBQUksQ0FBQ1YsS0FEaEQsRUFFYixDQUZhLEVBRVYsQ0FBQyxDQUFDLElBQUksS0FBSSxDQUFDUSxPQUFWLEtBQXNCLElBQUlFLFNBQTFCLElBQXVDQSxTQUF4QyxJQUFxRCxLQUFJLENBQUNWLEtBRmhELENBQWpCOztBQUdBb0IsWUFBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBRixZQUFBQSxVQUFRLENBQUNFLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkIsZUFBM0I7O0FBQ0EsWUFBQSxLQUFJLENBQUNoQixrQkFBTCxDQUF3QmlCLFNBQXhCLEdBQW9DSCxVQUFwQzs7QUFDQSxZQUFBLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JrQixRQUF4QixDQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1QyxLQUFJLENBQUN4QixLQUE1QyxFQUFtRCxLQUFJLENBQUNDLE1BQXhEOztBQUNBO0FBQ0g7O0FBRUQsYUFBSyxnQkFBTDtBQUF1QjtBQUFDO0FBRXBCLGdCQUFNbUIsVUFBUSxHQUFHLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JlLG9CQUF4QixDQUNiLENBQUMsS0FBSSxDQUFDYixPQUFMLElBQWdCLElBQUlFLFNBQXBCLElBQWlDQSxTQUFsQyxJQUErQyxLQUFJLENBQUNWLEtBRHZDLEVBQzhDLENBRDlDLEVBRWIsQ0FBQyxLQUFJLENBQUNRLE9BQUwsSUFBZ0IsSUFBSUUsU0FBcEIsSUFBaUNBLFNBQWxDLElBQStDLEtBQUksQ0FBQ1YsS0FGdkMsRUFFOENVLFNBQVMsSUFBSSxLQUFJLENBQUNWLEtBQUwsSUFBYyxLQUFJLENBQUNDLE1BQUwsR0FBYyxDQUE1QixDQUFKLENBQVQsR0FBK0MsS0FBSSxDQUFDRCxLQUZsRyxDQUFqQjs7QUFHQW9CLFlBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsWUFBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBLFlBQUEsS0FBSSxDQUFDaEIsa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQ0gsVUFBcEM7O0FBQ0EsWUFBQSxLQUFJLENBQUNkLGtCQUFMLENBQXdCa0IsUUFBeEIsQ0FBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBSSxDQUFDeEIsS0FBNUMsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFFQTtBQUNIOztBQUVELGFBQUssZ0JBQUw7QUFBdUI7QUFDbkIsZ0JBQU1tQixVQUFRLEdBQUcsS0FBSSxDQUFDZCxrQkFBTCxDQUF3QmUsb0JBQXhCLENBQ2IsQ0FBQyxLQUFJLENBQUNiLE9BQUwsSUFBZ0IsSUFBSUUsU0FBcEIsSUFBaUNBLFNBQWxDLElBQStDLEtBQUksQ0FBQ1YsS0FEdkMsRUFDOEMsQ0FEOUMsRUFFYixDQUFDLEtBQUksQ0FBQ1EsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBbEMsSUFBK0MsS0FBSSxDQUFDVixLQUFwRCxHQUE0RCxLQUFJLENBQUNBLEtBRnBELEVBRTJELEtBQUksQ0FBQ0MsTUFGaEUsQ0FBakI7O0FBR0FtQixZQUFBQSxVQUFRLENBQUNFLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkIsZUFBM0I7O0FBQ0FGLFlBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQSxZQUFBLEtBQUksQ0FBQ2hCLGtCQUFMLENBQXdCaUIsU0FBeEIsR0FBb0NILFVBQXBDOztBQUNBLFlBQUEsS0FBSSxDQUFDZCxrQkFBTCxDQUF3QmtCLFFBQXhCLENBQWlDLENBQWpDLEVBQW9DLENBQXBDLEVBQXVDLEtBQUksQ0FBQ3hCLEtBQTVDLEVBQW1ELEtBQUksQ0FBQ0MsTUFBeEQ7O0FBRUE7QUFDSDs7QUFFRCxhQUFLLFlBQUw7QUFBbUI7QUFFZixnQkFBTXdCLFFBQVEsR0FBRyxHQUFqQixDQUZlLENBRU87O0FBQ3RCLGdCQUFNQyxHQUFHLEdBQUdDLElBQUksQ0FBQ0MsRUFBTCxHQUFVSCxRQUF0QjtBQUNBLGdCQUFNSSxJQUFJLEdBQUcsSUFBSUosUUFBakIsQ0FKZSxDQU1mOztBQUNBLGdCQUFNSyxlQUFlLEdBQUcsS0FBSSxDQUFDdEIsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBekQsQ0FQZSxDQVNmOztBQUNBLGlCQUFLLElBQUlxQixJQUFJLEdBQUcsQ0FBQ3JCLFNBQWpCLEVBQTRCcUIsSUFBSSxHQUFHLElBQUlyQixTQUF2QyxFQUFrRHFCLElBQUksSUFBSUYsSUFBMUQsRUFBZ0U7QUFFNUQ7QUFDQSxrQkFBTUcsS0FBSyxHQUFHRCxJQUFJLEdBQUdKLElBQUksQ0FBQ0MsRUFBMUIsQ0FINEQsQ0FLNUQ7O0FBQ0Esa0JBQU1LLEVBQUUsR0FBR04sSUFBSSxDQUFDTyxHQUFMLENBQVNGLEtBQUssR0FBR0wsSUFBSSxDQUFDQyxFQUF0QixLQUE2QixLQUFJLENBQUMzQixNQUFMLEdBQWMsQ0FBM0MsSUFBZ0QsS0FBSSxDQUFDRCxLQUFMLEdBQWEsQ0FBeEU7O0FBQ0Esa0JBQU1tQyxFQUFFLEdBQUdSLElBQUksQ0FBQ1MsR0FBTCxDQUFTSixLQUFLLEdBQUdMLElBQUksQ0FBQ0MsRUFBdEIsS0FBNkIsS0FBSSxDQUFDM0IsTUFBTCxHQUFjLENBQTNDLElBQWdELEtBQUksQ0FBQ0EsTUFBaEU7O0FBQ0Esa0JBQU1vQyxFQUFFLEdBQUdWLElBQUksQ0FBQ08sR0FBTCxDQUFTRixLQUFLLEdBQUdOLEdBQVIsR0FBY0MsSUFBSSxDQUFDQyxFQUE1QixLQUFtQyxLQUFJLENBQUMzQixNQUFMLEdBQWMsQ0FBakQsSUFBc0QsS0FBSSxDQUFDRCxLQUFMLEdBQWEsQ0FBOUU7O0FBQ0Esa0JBQU1zQyxFQUFFLEdBQUdYLElBQUksQ0FBQ1MsR0FBTCxDQUFTSixLQUFLLEdBQUdOLEdBQVIsR0FBY0MsSUFBSSxDQUFDQyxFQUE1QixLQUFtQyxLQUFJLENBQUMzQixNQUFMLEdBQWMsQ0FBakQsSUFBc0QsS0FBSSxDQUFDQSxNQUF0RSxDQVQ0RCxDQVc1RDs7O0FBQ0Esa0JBQU1zQyxLQUFLLEdBQUcsQ0FBQ1QsZUFBZSxHQUFHQyxJQUFsQixHQUF5QnJCLFNBQTFCLElBQXVDQSxTQUFyRCxDQVo0RCxDQWM1RDs7QUFDQSxjQUFBLEtBQUksQ0FBQ0osa0JBQUwsQ0FBd0JrQyxTQUF4Qjs7QUFDQSxjQUFBLEtBQUksQ0FBQ2xDLGtCQUFMLENBQXdCbUMsTUFBeEIsQ0FBK0IsS0FBSSxDQUFDekMsS0FBTCxHQUFhLENBQWIsR0FBaUIsQ0FBaEQsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFDQSxjQUFBLEtBQUksQ0FBQ0ssa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQlQsRUFBL0IsRUFBbUNFLEVBQW5DOztBQUNBLGNBQUEsS0FBSSxDQUFDN0Isa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQkwsRUFBL0IsRUFBbUNDLEVBQW5DOztBQUNBLGNBQUEsS0FBSSxDQUFDaEMsa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQixLQUFJLENBQUMxQyxLQUFMLEdBQWEsQ0FBYixHQUFpQixDQUFoRCxFQUFtRCxLQUFJLENBQUNDLE1BQXhEOztBQUNBLGNBQUEsS0FBSSxDQUFDSyxrQkFBTCxDQUF3QmlCLFNBQXhCLEdBQW9DLGdCQUFnQmdCLEtBQWhCLEdBQXdCLEdBQTVEOztBQUNBLGNBQUEsS0FBSSxDQUFDakMsa0JBQUwsQ0FBd0JxQyxJQUF4QjtBQUNIOztBQUVEO0FBQ0g7O0FBRUQsYUFBSyxZQUFMO0FBQW1CO0FBRWYsZ0JBQU1sQixTQUFRLEdBQUcsR0FBakIsQ0FGZSxDQUVPOztBQUN0QixnQkFBTUMsSUFBRyxHQUFHQyxJQUFJLENBQUNDLEVBQUwsR0FBVUgsU0FBdEI7O0FBQ0EsZ0JBQU1JLEtBQUksR0FBRyxJQUFJSixTQUFqQixDQUplLENBTWY7OztBQUNBLGdCQUFNSyxnQkFBZSxHQUFHLEtBQUksQ0FBQ3RCLE9BQUwsSUFBZ0IsSUFBSUUsU0FBcEIsSUFBaUNBLFNBQXpELENBUGUsQ0FTZjs7O0FBQ0EsaUJBQUssSUFBSUYsT0FBTyxHQUFHLENBQUNFLFNBQXBCLEVBQStCRixPQUFPLEdBQUcsSUFBSUUsU0FBN0MsRUFBd0RGLE9BQU8sSUFBSXFCLEtBQW5FLEVBQXlFO0FBRXJFO0FBQ0Esa0JBQU1HLE1BQUssR0FBR3hCLE9BQU8sR0FBR21CLElBQUksQ0FBQ0MsRUFBN0IsQ0FIcUUsQ0FLckU7OztBQUNBLGtCQUFNSyxFQUFFLEdBQUdOLElBQUksQ0FBQ08sR0FBTCxDQUFTRixNQUFLLEdBQUdOLElBQVIsR0FBYyxJQUFJQyxJQUFJLENBQUNDLEVBQWhDLEtBQXVDLEtBQUksQ0FBQzNCLE1BQUwsR0FBYyxDQUFyRCxJQUEwRCxLQUFJLENBQUNELEtBQUwsR0FBYSxDQUFsRjs7QUFDQSxrQkFBTW1DLEVBQUUsR0FBR1IsSUFBSSxDQUFDUyxHQUFMLENBQVNKLE1BQUssR0FBR04sSUFBUixHQUFjLElBQUlDLElBQUksQ0FBQ0MsRUFBaEMsS0FBdUMsS0FBSSxDQUFDM0IsTUFBTCxHQUFjLENBQXJELENBQVg7O0FBQ0Esa0JBQU1vQyxHQUFFLEdBQUdWLElBQUksQ0FBQ08sR0FBTCxDQUFTRixNQUFLLEdBQUcsSUFBSUwsSUFBSSxDQUFDQyxFQUExQixLQUFpQyxLQUFJLENBQUMzQixNQUFMLEdBQWMsQ0FBL0MsSUFBb0QsS0FBSSxDQUFDRCxLQUFMLEdBQWEsQ0FBNUU7O0FBQ0Esa0JBQU1zQyxHQUFFLEdBQUdYLElBQUksQ0FBQ1MsR0FBTCxDQUFTSixNQUFLLEdBQUcsSUFBSUwsSUFBSSxDQUFDQyxFQUExQixLQUFpQyxLQUFJLENBQUMzQixNQUFMLEdBQWMsQ0FBL0MsQ0FBWCxDQVRxRSxDQVlyRTs7O0FBQ0Esa0JBQU1zQyxNQUFLLEdBQUcsQ0FBQ1QsZ0JBQWUsR0FBR3RCLE9BQWxCLEdBQTRCRSxTQUE3QixJQUEwQ0EsU0FBeEQsQ0FicUUsQ0FlckU7OztBQUNBLGNBQUEsS0FBSSxDQUFDSixrQkFBTCxDQUF3QmtDLFNBQXhCOztBQUNBLGNBQUEsS0FBSSxDQUFDbEMsa0JBQUwsQ0FBd0JtQyxNQUF4QixDQUErQixLQUFJLENBQUN6QyxLQUFMLEdBQWEsQ0FBYixHQUFpQixDQUFoRCxFQUFtRCxDQUFuRDs7QUFDQSxjQUFBLEtBQUksQ0FBQ00sa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQlQsRUFBL0IsRUFBbUNFLEVBQW5DOztBQUNBLGNBQUEsS0FBSSxDQUFDN0Isa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQkwsR0FBL0IsRUFBbUNDLEdBQW5DOztBQUNBLGNBQUEsS0FBSSxDQUFDaEMsa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQixLQUFJLENBQUMxQyxLQUFMLEdBQWEsQ0FBYixHQUFpQixDQUFoRCxFQUFtRCxDQUFuRDs7QUFDQSxjQUFBLEtBQUksQ0FBQ00sa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQyxnQkFBZ0JnQixNQUFoQixHQUF3QixHQUE1RDs7QUFDQSxjQUFBLEtBQUksQ0FBQ2pDLGtCQUFMLENBQXdCcUMsSUFBeEI7QUFDSDs7QUFFRDtBQUNIOztBQUVELGFBQUssWUFBTDtBQUNBLGFBQUssV0FBTDtBQUFrQjtBQUVkLGdCQUFNQyxXQUFXLEdBQUksS0FBSSxDQUFDcEMsT0FBTixHQUFpQixLQUFJLENBQUNQLE1BQXRCLEdBQStCLEdBQS9CLEdBQXFDLENBQXJDLEdBQXlDLEdBQXpDLEdBQWdELEtBQUksQ0FBQ08sT0FBTixHQUFpQixLQUFJLENBQUNQLE1BQXRCLEdBQStCLEdBQWxHO0FBQ0EsZ0JBQU00QyxXQUFXLEdBQUcsS0FBSSxDQUFDckMsT0FBTCxHQUFlLEtBQUksQ0FBQ1AsTUFBcEIsR0FBNkIsR0FBakQ7O0FBQ0EsZ0JBQU1tQixVQUFRLEdBQUcsS0FBSSxDQUFDZCxrQkFBTCxDQUF3QndDLG9CQUF4QixDQUE2QyxLQUFJLENBQUM5QyxLQUFMLEdBQWEsQ0FBMUQsRUFBNkQsS0FBSSxDQUFDQyxNQUFMLEdBQWMsQ0FBM0UsRUFBOEUyQyxXQUE5RSxFQUEyRixLQUFJLENBQUM1QyxLQUFMLEdBQWEsQ0FBeEcsRUFBMkcsS0FBSSxDQUFDQyxNQUFMLEdBQWMsQ0FBekgsRUFBNEg0QyxXQUE1SCxDQUFqQjs7QUFDQXpCLFlBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsWUFBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBLFlBQUEsS0FBSSxDQUFDaEIsa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQ0gsVUFBcEM7O0FBQ0EsWUFBQSxLQUFJLENBQUNkLGtCQUFMLENBQXdCa0IsUUFBeEIsQ0FBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBSSxDQUFDeEIsS0FBNUMsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFFQTtBQUNIOztBQUdEO0FBRUk7QUFuS1I7O0FBdUtBLE1BQUEsS0FBSSxDQUFDSyxrQkFBTCxDQUF3QnlDLHdCQUF4QixHQUFtRCxXQUFuRDs7QUFDQSxNQUFBLEtBQUksQ0FBQ0MsS0FBTCxDQUFXLEtBQUksQ0FBQ0MsTUFBaEIsRUFBd0IsS0FBSSxDQUFDM0Msa0JBQTdCOztBQUVBLE1BQUEsS0FBSSxDQUFDQSxrQkFBTCxDQUF3QjRDLE9BQXhCOztBQUdBLFVBQUlwQyxPQUFPLEdBQUcsS0FBSSxDQUFDTCxNQUFMLENBQVlRLFlBQTFCLEVBQ0lwQixNQUFNLENBQUNzRCxxQkFBUCxDQUE2QixLQUFJLENBQUN2QyxNQUFsQyxFQURKLEtBRUssSUFBSSxLQUFJLENBQUNsQixJQUFMLEtBQWNQLElBQUksQ0FBQ1EsSUFBdkIsRUFDRCxJQUFJLEtBQUksQ0FBQ0MsSUFBTCxJQUFhLEtBQUksQ0FBQ04sVUFBTCxHQUFrQixLQUFJLENBQUNELFVBQUwsQ0FBZ0JFLE1BQWhCLEdBQXlCLENBQTVELEVBQ0ksS0FBSSxDQUFDNkQsYUFBTCxHQUFxQkMsVUFBVSxDQUFDLEtBQUksQ0FBQ0MsUUFBTixFQUFnQixLQUFJLENBQUM3QyxNQUFMLENBQVk4QyxTQUE1QixDQUEvQjtBQUNYLEtBNU82SDs7QUFDMUgsUUFBTUMsTUFBTSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FBVyxLQUFLbEUsTUFBTCxDQUFZbUUsZ0JBQVosQ0FBNkIsS0FBN0IsQ0FBWCxDQUFmO0FBQ0EsU0FBS3RFLFVBQUwsR0FBa0JtRSxNQUFNLENBQUNJLEdBQVAsQ0FBVyxVQUFBQyxHQUFHLEVBQUk7QUFDaEMsVUFBTUMsTUFBTSxHQUFHRCxHQUFHLENBQUM3RCxLQUFKLEdBQVk2RCxHQUFHLENBQUM1RCxNQUEvQjtBQUNBLFVBQU1nQixZQUFZLEdBQUc0QyxHQUFHLENBQUNFLFlBQUosQ0FBaUIsbUJBQWpCLElBQXdDQyxNQUFNLENBQUNILEdBQUcsQ0FBQ0ksWUFBSixDQUFpQixtQkFBakIsQ0FBRCxDQUFOLEdBQWdELElBQXhGLEdBQStGLElBQXBIO0FBQ0EsVUFBTVYsU0FBUyxHQUFHTSxHQUFHLENBQUNFLFlBQUosQ0FBaUIsZ0JBQWpCLElBQXFDQyxNQUFNLENBQUNILEdBQUcsQ0FBQ0ksWUFBSixDQUFpQixnQkFBakIsQ0FBRCxDQUFOLEdBQTZDLElBQWxGLEdBQXlGLElBQTNHO0FBQ0EsVUFBTTlDLFFBQVEsR0FBRzBDLEdBQUcsQ0FBQ0UsWUFBSixDQUFpQixlQUFqQixJQUFvQ0YsR0FBRyxDQUFDSSxZQUFKLENBQWlCLGVBQWpCLENBQXBDLEdBQXdFLFVBQXpGO0FBQ0EsVUFBTXZELFNBQVMsR0FBR21ELEdBQUcsQ0FBQ0UsWUFBSixDQUFpQixnQkFBakIsSUFBcUNDLE1BQU0sQ0FBQ0gsR0FBRyxDQUFDSSxZQUFKLENBQWlCLGdCQUFqQixDQUFELENBQTNDLEdBQWtGLEVBQXBHO0FBQ0EsVUFBTWpELGVBQWUsR0FBRzZDLEdBQUcsQ0FBQ0UsWUFBSixDQUFpQixjQUFqQixJQUFtQ0MsTUFBTSxDQUFDSCxHQUFHLENBQUNJLFlBQUosQ0FBaUIsY0FBakIsQ0FBRCxDQUF6QyxHQUE4RSxDQUF0RztBQUNBLFVBQU1DLFFBQVEsR0FBR0wsR0FBRyxDQUFDRSxZQUFKLENBQWlCLGdCQUFqQixDQUFqQjtBQUNBLGFBQU87QUFDSEYsUUFBQUEsR0FBRyxFQUFIQSxHQURHO0FBRUhDLFFBQUFBLE1BQU0sRUFBTkEsTUFGRztBQUdIN0MsUUFBQUEsWUFBWSxFQUFaQSxZQUhHO0FBSUhzQyxRQUFBQSxTQUFTLEVBQVRBLFNBSkc7QUFLSHBDLFFBQUFBLFFBQVEsRUFBUkEsUUFMRztBQU1IVCxRQUFBQSxTQUFTLEVBQVRBLFNBTkc7QUFPSE0sUUFBQUEsZUFBZSxFQUFmQSxlQVBHO0FBUUhrRCxRQUFBQSxRQUFRLEVBQVJBO0FBUkcsT0FBUDtBQVVILEtBbEJpQixDQUFsQjtBQW9CQSxTQUFLMUUsTUFBTCxDQUFZMkUsV0FBWixDQUF3QixLQUFLQyxXQUE3QjtBQUNBLFNBQUs1RSxNQUFMLENBQVkyRSxXQUFaLENBQXdCLEtBQUtFLFdBQTdCOztBQUNBLFFBQU1DLFdBQVcsR0FBRyxLQUFLRixXQUFMLENBQWlCRyxVQUFqQixDQUE0QixJQUE1QixDQUFwQjs7QUFDQSxRQUFNQyxXQUFXLEdBQUcsS0FBS0gsV0FBTCxDQUFpQkUsVUFBakIsQ0FBNEIsSUFBNUIsQ0FBcEI7O0FBQ0EsUUFBSUQsV0FBVyxLQUFLLElBQWhCLElBQXdCRSxXQUFXLEtBQUssSUFBNUMsRUFBa0QsTUFBTUMsS0FBSyxDQUFDLDBCQUFELENBQVg7QUFDbEQsU0FBS0MsWUFBTCxHQUFvQkosV0FBcEI7QUFDQSxTQUFLaEUsa0JBQUwsR0FBMEJrRSxXQUExQjtBQUVBM0UsSUFBQUEsTUFBTSxDQUFDOEUsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBS0MsTUFBdkM7QUFDSDs7OzswQkErTWFDLEMsRUFBZ0JDLEcsRUFBOEI7QUFDeEQsVUFBSUQsQ0FBQyxDQUFDWCxRQUFOLEVBQWdCO0FBQ1osWUFBTWEsQ0FBQyxHQUFHRixDQUFDLENBQUNoQixHQUFGLENBQU01RCxNQUFoQjtBQUNBLFlBQU0rRSxDQUFDLEdBQUdILENBQUMsQ0FBQ2hCLEdBQUYsQ0FBTTdELEtBQWhCO0FBQ0E4RSxRQUFBQSxHQUFHLENBQUN6RSxTQUFKLENBQ0l3RSxDQUFDLENBQUNoQixHQUROLEVBRUksS0FBSzdELEtBQUwsR0FBYSxDQUFiLEdBQWlCZ0YsQ0FBQyxHQUFHLENBRnpCLEVBR0ksS0FBSy9FLE1BQUwsR0FBYSxDQUFiLEdBQWlCOEUsQ0FBQyxHQUFHLENBSHpCLEVBSUlDLENBSkosRUFJT0QsQ0FKUDtBQUtILE9BUkQsTUFRTyxJQUFJLEtBQUtqQixNQUFMLEdBQWNlLENBQUMsQ0FBQ2YsTUFBcEIsRUFBNEI7QUFFL0JnQixRQUFBQSxHQUFHLENBQUN6RSxTQUFKLENBQWN3RSxDQUFDLENBQUNoQixHQUFoQixFQUNJLENBREosRUFFSSxDQUFDLEtBQUs1RCxNQUFMLEdBQWMsS0FBS0QsS0FBTCxHQUFhNkUsQ0FBQyxDQUFDZixNQUE5QixJQUF3QyxDQUY1QyxFQUdJLEtBQUs5RCxLQUhULEVBSUksS0FBS0EsS0FBTCxHQUFhNkUsQ0FBQyxDQUFDZixNQUpuQjtBQUtILE9BUE0sTUFPQTtBQUVIZ0IsUUFBQUEsR0FBRyxDQUFDekUsU0FBSixDQUFjd0UsQ0FBQyxDQUFDaEIsR0FBaEIsRUFDSSxDQUFDLEtBQUs3RCxLQUFMLEdBQWEsS0FBS0MsTUFBTCxHQUFjNEUsQ0FBQyxDQUFDZixNQUE5QixJQUF3QyxDQUQ1QyxFQUVJLENBRkosRUFHSSxLQUFLN0QsTUFBTCxHQUFjNEUsQ0FBQyxDQUFDZixNQUhwQixFQUlJLEtBQUs3RCxNQUpUO0FBS0g7QUFFSjs7OzZCQUVnQjtBQUViLFdBQUtELEtBQUwsR0FBYUgsTUFBTSxDQUFDQyxVQUFwQjtBQUNBLFdBQUtHLE1BQUwsR0FBY0MsUUFBUSxDQUFDK0UsZUFBVCxDQUF5QkMsWUFBdkMsQ0FIYSxDQUd3Qzs7QUFDckQsV0FBS3BCLE1BQUwsR0FBYyxLQUFLOUQsS0FBTCxHQUFhLEtBQUtDLE1BQWhDO0FBRUEsV0FBS3lFLFlBQUwsQ0FBa0JTLE1BQWxCLENBQXlCbkYsS0FBekIsR0FBaUMsS0FBS0EsS0FBdEM7QUFDQSxXQUFLMEUsWUFBTCxDQUFrQlMsTUFBbEIsQ0FBeUJsRixNQUF6QixHQUFrQyxLQUFLQSxNQUF2QztBQUVBLFdBQUtLLGtCQUFMLENBQXdCNkUsTUFBeEIsQ0FBK0JuRixLQUEvQixHQUF1QyxLQUFLQSxLQUE1QztBQUNBLFdBQUtNLGtCQUFMLENBQXdCNkUsTUFBeEIsQ0FBK0JsRixNQUEvQixHQUF3QyxLQUFLQSxNQUE3QztBQUVBLFdBQUtJLFNBQUw7QUFDSDs7O2dDQUVtQjtBQUNoQixVQUFJLEtBQUtJLE1BQVQsRUFBaUI7QUFDYixhQUFLdUMsS0FBTCxDQUFXLEtBQUt2QyxNQUFoQixFQUF3QixLQUFLaUUsWUFBN0I7QUFDSCxPQUZELE1BRU87QUFDSCxjQUFNRCxLQUFLLENBQUMsY0FBYyxLQUFLbkYsVUFBbkIsR0FBZ0MsR0FBaEMsR0FBc0MsS0FBS0QsVUFBTCxDQUFnQkUsTUFBdkQsQ0FBWDtBQUNIO0FBQ0o7Ozs0QkFHTztBQUNKLFdBQUtELFVBQUwsR0FBa0IsQ0FBQyxDQUFuQjtBQUNBLFdBQUtnRSxRQUFMO0FBQ0EsV0FBS3NCLE1BQUw7QUFDSDs7OzJCQUVNO0FBQ0gsV0FBS3hCLGFBQUwsSUFBc0JnQyxZQUFZLENBQUMsS0FBS2hDLGFBQU4sQ0FBbEM7QUFDSDs7OzJCQUVNO0FBQ0gsVUFBSSxLQUFLMUQsSUFBTCxLQUFjUCxJQUFJLENBQUNrRyxhQUF2QixFQUNJLE1BQU1aLEtBQUssQ0FBQyxtQ0FBRCxDQUFYO0FBQ0osV0FBS25CLFFBQUw7QUFDSDs7O3dCQUdtQjtBQUNoQixhQUFPLEtBQUtqRSxVQUFMLENBQWdCRSxNQUF2QjtBQUNIOzs7Ozs7QUFHTCxDQUFDLFlBQVk7QUFFVFcsRUFBQUEsUUFBUSxDQUFDeUUsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQU07QUFDaER6RSxJQUFBQSxRQUFRLENBQUN5RCxnQkFBVCxDQUF1QyxTQUF2QyxFQUFrRDJCLE9BQWxELENBQTBELFVBQUFDLENBQUMsRUFBSTtBQUMzRCxVQUFNN0YsSUFBVSxHQUFHNkYsQ0FBQyxDQUFDeEIsWUFBRixDQUFlLGtCQUFmLElBQXFDNUUsSUFBSSxDQUFDa0csYUFBMUMsR0FBMERsRyxJQUFJLENBQUNRLElBQWxGO0FBQ0EsVUFBTTZGLE1BQWUsR0FBR0QsQ0FBQyxDQUFDeEIsWUFBRixDQUFlLGNBQWYsQ0FBeEI7QUFDQSxVQUFNdEUsS0FBSyxHQUFHOEYsQ0FBQyxDQUFDRSxPQUFGLENBQVUsU0FBVixDQUFkO0FBQ0EsVUFBSSxDQUFDaEcsS0FBTCxFQUFZLE1BQU1nRixLQUFLLENBQUMsc0NBQUQsQ0FBWDtBQUNaLFVBQU1pQixJQUFJLEdBQUcsSUFBSXRHLE1BQUosQ0FBV21HLENBQVgsRUFBYzlGLEtBQWQsRUFBcUJDLElBQXJCLEVBQTJCLENBQUM4RixNQUE1QixDQUFiLENBTDJELENBTTNEOztBQUNBRCxNQUFBQSxDQUFDLENBQUNJLE1BQUYsR0FBV0QsSUFBWDtBQUNILEtBUkQ7QUFVQUUsSUFBQUEsTUFBTSxDQUFDakIsZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsVUFBQ2tCLENBQUQsRUFBTztBQUMzQyxVQUFNQyxVQUFVLEdBQUdELENBQUMsQ0FBQ0UsYUFBRixDQUFnQkMsYUFBaEIsQ0FBOEIsU0FBOUIsQ0FBbkI7O0FBQ0EsVUFBSUYsVUFBSixFQUFnQjtBQUNaLFlBQU1KLElBQUksR0FBR0ksVUFBVSxDQUFDSCxNQUF4QjtBQUNBLFlBQUlELElBQUksQ0FBQ2hHLElBQUwsS0FBY1AsSUFBSSxDQUFDUSxJQUF2QixFQUNJK0YsSUFBSSxDQUFDTyxJQUFMLEdBREosS0FFSztBQUNELGNBQU1DLFVBQXFDLEdBQUdOLE1BQU0sQ0FBQ08sVUFBUCxDQUFrQlQsSUFBSSxDQUFDakcsS0FBdkIsQ0FBOUM7QUFDQSxjQUFNMkcsWUFBdUMsR0FBR1IsTUFBTSxDQUFDTyxVQUFQLENBQWtCTixDQUFDLENBQUNRLFlBQXBCLENBQWhEO0FBQ0EsY0FBTUMsUUFBUSxHQUFHVCxDQUFDLENBQUNRLFlBQUYsQ0FBZUUsTUFBZixHQUNiSCxZQUFZLENBQUNJLENBQWIsSUFBa0JOLFVBQVUsQ0FBQ00sQ0FBWCxJQUFnQixDQUFsQyxDQURhLEdBRWJKLFlBQVksQ0FBQ3JCLENBQWIsR0FBaUJtQixVQUFVLENBQUNuQixDQUZoQztBQUdBMEIsVUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlKLFFBQVo7O0FBQ0EsY0FBSUEsUUFBUSxHQUFHLENBQVgsSUFBZ0JBLFFBQVEsR0FBR1osSUFBSSxDQUFDaUIsYUFBcEMsRUFBbUQ7QUFDL0NkLFlBQUFBLENBQUMsQ0FBQ1EsWUFBRixDQUFlbEMsV0FBZixDQUEyQnVCLElBQUksQ0FBQ2xHLE1BQWhDO0FBQ0gsV0FGRCxNQUVPO0FBQ0hrRyxZQUFBQSxJQUFJLENBQUNPLElBQUw7QUFDQVAsWUFBQUEsSUFBSSxDQUFDakcsS0FBTCxDQUFXMEUsV0FBWCxDQUF1QnVCLElBQUksQ0FBQ2xHLE1BQTVCO0FBQ0g7QUFHSjtBQUNKOztBQUNELFVBQU1vSCxVQUFVLEdBQUdmLENBQUMsQ0FBQ1EsWUFBRixDQUFlTCxhQUFmLENBQTZCLFNBQTdCLENBQW5COztBQUNBLFVBQUlZLFVBQUosRUFBZ0I7QUFDWixZQUFJakIsTUFBTSxHQUFHaUIsVUFBVSxDQUFDakIsTUFBeEI7QUFDQSxZQUFJQSxNQUFNLENBQUNqRyxJQUFQLEtBQWdCUCxJQUFJLENBQUNRLElBQXJCLElBQTZCZ0csTUFBTSxDQUFDbEcsS0FBUCxLQUFpQm9HLENBQUMsQ0FBQ1EsWUFBcEQsRUFDSVYsTUFBTSxDQUFDa0IsS0FBUCxHQURKLEtBR0lsQixNQUFNLENBQUNtQixJQUFQO0FBRVA7QUFDSixLQWhDRDtBQWlDSCxHQTVDRDtBQStDSCxDQWpERCxJLENBbURBOzs7QUFFQSxJQUFJLENBQUNDLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkMsT0FBdkIsRUFBZ0M7QUFDNUJGLEVBQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkMsT0FBbEIsR0FDSUYsT0FBTyxDQUFDQyxTQUFSLENBQWtCRSxpQkFBbEIsSUFDQUgsT0FBTyxDQUFDQyxTQUFSLENBQWtCRyxxQkFGdEI7QUFHSDs7QUFFRCxJQUFJLENBQUNKLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQnZCLE9BQXZCLEVBQWdDO0FBQzVCc0IsRUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQWtCdkIsT0FBbEIsR0FBNEIsVUFBVTJCLENBQVYsRUFBYTtBQUNyQyxRQUFJQyxFQUFFLEdBQUcsSUFBVDs7QUFFQSxPQUFHO0FBQ0MsVUFBSU4sT0FBTyxDQUFDQyxTQUFSLENBQWtCQyxPQUFsQixDQUEwQkssSUFBMUIsQ0FBK0JELEVBQS9CLEVBQW1DRCxDQUFuQyxDQUFKLEVBQTJDLE9BQU9DLEVBQVA7QUFDM0NBLE1BQUFBLEVBQUUsR0FBR0EsRUFBRSxDQUFDRSxhQUFILElBQW9CRixFQUFFLENBQUNHLFVBQTVCO0FBQ0gsS0FIRCxRQUdTSCxFQUFFLEtBQUssSUFBUCxJQUFlQSxFQUFFLENBQUNJLFFBQUgsS0FBZ0IsQ0FIeEM7O0FBSUEsV0FBTyxJQUFQO0FBQ0gsR0FSRDtBQVNIIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuXHRUbyBEb1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Rml4IGRpYWdvbmFsIHdpcGVcblx0Zml4IHJhZGlhbCB3aXBlXG5cblxuV2VieWFybnMgdmVyc2lvbjpcbi0gQWRkZWQgXCJkZXN0cm95XCIgZmxhZyBhbmQgbWV0aG9kXG4tIEFkZGVkIHN1cHBvcnQgZm9yIGBkYXRhLXN0YXJ0QXRgIHRvIHNldCBzdGFydCBwZXJjZW50YWdlXG4tIG9uIGRlc3Ryb3kgcmVtb3ZlIGNyZWF0ZWQgZWxlbWVudHNcbiovXG5cbmVudW0gTW9kZSB7XG4gICAgQVVUTywgTVVMVElfU0VDVElPTlxufVxuXG5pbnRlcmZhY2UgSW1hZ2VPYmplY3Qge1xuICAgIHN0YXJ0UGVyY2VudGFnZTogbnVtYmVyO1xuICAgIGZhZGVXaWR0aDogbnVtYmVyO1xuICAgIGZhZGVUeXBlOiBzdHJpbmcgfCBudWxsO1xuICAgIGZhZGVEZWxheTogbnVtYmVyO1xuICAgIGZhZGVEdXJhdGlvbjogbnVtYmVyO1xuICAgIGFzcGVjdDogbnVtYmVyO1xuICAgIGltZzogSFRNTEltYWdlRWxlbWVudDtcbiAgICBub1Jlc2l6ZTogYm9vbGVhbjtcbn1cblxuY2xhc3MgU1dXaXBlIHtcblxuICAgIGN1cnJlbnRJZHggPSAtMTtcbiAgICB3aWR0aDogbnVtYmVyID0gd2luZG93LmlubmVyV2lkdGg7XHRcdFx0XHQvLyB3aWR0aCBvZiBjb250YWluZXIgKGJhbm5lcilcbiAgICBoZWlnaHQ6IG51bWJlciA9IHdpbmRvdy5pbm5lckhlaWdodDtcdFx0XHRcdC8vIGhlaWdodCBvZiBjb250YWluZXJcbiAgICBhc3BlY3Q6IG51bWJlciA9IHRoaXMud2lkdGggLyB0aGlzLmhlaWdodDtcdFx0XHRcdC8vIGFzcGVjdCByYXRpbyBvZiBjb250YWluZXJcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgaW1hZ2VBcnJheTogSW1hZ2VPYmplY3RbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9iYWNrQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZvcmVDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfYmFja0NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9mb3JlZ3JvdW5kQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgcHJpdmF0ZSBwZXJjZW50OiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgc3RhcnRUaW1lOiBEYXRlID0gbmV3IERhdGU7XG4gICAgcHJpdmF0ZSBuZXh0RmFkZVRpbWVyOiBOb2RlSlMuVGltZW91dCB8IG51bGwgPSBudWxsO1xuXG5cbiAgICBwcml2YXRlIGdldCBjdXJJbWcoKTogSW1hZ2VPYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZUFycmF5W3RoaXMuY3VycmVudElkeF07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgbnh0SW1nKCk6IEltYWdlT2JqZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VBcnJheVsodGhpcy5jdXJyZW50SWR4ICsgMSkgJSB0aGlzLmltYWdlQXJyYXkubGVuZ3RoXTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBiYW5uZXI6IEhUTUxFbGVtZW50LCByZWFkb25seSBvd25lcjogSFRNTEVsZW1lbnQsIHJlYWRvbmx5IG1vZGU6IE1vZGUgPSBNb2RlLkFVVE8sIHJlYWRvbmx5IGxvb3AgPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGltYWdlcyA9IEFycmF5LmZyb20odGhpcy5iYW5uZXIucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKSk7XG4gICAgICAgIHRoaXMuaW1hZ2VBcnJheSA9IGltYWdlcy5tYXAoaW1nID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFzcGVjdCA9IGltZy53aWR0aCAvIGltZy5oZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBmYWRlRHVyYXRpb24gPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1mYWRlRHVyYXRpb25cIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtZmFkZUR1cmF0aW9uXCIpKSAqIDEwMDAgOiAxMDAwO1xuICAgICAgICAgICAgY29uc3QgZmFkZURlbGF5ID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZURlbGF5XCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZhZGVEZWxheVwiKSkgKiAxMDAwIDogMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVUeXBlID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZVR5cGVcIikgPyBpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlVHlwZVwiKSA6IFwiY3Jvc3MtbHJcIjtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVXaWR0aCA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZhZGVXaWR0aFwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlV2lkdGhcIikpIDogLjE7XG4gICAgICAgICAgICBjb25zdCBzdGFydFBlcmNlbnRhZ2UgPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1zdGFydEF0XCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0YXJ0QXRcIikpIDogMDtcbiAgICAgICAgICAgIGNvbnN0IG5vUmVzaXplID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtbm8tcmVzaXplXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgYXNwZWN0LFxuICAgICAgICAgICAgICAgIGZhZGVEdXJhdGlvbixcbiAgICAgICAgICAgICAgICBmYWRlRGVsYXksXG4gICAgICAgICAgICAgICAgZmFkZVR5cGUsXG4gICAgICAgICAgICAgICAgZmFkZVdpZHRoLFxuICAgICAgICAgICAgICAgIHN0YXJ0UGVyY2VudGFnZSxcbiAgICAgICAgICAgICAgICBub1Jlc2l6ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuYmFubmVyLmFwcGVuZENoaWxkKHRoaXMuX2JhY2tDYW52YXMpO1xuICAgICAgICB0aGlzLmJhbm5lci5hcHBlbmRDaGlsZCh0aGlzLl9mb3JlQ2FudmFzKTtcbiAgICAgICAgY29uc3QgYmFja0NvbnRleHQgPSB0aGlzLl9iYWNrQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgICAgICBjb25zdCBmb3JlQ29udGV4dCA9IHRoaXMuX2ZvcmVDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICBpZiAoYmFja0NvbnRleHQgPT09IG51bGwgfHwgZm9yZUNvbnRleHQgPT09IG51bGwpIHRocm93IEVycm9yKFwiMmQgY29udGV4dCBub3Qgc3VwcG9ydGVkXCIpXG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0ID0gYmFja0NvbnRleHQ7XG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0ID0gZm9yZUNvbnRleHQ7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG5leHRGYWRlID0gKCkgPT4ge1xuICAgICAgICAvLyBhZHZhbmNlIGluZGljZXNcbiAgICAgICAgdGhpcy5jdXJyZW50SWR4ID0gKyt0aGlzLmN1cnJlbnRJZHggJSB0aGlzLmltYWdlQXJyYXkubGVuZ3RoO1xuICAgICAgICB0aGlzLmRyYXdJbWFnZSgpO1xuXG4gICAgICAgIC8vIGNsZWFyIHRoZSBmb3JlZ3JvdW5kXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgLy8gc2V0dXAgYW5kIHN0YXJ0IHRoZSBmYWRlXG4gICAgICAgIHRoaXMucGVyY2VudCA9IC10aGlzLmN1ckltZy5mYWRlV2lkdGg7XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGU7XG4gICAgICAgIHRoaXMucmVkcmF3KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWRyYXcgPSAoKSA9PiB7XG4gICAgICAgIC8vIGNhbGN1bGF0ZSBwZXJjZW50IGNvbXBsZXRpb24gb2Ygd2lwZVxuICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IG5ldyBEYXRlO1xuICAgICAgICBjb25zdCBlbGFwc2VkID0gY3VycmVudFRpbWUuZ2V0VGltZSgpIC0gdGhpcy5zdGFydFRpbWUuZ2V0VGltZSgpO1xuICAgICAgICB0aGlzLnBlcmNlbnQgPSB0aGlzLmN1ckltZy5zdGFydFBlcmNlbnRhZ2UgKyBlbGFwc2VkIC8gdGhpcy5jdXJJbWcuZmFkZUR1cmF0aW9uO1xuXG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuc2F2ZSgpO1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICBjb25zdCBmYWRlV2lkdGggPSB0aGlzLmN1ckltZy5mYWRlV2lkdGhcblxuICAgICAgICBzd2l0Y2ggKHRoaXMuY3VySW1nLmZhZGVUeXBlKSB7XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1sclwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDApO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1ybFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDApO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy11ZFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgMCwgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAwLCAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1kdVwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgMCwgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAwLCAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJkaWFnb25hbC10bC1iclwiOiB7Ly8gRFM6IFRoaXMgZGlhZ29uYWwgbm90IHdvcmtpbmcgcHJvcGVybHlcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMiArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgyICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCBmYWRlV2lkdGggKiAodGhpcy53aWR0aCAvICh0aGlzLmhlaWdodCAvIDIpKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImRpYWdvbmFsLXRyLWJsXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDAsXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCArIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtYnRtXCI6IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzID0gMzAwOyAvLyB0aGUgYW1vdW50IG9mIHNlZ21lbnRzIHRvIHNwbGl0IHRoZSBzZW1pIGNpcmNsZSBpbnRvLCBEUzogYWRqdXN0IHRoaXMgZm9yIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSAxIC8gc2VnbWVudHM7XG5cbiAgICAgICAgICAgICAgICAvLyBleHBhbmQgcGVyY2VudCB0byBjb3ZlciBmYWRlV2lkdGhcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFBlcmNlbnQgPSB0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIGEgcGVyY2VudFxuICAgICAgICAgICAgICAgIGZvciAobGV0IHByY3QgPSAtZmFkZVdpZHRoOyBwcmN0IDwgMSArIGZhZGVXaWR0aDsgcHJjdCArPSBzdGVwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCBwZXJjZW50IHRvIGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gcHJjdCAqIE1hdGguUEk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGNvb3JkaW5hdGVzIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MSA9IE1hdGguY29zKGFuZ2xlICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MSA9IE1hdGguc2luKGFuZ2xlICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MiA9IE1hdGguY29zKGFuZ2xlICsgbGVuICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MiA9IE1hdGguc2luKGFuZ2xlICsgbGVuICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBhbHBoYSBmb3Igd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxwaGEgPSAoYWRqdXN0ZWRQZXJjZW50IC0gcHJjdCArIGZhZGVXaWR0aCkgLyBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZHJhdyB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubW92ZVRvKHRoaXMud2lkdGggLyAyIC0gMiwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8oeDEsIHkxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgyLCB5Mik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh0aGlzLndpZHRoIC8gMiArIDIsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsJyArIGFscGhhICsgJyknO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtdG9wXCI6IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzID0gMzAwOyAvLyB0aGUgYW1vdW50IG9mIHNlZ21lbnRzIHRvIHNwbGl0IHRoZSBzZW1pIGNpcmNsZSBpbnRvLCBEUzogYWRqdXN0IHRoaXMgZm9yIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSAxIC8gc2VnbWVudHM7XG5cbiAgICAgICAgICAgICAgICAvLyBleHBhbmQgcGVyY2VudCB0byBjb3ZlciBmYWRlV2lkdGhcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFBlcmNlbnQgPSB0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIGEgcGVyY2VudFxuICAgICAgICAgICAgICAgIGZvciAobGV0IHBlcmNlbnQgPSAtZmFkZVdpZHRoOyBwZXJjZW50IDwgMSArIGZhZGVXaWR0aDsgcGVyY2VudCArPSBzdGVwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCBwZXJjZW50IHRvIGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gcGVyY2VudCAqIE1hdGguUEk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGNvb3JkaW5hdGVzIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MSA9IE1hdGguY29zKGFuZ2xlICsgbGVuICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTEgPSBNYXRoLnNpbihhbmdsZSArIGxlbiArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MiA9IE1hdGguY29zKGFuZ2xlICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTIgPSBNYXRoLnNpbihhbmdsZSArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGFscGhhIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbHBoYSA9IChhZGp1c3RlZFBlcmNlbnQgLSBwZXJjZW50ICsgZmFkZVdpZHRoKSAvIGZhZGVXaWR0aDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBkcmF3IHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5tb3ZlVG8odGhpcy53aWR0aCAvIDIgLSAyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgxLCB5MSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh4MiwgeTIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8odGhpcy53aWR0aCAvIDIgKyAyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsJyArIGFscGhhICsgJyknO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtb3V0XCI6XG4gICAgICAgICAgICBjYXNlIFwicmFkaWFsLWluXCI6IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGlubmVyUmFkaXVzID0gKHRoaXMucGVyY2VudCkgKiB0aGlzLmhlaWdodCAtIDEwMCA8IDAgPyAuMDEgOiAodGhpcy5wZXJjZW50KSAqIHRoaXMuaGVpZ2h0IC0gMTAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IG91dGVyUmFkaXVzID0gdGhpcy5wZXJjZW50ICogdGhpcy5oZWlnaHQgKyAxMDBcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHRoaXMud2lkdGggLyAyLCB0aGlzLmhlaWdodCAvIDIsIGlubmVyUmFkaXVzLCB0aGlzLndpZHRoIC8gMiwgdGhpcy5oZWlnaHQgLyAyLCBvdXRlclJhZGl1cyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJzb3VyY2UtaW5cIjtcbiAgICAgICAgdGhpcy5fZHJhdyh0aGlzLm54dEltZywgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQpXG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQucmVzdG9yZSgpO1xuXG5cbiAgICAgICAgaWYgKGVsYXBzZWQgPCB0aGlzLmN1ckltZy5mYWRlRHVyYXRpb24pXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVkcmF3KTtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5tb2RlID09PSBNb2RlLkFVVE8pXG4gICAgICAgICAgICBpZiAodGhpcy5sb29wIHx8IHRoaXMuY3VycmVudElkeCA8IHRoaXMuaW1hZ2VBcnJheS5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICAgIHRoaXMubmV4dEZhZGVUaW1lciA9IHNldFRpbWVvdXQodGhpcy5uZXh0RmFkZSwgdGhpcy5jdXJJbWcuZmFkZURlbGF5KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9kcmF3KGk6IEltYWdlT2JqZWN0LCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCl7XG4gICAgICAgIGlmIChpLm5vUmVzaXplKSB7XG4gICAgICAgICAgICBjb25zdCBoID0gaS5pbWcuaGVpZ2h0XG4gICAgICAgICAgICBjb25zdCB3ID0gaS5pbWcud2lkdGhcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoXG4gICAgICAgICAgICAgICAgaS5pbWcsXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIDIgLSB3IC8gMixcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAvMiAtIGggLyAyLFxuICAgICAgICAgICAgICAgIHcsIGgpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hc3BlY3QgPiBpLmFzcGVjdCkge1xuXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKGkuaW1nLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgKHRoaXMuaGVpZ2h0IC0gdGhpcy53aWR0aCAvIGkuYXNwZWN0KSAvIDIsXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoIC8gaS5hc3BlY3QpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKGkuaW1nLFxuICAgICAgICAgICAgICAgICh0aGlzLndpZHRoIC0gdGhpcy5oZWlnaHQgKiBpLmFzcGVjdCkgLyAyLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgKiBpLmFzcGVjdCxcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByaXZhdGUgcmVzaXplKCkge1xuXG4gICAgICAgIHRoaXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyAvLyBEUzogZml4IGZvciBpT1MgOSBidWdcbiAgICAgICAgdGhpcy5hc3BlY3QgPSB0aGlzLndpZHRoIC8gdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5fYmFja0NvbnRleHQuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5fYmFja0NvbnRleHQuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuICAgICAgICB0aGlzLmRyYXdJbWFnZSgpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGRyYXdJbWFnZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VySW1nKSB7XG4gICAgICAgICAgICB0aGlzLl9kcmF3KHRoaXMuY3VySW1nLCB0aGlzLl9iYWNrQ29udGV4dClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwibm8gaW1hZ2UgXCIgKyB0aGlzLmN1cnJlbnRJZHggKyBcIiBcIiArIHRoaXMuaW1hZ2VBcnJheS5sZW5ndGgpXG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRJZHggPSAtMVxuICAgICAgICB0aGlzLm5leHRGYWRlKCk7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5uZXh0RmFkZVRpbWVyICYmIGNsZWFyVGltZW91dCh0aGlzLm5leHRGYWRlVGltZXIpXG4gICAgfVxuXG4gICAgbmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMubW9kZSAhPT0gTW9kZS5NVUxUSV9TRUNUSU9OKVxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJUaGlzIHN3d2lwZSBvcGVyYXRlcyBpbiBBVVRPIG1vZGVcIilcbiAgICAgICAgdGhpcy5uZXh0RmFkZSgpXG4gICAgfVxuXG5cbiAgICBnZXQgbnVtYmVyT2ZGYWRlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VBcnJheS5sZW5ndGhcbiAgICB9XG59XG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmJhbm5lclwiKS5mb3JFYWNoKGIgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZTogTW9kZSA9IGIuaGFzQXR0cmlidXRlKFwiZGF0YS1tdWx0aS1zd2lwZVwiKSA/IE1vZGUuTVVMVElfU0VDVElPTiA6IE1vZGUuQVVUT1xuICAgICAgICAgICAgY29uc3Qgbm9Mb29wOiBib29sZWFuID0gYi5oYXNBdHRyaWJ1dGUoXCJkYXRhLW5vLWxvb3BcIilcbiAgICAgICAgICAgIGNvbnN0IG93bmVyID0gYi5jbG9zZXN0KFwic2VjdGlvblwiKVxuICAgICAgICAgICAgaWYgKCFvd25lcikgdGhyb3cgRXJyb3IoXCJiYW5uZXIgZWxlbWVudCBub3QgcGFydCBvZiBhIHNlY3Rpb25cIilcbiAgICAgICAgICAgIGNvbnN0IHdpcGUgPSBuZXcgU1dXaXBlKGIsIG93bmVyLCBtb2RlLCAhbm9Mb29wKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGIuc3N3aXBlID0gd2lwZTtcbiAgICAgICAgfSlcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihcInNsaWRlY2hhbmdlZFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJldkJhbm5lciA9IGUucHJldmlvdXNTbGlkZS5xdWVyeVNlbGVjdG9yKFwiLmJhbm5lclwiKTtcbiAgICAgICAgICAgIGlmIChwcmV2QmFubmVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2lwZSA9IHByZXZCYW5uZXIuc3N3aXBlIGFzIFNXV2lwZTtcbiAgICAgICAgICAgICAgICBpZiAod2lwZS5tb2RlID09PSBNb2RlLkFVVE8pXG4gICAgICAgICAgICAgICAgICAgIHdpcGUuc3RvcCgpO1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvd25lckluZGV4OiB7IGg6IG51bWJlcjsgdjogbnVtYmVyOyB9ID0gUmV2ZWFsLmdldEluZGljZXMod2lwZS5vd25lcilcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEluZGV4OiB7IGg6IG51bWJlcjsgdjogbnVtYmVyOyB9ID0gUmV2ZWFsLmdldEluZGljZXMoZS5jdXJyZW50U2xpZGUpXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gZS5jdXJyZW50U2xpZGUuaW5kZXhWID9cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleC52IC0gKG93bmVySW5kZXgudiB8fCAwKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXguaCAtIG93bmVySW5kZXguaFxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkaXN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA+IDAgJiYgZGlzdGFuY2UgPCB3aXBlLm51bWJlck9mRmFkZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY3VycmVudFNsaWRlLmFwcGVuZENoaWxkKHdpcGUuYmFubmVyKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lwZS5zdG9wKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpcGUub3duZXIuYXBwZW5kQ2hpbGQod2lwZS5iYW5uZXIpXG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV4dEJhbm5lciA9IGUuY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3IoXCIuYmFubmVyXCIpO1xuICAgICAgICAgICAgaWYgKG5leHRCYW5uZXIpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3N3aXBlID0gbmV4dEJhbm5lci5zc3dpcGUgYXMgU1dXaXBlO1xuICAgICAgICAgICAgICAgIGlmIChzc3dpcGUubW9kZSA9PT0gTW9kZS5BVVRPIHx8IHNzd2lwZS5vd25lciA9PT0gZS5jdXJyZW50U2xpZGUpXG4gICAgICAgICAgICAgICAgICAgIHNzd2lwZS5zdGFydCgpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgc3N3aXBlLm5leHQoKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0pXG5cblxufSkoKVxuXG4vLyBgY2xvc2VzdGAgUG9seWZpbGwgZm9yIElFXG5cbmlmICghRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykge1xuICAgIEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgPVxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS53ZWJraXRNYXRjaGVzU2VsZWN0b3I7XG59XG5cbmlmICghRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCkge1xuICAgIEVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QgPSBmdW5jdGlvbiAocykge1xuICAgICAgICB2YXIgZWwgPSB0aGlzO1xuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGlmIChFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzLmNhbGwoZWwsIHMpKSByZXR1cm4gZWw7XG4gICAgICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQgfHwgZWwucGFyZW50Tm9kZTtcbiAgICAgICAgfSB3aGlsZSAoZWwgIT09IG51bGwgJiYgZWwubm9kZVR5cGUgPT09IDEpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xufVxuXG4iXX0=