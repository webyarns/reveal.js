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

    _classCallCheck(this, SWWipe);

    this.banner = banner;
    this.owner = owner;
    this.mode = mode;

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

      if (_this.aspect > _this.nxtImg.aspect) {
        _this._foregroundContext.drawImage(_this.nxtImg.img, 0, (_this.height - _this.width / _this.nxtImg.aspect) / 2, _this.width, _this.width / _this.nxtImg.aspect);
      } else {
        _this._foregroundContext.drawImage(_this.nxtImg.img, (_this.width - _this.height * _this.nxtImg.aspect) / 2, 0, _this.height * _this.nxtImg.aspect, _this.height);
      }

      _this._foregroundContext.restore();

      if (elapsed < _this.curImg.fadeDuration) window.requestAnimationFrame(_this.redraw);else if (_this.mode === Mode.AUTO) _this.nextFadeTimer = setTimeout(_this.nextFade, _this.curImg.fadeDelay);
    });

    var images = Array.from(this.banner.querySelectorAll("img"));
    this.imageArray = images.map(function (img) {
      var aspect = img.width / img.height;
      var fadeDuration = img.hasAttribute("data-fadeDuration") ? Number(img.getAttribute("data-fadeDuration")) * 1000 : 1000;
      var fadeDelay = img.hasAttribute("data-fadeDelay") ? Number(img.getAttribute("data-fadeDelay")) * 1000 : 1000;
      var fadeType = img.hasAttribute("data-fadeType") ? img.getAttribute("data-fadeType") : "cross-lr";
      var fadeWidth = img.hasAttribute("data-fadeWidth") ? Number(img.getAttribute("data-fadeWidth")) : .1;
      var startPercentage = img.hasAttribute("data-startAt") ? Number(img.getAttribute("data-startAt")) : 0;
      return {
        img: img,
        aspect: aspect,
        fadeDuration: fadeDuration,
        fadeDelay: fadeDelay,
        fadeType: fadeType,
        fadeWidth: fadeWidth,
        startPercentage: startPercentage
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
        if (this.aspect > this.curImg.aspect) {
          this._backContext.drawImage(this.curImg.img, 0, (this.height - this.width / this.curImg.aspect) / 2, this.width, this.width / this.curImg.aspect);
        } else {
          this._backContext.drawImage(this.curImg.img, (this.width - this.height * this.curImg.aspect) / 2, 0, this.height * this.curImg.aspect, this.height);
        }
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
      var owner = b.closest("section");
      if (!owner) throw Error("banner element not part of a section");
      var wipe = new SWWipe(b, owner, mode); // @ts-ignore

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy1zd3dpcGUudHMiXSwibmFtZXMiOlsiTW9kZSIsIlNXV2lwZSIsImltYWdlQXJyYXkiLCJjdXJyZW50SWR4IiwibGVuZ3RoIiwiYmFubmVyIiwib3duZXIiLCJtb2RlIiwiQVVUTyIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsIndpZHRoIiwiaGVpZ2h0IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiRGF0ZSIsImRyYXdJbWFnZSIsIl9mb3JlZ3JvdW5kQ29udGV4dCIsImNsZWFyUmVjdCIsInBlcmNlbnQiLCJjdXJJbWciLCJmYWRlV2lkdGgiLCJzdGFydFRpbWUiLCJyZWRyYXciLCJjdXJyZW50VGltZSIsImVsYXBzZWQiLCJnZXRUaW1lIiwic3RhcnRQZXJjZW50YWdlIiwiZmFkZUR1cmF0aW9uIiwic2F2ZSIsImZhZGVUeXBlIiwiZ3JhZGllbnQiLCJjcmVhdGVMaW5lYXJHcmFkaWVudCIsImFkZENvbG9yU3RvcCIsImZpbGxTdHlsZSIsImZpbGxSZWN0Iiwic2VnbWVudHMiLCJsZW4iLCJNYXRoIiwiUEkiLCJzdGVwIiwiYWRqdXN0ZWRQZXJjZW50IiwicHJjdCIsImFuZ2xlIiwieDEiLCJjb3MiLCJ5MSIsInNpbiIsIngyIiwieTIiLCJhbHBoYSIsImJlZ2luUGF0aCIsIm1vdmVUbyIsImxpbmVUbyIsImZpbGwiLCJpbm5lclJhZGl1cyIsIm91dGVyUmFkaXVzIiwiY3JlYXRlUmFkaWFsR3JhZGllbnQiLCJnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24iLCJhc3BlY3QiLCJueHRJbWciLCJpbWciLCJyZXN0b3JlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibmV4dEZhZGVUaW1lciIsInNldFRpbWVvdXQiLCJuZXh0RmFkZSIsImZhZGVEZWxheSIsImltYWdlcyIsIkFycmF5IiwiZnJvbSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJtYXAiLCJoYXNBdHRyaWJ1dGUiLCJOdW1iZXIiLCJnZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsIl9iYWNrQ2FudmFzIiwiX2ZvcmVDYW52YXMiLCJiYWNrQ29udGV4dCIsImdldENvbnRleHQiLCJmb3JlQ29udGV4dCIsIkVycm9yIiwiX2JhY2tDb250ZXh0IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlc2l6ZSIsImRvY3VtZW50RWxlbWVudCIsImNsaWVudEhlaWdodCIsImNhbnZhcyIsImNsZWFyVGltZW91dCIsIk1VTFRJX1NFQ1RJT04iLCJmb3JFYWNoIiwiYiIsImNsb3Nlc3QiLCJ3aXBlIiwic3N3aXBlIiwiUmV2ZWFsIiwiZSIsInByZXZCYW5uZXIiLCJwcmV2aW91c1NsaWRlIiwicXVlcnlTZWxlY3RvciIsInN0b3AiLCJvd25lckluZGV4IiwiZ2V0SW5kaWNlcyIsImN1cnJlbnRJbmRleCIsImN1cnJlbnRTbGlkZSIsImRpc3RhbmNlIiwiaW5kZXhWIiwidiIsImgiLCJjb25zb2xlIiwibG9nIiwibnVtYmVyT2ZGYWRlcyIsIm5leHRCYW5uZXIiLCJzdGFydCIsIm5leHQiLCJFbGVtZW50IiwicHJvdG90eXBlIiwibWF0Y2hlcyIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwid2Via2l0TWF0Y2hlc1NlbGVjdG9yIiwicyIsImVsIiwiY2FsbCIsInBhcmVudEVsZW1lbnQiLCJwYXJlbnROb2RlIiwibm9kZVR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7OztJQWNLQSxJOztXQUFBQSxJO0FBQUFBLEVBQUFBLEksQ0FBQUEsSTtBQUFBQSxFQUFBQSxJLENBQUFBLEk7R0FBQUEsSSxLQUFBQSxJOztJQWNDQyxNOzs7OztBQUdvQztBQUNFO0FBQ007d0JBYVo7QUFDOUIsYUFBTyxLQUFLQyxVQUFMLENBQWdCLEtBQUtDLFVBQXJCLENBQVA7QUFDSDs7O3dCQUVpQztBQUM5QixhQUFPLEtBQUtELFVBQUwsQ0FBZ0IsQ0FBQyxLQUFLQyxVQUFMLEdBQWtCLENBQW5CLElBQXdCLEtBQUtELFVBQUwsQ0FBZ0JFLE1BQXhELENBQVA7QUFDSDs7O0FBRUQsa0JBQXFCQyxNQUFyQixFQUFtREMsS0FBbkQsRUFBd0c7QUFBQTs7QUFBQSxRQUF4QkMsSUFBd0IsdUVBQVhQLElBQUksQ0FBQ1EsSUFBTTs7QUFBQTs7QUFBQSxTQUFuRkgsTUFBbUYsR0FBbkZBLE1BQW1GO0FBQUEsU0FBckRDLEtBQXFELEdBQXJEQSxLQUFxRDtBQUFBLFNBQXhCQyxJQUF3QixHQUF4QkEsSUFBd0I7O0FBQUEsd0NBeEIzRixDQUFDLENBd0IwRjs7QUFBQSxtQ0F2QnhGRSxNQUFNLENBQUNDLFVBdUJpRjs7QUFBQSxvQ0F0QnZGRCxNQUFNLENBQUNFLFdBc0JnRjs7QUFBQSxvQ0FyQnZGLEtBQUtDLEtBQUwsR0FBYSxLQUFLQyxNQXFCcUU7O0FBQUE7O0FBQUEseUNBbEJ0REMsUUFBUSxDQUFDQyxhQUFULENBQXVCLFFBQXZCLENBa0JzRDs7QUFBQSx5Q0FqQnRERCxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FpQnNEOztBQUFBOztBQUFBOztBQUFBLHFDQWI5RSxDQWE4RTs7QUFBQSx1Q0FaOUUsSUFBSUMsSUFBSixFQVk4RTs7QUFBQSwyQ0FYekQsSUFXeUQ7O0FBQUEsc0NBK0JyRixZQUFNO0FBQ3JCO0FBQ0EsTUFBQSxLQUFJLENBQUNiLFVBQUwsR0FBa0IsRUFBRSxLQUFJLENBQUNBLFVBQVAsR0FBb0IsS0FBSSxDQUFDRCxVQUFMLENBQWdCRSxNQUF0RDs7QUFDQSxNQUFBLEtBQUksQ0FBQ2EsU0FBTCxHQUhxQixDQUtyQjs7O0FBQ0EsTUFBQSxLQUFJLENBQUNDLGtCQUFMLENBQXdCQyxTQUF4QixDQUFrQyxDQUFsQyxFQUFxQyxDQUFyQyxFQUF3QyxLQUFJLENBQUNQLEtBQTdDLEVBQW9ELEtBQUksQ0FBQ0MsTUFBekQsRUFOcUIsQ0FRckI7OztBQUNBLE1BQUEsS0FBSSxDQUFDTyxPQUFMLEdBQWUsQ0FBQyxLQUFJLENBQUNDLE1BQUwsQ0FBWUMsU0FBNUI7QUFDQSxNQUFBLEtBQUksQ0FBQ0MsU0FBTCxHQUFpQixJQUFJUCxJQUFKLEVBQWpCOztBQUNBLE1BQUEsS0FBSSxDQUFDUSxNQUFMO0FBQ0gsS0EzQ3VHOztBQUFBLG9DQTZDdkYsWUFBTTtBQUNuQjtBQUNBLFVBQU1DLFdBQVcsR0FBRyxJQUFJVCxJQUFKLEVBQXBCOztBQUNBLFVBQU1VLE9BQU8sR0FBR0QsV0FBVyxDQUFDRSxPQUFaLEtBQXdCLEtBQUksQ0FBQ0osU0FBTCxDQUFlSSxPQUFmLEVBQXhDOztBQUNBLE1BQUEsS0FBSSxDQUFDUCxPQUFMLEdBQWUsS0FBSSxDQUFDQyxNQUFMLENBQVlPLGVBQVosR0FBOEJGLE9BQU8sR0FBRyxLQUFJLENBQUNMLE1BQUwsQ0FBWVEsWUFBbkU7O0FBR0EsTUFBQSxLQUFJLENBQUNYLGtCQUFMLENBQXdCWSxJQUF4Qjs7QUFDQSxNQUFBLEtBQUksQ0FBQ1osa0JBQUwsQ0FBd0JDLFNBQXhCLENBQWtDLENBQWxDLEVBQXFDLENBQXJDLEVBQXdDLEtBQUksQ0FBQ1AsS0FBN0MsRUFBb0QsS0FBSSxDQUFDQyxNQUF6RDs7QUFDQSxVQUFNUyxTQUFTLEdBQUcsS0FBSSxDQUFDRCxNQUFMLENBQVlDLFNBQTlCOztBQUVBLGNBQVEsS0FBSSxDQUFDRCxNQUFMLENBQVlVLFFBQXBCO0FBRUksYUFBSyxVQUFMO0FBQWlCO0FBQ2IsZ0JBQU1DLFFBQVEsR0FBRyxLQUFJLENBQUNkLGtCQUFMLENBQXdCZSxvQkFBeEIsQ0FDYixDQUFDLEtBQUksQ0FBQ2IsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBbEMsSUFBK0MsS0FBSSxDQUFDVixLQUR2QyxFQUM4QyxDQUQ5QyxFQUViLENBQUMsS0FBSSxDQUFDUSxPQUFMLElBQWdCLElBQUlFLFNBQXBCLElBQWlDQSxTQUFsQyxJQUErQyxLQUFJLENBQUNWLEtBRnZDLEVBRThDLENBRjlDLENBQWpCOztBQUdBb0IsWUFBQUEsUUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCO0FBQ0FGLFlBQUFBLFFBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjtBQUNBLFlBQUEsS0FBSSxDQUFDaEIsa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQ0gsUUFBcEM7O0FBQ0EsWUFBQSxLQUFJLENBQUNkLGtCQUFMLENBQXdCa0IsUUFBeEIsQ0FBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBSSxDQUFDeEIsS0FBNUMsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFDQTtBQUNIOztBQUVELGFBQUssVUFBTDtBQUFpQjtBQUNiLGdCQUFNbUIsU0FBUSxHQUFHLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JlLG9CQUF4QixDQUNiLENBQUMsQ0FBQyxJQUFJLEtBQUksQ0FBQ2IsT0FBVixLQUFzQixJQUFJRSxTQUExQixJQUF1Q0EsU0FBeEMsSUFBcUQsS0FBSSxDQUFDVixLQUQ3QyxFQUNvRCxDQURwRCxFQUViLENBQUMsQ0FBQyxJQUFJLEtBQUksQ0FBQ1EsT0FBVixLQUFzQixJQUFJRSxTQUExQixJQUF1Q0EsU0FBeEMsSUFBcUQsS0FBSSxDQUFDVixLQUY3QyxFQUVvRCxDQUZwRCxDQUFqQjs7QUFHQW9CLFlBQUFBLFNBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsWUFBQUEsU0FBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBLFlBQUEsS0FBSSxDQUFDaEIsa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQ0gsU0FBcEM7O0FBQ0EsWUFBQSxLQUFJLENBQUNkLGtCQUFMLENBQXdCa0IsUUFBeEIsQ0FBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBSSxDQUFDeEIsS0FBNUMsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFDQTtBQUNIOztBQUVELGFBQUssVUFBTDtBQUFpQjtBQUNiLGdCQUFNbUIsVUFBUSxHQUFHLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JlLG9CQUF4QixDQUNiLENBRGEsRUFDVixDQUFDLEtBQUksQ0FBQ2IsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBbEMsSUFBK0MsS0FBSSxDQUFDVixLQUQxQyxFQUViLENBRmEsRUFFVixDQUFDLEtBQUksQ0FBQ1EsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBbEMsSUFBK0MsS0FBSSxDQUFDVixLQUYxQyxDQUFqQjs7QUFHQW9CLFlBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsWUFBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBLFlBQUEsS0FBSSxDQUFDaEIsa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQ0gsVUFBcEM7O0FBQ0EsWUFBQSxLQUFJLENBQUNkLGtCQUFMLENBQXdCa0IsUUFBeEIsQ0FBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBSSxDQUFDeEIsS0FBNUMsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFDQTtBQUNIOztBQUVELGFBQUssVUFBTDtBQUFpQjtBQUNiLGdCQUFNbUIsVUFBUSxHQUFHLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JlLG9CQUF4QixDQUNiLENBRGEsRUFDVixDQUFDLENBQUMsSUFBSSxLQUFJLENBQUNiLE9BQVYsS0FBc0IsSUFBSUUsU0FBMUIsSUFBdUNBLFNBQXhDLElBQXFELEtBQUksQ0FBQ1YsS0FEaEQsRUFFYixDQUZhLEVBRVYsQ0FBQyxDQUFDLElBQUksS0FBSSxDQUFDUSxPQUFWLEtBQXNCLElBQUlFLFNBQTFCLElBQXVDQSxTQUF4QyxJQUFxRCxLQUFJLENBQUNWLEtBRmhELENBQWpCOztBQUdBb0IsWUFBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBRixZQUFBQSxVQUFRLENBQUNFLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkIsZUFBM0I7O0FBQ0EsWUFBQSxLQUFJLENBQUNoQixrQkFBTCxDQUF3QmlCLFNBQXhCLEdBQW9DSCxVQUFwQzs7QUFDQSxZQUFBLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JrQixRQUF4QixDQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1QyxLQUFJLENBQUN4QixLQUE1QyxFQUFtRCxLQUFJLENBQUNDLE1BQXhEOztBQUNBO0FBQ0g7O0FBRUQsYUFBSyxnQkFBTDtBQUF1QjtBQUFDO0FBRXBCLGdCQUFNbUIsVUFBUSxHQUFHLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JlLG9CQUF4QixDQUNiLENBQUMsS0FBSSxDQUFDYixPQUFMLElBQWdCLElBQUlFLFNBQXBCLElBQWlDQSxTQUFsQyxJQUErQyxLQUFJLENBQUNWLEtBRHZDLEVBQzhDLENBRDlDLEVBRWIsQ0FBQyxLQUFJLENBQUNRLE9BQUwsSUFBZ0IsSUFBSUUsU0FBcEIsSUFBaUNBLFNBQWxDLElBQStDLEtBQUksQ0FBQ1YsS0FGdkMsRUFFOENVLFNBQVMsSUFBSSxLQUFJLENBQUNWLEtBQUwsSUFBYyxLQUFJLENBQUNDLE1BQUwsR0FBYyxDQUE1QixDQUFKLENBQVQsR0FBK0MsS0FBSSxDQUFDRCxLQUZsRyxDQUFqQjs7QUFHQW9CLFlBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsWUFBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBLFlBQUEsS0FBSSxDQUFDaEIsa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQ0gsVUFBcEM7O0FBQ0EsWUFBQSxLQUFJLENBQUNkLGtCQUFMLENBQXdCa0IsUUFBeEIsQ0FBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBSSxDQUFDeEIsS0FBNUMsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFFQTtBQUNIOztBQUVELGFBQUssZ0JBQUw7QUFBdUI7QUFDbkIsZ0JBQU1tQixVQUFRLEdBQUcsS0FBSSxDQUFDZCxrQkFBTCxDQUF3QmUsb0JBQXhCLENBQ2IsQ0FBQyxLQUFJLENBQUNiLE9BQUwsSUFBZ0IsSUFBSUUsU0FBcEIsSUFBaUNBLFNBQWxDLElBQStDLEtBQUksQ0FBQ1YsS0FEdkMsRUFDOEMsQ0FEOUMsRUFFYixDQUFDLEtBQUksQ0FBQ1EsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBbEMsSUFBK0MsS0FBSSxDQUFDVixLQUFwRCxHQUE0RCxLQUFJLENBQUNBLEtBRnBELEVBRTJELEtBQUksQ0FBQ0MsTUFGaEUsQ0FBakI7O0FBR0FtQixZQUFBQSxVQUFRLENBQUNFLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkIsZUFBM0I7O0FBQ0FGLFlBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQSxZQUFBLEtBQUksQ0FBQ2hCLGtCQUFMLENBQXdCaUIsU0FBeEIsR0FBb0NILFVBQXBDOztBQUNBLFlBQUEsS0FBSSxDQUFDZCxrQkFBTCxDQUF3QmtCLFFBQXhCLENBQWlDLENBQWpDLEVBQW9DLENBQXBDLEVBQXVDLEtBQUksQ0FBQ3hCLEtBQTVDLEVBQW1ELEtBQUksQ0FBQ0MsTUFBeEQ7O0FBRUE7QUFDSDs7QUFFRCxhQUFLLFlBQUw7QUFBbUI7QUFFZixnQkFBTXdCLFFBQVEsR0FBRyxHQUFqQixDQUZlLENBRU87O0FBQ3RCLGdCQUFNQyxHQUFHLEdBQUdDLElBQUksQ0FBQ0MsRUFBTCxHQUFVSCxRQUF0QjtBQUNBLGdCQUFNSSxJQUFJLEdBQUcsSUFBSUosUUFBakIsQ0FKZSxDQU1mOztBQUNBLGdCQUFNSyxlQUFlLEdBQUcsS0FBSSxDQUFDdEIsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBekQsQ0FQZSxDQVNmOztBQUNBLGlCQUFLLElBQUlxQixJQUFJLEdBQUcsQ0FBQ3JCLFNBQWpCLEVBQTRCcUIsSUFBSSxHQUFHLElBQUlyQixTQUF2QyxFQUFrRHFCLElBQUksSUFBSUYsSUFBMUQsRUFBZ0U7QUFFNUQ7QUFDQSxrQkFBTUcsS0FBSyxHQUFHRCxJQUFJLEdBQUdKLElBQUksQ0FBQ0MsRUFBMUIsQ0FINEQsQ0FLNUQ7O0FBQ0Esa0JBQU1LLEVBQUUsR0FBR04sSUFBSSxDQUFDTyxHQUFMLENBQVNGLEtBQUssR0FBR0wsSUFBSSxDQUFDQyxFQUF0QixLQUE2QixLQUFJLENBQUMzQixNQUFMLEdBQWMsQ0FBM0MsSUFBZ0QsS0FBSSxDQUFDRCxLQUFMLEdBQWEsQ0FBeEU7O0FBQ0Esa0JBQU1tQyxFQUFFLEdBQUdSLElBQUksQ0FBQ1MsR0FBTCxDQUFTSixLQUFLLEdBQUdMLElBQUksQ0FBQ0MsRUFBdEIsS0FBNkIsS0FBSSxDQUFDM0IsTUFBTCxHQUFjLENBQTNDLElBQWdELEtBQUksQ0FBQ0EsTUFBaEU7O0FBQ0Esa0JBQU1vQyxFQUFFLEdBQUdWLElBQUksQ0FBQ08sR0FBTCxDQUFTRixLQUFLLEdBQUdOLEdBQVIsR0FBY0MsSUFBSSxDQUFDQyxFQUE1QixLQUFtQyxLQUFJLENBQUMzQixNQUFMLEdBQWMsQ0FBakQsSUFBc0QsS0FBSSxDQUFDRCxLQUFMLEdBQWEsQ0FBOUU7O0FBQ0Esa0JBQU1zQyxFQUFFLEdBQUdYLElBQUksQ0FBQ1MsR0FBTCxDQUFTSixLQUFLLEdBQUdOLEdBQVIsR0FBY0MsSUFBSSxDQUFDQyxFQUE1QixLQUFtQyxLQUFJLENBQUMzQixNQUFMLEdBQWMsQ0FBakQsSUFBc0QsS0FBSSxDQUFDQSxNQUF0RSxDQVQ0RCxDQVc1RDs7O0FBQ0Esa0JBQU1zQyxLQUFLLEdBQUcsQ0FBQ1QsZUFBZSxHQUFHQyxJQUFsQixHQUF5QnJCLFNBQTFCLElBQXVDQSxTQUFyRCxDQVo0RCxDQWM1RDs7QUFDQSxjQUFBLEtBQUksQ0FBQ0osa0JBQUwsQ0FBd0JrQyxTQUF4Qjs7QUFDQSxjQUFBLEtBQUksQ0FBQ2xDLGtCQUFMLENBQXdCbUMsTUFBeEIsQ0FBK0IsS0FBSSxDQUFDekMsS0FBTCxHQUFhLENBQWIsR0FBaUIsQ0FBaEQsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFDQSxjQUFBLEtBQUksQ0FBQ0ssa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQlQsRUFBL0IsRUFBbUNFLEVBQW5DOztBQUNBLGNBQUEsS0FBSSxDQUFDN0Isa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQkwsRUFBL0IsRUFBbUNDLEVBQW5DOztBQUNBLGNBQUEsS0FBSSxDQUFDaEMsa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQixLQUFJLENBQUMxQyxLQUFMLEdBQWEsQ0FBYixHQUFpQixDQUFoRCxFQUFtRCxLQUFJLENBQUNDLE1BQXhEOztBQUNBLGNBQUEsS0FBSSxDQUFDSyxrQkFBTCxDQUF3QmlCLFNBQXhCLEdBQW9DLGdCQUFnQmdCLEtBQWhCLEdBQXdCLEdBQTVEOztBQUNBLGNBQUEsS0FBSSxDQUFDakMsa0JBQUwsQ0FBd0JxQyxJQUF4QjtBQUNIOztBQUVEO0FBQ0g7O0FBRUQsYUFBSyxZQUFMO0FBQW1CO0FBRWYsZ0JBQU1sQixTQUFRLEdBQUcsR0FBakIsQ0FGZSxDQUVPOztBQUN0QixnQkFBTUMsSUFBRyxHQUFHQyxJQUFJLENBQUNDLEVBQUwsR0FBVUgsU0FBdEI7O0FBQ0EsZ0JBQU1JLEtBQUksR0FBRyxJQUFJSixTQUFqQixDQUplLENBTWY7OztBQUNBLGdCQUFNSyxnQkFBZSxHQUFHLEtBQUksQ0FBQ3RCLE9BQUwsSUFBZ0IsSUFBSUUsU0FBcEIsSUFBaUNBLFNBQXpELENBUGUsQ0FTZjs7O0FBQ0EsaUJBQUssSUFBSUYsT0FBTyxHQUFHLENBQUNFLFNBQXBCLEVBQStCRixPQUFPLEdBQUcsSUFBSUUsU0FBN0MsRUFBd0RGLE9BQU8sSUFBSXFCLEtBQW5FLEVBQXlFO0FBRXJFO0FBQ0Esa0JBQU1HLE1BQUssR0FBR3hCLE9BQU8sR0FBR21CLElBQUksQ0FBQ0MsRUFBN0IsQ0FIcUUsQ0FLckU7OztBQUNBLGtCQUFNSyxFQUFFLEdBQUdOLElBQUksQ0FBQ08sR0FBTCxDQUFTRixNQUFLLEdBQUdOLElBQVIsR0FBYyxJQUFJQyxJQUFJLENBQUNDLEVBQWhDLEtBQXVDLEtBQUksQ0FBQzNCLE1BQUwsR0FBYyxDQUFyRCxJQUEwRCxLQUFJLENBQUNELEtBQUwsR0FBYSxDQUFsRjs7QUFDQSxrQkFBTW1DLEVBQUUsR0FBR1IsSUFBSSxDQUFDUyxHQUFMLENBQVNKLE1BQUssR0FBR04sSUFBUixHQUFjLElBQUlDLElBQUksQ0FBQ0MsRUFBaEMsS0FBdUMsS0FBSSxDQUFDM0IsTUFBTCxHQUFjLENBQXJELENBQVg7O0FBQ0Esa0JBQU1vQyxHQUFFLEdBQUdWLElBQUksQ0FBQ08sR0FBTCxDQUFTRixNQUFLLEdBQUcsSUFBSUwsSUFBSSxDQUFDQyxFQUExQixLQUFpQyxLQUFJLENBQUMzQixNQUFMLEdBQWMsQ0FBL0MsSUFBb0QsS0FBSSxDQUFDRCxLQUFMLEdBQWEsQ0FBNUU7O0FBQ0Esa0JBQU1zQyxHQUFFLEdBQUdYLElBQUksQ0FBQ1MsR0FBTCxDQUFTSixNQUFLLEdBQUcsSUFBSUwsSUFBSSxDQUFDQyxFQUExQixLQUFpQyxLQUFJLENBQUMzQixNQUFMLEdBQWMsQ0FBL0MsQ0FBWCxDQVRxRSxDQVlyRTs7O0FBQ0Esa0JBQU1zQyxNQUFLLEdBQUcsQ0FBQ1QsZ0JBQWUsR0FBR3RCLE9BQWxCLEdBQTRCRSxTQUE3QixJQUEwQ0EsU0FBeEQsQ0FicUUsQ0FlckU7OztBQUNBLGNBQUEsS0FBSSxDQUFDSixrQkFBTCxDQUF3QmtDLFNBQXhCOztBQUNBLGNBQUEsS0FBSSxDQUFDbEMsa0JBQUwsQ0FBd0JtQyxNQUF4QixDQUErQixLQUFJLENBQUN6QyxLQUFMLEdBQWEsQ0FBYixHQUFpQixDQUFoRCxFQUFtRCxDQUFuRDs7QUFDQSxjQUFBLEtBQUksQ0FBQ00sa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQlQsRUFBL0IsRUFBbUNFLEVBQW5DOztBQUNBLGNBQUEsS0FBSSxDQUFDN0Isa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQkwsR0FBL0IsRUFBbUNDLEdBQW5DOztBQUNBLGNBQUEsS0FBSSxDQUFDaEMsa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQixLQUFJLENBQUMxQyxLQUFMLEdBQWEsQ0FBYixHQUFpQixDQUFoRCxFQUFtRCxDQUFuRDs7QUFDQSxjQUFBLEtBQUksQ0FBQ00sa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQyxnQkFBZ0JnQixNQUFoQixHQUF3QixHQUE1RDs7QUFDQSxjQUFBLEtBQUksQ0FBQ2pDLGtCQUFMLENBQXdCcUMsSUFBeEI7QUFDSDs7QUFFRDtBQUNIOztBQUVELGFBQUssWUFBTDtBQUNBLGFBQUssV0FBTDtBQUFrQjtBQUVkLGdCQUFNQyxXQUFXLEdBQUksS0FBSSxDQUFDcEMsT0FBTixHQUFpQixLQUFJLENBQUNQLE1BQXRCLEdBQStCLEdBQS9CLEdBQXFDLENBQXJDLEdBQXlDLEdBQXpDLEdBQWdELEtBQUksQ0FBQ08sT0FBTixHQUFpQixLQUFJLENBQUNQLE1BQXRCLEdBQStCLEdBQWxHO0FBQ0EsZ0JBQU00QyxXQUFXLEdBQUcsS0FBSSxDQUFDckMsT0FBTCxHQUFlLEtBQUksQ0FBQ1AsTUFBcEIsR0FBNkIsR0FBakQ7O0FBQ0EsZ0JBQU1tQixVQUFRLEdBQUcsS0FBSSxDQUFDZCxrQkFBTCxDQUF3QndDLG9CQUF4QixDQUE2QyxLQUFJLENBQUM5QyxLQUFMLEdBQWEsQ0FBMUQsRUFBNkQsS0FBSSxDQUFDQyxNQUFMLEdBQWMsQ0FBM0UsRUFBOEUyQyxXQUE5RSxFQUEyRixLQUFJLENBQUM1QyxLQUFMLEdBQWEsQ0FBeEcsRUFBMkcsS0FBSSxDQUFDQyxNQUFMLEdBQWMsQ0FBekgsRUFBNEg0QyxXQUE1SCxDQUFqQjs7QUFDQXpCLFlBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsWUFBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBLFlBQUEsS0FBSSxDQUFDaEIsa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQ0gsVUFBcEM7O0FBQ0EsWUFBQSxLQUFJLENBQUNkLGtCQUFMLENBQXdCa0IsUUFBeEIsQ0FBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBSSxDQUFDeEIsS0FBNUMsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFFQTtBQUNIOztBQUdEO0FBRUk7QUFuS1I7O0FBdUtBLE1BQUEsS0FBSSxDQUFDSyxrQkFBTCxDQUF3QnlDLHdCQUF4QixHQUFtRCxXQUFuRDs7QUFFQSxVQUFJLEtBQUksQ0FBQ0MsTUFBTCxHQUFjLEtBQUksQ0FBQ0MsTUFBTCxDQUFZRCxNQUE5QixFQUFzQztBQUVsQyxRQUFBLEtBQUksQ0FBQzFDLGtCQUFMLENBQXdCRCxTQUF4QixDQUFrQyxLQUFJLENBQUM0QyxNQUFMLENBQVlDLEdBQTlDLEVBQ0ksQ0FESixFQUVJLENBQUMsS0FBSSxDQUFDakQsTUFBTCxHQUFjLEtBQUksQ0FBQ0QsS0FBTCxHQUFhLEtBQUksQ0FBQ2lELE1BQUwsQ0FBWUQsTUFBeEMsSUFBa0QsQ0FGdEQsRUFHSSxLQUFJLENBQUNoRCxLQUhULEVBSUksS0FBSSxDQUFDQSxLQUFMLEdBQWEsS0FBSSxDQUFDaUQsTUFBTCxDQUFZRCxNQUo3QjtBQUtILE9BUEQsTUFPTztBQUVILFFBQUEsS0FBSSxDQUFDMUMsa0JBQUwsQ0FBd0JELFNBQXhCLENBQWtDLEtBQUksQ0FBQzRDLE1BQUwsQ0FBWUMsR0FBOUMsRUFDSSxDQUFDLEtBQUksQ0FBQ2xELEtBQUwsR0FBYSxLQUFJLENBQUNDLE1BQUwsR0FBYyxLQUFJLENBQUNnRCxNQUFMLENBQVlELE1BQXhDLElBQWtELENBRHRELEVBRUksQ0FGSixFQUdJLEtBQUksQ0FBQy9DLE1BQUwsR0FBYyxLQUFJLENBQUNnRCxNQUFMLENBQVlELE1BSDlCLEVBSUksS0FBSSxDQUFDL0MsTUFKVDtBQUtIOztBQUVELE1BQUEsS0FBSSxDQUFDSyxrQkFBTCxDQUF3QjZDLE9BQXhCOztBQUdBLFVBQUlyQyxPQUFPLEdBQUcsS0FBSSxDQUFDTCxNQUFMLENBQVlRLFlBQTFCLEVBQ0lwQixNQUFNLENBQUN1RCxxQkFBUCxDQUE2QixLQUFJLENBQUN4QyxNQUFsQyxFQURKLEtBRUssSUFBSSxLQUFJLENBQUNqQixJQUFMLEtBQWNQLElBQUksQ0FBQ1EsSUFBdkIsRUFDRCxLQUFJLENBQUN5RCxhQUFMLEdBQXFCQyxVQUFVLENBQUMsS0FBSSxDQUFDQyxRQUFOLEVBQWdCLEtBQUksQ0FBQzlDLE1BQUwsQ0FBWStDLFNBQTVCLENBQS9CO0FBQ1AsS0F4UHVHOztBQUNwRyxRQUFNQyxNQUFNLEdBQUdDLEtBQUssQ0FBQ0MsSUFBTixDQUFXLEtBQUtsRSxNQUFMLENBQVltRSxnQkFBWixDQUE2QixLQUE3QixDQUFYLENBQWY7QUFDQSxTQUFLdEUsVUFBTCxHQUFrQm1FLE1BQU0sQ0FBQ0ksR0FBUCxDQUFXLFVBQUFYLEdBQUcsRUFBSTtBQUNoQyxVQUFNRixNQUFNLEdBQUdFLEdBQUcsQ0FBQ2xELEtBQUosR0FBWWtELEdBQUcsQ0FBQ2pELE1BQS9CO0FBQ0EsVUFBTWdCLFlBQVksR0FBR2lDLEdBQUcsQ0FBQ1ksWUFBSixDQUFpQixtQkFBakIsSUFBd0NDLE1BQU0sQ0FBQ2IsR0FBRyxDQUFDYyxZQUFKLENBQWlCLG1CQUFqQixDQUFELENBQU4sR0FBZ0QsSUFBeEYsR0FBK0YsSUFBcEg7QUFDQSxVQUFNUixTQUFTLEdBQUdOLEdBQUcsQ0FBQ1ksWUFBSixDQUFpQixnQkFBakIsSUFBcUNDLE1BQU0sQ0FBQ2IsR0FBRyxDQUFDYyxZQUFKLENBQWlCLGdCQUFqQixDQUFELENBQU4sR0FBNkMsSUFBbEYsR0FBeUYsSUFBM0c7QUFDQSxVQUFNN0MsUUFBUSxHQUFHK0IsR0FBRyxDQUFDWSxZQUFKLENBQWlCLGVBQWpCLElBQW9DWixHQUFHLENBQUNjLFlBQUosQ0FBaUIsZUFBakIsQ0FBcEMsR0FBd0UsVUFBekY7QUFDQSxVQUFNdEQsU0FBUyxHQUFHd0MsR0FBRyxDQUFDWSxZQUFKLENBQWlCLGdCQUFqQixJQUFxQ0MsTUFBTSxDQUFDYixHQUFHLENBQUNjLFlBQUosQ0FBaUIsZ0JBQWpCLENBQUQsQ0FBM0MsR0FBa0YsRUFBcEc7QUFDQSxVQUFNaEQsZUFBZSxHQUFHa0MsR0FBRyxDQUFDWSxZQUFKLENBQWlCLGNBQWpCLElBQW1DQyxNQUFNLENBQUNiLEdBQUcsQ0FBQ2MsWUFBSixDQUFpQixjQUFqQixDQUFELENBQXpDLEdBQThFLENBQXRHO0FBQ0EsYUFBTztBQUNIZCxRQUFBQSxHQUFHLEVBQUhBLEdBREc7QUFFSEYsUUFBQUEsTUFBTSxFQUFOQSxNQUZHO0FBR0gvQixRQUFBQSxZQUFZLEVBQVpBLFlBSEc7QUFJSHVDLFFBQUFBLFNBQVMsRUFBVEEsU0FKRztBQUtIckMsUUFBQUEsUUFBUSxFQUFSQSxRQUxHO0FBTUhULFFBQUFBLFNBQVMsRUFBVEEsU0FORztBQU9ITSxRQUFBQSxlQUFlLEVBQWZBO0FBUEcsT0FBUDtBQVNILEtBaEJpQixDQUFsQjtBQWtCQSxTQUFLdkIsTUFBTCxDQUFZd0UsV0FBWixDQUF3QixLQUFLQyxXQUE3QjtBQUNBLFNBQUt6RSxNQUFMLENBQVl3RSxXQUFaLENBQXdCLEtBQUtFLFdBQTdCOztBQUNBLFFBQU1DLFdBQVcsR0FBRyxLQUFLRixXQUFMLENBQWlCRyxVQUFqQixDQUE0QixJQUE1QixDQUFwQjs7QUFDQSxRQUFNQyxXQUFXLEdBQUcsS0FBS0gsV0FBTCxDQUFpQkUsVUFBakIsQ0FBNEIsSUFBNUIsQ0FBcEI7O0FBQ0EsUUFBSUQsV0FBVyxLQUFLLElBQWhCLElBQXdCRSxXQUFXLEtBQUssSUFBNUMsRUFBa0QsTUFBTUMsS0FBSyxDQUFDLDBCQUFELENBQVg7QUFDbEQsU0FBS0MsWUFBTCxHQUFvQkosV0FBcEI7QUFDQSxTQUFLOUQsa0JBQUwsR0FBMEJnRSxXQUExQjtBQUVBekUsSUFBQUEsTUFBTSxDQUFDNEUsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBS0MsTUFBdkM7QUFDSDs7Ozs2QkE2TmdCO0FBRWIsV0FBSzFFLEtBQUwsR0FBYUgsTUFBTSxDQUFDQyxVQUFwQjtBQUNBLFdBQUtHLE1BQUwsR0FBY0MsUUFBUSxDQUFDeUUsZUFBVCxDQUF5QkMsWUFBdkMsQ0FIYSxDQUd3Qzs7QUFDckQsV0FBSzVCLE1BQUwsR0FBYyxLQUFLaEQsS0FBTCxHQUFhLEtBQUtDLE1BQWhDO0FBRUEsV0FBS3VFLFlBQUwsQ0FBa0JLLE1BQWxCLENBQXlCN0UsS0FBekIsR0FBaUMsS0FBS0EsS0FBdEM7QUFDQSxXQUFLd0UsWUFBTCxDQUFrQkssTUFBbEIsQ0FBeUI1RSxNQUF6QixHQUFrQyxLQUFLQSxNQUF2QztBQUVBLFdBQUtLLGtCQUFMLENBQXdCdUUsTUFBeEIsQ0FBK0I3RSxLQUEvQixHQUF1QyxLQUFLQSxLQUE1QztBQUNBLFdBQUtNLGtCQUFMLENBQXdCdUUsTUFBeEIsQ0FBK0I1RSxNQUEvQixHQUF3QyxLQUFLQSxNQUE3QztBQUVBLFdBQUtJLFNBQUw7QUFDSDs7O2dDQUVtQjtBQUNoQixVQUFJLEtBQUtJLE1BQVQsRUFBaUI7QUFDYixZQUFJLEtBQUt1QyxNQUFMLEdBQWMsS0FBS3ZDLE1BQUwsQ0FBWXVDLE1BQTlCLEVBQXNDO0FBRWxDLGVBQUt3QixZQUFMLENBQWtCbkUsU0FBbEIsQ0FDSSxLQUFLSSxNQUFMLENBQVl5QyxHQURoQixFQUVJLENBRkosRUFHSSxDQUFDLEtBQUtqRCxNQUFMLEdBQWMsS0FBS0QsS0FBTCxHQUFhLEtBQUtTLE1BQUwsQ0FBWXVDLE1BQXhDLElBQWtELENBSHRELEVBSUksS0FBS2hELEtBSlQsRUFLSSxLQUFLQSxLQUFMLEdBQWEsS0FBS1MsTUFBTCxDQUFZdUMsTUFMN0I7QUFNSCxTQVJELE1BUU87QUFFSCxlQUFLd0IsWUFBTCxDQUFrQm5FLFNBQWxCLENBQ0ksS0FBS0ksTUFBTCxDQUFZeUMsR0FEaEIsRUFFSSxDQUFDLEtBQUtsRCxLQUFMLEdBQWEsS0FBS0MsTUFBTCxHQUFjLEtBQUtRLE1BQUwsQ0FBWXVDLE1BQXhDLElBQWtELENBRnRELEVBR0ksQ0FISixFQUlJLEtBQUsvQyxNQUFMLEdBQWMsS0FBS1EsTUFBTCxDQUFZdUMsTUFKOUIsRUFLSSxLQUFLL0MsTUFMVDtBQU1IO0FBQ0osT0FsQkQsTUFrQk87QUFDSCxjQUFNc0UsS0FBSyxDQUFDLGNBQWMsS0FBS2hGLFVBQW5CLEdBQStCLEdBQS9CLEdBQXFDLEtBQUtELFVBQUwsQ0FBZ0JFLE1BQXRELENBQVg7QUFDSDtBQUNKOzs7NEJBR007QUFDSCxXQUFLRCxVQUFMLEdBQWtCLENBQUMsQ0FBbkI7QUFDQSxXQUFLZ0UsUUFBTDtBQUNBLFdBQUttQixNQUFMO0FBQ0g7OzsyQkFFSztBQUNGLFdBQUtyQixhQUFMLElBQXNCeUIsWUFBWSxDQUFDLEtBQUt6QixhQUFOLENBQWxDO0FBQ0g7OzsyQkFFSztBQUNGLFVBQUksS0FBSzFELElBQUwsS0FBY1AsSUFBSSxDQUFDMkYsYUFBdkIsRUFDSSxNQUFNUixLQUFLLENBQUMsbUNBQUQsQ0FBWDtBQUNKLFdBQUtoQixRQUFMO0FBQ0g7Ozt3QkFHbUI7QUFDaEIsYUFBTyxLQUFLakUsVUFBTCxDQUFnQkUsTUFBdkI7QUFDSDs7Ozs7O0FBR0wsQ0FBQyxZQUFZO0FBRVRVLEVBQUFBLFFBQVEsQ0FBQ3VFLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxZQUFNO0FBQ2hEdkUsSUFBQUEsUUFBUSxDQUFDMEQsZ0JBQVQsQ0FBdUMsU0FBdkMsRUFBa0RvQixPQUFsRCxDQUEwRCxVQUFBQyxDQUFDLEVBQUU7QUFDekQsVUFBTXRGLElBQVUsR0FBSXNGLENBQUMsQ0FBQ25CLFlBQUYsQ0FBZSxrQkFBZixJQUFxQzFFLElBQUksQ0FBQzJGLGFBQTFDLEdBQTBEM0YsSUFBSSxDQUFDUSxJQUFuRjtBQUNBLFVBQU1GLEtBQUssR0FBR3VGLENBQUMsQ0FBQ0MsT0FBRixDQUFVLFNBQVYsQ0FBZDtBQUNBLFVBQUksQ0FBQ3hGLEtBQUwsRUFBWSxNQUFNNkUsS0FBSyxDQUFDLHNDQUFELENBQVg7QUFDWixVQUFNWSxJQUFJLEdBQUcsSUFBSTlGLE1BQUosQ0FBVzRGLENBQVgsRUFBY3ZGLEtBQWQsRUFBcUJDLElBQXJCLENBQWIsQ0FKeUQsQ0FLekQ7O0FBQ0FzRixNQUFBQSxDQUFDLENBQUNHLE1BQUYsR0FBV0QsSUFBWDtBQUNILEtBUEQ7QUFTQUUsSUFBQUEsTUFBTSxDQUFDWixnQkFBUCxDQUF3QixjQUF4QixFQUF3QyxVQUFDYSxDQUFELEVBQU87QUFDM0MsVUFBTUMsVUFBVSxHQUFHRCxDQUFDLENBQUNFLGFBQUYsQ0FBZ0JDLGFBQWhCLENBQThCLFNBQTlCLENBQW5COztBQUNBLFVBQUlGLFVBQUosRUFBZ0I7QUFDWixZQUFNSixJQUFJLEdBQUdJLFVBQVUsQ0FBQ0gsTUFBeEI7QUFDQSxZQUFJRCxJQUFJLENBQUN4RixJQUFMLEtBQWNQLElBQUksQ0FBQ1EsSUFBdkIsRUFDRXVGLElBQUksQ0FBQ08sSUFBTCxHQURGLEtBRUs7QUFDRCxjQUFNQyxVQUFpQyxHQUFHTixNQUFNLENBQUNPLFVBQVAsQ0FBa0JULElBQUksQ0FBQ3pGLEtBQXZCLENBQTFDO0FBQ0EsY0FBTW1HLFlBQW1DLEdBQUdSLE1BQU0sQ0FBQ08sVUFBUCxDQUFrQk4sQ0FBQyxDQUFDUSxZQUFwQixDQUE1QztBQUNBLGNBQU1DLFFBQVEsR0FBR1QsQ0FBQyxDQUFDUSxZQUFGLENBQWVFLE1BQWYsR0FDYkgsWUFBWSxDQUFDSSxDQUFiLElBQWtCTixVQUFVLENBQUNNLENBQVgsSUFBZ0IsQ0FBbEMsQ0FEYSxHQUViSixZQUFZLENBQUNLLENBQWIsR0FBaUJQLFVBQVUsQ0FBQ08sQ0FGaEM7QUFHQUMsVUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlMLFFBQVo7O0FBQ0EsY0FBSUEsUUFBUSxHQUFHLENBQVgsSUFBZ0JBLFFBQVEsR0FBR1osSUFBSSxDQUFDa0IsYUFBcEMsRUFBbUQ7QUFDL0NmLFlBQUFBLENBQUMsQ0FBQ1EsWUFBRixDQUFlN0IsV0FBZixDQUEyQmtCLElBQUksQ0FBQzFGLE1BQWhDO0FBQ0gsV0FGRCxNQUVPO0FBQ0gwRixZQUFBQSxJQUFJLENBQUNPLElBQUw7QUFDQVAsWUFBQUEsSUFBSSxDQUFDekYsS0FBTCxDQUFXdUUsV0FBWCxDQUF1QmtCLElBQUksQ0FBQzFGLE1BQTVCO0FBQ0g7QUFHSjtBQUNKOztBQUNELFVBQU02RyxVQUFVLEdBQUdoQixDQUFDLENBQUNRLFlBQUYsQ0FBZUwsYUFBZixDQUE2QixTQUE3QixDQUFuQjs7QUFDQSxVQUFJYSxVQUFKLEVBQWdCO0FBQ1osWUFBSWxCLE1BQU0sR0FBR2tCLFVBQVUsQ0FBQ2xCLE1BQXhCO0FBQ0EsWUFBSUEsTUFBTSxDQUFDekYsSUFBUCxLQUFnQlAsSUFBSSxDQUFDUSxJQUFyQixJQUE2QndGLE1BQU0sQ0FBQzFGLEtBQVAsS0FBaUI0RixDQUFDLENBQUNRLFlBQXBELEVBQ0lWLE1BQU0sQ0FBQ21CLEtBQVAsR0FESixLQUdJbkIsTUFBTSxDQUFDb0IsSUFBUDtBQUVQO0FBQ0osS0FoQ0Q7QUFpQ0gsR0EzQ0Q7QUE4Q0gsQ0FoREQsSSxDQWtEQTs7O0FBRUEsSUFBSSxDQUFDQyxPQUFPLENBQUNDLFNBQVIsQ0FBa0JDLE9BQXZCLEVBQWdDO0FBQzVCRixFQUFBQSxPQUFPLENBQUNDLFNBQVIsQ0FBa0JDLE9BQWxCLEdBQ0lGLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkUsaUJBQWxCLElBQ0FILE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkcscUJBRnRCO0FBR0g7O0FBRUQsSUFBSSxDQUFDSixPQUFPLENBQUNDLFNBQVIsQ0FBa0J4QixPQUF2QixFQUFnQztBQUM1QnVCLEVBQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQnhCLE9BQWxCLEdBQTRCLFVBQVM0QixDQUFULEVBQVk7QUFDcEMsUUFBSUMsRUFBRSxHQUFHLElBQVQ7O0FBRUEsT0FBRztBQUNDLFVBQUlOLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkMsT0FBbEIsQ0FBMEJLLElBQTFCLENBQStCRCxFQUEvQixFQUFtQ0QsQ0FBbkMsQ0FBSixFQUEyQyxPQUFPQyxFQUFQO0FBQzNDQSxNQUFBQSxFQUFFLEdBQUdBLEVBQUUsQ0FBQ0UsYUFBSCxJQUFvQkYsRUFBRSxDQUFDRyxVQUE1QjtBQUNILEtBSEQsUUFHU0gsRUFBRSxLQUFLLElBQVAsSUFBZUEsRUFBRSxDQUFDSSxRQUFILEtBQWdCLENBSHhDOztBQUlBLFdBQU8sSUFBUDtBQUNILEdBUkQ7QUFTSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cblx0VG8gRG9cblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdEZpeCBkaWFnb25hbCB3aXBlXG5cdGZpeCByYWRpYWwgd2lwZVxuXG5cbldlYnlhcm5zIHZlcnNpb246XG4tIEFkZGVkIFwiZGVzdHJveVwiIGZsYWcgYW5kIG1ldGhvZFxuLSBBZGRlZCBzdXBwb3J0IGZvciBgZGF0YS1zdGFydEF0YCB0byBzZXQgc3RhcnQgcGVyY2VudGFnZVxuLSBvbiBkZXN0cm95IHJlbW92ZSBjcmVhdGVkIGVsZW1lbnRzXG4qL1xuXG5lbnVtIE1vZGUge1xuICAgIEFVVE8sIE1VTFRJX1NFQ1RJT05cbn1cblxuaW50ZXJmYWNlIEltYWdlT2JqZWN0IHtcbiAgICBzdGFydFBlcmNlbnRhZ2U6IG51bWJlcjtcbiAgICBmYWRlV2lkdGg6IG51bWJlcjtcbiAgICBmYWRlVHlwZTogc3RyaW5nIHwgbnVsbDtcbiAgICBmYWRlRGVsYXk6IG51bWJlcjtcbiAgICBmYWRlRHVyYXRpb246IG51bWJlcjtcbiAgICBhc3BlY3Q6IG51bWJlcjtcbiAgICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XG59XG5cbmNsYXNzIFNXV2lwZSB7XG5cbiAgICBjdXJyZW50SWR4ID0gLTE7XG4gICAgd2lkdGg6IG51bWJlciA9IHdpbmRvdy5pbm5lcldpZHRoO1x0XHRcdFx0Ly8gd2lkdGggb2YgY29udGFpbmVyIChiYW5uZXIpXG4gICAgaGVpZ2h0OiBudW1iZXIgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHRcdFx0XHQvLyBoZWlnaHQgb2YgY29udGFpbmVyXG4gICAgYXNwZWN0OiBudW1iZXIgPSB0aGlzLndpZHRoIC8gdGhpcy5oZWlnaHQ7XHRcdFx0XHQvLyBhc3BlY3QgcmF0aW8gb2YgY29udGFpbmVyXG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IGltYWdlQXJyYXk6IEltYWdlT2JqZWN0W107XG4gICAgcHJpdmF0ZSByZWFkb25seSBfYmFja0NhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9mb3JlQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2JhY2tDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfZm9yZWdyb3VuZENvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIHByaXZhdGUgcGVyY2VudDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIHN0YXJ0VGltZTogRGF0ZSA9IG5ldyBEYXRlO1xuICAgIHByaXZhdGUgbmV4dEZhZGVUaW1lcjogTm9kZUpTLlRpbWVvdXQgfCBudWxsID0gbnVsbDtcblxuXG4gICAgcHJpdmF0ZSBnZXQgY3VySW1nKCk6IEltYWdlT2JqZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VBcnJheVt0aGlzLmN1cnJlbnRJZHhdO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IG54dEltZygpOiBJbWFnZU9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLmltYWdlQXJyYXlbKHRoaXMuY3VycmVudElkeCArIDEpICUgdGhpcy5pbWFnZUFycmF5Lmxlbmd0aF07XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgYmFubmVyOiBIVE1MRWxlbWVudCwgcmVhZG9ubHkgb3duZXI6IEhUTUxFbGVtZW50LCByZWFkb25seSBtb2RlOiBNb2RlID0gTW9kZS5BVVRPKSB7XG4gICAgICAgIGNvbnN0IGltYWdlcyA9IEFycmF5LmZyb20odGhpcy5iYW5uZXIucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKSk7XG4gICAgICAgIHRoaXMuaW1hZ2VBcnJheSA9IGltYWdlcy5tYXAoaW1nID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFzcGVjdCA9IGltZy53aWR0aCAvIGltZy5oZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBmYWRlRHVyYXRpb24gPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1mYWRlRHVyYXRpb25cIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtZmFkZUR1cmF0aW9uXCIpKSAqIDEwMDAgOiAxMDAwO1xuICAgICAgICAgICAgY29uc3QgZmFkZURlbGF5ID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZURlbGF5XCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZhZGVEZWxheVwiKSkgKiAxMDAwIDogMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVUeXBlID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZVR5cGVcIikgPyBpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlVHlwZVwiKSA6IFwiY3Jvc3MtbHJcIjtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVXaWR0aCA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZhZGVXaWR0aFwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlV2lkdGhcIikpIDogLjE7XG4gICAgICAgICAgICBjb25zdCBzdGFydFBlcmNlbnRhZ2UgPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1zdGFydEF0XCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0YXJ0QXRcIikpIDogMDtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaW1nLFxuICAgICAgICAgICAgICAgIGFzcGVjdCxcbiAgICAgICAgICAgICAgICBmYWRlRHVyYXRpb24sXG4gICAgICAgICAgICAgICAgZmFkZURlbGF5LFxuICAgICAgICAgICAgICAgIGZhZGVUeXBlLFxuICAgICAgICAgICAgICAgIGZhZGVXaWR0aCxcbiAgICAgICAgICAgICAgICBzdGFydFBlcmNlbnRhZ2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmJhbm5lci5hcHBlbmRDaGlsZCh0aGlzLl9iYWNrQ2FudmFzKTtcbiAgICAgICAgdGhpcy5iYW5uZXIuYXBwZW5kQ2hpbGQodGhpcy5fZm9yZUNhbnZhcyk7XG4gICAgICAgIGNvbnN0IGJhY2tDb250ZXh0ID0gdGhpcy5fYmFja0NhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICAgICAgY29uc3QgZm9yZUNvbnRleHQgPSB0aGlzLl9mb3JlQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgaWYgKGJhY2tDb250ZXh0ID09PSBudWxsIHx8IGZvcmVDb250ZXh0ID09PSBudWxsKSB0aHJvdyBFcnJvcihcIjJkIGNvbnRleHQgbm90IHN1cHBvcnRlZFwiKVxuICAgICAgICB0aGlzLl9iYWNrQ29udGV4dCA9IGJhY2tDb250ZXh0O1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dCA9IGZvcmVDb250ZXh0O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBuZXh0RmFkZSA9ICgpID0+IHtcbiAgICAgICAgLy8gYWR2YW5jZSBpbmRpY2VzXG4gICAgICAgIHRoaXMuY3VycmVudElkeCA9ICsrdGhpcy5jdXJyZW50SWR4ICUgdGhpcy5pbWFnZUFycmF5Lmxlbmd0aDtcbiAgICAgICAgdGhpcy5kcmF3SW1hZ2UoKTtcblxuICAgICAgICAvLyBjbGVhciB0aGUgZm9yZWdyb3VuZFxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgIC8vIHNldHVwIGFuZCBzdGFydCB0aGUgZmFkZVxuICAgICAgICB0aGlzLnBlcmNlbnQgPSAtdGhpcy5jdXJJbWcuZmFkZVdpZHRoO1xuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IG5ldyBEYXRlO1xuICAgICAgICB0aGlzLnJlZHJhdygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVkcmF3ID0gKCkgPT4ge1xuICAgICAgICAvLyBjYWxjdWxhdGUgcGVyY2VudCBjb21wbGV0aW9uIG9mIHdpcGVcbiAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBuZXcgRGF0ZTtcbiAgICAgICAgY29uc3QgZWxhcHNlZCA9IGN1cnJlbnRUaW1lLmdldFRpbWUoKSAtIHRoaXMuc3RhcnRUaW1lLmdldFRpbWUoKTtcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gdGhpcy5jdXJJbWcuc3RhcnRQZXJjZW50YWdlICsgZWxhcHNlZCAvIHRoaXMuY3VySW1nLmZhZGVEdXJhdGlvbjtcblxuXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LnNhdmUoKTtcbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgY29uc3QgZmFkZVdpZHRoID0gdGhpcy5jdXJJbWcuZmFkZVdpZHRoXG5cbiAgICAgICAgc3dpdGNoICh0aGlzLmN1ckltZy5mYWRlVHlwZSkge1xuXG4gICAgICAgICAgICBjYXNlIFwiY3Jvc3MtbHJcIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwiY3Jvc3MtcmxcIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICgoMSAtIHRoaXMucGVyY2VudCkgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCxcbiAgICAgICAgICAgICAgICAgICAgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwiY3Jvc3MtdWRcIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgIDAsICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgMCwgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwiY3Jvc3MtZHVcIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgIDAsICgoMSAtIHRoaXMucGVyY2VudCkgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgMCwgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwiZGlhZ29uYWwtdGwtYnJcIjogey8vIERTOiBUaGlzIGRpYWdvbmFsIG5vdCB3b3JraW5nIHByb3Blcmx5XG5cbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDIgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDAsXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMiArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgZmFkZVdpZHRoICogKHRoaXMud2lkdGggLyAodGhpcy5oZWlnaHQgLyAyKSkgKiB0aGlzLndpZHRoKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJkaWFnb25hbC10ci1ibFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGggKyB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwicmFkaWFsLWJ0bVwiOiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50cyA9IDMwMDsgLy8gdGhlIGFtb3VudCBvZiBzZWdtZW50cyB0byBzcGxpdCB0aGUgc2VtaSBjaXJjbGUgaW50bywgRFM6IGFkanVzdCB0aGlzIGZvciBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgICAgIGNvbnN0IGxlbiA9IE1hdGguUEkgLyBzZWdtZW50cztcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwID0gMSAvIHNlZ21lbnRzO1xuXG4gICAgICAgICAgICAgICAgLy8gZXhwYW5kIHBlcmNlbnQgdG8gY292ZXIgZmFkZVdpZHRoXG4gICAgICAgICAgICAgICAgY29uc3QgYWRqdXN0ZWRQZXJjZW50ID0gdGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoO1xuXG4gICAgICAgICAgICAgICAgLy8gaXRlcmF0ZSBhIHBlcmNlbnRcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwcmN0ID0gLWZhZGVXaWR0aDsgcHJjdCA8IDEgKyBmYWRlV2lkdGg7IHByY3QgKz0gc3RlcCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgcGVyY2VudCB0byBhbmdsZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IHByY3QgKiBNYXRoLlBJO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBjb29yZGluYXRlcyBmb3Igd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeDEgPSBNYXRoLmNvcyhhbmdsZSArIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTEgPSBNYXRoLnNpbihhbmdsZSArIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeDIgPSBNYXRoLmNvcyhhbmdsZSArIGxlbiArIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTIgPSBNYXRoLnNpbihhbmdsZSArIGxlbiArIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLmhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgYWxwaGEgZm9yIHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFscGhhID0gKGFkanVzdGVkUGVyY2VudCAtIHByY3QgKyBmYWRlV2lkdGgpIC8gZmFkZVdpZHRoO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGRyYXcgd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0Lm1vdmVUbyh0aGlzLndpZHRoIC8gMiAtIDIsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgxLCB5MSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh4MiwgeTIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8odGhpcy53aWR0aCAvIDIgKyAyLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsMCwwLCcgKyBhbHBoYSArICcpJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwicmFkaWFsLXRvcFwiOiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50cyA9IDMwMDsgLy8gdGhlIGFtb3VudCBvZiBzZWdtZW50cyB0byBzcGxpdCB0aGUgc2VtaSBjaXJjbGUgaW50bywgRFM6IGFkanVzdCB0aGlzIGZvciBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgICAgIGNvbnN0IGxlbiA9IE1hdGguUEkgLyBzZWdtZW50cztcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwID0gMSAvIHNlZ21lbnRzO1xuXG4gICAgICAgICAgICAgICAgLy8gZXhwYW5kIHBlcmNlbnQgdG8gY292ZXIgZmFkZVdpZHRoXG4gICAgICAgICAgICAgICAgY29uc3QgYWRqdXN0ZWRQZXJjZW50ID0gdGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoO1xuXG4gICAgICAgICAgICAgICAgLy8gaXRlcmF0ZSBhIHBlcmNlbnRcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwZXJjZW50ID0gLWZhZGVXaWR0aDsgcGVyY2VudCA8IDEgKyBmYWRlV2lkdGg7IHBlcmNlbnQgKz0gc3RlcCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgcGVyY2VudCB0byBhbmdsZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IHBlcmNlbnQgKiBNYXRoLlBJO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBjb29yZGluYXRlcyBmb3Igd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeDEgPSBNYXRoLmNvcyhhbmdsZSArIGxlbiArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHkxID0gTWF0aC5zaW4oYW5nbGUgKyBsZW4gKyAyICogTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeDIgPSBNYXRoLmNvcyhhbmdsZSArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHkyID0gTWF0aC5zaW4oYW5nbGUgKyAyICogTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKTtcblxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBhbHBoYSBmb3Igd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxwaGEgPSAoYWRqdXN0ZWRQZXJjZW50IC0gcGVyY2VudCArIGZhZGVXaWR0aCkgLyBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZHJhdyB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubW92ZVRvKHRoaXMud2lkdGggLyAyIC0gMiwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh4MSwgeTEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8oeDIsIHkyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHRoaXMud2lkdGggLyAyICsgMiwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsMCwwLCcgKyBhbHBoYSArICcpJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwicmFkaWFsLW91dFwiOlxuICAgICAgICAgICAgY2FzZSBcInJhZGlhbC1pblwiOiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpbm5lclJhZGl1cyA9ICh0aGlzLnBlcmNlbnQpICogdGhpcy5oZWlnaHQgLSAxMDAgPCAwID8gLjAxIDogKHRoaXMucGVyY2VudCkgKiB0aGlzLmhlaWdodCAtIDEwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBvdXRlclJhZGl1cyA9IHRoaXMucGVyY2VudCAqIHRoaXMuaGVpZ2h0ICsgMTAwXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCh0aGlzLndpZHRoIC8gMiwgdGhpcy5oZWlnaHQgLyAyLCBpbm5lclJhZGl1cywgdGhpcy53aWR0aCAvIDIsIHRoaXMuaGVpZ2h0IC8gMiwgb3V0ZXJSYWRpdXMpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBkZWZhdWx0OlxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwic291cmNlLWluXCI7XG5cbiAgICAgICAgaWYgKHRoaXMuYXNwZWN0ID4gdGhpcy5ueHRJbWcuYXNwZWN0KSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmRyYXdJbWFnZSh0aGlzLm54dEltZy5pbWcsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAodGhpcy5oZWlnaHQgLSB0aGlzLndpZHRoIC8gdGhpcy5ueHRJbWcuYXNwZWN0KSAvIDIsXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoIC8gdGhpcy5ueHRJbWcuYXNwZWN0KTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZHJhd0ltYWdlKHRoaXMubnh0SW1nLmltZyxcbiAgICAgICAgICAgICAgICAodGhpcy53aWR0aCAtIHRoaXMuaGVpZ2h0ICogdGhpcy5ueHRJbWcuYXNwZWN0KSAvIDIsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAqIHRoaXMubnh0SW1nLmFzcGVjdCxcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5yZXN0b3JlKCk7XG5cblxuICAgICAgICBpZiAoZWxhcHNlZCA8IHRoaXMuY3VySW1nLmZhZGVEdXJhdGlvbilcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZWRyYXcpO1xuICAgICAgICBlbHNlIGlmICh0aGlzLm1vZGUgPT09IE1vZGUuQVVUTylcbiAgICAgICAgICAgIHRoaXMubmV4dEZhZGVUaW1lciA9IHNldFRpbWVvdXQodGhpcy5uZXh0RmFkZSwgdGhpcy5jdXJJbWcuZmFkZURlbGF5KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2l6ZSgpIHtcblxuICAgICAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDsgLy8gRFM6IGZpeCBmb3IgaU9TIDkgYnVnXG4gICAgICAgIHRoaXMuYXNwZWN0ID0gdGhpcy53aWR0aCAvIHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0LmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5kcmF3SW1hZ2UoKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBkcmF3SW1hZ2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1ckltZykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXNwZWN0ID4gdGhpcy5jdXJJbWcuYXNwZWN0KSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9iYWNrQ29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VySW1nLmltZyxcbiAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuaGVpZ2h0IC0gdGhpcy53aWR0aCAvIHRoaXMuY3VySW1nLmFzcGVjdCkgLyAyLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoIC8gdGhpcy5jdXJJbWcuYXNwZWN0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9iYWNrQ29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VySW1nLmltZyxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMud2lkdGggLSB0aGlzLmhlaWdodCAqIHRoaXMuY3VySW1nLmFzcGVjdCkgLyAyLFxuICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAqIHRoaXMuY3VySW1nLmFzcGVjdCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJubyBpbWFnZSBcIiArIHRoaXMuY3VycmVudElkeCArXCIgXCIgKyB0aGlzLmltYWdlQXJyYXkubGVuZ3RoIClcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgc3RhcnQoKXtcbiAgICAgICAgdGhpcy5jdXJyZW50SWR4ID0gLTFcbiAgICAgICAgdGhpcy5uZXh0RmFkZSgpO1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cblxuICAgIHN0b3AoKXtcbiAgICAgICAgdGhpcy5uZXh0RmFkZVRpbWVyICYmIGNsZWFyVGltZW91dCh0aGlzLm5leHRGYWRlVGltZXIpXG4gICAgfVxuXG4gICAgbmV4dCgpe1xuICAgICAgICBpZiAodGhpcy5tb2RlICE9PSBNb2RlLk1VTFRJX1NFQ1RJT04pXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIlRoaXMgc3d3aXBlIG9wZXJhdGVzIGluIEFVVE8gbW9kZVwiKVxuICAgICAgICB0aGlzLm5leHRGYWRlKClcbiAgICB9XG5cblxuICAgIGdldCBudW1iZXJPZkZhZGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZUFycmF5Lmxlbmd0aFxuICAgIH1cbn1cblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuYmFubmVyXCIpLmZvckVhY2goYj0+e1xuICAgICAgICAgICAgY29uc3QgbW9kZTogTW9kZSA9ICBiLmhhc0F0dHJpYnV0ZShcImRhdGEtbXVsdGktc3dpcGVcIikgPyBNb2RlLk1VTFRJX1NFQ1RJT04gOiBNb2RlLkFVVE9cbiAgICAgICAgICAgIGNvbnN0IG93bmVyID0gYi5jbG9zZXN0KFwic2VjdGlvblwiKVxuICAgICAgICAgICAgaWYgKCFvd25lcikgdGhyb3cgRXJyb3IoXCJiYW5uZXIgZWxlbWVudCBub3QgcGFydCBvZiBhIHNlY3Rpb25cIilcbiAgICAgICAgICAgIGNvbnN0IHdpcGUgPSBuZXcgU1dXaXBlKGIsIG93bmVyLCBtb2RlKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGIuc3N3aXBlID0gd2lwZTtcbiAgICAgICAgfSlcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihcInNsaWRlY2hhbmdlZFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJldkJhbm5lciA9IGUucHJldmlvdXNTbGlkZS5xdWVyeVNlbGVjdG9yKFwiLmJhbm5lclwiKTtcbiAgICAgICAgICAgIGlmIChwcmV2QmFubmVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2lwZSA9IHByZXZCYW5uZXIuc3N3aXBlIGFzIFNXV2lwZTtcbiAgICAgICAgICAgICAgICBpZiAod2lwZS5tb2RlID09PSBNb2RlLkFVVE8pXG4gICAgICAgICAgICAgICAgICB3aXBlLnN0b3AoKTtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3duZXJJbmRleDoge2g6bnVtYmVyOyB2Om51bWJlcjt9ID0gUmV2ZWFsLmdldEluZGljZXMod2lwZS5vd25lcilcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEluZGV4OiB7aDpudW1iZXI7IHY6bnVtYmVyO30gPSBSZXZlYWwuZ2V0SW5kaWNlcyhlLmN1cnJlbnRTbGlkZSlcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBlLmN1cnJlbnRTbGlkZS5pbmRleFYgP1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4LnYgLSAob3duZXJJbmRleC52IHx8IDApIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleC5oIC0gb3duZXJJbmRleC5oXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRpc3RhbmNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlID4gMCAmJiBkaXN0YW5jZSA8IHdpcGUubnVtYmVyT2ZGYWRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5jdXJyZW50U2xpZGUuYXBwZW5kQ2hpbGQod2lwZS5iYW5uZXIpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aXBlLnN0b3AoKVxuICAgICAgICAgICAgICAgICAgICAgICAgd2lwZS5vd25lci5hcHBlbmRDaGlsZCh3aXBlLmJhbm5lcilcbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXh0QmFubmVyID0gZS5jdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvcihcIi5iYW5uZXJcIik7XG4gICAgICAgICAgICBpZiAobmV4dEJhbm5lcikge1xuICAgICAgICAgICAgICAgIGxldCBzc3dpcGUgPSBuZXh0QmFubmVyLnNzd2lwZSBhcyBTV1dpcGU7XG4gICAgICAgICAgICAgICAgaWYgKHNzd2lwZS5tb2RlID09PSBNb2RlLkFVVE8gfHwgc3N3aXBlLm93bmVyID09PSBlLmN1cnJlbnRTbGlkZSlcbiAgICAgICAgICAgICAgICAgICAgc3N3aXBlLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBzc3dpcGUubmV4dCgpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSlcblxuXG59KSgpXG5cbi8vIGBjbG9zZXN0YCBQb2x5ZmlsbCBmb3IgSUVcblxuaWYgKCFFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzKSB7XG4gICAgRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcyA9XG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3Rvcjtcbn1cblxuaWYgKCFFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0KSB7XG4gICAgRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgdmFyIGVsID0gdGhpcztcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBpZiAoRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcy5jYWxsKGVsLCBzKSkgcmV0dXJuIGVsO1xuICAgICAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50IHx8IGVsLnBhcmVudE5vZGU7XG4gICAgICAgIH0gd2hpbGUgKGVsICE9PSBudWxsICYmIGVsLm5vZGVUeXBlID09PSAxKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbn1cblxuIl19