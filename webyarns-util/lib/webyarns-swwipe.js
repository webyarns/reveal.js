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
      var dimensions = {
        width: img.width,
        height: img.height
      };
      return {
        img: img,
        aspect: aspect,
        fadeDuration: fadeDuration,
        fadeDelay: fadeDelay,
        fadeType: fadeType,
        fadeWidth: fadeWidth,
        startPercentage: startPercentage,
        noResize: noResize,
        dimensions: dimensions
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
        var h = i.dimensions.height;
        var w = i.dimensions.width;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy1zd3dpcGUudHMiXSwibmFtZXMiOlsiTW9kZSIsIlNXV2lwZSIsImltYWdlQXJyYXkiLCJjdXJyZW50SWR4IiwibGVuZ3RoIiwiYmFubmVyIiwib3duZXIiLCJtb2RlIiwiQVVUTyIsImxvb3AiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJ3aWR0aCIsImhlaWdodCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIkRhdGUiLCJkcmF3SW1hZ2UiLCJfZm9yZWdyb3VuZENvbnRleHQiLCJjbGVhclJlY3QiLCJwZXJjZW50IiwiY3VySW1nIiwiZmFkZVdpZHRoIiwic3RhcnRUaW1lIiwicmVkcmF3IiwiY3VycmVudFRpbWUiLCJlbGFwc2VkIiwiZ2V0VGltZSIsInN0YXJ0UGVyY2VudGFnZSIsImZhZGVEdXJhdGlvbiIsInNhdmUiLCJmYWRlVHlwZSIsImdyYWRpZW50IiwiY3JlYXRlTGluZWFyR3JhZGllbnQiLCJhZGRDb2xvclN0b3AiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsInNlZ21lbnRzIiwibGVuIiwiTWF0aCIsIlBJIiwic3RlcCIsImFkanVzdGVkUGVyY2VudCIsInByY3QiLCJhbmdsZSIsIngxIiwiY29zIiwieTEiLCJzaW4iLCJ4MiIsInkyIiwiYWxwaGEiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJmaWxsIiwiZW5kU3RhdGUiLCJpbm5lclJhZGl1cyIsIm91dGVyUmFkaXVzIiwiY3JlYXRlUmFkaWFsR3JhZGllbnQiLCJnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24iLCJfZHJhdyIsIm54dEltZyIsInJlc3RvcmUiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJuZXh0RmFkZVRpbWVyIiwic2V0VGltZW91dCIsIm5leHRGYWRlIiwiZmFkZURlbGF5IiwiaW1hZ2VzIiwiQXJyYXkiLCJmcm9tIiwicXVlcnlTZWxlY3RvckFsbCIsIm1hcCIsImltZyIsImFzcGVjdCIsImhhc0F0dHJpYnV0ZSIsIk51bWJlciIsImdldEF0dHJpYnV0ZSIsIm5vUmVzaXplIiwiZGltZW5zaW9ucyIsImFwcGVuZENoaWxkIiwiX2JhY2tDYW52YXMiLCJfZm9yZUNhbnZhcyIsImJhY2tDb250ZXh0IiwiZ2V0Q29udGV4dCIsImZvcmVDb250ZXh0IiwiRXJyb3IiLCJfYmFja0NvbnRleHQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVzaXplIiwiaSIsImN0eCIsImgiLCJ3IiwiZG9jdW1lbnRFbGVtZW50IiwiY2xpZW50SGVpZ2h0IiwiY2FudmFzIiwiY2xlYXJUaW1lb3V0IiwiTVVMVElfU0VDVElPTiIsImZvckVhY2giLCJiIiwibm9Mb29wIiwiY2xvc2VzdCIsIndpcGUiLCJzc3dpcGUiLCJSZXZlYWwiLCJlIiwicHJldkJhbm5lciIsInByZXZpb3VzU2xpZGUiLCJxdWVyeVNlbGVjdG9yIiwic3RvcCIsIm93bmVySW5kZXgiLCJnZXRJbmRpY2VzIiwiY3VycmVudEluZGV4IiwiY3VycmVudFNsaWRlIiwiZGlzdGFuY2UiLCJpbmRleFYiLCJ2IiwiY29uc29sZSIsImxvZyIsIm51bWJlck9mRmFkZXMiLCJuZXh0QmFubmVyIiwic3RhcnQiLCJuZXh0IiwiRWxlbWVudCIsInByb3RvdHlwZSIsIm1hdGNoZXMiLCJtc01hdGNoZXNTZWxlY3RvciIsIndlYmtpdE1hdGNoZXNTZWxlY3RvciIsInMiLCJlbCIsImNhbGwiLCJwYXJlbnRFbGVtZW50IiwicGFyZW50Tm9kZSIsIm5vZGVUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7OztJQWdCS0EsSTs7V0FBQUEsSTtBQUFBQSxFQUFBQSxJLENBQUFBLEk7QUFBQUEsRUFBQUEsSSxDQUFBQSxJO0dBQUFBLEksS0FBQUEsSTs7SUFnQkNDLE07Ozs7O0FBR29DO0FBQ0U7QUFDTTt3QkFhWjtBQUM5QixhQUFPLEtBQUtDLFVBQUwsQ0FBZ0IsS0FBS0MsVUFBckIsQ0FBUDtBQUNIOzs7d0JBRWlDO0FBQzlCLGFBQU8sS0FBS0Qs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UixDQUFrQkUsaUJBQWxCLElBQ0FILE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkcscUJBRnRCO0FBR0g7O0FBRUQsSUFBSSxDQUFDSixPQUFPLENBQUNDLFNBQVIsQ0FBa0J2QixPQUF2QixFQUFnQztBQUM1QnNCLEVBQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQnZCLE9BQWxCLEdBQTRCLFVBQVUyQixDQUFWLEVBQWE7QUFDckMsUUFBSUMsRUFBRSxHQUFHLElBQVQ7O0FBRUEsT0FBRztBQUNDLFVBQUlOLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkMsT0FBbEIsQ0FBMEJLLElBQTFCLENBQStCRCxFQUEvQixFQUFtQ0QsQ0FBbkMsQ0FBSixFQUEyQyxPQUFPQyxFQUFQO0FBQzNDQSxNQUFBQSxFQUFFLEdBQUdBLEVBQUUsQ0FBQ0UsYUFBSCxJQUFvQkYsRUFBRSxDQUFDRyxVQUE1QjtBQUNILEtBSEQsUUFHU0gsRUFBRSxLQUFLLElBQVAsSUFBZUEsRUFBRSxDQUFDSSxRQUFILEtBQWdCLENBSHhDOztBQUlBLFdBQU8sSUFBUDtBQUNILEdBUkQ7QUFTSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cblNlZSBodHRwczovL2dpdGh1Yi5jb20vRGF2ZVNlaWRtYW4vU3RhcldhcnNXaXBlXG5cblx0VG8gRG9cblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdEZpeCBkaWFnb25hbCB3aXBlXG5cdGZpeCByYWRpYWwgd2lwZVxuXG5cbldlYnlhcm5zIHZlcnNpb246XG4tIEFkZGVkIFwiZGVzdHJveVwiIGZsYWcgYW5kIG1ldGhvZFxuLSBBZGRlZCBzdXBwb3J0IGZvciBgZGF0YS1zdGFydEF0YCB0byBzZXQgc3RhcnQgcGVyY2VudGFnZVxuLSBvbiBkZXN0cm95IHJlbW92ZSBjcmVhdGVkIGVsZW1lbnRzXG4qL1xuXG5lbnVtIE1vZGUge1xuICAgIEFVVE8sIE1VTFRJX1NFQ1RJT05cbn1cblxuaW50ZXJmYWNlIEltYWdlT2JqZWN0IHtcbiAgICBzdGFydFBlcmNlbnRhZ2U6IG51bWJlcjtcbiAgICBmYWRlV2lkdGg6IG51bWJlcjtcbiAgICBmYWRlVHlwZTogc3RyaW5nIHwgbnVsbDtcbiAgICBmYWRlRGVsYXk6IG51bWJlcjtcbiAgICBmYWRlRHVyYXRpb246IG51bWJlcjtcbiAgICBhc3BlY3Q6IG51bWJlcjtcbiAgICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgbm9SZXNpemU6IGJvb2xlYW47XG4gICAgZGltZW5zaW9ucyA6IHtcIndpZHRoXCI6IG51bWJlcixcImhlaWdodFwiOiBudW1iZXJ9XG59XG5cbmNsYXNzIFNXV2lwZSB7XG5cbiAgICBjdXJyZW50SWR4ID0gLTE7XG4gICAgd2lkdGg6IG51bWJlciA9IHdpbmRvdy5pbm5lcldpZHRoO1x0XHRcdFx0Ly8gd2lkdGggb2YgY29udGFpbmVyIChiYW5uZXIpXG4gICAgaGVpZ2h0OiBudW1iZXIgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHRcdFx0XHQvLyBoZWlnaHQgb2YgY29udGFpbmVyXG4gICAgYXNwZWN0OiBudW1iZXIgPSB0aGlzLndpZHRoIC8gdGhpcy5oZWlnaHQ7XHRcdFx0XHQvLyBhc3BlY3QgcmF0aW8gb2YgY29udGFpbmVyXG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IGltYWdlQXJyYXk6IEltYWdlT2JqZWN0W107XG4gICAgcHJpdmF0ZSByZWFkb25seSBfYmFja0NhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9mb3JlQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2JhY2tDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfZm9yZWdyb3VuZENvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIHByaXZhdGUgcGVyY2VudDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIHN0YXJ0VGltZTogRGF0ZSA9IG5ldyBEYXRlO1xuICAgIHByaXZhdGUgbmV4dEZhZGVUaW1lcjogTm9kZUpTLlRpbWVvdXQgfCBudWxsID0gbnVsbDtcblxuXG4gICAgcHJpdmF0ZSBnZXQgY3VySW1nKCk6IEltYWdlT2JqZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VBcnJheVt0aGlzLmN1cnJlbnRJZHhdO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IG54dEltZygpOiBJbWFnZU9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLmltYWdlQXJyYXlbKHRoaXMuY3VycmVudElkeCArIDEpICUgdGhpcy5pbWFnZUFycmF5Lmxlbmd0aF07XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgYmFubmVyOiBIVE1MRWxlbWVudCwgcmVhZG9ubHkgb3duZXI6IEhUTUxFbGVtZW50LCByZWFkb25seSBtb2RlOiBNb2RlID0gTW9kZS5BVVRPLCByZWFkb25seSBsb29wID0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBpbWFnZXMgPSBBcnJheS5mcm9tKHRoaXMuYmFubmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIikpO1xuICAgICAgICB0aGlzLmltYWdlQXJyYXkgPSBpbWFnZXMubWFwKGltZyA9PiB7XG4gICAgICAgICAgICBjb25zdCBhc3BlY3QgPSBpbWcud2lkdGggLyBpbWcuaGVpZ2h0O1xuICAgICAgICAgICAgY29uc3QgZmFkZUR1cmF0aW9uID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZUR1cmF0aW9uXCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZhZGVEdXJhdGlvblwiKSkgKiAxMDAwIDogMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVEZWxheSA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZhZGVEZWxheVwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlRGVsYXlcIikpICogMTAwMCA6IDEwMDA7XG4gICAgICAgICAgICBjb25zdCBmYWRlVHlwZSA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZhZGVUeXBlXCIpID8gaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtZmFkZVR5cGVcIikgOiBcImNyb3NzLWxyXCI7XG4gICAgICAgICAgICBjb25zdCBmYWRlV2lkdGggPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1mYWRlV2lkdGhcIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtZmFkZVdpZHRoXCIpKSA6IC4xO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRQZXJjZW50YWdlID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtc3RhcnRBdFwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdGFydEF0XCIpKSA6IDA7XG4gICAgICAgICAgICBjb25zdCBub1Jlc2l6ZSA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLW5vLXJlc2l6ZVwiKTtcbiAgICAgICAgICAgIGNvbnN0IGRpbWVuc2lvbnMgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGggOiBpbWcud2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0IDogaW1nLmhlaWdodCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaW1nLFxuICAgICAgICAgICAgICAgIGFzcGVjdCxcbiAgICAgICAgICAgICAgICBmYWRlRHVyYXRpb24sXG4gICAgICAgICAgICAgICAgZmFkZURlbGF5LFxuICAgICAgICAgICAgICAgIGZhZGVUeXBlLFxuICAgICAgICAgICAgICAgIGZhZGVXaWR0aCxcbiAgICAgICAgICAgICAgICBzdGFydFBlcmNlbnRhZ2UsXG4gICAgICAgICAgICAgICAgbm9SZXNpemUsXG4gICAgICAgICAgICAgICAgZGltZW5zaW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuYmFubmVyLmFwcGVuZENoaWxkKHRoaXMuX2JhY2tDYW52YXMpO1xuICAgICAgICB0aGlzLmJhbm5lci5hcHBlbmRDaGlsZCh0aGlzLl9mb3JlQ2FudmFzKTtcbiAgICAgICAgY29uc3QgYmFja0NvbnRleHQgPSB0aGlzLl9iYWNrQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgICAgICBjb25zdCBmb3JlQ29udGV4dCA9IHRoaXMuX2ZvcmVDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICBpZiAoYmFja0NvbnRleHQgPT09IG51bGwgfHwgZm9yZUNvbnRleHQgPT09IG51bGwpIHRocm93IEVycm9yKFwiMmQgY29udGV4dCBub3Qgc3VwcG9ydGVkXCIpXG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0ID0gYmFja0NvbnRleHQ7XG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0ID0gZm9yZUNvbnRleHQ7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG5leHRGYWRlID0gKCkgPT4ge1xuICAgICAgICAvLyBhZHZhbmNlIGluZGljZXNcbiAgICAgICAgdGhpcy5jdXJyZW50SWR4ID0gKyt0aGlzLmN1cnJlbnRJZHggJSB0aGlzLmltYWdlQXJyYXkubGVuZ3RoO1xuICAgICAgICB0aGlzLmRyYXdJbWFnZSgpO1xuXG4gICAgICAgIC8vIGNsZWFyIHRoZSBmb3JlZ3JvdW5kXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgLy8gc2V0dXAgYW5kIHN0YXJ0IHRoZSBmYWRlXG4gICAgICAgIHRoaXMucGVyY2VudCA9IC10aGlzLmN1ckltZy5mYWRlV2lkdGg7XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGU7XG4gICAgICAgIHRoaXMucmVkcmF3KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWRyYXcgPSAoKSA9PiB7XG4gICAgICAgIC8vIGNhbGN1bGF0ZSBwZXJjZW50IGNvbXBsZXRpb24gb2Ygd2lwZVxuICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IG5ldyBEYXRlO1xuICAgICAgICBjb25zdCBlbGFwc2VkID0gY3VycmVudFRpbWUuZ2V0VGltZSgpIC0gdGhpcy5zdGFydFRpbWUuZ2V0VGltZSgpO1xuICAgICAgICB0aGlzLnBlcmNlbnQgPSB0aGlzLmN1ckltZy5zdGFydFBlcmNlbnRhZ2UgKyBlbGFwc2VkIC8gdGhpcy5jdXJJbWcuZmFkZUR1cmF0aW9uO1xuXG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuc2F2ZSgpO1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICBjb25zdCBmYWRlV2lkdGggPSB0aGlzLmN1ckltZy5mYWRlV2lkdGhcblxuICAgICAgICBzd2l0Y2ggKHRoaXMuY3VySW1nLmZhZGVUeXBlKSB7XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1sclwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDApO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1ybFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDApO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy11ZFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgMCwgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAwLCAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1kdVwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgMCwgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAwLCAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJkaWFnb25hbC10bC1iclwiOiB7Ly8gRFM6IFRoaXMgZGlhZ29uYWwgbm90IHdvcmtpbmcgcHJvcGVybHlcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMiArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgyICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCBmYWRlV2lkdGggKiAodGhpcy53aWR0aCAvICh0aGlzLmhlaWdodCAvIDIpKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImRpYWdvbmFsLXRyLWJsXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDAsXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCArIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtYnRtXCI6IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzID0gMzAwOyAvLyB0aGUgYW1vdW50IG9mIHNlZ21lbnRzIHRvIHNwbGl0IHRoZSBzZW1pIGNpcmNsZSBpbnRvLCBEUzogYWRqdXN0IHRoaXMgZm9yIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSAxIC8gc2VnbWVudHM7XG5cbiAgICAgICAgICAgICAgICAvLyBleHBhbmQgcGVyY2VudCB0byBjb3ZlciBmYWRlV2lkdGhcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFBlcmNlbnQgPSB0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIGEgcGVyY2VudFxuICAgICAgICAgICAgICAgIGZvciAobGV0IHByY3QgPSAtZmFkZVdpZHRoOyBwcmN0IDwgMSArIGZhZGVXaWR0aDsgcHJjdCArPSBzdGVwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCBwZXJjZW50IHRvIGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gcHJjdCAqIE1hdGguUEk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGNvb3JkaW5hdGVzIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MSA9IE1hdGguY29zKGFuZ2xlICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MSA9IE1hdGguc2luKGFuZ2xlICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MiA9IE1hdGguY29zKGFuZ2xlICsgbGVuICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MiA9IE1hdGguc2luKGFuZ2xlICsgbGVuICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBhbHBoYSBmb3Igd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxwaGEgPSAoYWRqdXN0ZWRQZXJjZW50IC0gcHJjdCArIGZhZGVXaWR0aCkgLyBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZHJhdyB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubW92ZVRvKHRoaXMud2lkdGggLyAyIC0gMiwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8oeDEsIHkxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgyLCB5Mik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh0aGlzLndpZHRoIC8gMiArIDIsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsJyArIGFscGhhICsgJyknO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtdG9wXCI6IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzID0gMzAwOyAvLyB0aGUgYW1vdW50IG9mIHNlZ21lbnRzIHRvIHNwbGl0IHRoZSBzZW1pIGNpcmNsZSBpbnRvLCBEUzogYWRqdXN0IHRoaXMgZm9yIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSAxIC8gc2VnbWVudHM7XG5cbiAgICAgICAgICAgICAgICAvLyBleHBhbmQgcGVyY2VudCB0byBjb3ZlciBmYWRlV2lkdGhcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFBlcmNlbnQgPSB0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIGEgcGVyY2VudFxuICAgICAgICAgICAgICAgIGZvciAobGV0IHBlcmNlbnQgPSAtZmFkZVdpZHRoOyBwZXJjZW50IDwgMSArIGZhZGVXaWR0aDsgcGVyY2VudCArPSBzdGVwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCBwZXJjZW50IHRvIGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gcGVyY2VudCAqIE1hdGguUEk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGNvb3JkaW5hdGVzIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MSA9IE1hdGguY29zKGFuZ2xlICsgbGVuICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTEgPSBNYXRoLnNpbihhbmdsZSArIGxlbiArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MiA9IE1hdGguY29zKGFuZ2xlICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTIgPSBNYXRoLnNpbihhbmdsZSArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGFscGhhIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbHBoYSA9IChhZGp1c3RlZFBlcmNlbnQgLSBwZXJjZW50ICsgZmFkZVdpZHRoKSAvIGZhZGVXaWR0aDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBkcmF3IHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5tb3ZlVG8odGhpcy53aWR0aCAvIDIgLSAyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgxLCB5MSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh4MiwgeTIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8odGhpcy53aWR0aCAvIDIgKyAyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsJyArIGFscGhhICsgJyknO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtb3V0XCI6XG4gICAgICAgICAgICBjYXNlIFwicmFkaWFsLWluXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwZXJjZW50ID0gdGhpcy5jdXJJbWcuZmFkZVR5cGUgPT09IFwicmFkaWFsLWluXCIgPyAgKDEgLSB0aGlzLnBlcmNlbnQpIDogdGhpcy5wZXJjZW50XG4gICAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSAxMDA7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kU3RhdGUgPSAgMC4wMVxuICAgICAgICAgICAgICAgIGNvbnN0IGlubmVyUmFkaXVzID0gKHBlcmNlbnQpICogdGhpcy5oZWlnaHQgLSB3aWR0aCA8IDAgPyBlbmRTdGF0ZSA6IChwZXJjZW50KSAqIHRoaXMuaGVpZ2h0IC0gd2lkdGg7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0ZXJSYWRpdXMgPSBwZXJjZW50ICogdGhpcy5oZWlnaHQgKyB3aWR0aFxuICAgICAgICAgICAgICAgIC8qaWYgKHRoaXMuY3VySW1nLmZhZGVUeXBlID09PSBcInJhZGlhbC1pblwiKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS50YWJsZSh7XCJwZXJjZW50XCI6IHBlcmNlbnQsXCJpbm5lclJhZGl1c1wiOiBpbm5lclJhZGl1cywgXCJvdXRlclJhZGl1c1wiOiBvdXRlclJhZGl1cyB9KVxuICAgICAgICAgICAgICAgIH0qL1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIDIsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0IC8gMiwgaW5uZXJSYWRpdXMsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyAyLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAvIDIsIG91dGVyUmFkaXVzKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJJbWcuZmFkZVR5cGUgPT09IFwicmFkaWFsLWluXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJzb3VyY2UtaW5cIjtcbiAgICAgICAgdGhpcy5fZHJhdyh0aGlzLm54dEltZywgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQpXG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQucmVzdG9yZSgpO1xuXG5cbiAgICAgICAgaWYgKGVsYXBzZWQgPCB0aGlzLmN1ckltZy5mYWRlRHVyYXRpb24pXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVkcmF3KTtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5tb2RlID09PSBNb2RlLkFVVE8pXG4gICAgICAgICAgICBpZiAodGhpcy5sb29wIHx8IHRoaXMuY3VycmVudElkeCA8IHRoaXMuaW1hZ2VBcnJheS5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICAgIHRoaXMubmV4dEZhZGVUaW1lciA9IHNldFRpbWVvdXQodGhpcy5uZXh0RmFkZSwgdGhpcy5jdXJJbWcuZmFkZURlbGF5KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9kcmF3KGk6IEltYWdlT2JqZWN0LCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCl7XG4gICAgICAgIGlmIChpLm5vUmVzaXplKSB7XG4gICAgICAgICAgICBjb25zdCBoID0gaS5kaW1lbnNpb25zLmhlaWdodFxuICAgICAgICAgICAgY29uc3QgdyA9IGkuZGltZW5zaW9ucy53aWR0aFxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShcbiAgICAgICAgICAgICAgICBpLmltZyxcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoIC8gMiAtIHcgLyAyLFxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0IC8yIC0gaCAvIDIsXG4gICAgICAgICAgICAgICAgdywgaClcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFzcGVjdCA+IGkuYXNwZWN0KSB7XG5cbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaS5pbWcsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAodGhpcy5oZWlnaHQgLSB0aGlzLndpZHRoIC8gaS5hc3BlY3QpIC8gMixcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyBpLmFzcGVjdCk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaS5pbWcsXG4gICAgICAgICAgICAgICAgKHRoaXMud2lkdGggLSB0aGlzLmhlaWdodCAqIGkuYXNwZWN0KSAvIDIsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAqIGkuYXNwZWN0LFxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNpemUoKSB7XG5cbiAgICAgICAgdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7IC8vIERTOiBmaXggZm9yIGlPUyA5IGJ1Z1xuICAgICAgICB0aGlzLmFzcGVjdCA9IHRoaXMud2lkdGggLyB0aGlzLmhlaWdodDtcblxuICAgICAgICB0aGlzLl9iYWNrQ29udGV4dC5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLl9iYWNrQ29udGV4dC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgIHRoaXMuZHJhd0ltYWdlKCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgZHJhd0ltYWdlKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJJbWcpIHtcbiAgICAgICAgICAgIHRoaXMuX2RyYXcodGhpcy5jdXJJbWcsIHRoaXMuX2JhY2tDb250ZXh0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJubyBpbWFnZSBcIiArIHRoaXMuY3VycmVudElkeCArIFwiIFwiICsgdGhpcy5pbWFnZUFycmF5Lmxlbmd0aClcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudElkeCA9IC0xXG4gICAgICAgIHRoaXMubmV4dEZhZGUoKTtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLm5leHRGYWRlVGltZXIgJiYgY2xlYXJUaW1lb3V0KHRoaXMubmV4dEZhZGVUaW1lcilcbiAgICB9XG5cbiAgICBuZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5tb2RlICE9PSBNb2RlLk1VTFRJX1NFQ1RJT04pXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIlRoaXMgc3d3aXBlIG9wZXJhdGVzIGluIEFVVE8gbW9kZVwiKVxuICAgICAgICB0aGlzLm5leHRGYWRlKClcbiAgICB9XG5cblxuICAgIGdldCBudW1iZXJPZkZhZGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZUFycmF5Lmxlbmd0aFxuICAgIH1cbn1cblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuYmFubmVyXCIpLmZvckVhY2goYiA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlOiBNb2RlID0gYi5oYXNBdHRyaWJ1dGUoXCJkYXRhLW11bHRpLXN3aXBlXCIpID8gTW9kZS5NVUxUSV9TRUNUSU9OIDogTW9kZS5BVVRPXG4gICAgICAgICAgICBjb25zdCBub0xvb3A6IGJvb2xlYW4gPSBiLmhhc0F0dHJpYnV0ZShcImRhdGEtbm8tbG9vcFwiKVxuICAgICAgICAgICAgY29uc3Qgb3duZXIgPSBiLmNsb3Nlc3QoXCJzZWN0aW9uXCIpXG4gICAgICAgICAgICBpZiAoIW93bmVyKSB0aHJvdyBFcnJvcihcImJhbm5lciBlbGVtZW50IG5vdCBwYXJ0IG9mIGEgc2VjdGlvblwiKVxuICAgICAgICAgICAgY29uc3Qgd2lwZSA9IG5ldyBTV1dpcGUoYiwgb3duZXIsIG1vZGUsICFub0xvb3ApO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgYi5zc3dpcGUgPSB3aXBlO1xuICAgICAgICB9KVxuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKFwic2xpZGVjaGFuZ2VkXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcmV2QmFubmVyID0gZS5wcmV2aW91c1NsaWRlPy5xdWVyeVNlbGVjdG9yKFwiLmJhbm5lclwiKTtcbiAgICAgICAgICAgIGlmIChwcmV2QmFubmVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2lwZSA9IHByZXZCYW5uZXIuc3N3aXBlIGFzIFNXV2lwZTtcbiAgICAgICAgICAgICAgICBpZiAod2lwZS5tb2RlID09PSBNb2RlLkFVVE8pXG4gICAgICAgICAgICAgICAgICAgIHdpcGUuc3RvcCgpO1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvd25lckluZGV4OiB7IGg6IG51bWJlcjsgdjogbnVtYmVyOyB9ID0gUmV2ZWFsLmdldEluZGljZXMod2lwZS5vd25lcilcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEluZGV4OiB7IGg6IG51bWJlcjsgdjogbnVtYmVyOyB9ID0gUmV2ZWFsLmdldEluZGljZXMoZS5jdXJyZW50U2xpZGUpXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gZS5jdXJyZW50U2xpZGUuaW5kZXhWID9cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleC52IC0gKG93bmVySW5kZXgudiB8fCAwKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXguaCAtIG93bmVySW5kZXguaFxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkaXN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA+IDAgJiYgZGlzdGFuY2UgPCB3aXBlLm51bWJlck9mRmFkZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY3VycmVudFNsaWRlLmFwcGVuZENoaWxkKHdpcGUuYmFubmVyKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lwZS5zdG9wKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpcGUub3duZXIuYXBwZW5kQ2hpbGQod2lwZS5iYW5uZXIpXG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV4dEJhbm5lciA9IGUuY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3IoXCIuYmFubmVyXCIpO1xuICAgICAgICAgICAgaWYgKG5leHRCYW5uZXIpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3N3aXBlID0gbmV4dEJhbm5lci5zc3dpcGUgYXMgU1dXaXBlO1xuICAgICAgICAgICAgICAgIGlmIChzc3dpcGUubW9kZSA9PT0gTW9kZS5BVVRPIHx8IHNzd2lwZS5vd25lciA9PT0gZS5jdXJyZW50U2xpZGUpXG4gICAgICAgICAgICAgICAgICAgIHNzd2lwZS5zdGFydCgpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgc3N3aXBlLm5leHQoKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0pXG5cblxufSkoKVxuXG4vLyBgY2xvc2VzdGAgUG9seWZpbGwgZm9yIElFXG5cbmlmICghRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykge1xuICAgIEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgPVxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS53ZWJraXRNYXRjaGVzU2VsZWN0b3I7XG59XG5cbmlmICghRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCkge1xuICAgIEVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QgPSBmdW5jdGlvbiAocykge1xuICAgICAgICB2YXIgZWwgPSB0aGlzO1xuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGlmIChFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzLmNhbGwoZWwsIHMpKSByZXR1cm4gZWw7XG4gICAgICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQgfHwgZWwucGFyZW50Tm9kZTtcbiAgICAgICAgfSB3aGlsZSAoZWwgIT09IG51bGwgJiYgZWwubm9kZVR5cGUgPT09IDEpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xufVxuXG4iXX0=