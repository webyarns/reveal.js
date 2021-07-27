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

      _this._foregroundContext.globalCompositeOperation = _this.nxtImg.noResize ? "source-atop" : "source-in";

      _this._draw(_this.nxtImg, _this._foregroundContext, _this._backContext);

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
    value: function _draw(i, ctx, otherCtx) {
      if (i.noResize) {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.height);
        var h = i.dimensions.height;
        var w = i.dimensions.width;
        ctx.drawImage(i.img, this.width / 2 - w / 2, this.height / 2 - h / 2, w, h);
        ctx.restore();
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
        this._draw(this.curImg, this._backContext, this._foregroundContext);
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
  // @ts-ignore
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  // @ts-ignore
  Element.prototype.closest = function (s) {
    var el = this;

    do {
      if (Element.prototype.matches.call(el, s)) return el; // @ts-ignore

      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy1zd3dpcGUudHMiXSwibmFtZXMiOlsiTW9kZSIsIlNXV2lwZSIsImltYWdlQXJyYXkiLCJjdXJyZW50SWR4IiwibGVuZ3RoIiwiYmFubmVyIiwib3duZXIiLCJtb2RlIiwiQVVUTyIsImxvb3AiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJ3aWR0aCIsImhlaWdodCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIkRhdGUiLCJkcmF3SW1hZ2UiLCJfZm9yZWdyb3VuZENvbnRleHQiLCJjbGVhclJlY3QiLCJwZXJjZW50IiwiY3VySW1nIiwiZmFkZVdpZHRoIiwic3RhcnRUaW1lIiwicmVkcmF3IiwiY3VycmVudFRpbWUiLCJlbGFwc2VkIiwiZ2V0VGltZSIsInN0YXJ0UGVyY2VudGFnZSIsImZhZGVEdXJhdGlvbiIsInNhdmUiLCJmYWRlVHlwZSIsImdyYWRpZW50IiwiY3JlYXRlTGluZWFyR3JhZGllbnQiLCJhZGRDb2xvclN0b3AiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsInNlZ21lbnRzIiwibGVuIiwiTWF0aCIsIlBJIiwic3RlcCIsImFkanVzdGVkUGVyY2VudCIsInByY3QiLCJhbmdsZSIsIngxIiwiY29zIiwieTEiLCJzaW4iLCJ4MiIsInkyIiwiYWxwaGEiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJmaWxsIiwiZW5kU3RhdGUiLCJpbm5lclJhZGl1cyIsIm91dGVyUmFkaXVzIiwiY3JlYXRlUmFkaWFsR3JhZGllbnQiLCJnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24iLCJueHRJbWciLCJub1Jlc2l6ZSIsIl9kcmF3IiwiX2JhY2tDb250ZXh0IiwicmVzdG9yZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm5leHRGYWRlVGltZXIiLCJzZXRUaW1lb3V0IiwibmV4dEZhZGUiLCJmYWRlRGVsYXkiLCJpbWFnZXMiLCJBcnJheSIsImZyb20iLCJxdWVyeVNlbGVjdG9yQWxsIiwibWFwIiwiaW1nIiwiYXNwZWN0IiwiaGFzQXR0cmlidXRlIiwiTnVtYmVyIiwiZ2V0QXR0cmlidXRlIiwiZGltZW5zaW9ucyIsImFwcGVuZENoaWxkIiwiX2JhY2tDYW52YXMiLCJfZm9yZUNhbnZhcyIsImJhY2tDb250ZXh0IiwiZ2V0Q29udGV4dCIsImZvcmVDb250ZXh0IiwiRXJyb3IiLCJhZGRFdmVudExpc3RlbmVyIiwicmVzaXplIiwiaSIsImN0eCIsIm90aGVyQ3R4IiwiaCIsInciLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRIZWlnaHQiLCJjYW52YXMiLCJjbGVhclRpbWVvdXQiLCJNVUxUSV9TRUNUSU9OIiwiZm9yRWFjaCIsImIiLCJub0xvb3AiLCJjbG9zZXN0Iiwid2lwZSIsInNzd2lwZSIsIlJldmVhbCIsImUiLCJwcmV2QmFubmVyIiwicHJldmlvdXNTbGlkZSIsInF1ZXJ5U2VsZWN0b3IiLCJzdG9wIiwib3duZXJJbmRleCIsImdldEluZGljZXMiLCJjdXJyZW50SW5kZXgiLCJjdXJyZW50U2xpZGUiLCJkaXN0YW5jZSIsImluZGV4ViIsInYiLCJjb25zb2xlIiwibG9nIiwibnVtYmVyT2ZGYWRlcyIsIm5leHRCYW5uZXIiLCJzdGFydCIsIm5leHQiLCJFbGVtZW50IiwicHJvdG90eXBlIiwibWF0Y2hlcyIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwid2Via2l0TWF0Y2hlc1NlbGVjdG9yIiwicyIsImVsIiwiY2FsbCIsInBhcmVudEVsZW1lbnQiLCJwYXJlbnROb2RlIiwibm9kZVR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0lBZ0JLQSxJOztXQUFBQSxJO0FBQUFBLEVBQUFBLEksQ0FBQUEsSTtBQUFBQSxFQUFBQSxJLENBQUFBLEk7R0FBQUEsSSxLQUFBQSxJOztJQWdCQ0MsTTs7Ozs7QUFHb0M7QUFDRTtBQUNNO3dCQWFaO0FBQzlCLGFBQU8sS0FBS0MsVUFBTCxDQUFnQixLQUFLQyxVQUFyQixDQUFQO0FBQ0g7Ozt3QkFFaUM7QUFDOUIs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QUFQLEtBQWdCUCxJQUFJLENBQUNRLElBQXJCLElBQTZCbUcsTUFBTSxDQUFDckcsS0FBUCxLQUFpQnVHLENBQUMsQ0FBQ1EsWUFBcEQsRUFDSVYsTUFBTSxDQUFDa0IsS0FBUCxHQURKLEtBR0lsQixNQUFNLENBQUNtQixJQUFQO0FBRVA7QUFDSixLQWhDRDtBQWlDSCxHQTVDRDtBQStDSCxDQWpERCxJLENBbURBOzs7QUFFQSxJQUFJLENBQUNDLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkMsT0FBdkIsRUFBZ0M7QUFDNUI7QUFDQUYsRUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQWtCQyxPQUFsQixHQUE0QkYsT0FBTyxDQUFDQyxTQUFSLENBQWtCRSxpQkFBbEIsSUFDeEJILE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkcscUJBRHRCO0FBRUg7O0FBRUQsSUFBSSxDQUFDSixPQUFPLENBQUNDLFNBQVIsQ0FBa0J2QixPQUF2QixFQUFnQztBQUM1QjtBQUNBc0IsRUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQWtCdkIsT0FBbEIsR0FBNEIsVUFBVTJCLENBQVYsRUFBYTtBQUNyQyxRQUFJQyxFQUFFLEdBQUcsSUFBVDs7QUFFQSxPQUFHO0FBQ0MsVUFBSU4sT0FBTyxDQUFDQyxTQUFSLENBQWtCQyxPQUFsQixDQUEwQkssSUFBMUIsQ0FBK0JELEVBQS9CLEVBQW1DRCxDQUFuQyxDQUFKLEVBQTJDLE9BQU9DLEVBQVAsQ0FENUMsQ0FFQzs7QUFDQUEsTUFBQUEsRUFBRSxHQUFHQSxFQUFFLENBQUNFLGFBQUgsSUFBb0JGLEVBQUUsQ0FBQ0csVUFBNUI7QUFDSCxLQUpELFFBSVNILEVBQUUsS0FBSyxJQUFQLElBQWVBLEVBQUUsQ0FBQ0ksUUFBSCxLQUFnQixDQUp4Qzs7QUFLQSxXQUFPLElBQVA7QUFDSCxHQVREO0FBVUgiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5TZWUgaHR0cHM6Ly9naXRodWIuY29tL0RhdmVTZWlkbWFuL1N0YXJXYXJzV2lwZVxuXG5cdFRvIERvXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRGaXggZGlhZ29uYWwgd2lwZVxuXHRmaXggcmFkaWFsIHdpcGVcblxuXG5XZWJ5YXJucyB2ZXJzaW9uOlxuLSBBZGRlZCBcImRlc3Ryb3lcIiBmbGFnIGFuZCBtZXRob2Rcbi0gQWRkZWQgc3VwcG9ydCBmb3IgYGRhdGEtc3RhcnRBdGAgdG8gc2V0IHN0YXJ0IHBlcmNlbnRhZ2Vcbi0gb24gZGVzdHJveSByZW1vdmUgY3JlYXRlZCBlbGVtZW50c1xuKi9cblxuZW51bSBNb2RlIHtcbiAgICBBVVRPLCBNVUxUSV9TRUNUSU9OXG59XG5cbmludGVyZmFjZSBJbWFnZU9iamVjdCB7XG4gICAgc3RhcnRQZXJjZW50YWdlOiBudW1iZXI7XG4gICAgZmFkZVdpZHRoOiBudW1iZXI7XG4gICAgZmFkZVR5cGU6IHN0cmluZyB8IG51bGw7XG4gICAgZmFkZURlbGF5OiBudW1iZXI7XG4gICAgZmFkZUR1cmF0aW9uOiBudW1iZXI7XG4gICAgYXNwZWN0OiBudW1iZXI7XG4gICAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xuICAgIG5vUmVzaXplOiBib29sZWFuO1xuICAgIGRpbWVuc2lvbnMgOiB7XCJ3aWR0aFwiOiBudW1iZXIsXCJoZWlnaHRcIjogbnVtYmVyfVxufVxuXG5jbGFzcyBTV1dpcGUge1xuXG4gICAgY3VycmVudElkeCA9IC0xO1xuICAgIHdpZHRoOiBudW1iZXIgPSB3aW5kb3cuaW5uZXJXaWR0aDtcdFx0XHRcdC8vIHdpZHRoIG9mIGNvbnRhaW5lciAoYmFubmVyKVxuICAgIGhlaWdodDogbnVtYmVyID0gd2luZG93LmlubmVySGVpZ2h0O1x0XHRcdFx0Ly8gaGVpZ2h0IG9mIGNvbnRhaW5lclxuICAgIGFzcGVjdDogbnVtYmVyID0gdGhpcy53aWR0aCAvIHRoaXMuaGVpZ2h0O1x0XHRcdFx0Ly8gYXNwZWN0IHJhdGlvIG9mIGNvbnRhaW5lclxuXG4gICAgcHJpdmF0ZSByZWFkb25seSBpbWFnZUFycmF5OiBJbWFnZU9iamVjdFtdO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2JhY2tDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfZm9yZUNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9iYWNrQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZvcmVncm91bmRDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICBwcml2YXRlIHBlcmNlbnQ6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBzdGFydFRpbWU6IERhdGUgPSBuZXcgRGF0ZTtcbiAgICBwcml2YXRlIG5leHRGYWRlVGltZXI6IE5vZGVKUy5UaW1lb3V0IHwgbnVsbCA9IG51bGw7XG5cblxuICAgIHByaXZhdGUgZ2V0IGN1ckltZygpOiBJbWFnZU9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLmltYWdlQXJyYXlbdGhpcy5jdXJyZW50SWR4XTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBueHRJbWcoKTogSW1hZ2VPYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZUFycmF5Wyh0aGlzLmN1cnJlbnRJZHggKyAxKSAlIHRoaXMuaW1hZ2VBcnJheS5sZW5ndGhdO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGJhbm5lcjogSFRNTEVsZW1lbnQsIHJlYWRvbmx5IG93bmVyOiBIVE1MRWxlbWVudCwgcmVhZG9ubHkgbW9kZTogTW9kZSA9IE1vZGUuQVVUTywgcmVhZG9ubHkgbG9vcCA9IHRydWUpIHtcbiAgICAgICAgY29uc3QgaW1hZ2VzID0gQXJyYXkuZnJvbSh0aGlzLmJhbm5lci5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpKTtcbiAgICAgICAgdGhpcy5pbWFnZUFycmF5ID0gaW1hZ2VzLm1hcChpbWcgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXNwZWN0ID0gaW1nLndpZHRoIC8gaW1nLmhlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVEdXJhdGlvbiA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZhZGVEdXJhdGlvblwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlRHVyYXRpb25cIikpICogMTAwMCA6IDEwMDA7XG4gICAgICAgICAgICBjb25zdCBmYWRlRGVsYXkgPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1mYWRlRGVsYXlcIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtZmFkZURlbGF5XCIpKSAqIDEwMDAgOiAxMDAwO1xuICAgICAgICAgICAgY29uc3QgZmFkZVR5cGUgPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1mYWRlVHlwZVwiKSA/IGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZhZGVUeXBlXCIpIDogXCJjcm9zcy1sclwiO1xuICAgICAgICAgICAgY29uc3QgZmFkZVdpZHRoID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZVdpZHRoXCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZhZGVXaWR0aFwiKSkgOiAuMTtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0UGVyY2VudGFnZSA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLXN0YXJ0QXRcIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtc3RhcnRBdFwiKSkgOiAwO1xuICAgICAgICAgICAgY29uc3Qgbm9SZXNpemUgPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1uby1yZXNpemVcIik7XG4gICAgICAgICAgICBjb25zdCBkaW1lbnNpb25zID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoIDogaW1nLndpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodCA6IGltZy5oZWlnaHQsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgICAgICBhc3BlY3QsXG4gICAgICAgICAgICAgICAgZmFkZUR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGZhZGVEZWxheSxcbiAgICAgICAgICAgICAgICBmYWRlVHlwZSxcbiAgICAgICAgICAgICAgICBmYWRlV2lkdGgsXG4gICAgICAgICAgICAgICAgc3RhcnRQZXJjZW50YWdlLFxuICAgICAgICAgICAgICAgIG5vUmVzaXplLFxuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmJhbm5lci5hcHBlbmRDaGlsZCh0aGlzLl9iYWNrQ2FudmFzKTtcbiAgICAgICAgdGhpcy5iYW5uZXIuYXBwZW5kQ2hpbGQodGhpcy5fZm9yZUNhbnZhcyk7XG4gICAgICAgIGNvbnN0IGJhY2tDb250ZXh0ID0gdGhpcy5fYmFja0NhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICAgICAgY29uc3QgZm9yZUNvbnRleHQgPSB0aGlzLl9mb3JlQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgaWYgKGJhY2tDb250ZXh0ID09PSBudWxsIHx8IGZvcmVDb250ZXh0ID09PSBudWxsKSB0aHJvdyBFcnJvcihcIjJkIGNvbnRleHQgbm90IHN1cHBvcnRlZFwiKVxuICAgICAgICB0aGlzLl9iYWNrQ29udGV4dCA9IGJhY2tDb250ZXh0O1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dCA9IGZvcmVDb250ZXh0O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBuZXh0RmFkZSA9ICgpID0+IHtcbiAgICAgICAgLy8gYWR2YW5jZSBpbmRpY2VzXG4gICAgICAgIHRoaXMuY3VycmVudElkeCA9ICsrdGhpcy5jdXJyZW50SWR4ICUgdGhpcy5pbWFnZUFycmF5Lmxlbmd0aDtcbiAgICAgICAgdGhpcy5kcmF3SW1hZ2UoKTtcblxuICAgICAgICAvLyBjbGVhciB0aGUgZm9yZWdyb3VuZFxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgIC8vIHNldHVwIGFuZCBzdGFydCB0aGUgZmFkZVxuICAgICAgICB0aGlzLnBlcmNlbnQgPSAtdGhpcy5jdXJJbWcuZmFkZVdpZHRoO1xuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IG5ldyBEYXRlO1xuICAgICAgICB0aGlzLnJlZHJhdygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVkcmF3ID0gKCkgPT4ge1xuICAgICAgICAvLyBjYWxjdWxhdGUgcGVyY2VudCBjb21wbGV0aW9uIG9mIHdpcGVcbiAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBuZXcgRGF0ZTtcbiAgICAgICAgY29uc3QgZWxhcHNlZCA9IGN1cnJlbnRUaW1lLmdldFRpbWUoKSAtIHRoaXMuc3RhcnRUaW1lLmdldFRpbWUoKTtcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gdGhpcy5jdXJJbWcuc3RhcnRQZXJjZW50YWdlICsgZWxhcHNlZCAvIHRoaXMuY3VySW1nLmZhZGVEdXJhdGlvbjtcblxuXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LnNhdmUoKTtcbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgY29uc3QgZmFkZVdpZHRoID0gdGhpcy5jdXJJbWcuZmFkZVdpZHRoXG5cbiAgICAgICAgc3dpdGNoICh0aGlzLmN1ckltZy5mYWRlVHlwZSkge1xuXG4gICAgICAgICAgICBjYXNlIFwiY3Jvc3MtbHJcIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwiY3Jvc3MtcmxcIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICgoMSAtIHRoaXMucGVyY2VudCkgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCxcbiAgICAgICAgICAgICAgICAgICAgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwiY3Jvc3MtdWRcIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgIDAsICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgMCwgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwiY3Jvc3MtZHVcIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgIDAsICgoMSAtIHRoaXMucGVyY2VudCkgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgMCwgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwiZGlhZ29uYWwtdGwtYnJcIjogey8vIERTOiBUaGlzIGRpYWdvbmFsIG5vdCB3b3JraW5nIHByb3Blcmx5XG5cbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDIgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDAsXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMiArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgZmFkZVdpZHRoICogKHRoaXMud2lkdGggLyAodGhpcy5oZWlnaHQgLyAyKSkgKiB0aGlzLndpZHRoKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJkaWFnb25hbC10ci1ibFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGggKyB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwicmFkaWFsLWJ0bVwiOiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50cyA9IDMwMDsgLy8gdGhlIGFtb3VudCBvZiBzZWdtZW50cyB0byBzcGxpdCB0aGUgc2VtaSBjaXJjbGUgaW50bywgRFM6IGFkanVzdCB0aGlzIGZvciBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgICAgIGNvbnN0IGxlbiA9IE1hdGguUEkgLyBzZWdtZW50cztcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwID0gMSAvIHNlZ21lbnRzO1xuXG4gICAgICAgICAgICAgICAgLy8gZXhwYW5kIHBlcmNlbnQgdG8gY292ZXIgZmFkZVdpZHRoXG4gICAgICAgICAgICAgICAgY29uc3QgYWRqdXN0ZWRQZXJjZW50ID0gdGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoO1xuXG4gICAgICAgICAgICAgICAgLy8gaXRlcmF0ZSBhIHBlcmNlbnRcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwcmN0ID0gLWZhZGVXaWR0aDsgcHJjdCA8IDEgKyBmYWRlV2lkdGg7IHByY3QgKz0gc3RlcCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgcGVyY2VudCB0byBhbmdsZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IHByY3QgKiBNYXRoLlBJO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBjb29yZGluYXRlcyBmb3Igd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeDEgPSBNYXRoLmNvcyhhbmdsZSArIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTEgPSBNYXRoLnNpbihhbmdsZSArIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeDIgPSBNYXRoLmNvcyhhbmdsZSArIGxlbiArIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTIgPSBNYXRoLnNpbihhbmdsZSArIGxlbiArIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLmhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgYWxwaGEgZm9yIHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFscGhhID0gKGFkanVzdGVkUGVyY2VudCAtIHByY3QgKyBmYWRlV2lkdGgpIC8gZmFkZVdpZHRoO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGRyYXcgd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0Lm1vdmVUbyh0aGlzLndpZHRoIC8gMiAtIDIsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgxLCB5MSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh4MiwgeTIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8odGhpcy53aWR0aCAvIDIgKyAyLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsMCwwLCcgKyBhbHBoYSArICcpJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwicmFkaWFsLXRvcFwiOiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50cyA9IDMwMDsgLy8gdGhlIGFtb3VudCBvZiBzZWdtZW50cyB0byBzcGxpdCB0aGUgc2VtaSBjaXJjbGUgaW50bywgRFM6IGFkanVzdCB0aGlzIGZvciBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgICAgIGNvbnN0IGxlbiA9IE1hdGguUEkgLyBzZWdtZW50cztcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwID0gMSAvIHNlZ21lbnRzO1xuXG4gICAgICAgICAgICAgICAgLy8gZXhwYW5kIHBlcmNlbnQgdG8gY292ZXIgZmFkZVdpZHRoXG4gICAgICAgICAgICAgICAgY29uc3QgYWRqdXN0ZWRQZXJjZW50ID0gdGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoO1xuXG4gICAgICAgICAgICAgICAgLy8gaXRlcmF0ZSBhIHBlcmNlbnRcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwZXJjZW50ID0gLWZhZGVXaWR0aDsgcGVyY2VudCA8IDEgKyBmYWRlV2lkdGg7IHBlcmNlbnQgKz0gc3RlcCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgcGVyY2VudCB0byBhbmdsZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IHBlcmNlbnQgKiBNYXRoLlBJO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBjb29yZGluYXRlcyBmb3Igd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeDEgPSBNYXRoLmNvcyhhbmdsZSArIGxlbiArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHkxID0gTWF0aC5zaW4oYW5nbGUgKyBsZW4gKyAyICogTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeDIgPSBNYXRoLmNvcyhhbmdsZSArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHkyID0gTWF0aC5zaW4oYW5nbGUgKyAyICogTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKTtcblxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBhbHBoYSBmb3Igd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxwaGEgPSAoYWRqdXN0ZWRQZXJjZW50IC0gcGVyY2VudCArIGZhZGVXaWR0aCkgLyBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZHJhdyB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubW92ZVRvKHRoaXMud2lkdGggLyAyIC0gMiwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh4MSwgeTEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8oeDIsIHkyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHRoaXMud2lkdGggLyAyICsgMiwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsMCwwLCcgKyBhbHBoYSArICcpJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwicmFkaWFsLW91dFwiOlxuICAgICAgICAgICAgY2FzZSBcInJhZGlhbC1pblwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGVyY2VudCA9IHRoaXMuY3VySW1nLmZhZGVUeXBlID09PSBcInJhZGlhbC1pblwiID8gICgxIC0gdGhpcy5wZXJjZW50KSA6IHRoaXMucGVyY2VudFxuICAgICAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gMTAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZFN0YXRlID0gIDAuMDFcbiAgICAgICAgICAgICAgICBjb25zdCBpbm5lclJhZGl1cyA9IChwZXJjZW50KSAqIHRoaXMuaGVpZ2h0IC0gd2lkdGggPCAwID8gZW5kU3RhdGUgOiAocGVyY2VudCkgKiB0aGlzLmhlaWdodCAtIHdpZHRoO1xuICAgICAgICAgICAgICAgIGNvbnN0IG91dGVyUmFkaXVzID0gcGVyY2VudCAqIHRoaXMuaGVpZ2h0ICsgd2lkdGhcbiAgICAgICAgICAgICAgICAvKmlmICh0aGlzLmN1ckltZy5mYWRlVHlwZSA9PT0gXCJyYWRpYWwtaW5cIil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUudGFibGUoe1wicGVyY2VudFwiOiBwZXJjZW50LFwiaW5uZXJSYWRpdXNcIjogaW5uZXJSYWRpdXMsIFwib3V0ZXJSYWRpdXNcIjogb3V0ZXJSYWRpdXMgfSlcbiAgICAgICAgICAgICAgICB9Ki9cblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyAyLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAvIDIsIGlubmVyUmFkaXVzLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoIC8gMixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgLyAyLCBvdXRlclJhZGl1cyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VySW1nLmZhZGVUeXBlID09PSBcInJhZGlhbC1pblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gdGhpcy5ueHRJbWcubm9SZXNpemUgPyBcInNvdXJjZS1hdG9wXCIgOiBcInNvdXJjZS1pblwiO1xuICAgICAgICB0aGlzLl9kcmF3KHRoaXMubnh0SW1nLCB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dCwgdGhpcy5fYmFja0NvbnRleHQpXG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQucmVzdG9yZSgpO1xuXG5cbiAgICAgICAgaWYgKGVsYXBzZWQgPCB0aGlzLmN1ckltZy5mYWRlRHVyYXRpb24pXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVkcmF3KTtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5tb2RlID09PSBNb2RlLkFVVE8pXG4gICAgICAgICAgICBpZiAodGhpcy5sb29wIHx8IHRoaXMuY3VycmVudElkeCA8IHRoaXMuaW1hZ2VBcnJheS5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICAgIHRoaXMubmV4dEZhZGVUaW1lciA9IHNldFRpbWVvdXQodGhpcy5uZXh0RmFkZSwgdGhpcy5jdXJJbWcuZmFkZURlbGF5KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9kcmF3KGk6IEltYWdlT2JqZWN0LCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgb3RoZXJDdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCl7XG4gICAgICAgIGlmIChpLm5vUmVzaXplKSB7XG4gICAgICAgICAgICBjdHguc2F2ZSgpXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlPVwiYmxhY2tcIlxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsMCx0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KVxuXG4gICAgICAgICAgICBjb25zdCBoID0gaS5kaW1lbnNpb25zLmhlaWdodFxuICAgICAgICAgICAgY29uc3QgdyA9IGkuZGltZW5zaW9ucy53aWR0aFxuXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKFxuICAgICAgICAgICAgICAgIGkuaW1nLFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyAyIC0gdyAvIDIsXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgLzIgLSBoIC8gMixcbiAgICAgICAgICAgICAgICB3LCBoKVxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYXNwZWN0ID4gaS5hc3BlY3QpIHtcblxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpLmltZyxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICh0aGlzLmhlaWdodCAtIHRoaXMud2lkdGggLyBpLmFzcGVjdCkgLyAyLFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIGkuYXNwZWN0KTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpLmltZyxcbiAgICAgICAgICAgICAgICAodGhpcy53aWR0aCAtIHRoaXMuaGVpZ2h0ICogaS5hc3BlY3QpIC8gMixcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICogaS5hc3BlY3QsXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2l6ZSgpIHtcblxuICAgICAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDsgLy8gRFM6IGZpeCBmb3IgaU9TIDkgYnVnXG4gICAgICAgIHRoaXMuYXNwZWN0ID0gdGhpcy53aWR0aCAvIHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0LmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5kcmF3SW1hZ2UoKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBkcmF3SW1hZ2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1ckltZykge1xuICAgICAgICAgICAgdGhpcy5fZHJhdyh0aGlzLmN1ckltZywgdGhpcy5fYmFja0NvbnRleHQsIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJubyBpbWFnZSBcIiArIHRoaXMuY3VycmVudElkeCArIFwiIFwiICsgdGhpcy5pbWFnZUFycmF5Lmxlbmd0aClcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudElkeCA9IC0xXG4gICAgICAgIHRoaXMubmV4dEZhZGUoKTtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLm5leHRGYWRlVGltZXIgJiYgY2xlYXJUaW1lb3V0KHRoaXMubmV4dEZhZGVUaW1lcilcbiAgICB9XG5cbiAgICBuZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5tb2RlICE9PSBNb2RlLk1VTFRJX1NFQ1RJT04pXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIlRoaXMgc3d3aXBlIG9wZXJhdGVzIGluIEFVVE8gbW9kZVwiKVxuICAgICAgICB0aGlzLm5leHRGYWRlKClcbiAgICB9XG5cblxuICAgIGdldCBudW1iZXJPZkZhZGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZUFycmF5Lmxlbmd0aFxuICAgIH1cbn1cblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuYmFubmVyXCIpLmZvckVhY2goYiA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlOiBNb2RlID0gYi5oYXNBdHRyaWJ1dGUoXCJkYXRhLW11bHRpLXN3aXBlXCIpID8gTW9kZS5NVUxUSV9TRUNUSU9OIDogTW9kZS5BVVRPXG4gICAgICAgICAgICBjb25zdCBub0xvb3A6IGJvb2xlYW4gPSBiLmhhc0F0dHJpYnV0ZShcImRhdGEtbm8tbG9vcFwiKVxuICAgICAgICAgICAgY29uc3Qgb3duZXIgPSBiLmNsb3Nlc3QoXCJzZWN0aW9uXCIpXG4gICAgICAgICAgICBpZiAoIW93bmVyKSB0aHJvdyBFcnJvcihcImJhbm5lciBlbGVtZW50IG5vdCBwYXJ0IG9mIGEgc2VjdGlvblwiKVxuICAgICAgICAgICAgY29uc3Qgd2lwZSA9IG5ldyBTV1dpcGUoYiwgb3duZXIsIG1vZGUsICFub0xvb3ApO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgYi5zc3dpcGUgPSB3aXBlO1xuICAgICAgICB9KVxuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKFwic2xpZGVjaGFuZ2VkXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcmV2QmFubmVyID0gZS5wcmV2aW91c1NsaWRlPy5xdWVyeVNlbGVjdG9yKFwiLmJhbm5lclwiKTtcbiAgICAgICAgICAgIGlmIChwcmV2QmFubmVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2lwZSA9IHByZXZCYW5uZXIuc3N3aXBlIGFzIFNXV2lwZTtcbiAgICAgICAgICAgICAgICBpZiAod2lwZS5tb2RlID09PSBNb2RlLkFVVE8pXG4gICAgICAgICAgICAgICAgICAgIHdpcGUuc3RvcCgpO1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvd25lckluZGV4OiB7IGg6IG51bWJlcjsgdjogbnVtYmVyOyB9ID0gUmV2ZWFsLmdldEluZGljZXMod2lwZS5vd25lcilcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEluZGV4OiB7IGg6IG51bWJlcjsgdjogbnVtYmVyOyB9ID0gUmV2ZWFsLmdldEluZGljZXMoZS5jdXJyZW50U2xpZGUpXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gZS5jdXJyZW50U2xpZGUuaW5kZXhWID9cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleC52IC0gKG93bmVySW5kZXgudiB8fCAwKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXguaCAtIG93bmVySW5kZXguaFxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkaXN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA+IDAgJiYgZGlzdGFuY2UgPCB3aXBlLm51bWJlck9mRmFkZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY3VycmVudFNsaWRlLmFwcGVuZENoaWxkKHdpcGUuYmFubmVyKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lwZS5zdG9wKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpcGUub3duZXIuYXBwZW5kQ2hpbGQod2lwZS5iYW5uZXIpXG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV4dEJhbm5lciA9IGUuY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3IoXCIuYmFubmVyXCIpO1xuICAgICAgICAgICAgaWYgKG5leHRCYW5uZXIpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3N3aXBlID0gbmV4dEJhbm5lci5zc3dpcGUgYXMgU1dXaXBlO1xuICAgICAgICAgICAgICAgIGlmIChzc3dpcGUubW9kZSA9PT0gTW9kZS5BVVRPIHx8IHNzd2lwZS5vd25lciA9PT0gZS5jdXJyZW50U2xpZGUpXG4gICAgICAgICAgICAgICAgICAgIHNzd2lwZS5zdGFydCgpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgc3N3aXBlLm5leHQoKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0pXG5cblxufSkoKVxuXG4vLyBgY2xvc2VzdGAgUG9seWZpbGwgZm9yIElFXG5cbmlmICghRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzID0gRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yO1xufVxuXG5pZiAoIUVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIGxldCBlbCA9IHRoaXM7XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgaWYgKEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMuY2FsbChlbCwgcykpIHJldHVybiBlbDtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudCB8fCBlbC5wYXJlbnROb2RlO1xuICAgICAgICB9IHdoaWxlIChlbCAhPT0gbnVsbCAmJiBlbC5ub2RlVHlwZSA9PT0gMSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG59XG5cbiJdfQ==