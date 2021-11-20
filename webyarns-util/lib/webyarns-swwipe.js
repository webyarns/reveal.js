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

var SWWipe = /*#__PURE__*/function () {
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

      _this._foregroundContext.globalCompositeOperation = _this.nxtImg.contain ? "source-atop" : "source-in";

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
      var contain = img.hasAttribute("data-contain");
      var scale = img.hasAttribute("data-scale") ? Number(img.getAttribute("data-scale")) : 1;
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
        contain: contain,
        scale: scale,
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
    this._backContext.imageSmoothingEnabled = false;
    this._foregroundContext.imageSmoothingEnabled = false;
    window.addEventListener('resize', this.resize);
  }

  _createClass(SWWipe, [{
    key: "curImg",
    get: // width of container (banner)
    // height of container
    // aspect ratio of container
    function get() {
      return this.imageArray[this.currentIdx];
    }
  }, {
    key: "nxtImg",
    get: function get() {
      return this.imageArray[(this.currentIdx + 1) % this.imageArray.length];
    }
  }, {
    key: "_draw",
    value: function _draw(i, ctx, otherCtx) {
      if (i.contain) {
        var canvasWidthMiddle = ctx.canvas.width / 2;
        var canvasHeightMiddle = ctx.canvas.height / 2;
        var g = ctx.createRadialGradient(canvasWidthMiddle, canvasHeightMiddle, 0, canvasWidthMiddle, canvasHeightMiddle, Math.max(canvasWidthMiddle, canvasHeightMiddle));
        g.addColorStop(0, "#5cb8f8");
        g.addColorStop(1, "#464848");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, this.width, this.height);

        var _contain = contain(this.width, this.height, i.img.width, i.img.height, i.scale),
            offsetX = _contain.offsetX,
            offsetY = _contain.offsetY,
            width = _contain.width,
            height = _contain.height;

        ctx.drawImage(i.img, offsetX, offsetY, width, height);
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

var SWWipeStatic = /*#__PURE__*/function () {
  // width of container (banner)
  // height of container
  function SWWipeStatic(banner, owner) {
    var _this2 = this;

    _classCallCheck(this, SWWipeStatic);

    this.banner = banner;
    this.owner = owner;

    _defineProperty(this, "img", void 0);

    _defineProperty(this, "width", window.innerWidth);

    _defineProperty(this, "height", window.innerHeight);

    _defineProperty(this, "scale", void 0);

    _defineProperty(this, "_canvas", document.createElement('canvas'));

    _defineProperty(this, "_context", void 0);

    var images = Array.from(this.banner.querySelectorAll("img"));

    if (images.length !== 1) {
      throw Error("Was expecting a single img for static-banner");
    }

    this.img = images[0];
    this.banner.appendChild(this._canvas);

    var context = this._canvas.getContext("2d");

    if (context === null) throw Error("2d context not supported");
    this._context = context;
    this._context.imageSmoothingEnabled = false;
    this._context.globalCompositeOperation = "source-over";
    this.img.addEventListener("load", function () {
      return _this2.draw();
    });
    this.scale = this.img.hasAttribute("data-scale") ? Number(this.img.getAttribute("data-scale")) : 1;
    this.draw(); // window.addEventListener('resize', this.resize);
  }

  _createClass(SWWipeStatic, [{
    key: "start",
    value: function start() {
      this.resize();
    }
  }, {
    key: "draw",
    value: function draw() {
      var canvasWidthMiddle = this._context.canvas.width / 2;
      var canvasHeightMiddle = this._context.canvas.height / 2;

      var g = this._context.createRadialGradient(canvasWidthMiddle, canvasHeightMiddle, 0, canvasWidthMiddle, canvasHeightMiddle, Math.max(canvasWidthMiddle, canvasHeightMiddle));

      g.addColorStop(0, "#5cb8f8");
      g.addColorStop(1, "#464848");

      this._context.save();

      this._context.fillStyle = g;

      this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);

      var _contain2 = contain(this.width, this.height, this.img.width, this.img.height, this.scale),
          offsetX = _contain2.offsetX,
          offsetY = _contain2.offsetY,
          width = _contain2.width,
          height = _contain2.height;

      this._context.drawImage(this.img, offsetX, offsetY, width, height);
    }
  }, {
    key: "resize",
    value: function resize() {
      this.width = window.innerWidth;
      this.height = document.documentElement.clientHeight; // DS: fix for iOS 9 bug

      this._context.canvas.width = this.width;
      this._context.canvas.height = this.height;
      this.draw();
    }
  }]);

  return SWWipeStatic;
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
    document.querySelectorAll(".static-banner").forEach(function (b) {
      var owner = b.closest("section");
      if (!owner) throw Error("banner element not part of a section");
      var staticWipe = new SWWipeStatic(b, owner);
      staticWipe.start();
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

var contain = function contain(canvasWidth, canvasHEight, imgWidth, imgHeight) {
  var scale = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var offsetX = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.5;
  var offsetY = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0.5;
  var childRatio = imgWidth / imgHeight;
  var parentRatio = canvasWidth / canvasHEight;
  var width = canvasWidth * scale;
  var height = canvasHEight * scale;

  if (childRatio > parentRatio) {
    height = width / childRatio;
  } else {
    width = height * childRatio;
  }

  return {
    width: width,
    height: height,
    offsetX: (canvasWidth - width) * offsetX,
    offsetY: (canvasHEight - height) * offsetY
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy1zd3dpcGUudHMiXSwibmFtZXMiOlsiTW9kZSIsIlNXV2lwZSIsImJhbm5lciIsIm93bmVyIiwibW9kZSIsIkFVVE8iLCJsb29wIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImlubmVySGVpZ2h0Iiwid2lkdGgiLCJoZWlnaHQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJEYXRlIiwiY3VycmVudElkeCIsImltYWdlQXJyYXkiLCJsZW5ndGgiLCJkcmF3SW1hZ2UiLCJfZm9yZWdyb3VuZENvbnRleHQiLCJjbGVhclJlY3QiLCJwZXJjZW50IiwiY3VySW1nIiwiZmFkZVdpZHRoIiwic3RhcnRUaW1lIiwicmVkcmF3IiwiY3VycmVudFRpbWUiLCJlbGFwc2VkIiwiZ2V0VGltZSIsInN0YXJ0UGVyY2VudGFnZSIsImZhZGVEdXJhdGlvbiIsInNhdmUiLCJmYWRlVHlwZSIsImdyYWRpZW50IiwiY3JlYXRlTGluZWFyR3JhZGllbnQiLCJhZGRDb2xvclN0b3AiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsInNlZ21lbnRzIiwibGVuIiwiTWF0aCIsIlBJIiwic3RlcCIsImFkanVzdGVkUGVyY2VudCIsInByY3QiLCJhbmdsZSIsIngxIiwiY29zIiwieTEiLCJzaW4iLCJ4MiIsInkyIiwiYWxwaGEiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJmaWxsIiwiZW5kU3RhdGUiLCJpbm5lclJhZGl1cyIsIm91dGVyUmFkaXVzIiwiY3JlYXRlUmFkaWFsR3JhZGllbnQiLCJnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24iLCJueHRJbWciLCJjb250YWluIiwiX2RyYXciLCJfYmFja0NvbnRleHQiLCJyZXN0b3JlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibmV4dEZhZGVUaW1lciIsInNldFRpbWVvdXQiLCJuZXh0RmFkZSIsImZhZGVEZWxheSIsImltYWdlcyIsIkFycmF5IiwiZnJvbSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJtYXAiLCJpbWciLCJhc3BlY3QiLCJoYXNBdHRyaWJ1dGUiLCJOdW1iZXIiLCJnZXRBdHRyaWJ1dGUiLCJzY2FsZSIsImRpbWVuc2lvbnMiLCJhcHBlbmRDaGlsZCIsIl9iYWNrQ2FudmFzIiwiX2ZvcmVDYW52YXMiLCJiYWNrQ29udGV4dCIsImdldENvbnRleHQiLCJmb3JlQ29udGV4dCIsIkVycm9yIiwiaW1hZ2VTbW9vdGhpbmdFbmFibGVkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlc2l6ZSIsImkiLCJjdHgiLCJvdGhlckN0eCIsImNhbnZhc1dpZHRoTWlkZGxlIiwiY2FudmFzIiwiY2FudmFzSGVpZ2h0TWlkZGxlIiwiZyIsIm1heCIsIm9mZnNldFgiLCJvZmZzZXRZIiwiZG9jdW1lbnRFbGVtZW50IiwiY2xpZW50SGVpZ2h0IiwiY2xlYXJUaW1lb3V0IiwiTVVMVElfU0VDVElPTiIsIlNXV2lwZVN0YXRpYyIsIl9jYW52YXMiLCJjb250ZXh0IiwiX2NvbnRleHQiLCJkcmF3IiwiZm9yRWFjaCIsImIiLCJub0xvb3AiLCJjbG9zZXN0Iiwid2lwZSIsInNzd2lwZSIsIlJldmVhbCIsImUiLCJwcmV2QmFubmVyIiwicHJldmlvdXNTbGlkZSIsInF1ZXJ5U2VsZWN0b3IiLCJzdG9wIiwib3duZXJJbmRleCIsImdldEluZGljZXMiLCJjdXJyZW50SW5kZXgiLCJjdXJyZW50U2xpZGUiLCJkaXN0YW5jZSIsImluZGV4ViIsInYiLCJoIiwiY29uc29sZSIsImxvZyIsIm51bWJlck9mRmFkZXMiLCJuZXh0QmFubmVyIiwic3RhcnQiLCJuZXh0Iiwic3RhdGljV2lwZSIsIkVsZW1lbnQiLCJwcm90b3R5cGUiLCJtYXRjaGVzIiwibXNNYXRjaGVzU2VsZWN0b3IiLCJ3ZWJraXRNYXRjaGVzU2VsZWN0b3IiLCJzIiwiZWwiLCJjYWxsIiwicGFyZW50RWxlbWVudCIsInBhcmVudE5vZGUiLCJub2RlVHlwZSIsImNhbnZhc1dpZHRoIiwiY2FudmFzSEVpZ2h0IiwiaW1nV2lkdGgiLCJpbWdIZWlnaHQiLCJjaGlsZFJhdGlvIiwicGFyZW50UmF0aW8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFFS0EsSTs7V0FBQUEsSTtBQUFBQSxFQUFBQSxJLENBQUFBLEk7QUFBQUEsRUFBQUEsSSxDQUFBQSxJO0dBQUFBLEksS0FBQUEsSTs7SUFpQkNDLE07QUEwQkYsa0JBQXFCQyxNQUFyQixFQUFtREMsS0FBbkQsRUFBOEg7QUFBQTs7QUFBQSxRQUE5Q0MsSUFBOEMsdUVBQWpDSixJQUFJLENBQUNLLElBQTRCO0FBQUEsUUFBYkMsSUFBYSx1RUFBTixJQUFNOztBQUFBOztBQUFBLFNBQXpHSixNQUF5RyxHQUF6R0EsTUFBeUc7QUFBQSxTQUEzRUMsS0FBMkUsR0FBM0VBLEtBQTJFO0FBQUEsU0FBOUNDLElBQThDLEdBQTlDQSxJQUE4QztBQUFBLFNBQWJFLElBQWEsR0FBYkEsSUFBYTs7QUFBQSx3Q0F4QmpILENBQUMsQ0F3QmdIOztBQUFBLG1DQXZCOUdDLE1BQU0sQ0FBQ0MsVUF1QnVHOztBQUFBLG9DQXRCN0dELE1BQU0sQ0FBQ0UsV0FzQnNHOztBQUFBLG9DQXJCN0csS0FBS0MsS0FBTCxHQUFhLEtBQUtDLE1BcUIyRjs7QUFBQTs7QUFBQSx5Q0FsQjVFQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FrQjRFOztBQUFBLHlDQWpCNUVELFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixRQUF2QixDQWlCNEU7O0FBQUE7O0FBQUE7O0FBQUEscUNBYnBHLENBYW9HOztBQUFBLHVDQVpwRyxJQUFJQyxJQUFKLEVBWW9HOztBQUFBLDJDQVgvRSxJQVcrRTs7QUFBQSxzQ0EwQzNHLFlBQU07QUFDckI7QUFDQSxNQUFBLEtBQUksQ0FBQ0MsVUFBTCxHQUFrQixFQUFFLEtBQUksQ0FBQ0EsVUFBUCxHQUFvQixLQUFJLENBQUNDLFVBQUwsQ0FBZ0JDLE1BQXREOztBQUNBLE1BQUEsS0FBSSxDQUFDQyxTQUFMLEdBSHFCLENBS3JCOzs7QUFDQSxNQUFBLEtBQUksQ0FBQ0Msa0JBQUwsQ0FBd0JDLFNBQXhCLENBQWtDLENBQWxDLEVBQXFDLENBQXJDLEVBQXdDLEtBQUksQ0FBQ1YsS0FBN0MsRUFBb0QsS0FBSSxDQUFDQyxNQUF6RCxFQU5xQixDQVFyQjs7O0FBQ0EsTUFBQSxLQUFJLENBQUNVLE9BQUwsR0FBZSxDQUFDLEtBQUksQ0FBQ0MsTUFBTCxDQUFZQyxTQUE1QjtBQUNBLE1BQUEsS0FBSSxDQUFDQyxTQUFMLEdBQWlCLElBQUlWLElBQUosRUFBakI7O0FBQ0EsTUFBQSxLQUFJLENBQUNXLE1BQUw7QUFDSCxLQXRENkg7O0FBQUEsb0NBd0Q3RyxZQUFNO0FBQ25CO0FBQ0EsVUFBTUMsV0FBVyxHQUFHLElBQUlaLElBQUosRUFBcEI7O0FBQ0EsVUFBTWEsT0FBTyxHQUFHRCxXQUFXLENBQUNFLE9BQVosS0FBd0IsS0FBSSxDQUFDSixTQUFMLENBQWVJLE9BQWYsRUFBeEM7O0FBQ0EsTUFBQSxLQUFJLENBQUNQLE9BQUwsR0FBZSxLQUFJLENBQUNDLE1BQUwsQ0FBWU8sZUFBWixHQUE4QkYsT0FBTyxHQUFHLEtBQUksQ0FBQ0wsTUFBTCxDQUFZUSxZQUFuRTs7QUFHQSxNQUFBLEtBQUksQ0FBQ1gsa0JBQUwsQ0FBd0JZLElBQXhCOztBQUNBLE1BQUEsS0FBSSxDQUFDWixrQkFBTCxDQUF3QkMsU0FBeEIsQ0FBa0MsQ0FBbEMsRUFBcUMsQ0FBckMsRUFBd0MsS0FBSSxDQUFDVixLQUE3QyxFQUFvRCxLQUFJLENBQUNDLE1BQXpEOztBQUNBLFVBQU1ZLFNBQVMsR0FBRyxLQUFJLENBQUNELE1BQUwsQ0FBWUMsU0FBOUI7O0FBRUEsY0FBUSxLQUFJLENBQUNELE1BQUwsQ0FBWVUsUUFBcEI7QUFFSSxhQUFLLFVBQUw7QUFBaUI7QUFDYixnQkFBTUMsUUFBUSxHQUFHLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JlLG9CQUF4QixDQUNiLENBQUMsS0FBSSxDQUFDYixPQUFMLElBQWdCLElBQUlFLFNBQXBCLElBQWlDQSxTQUFsQyxJQUErQyxLQUFJLENBQUNiLEtBRHZDLEVBQzhDLENBRDlDLEVBRWIsQ0FBQyxLQUFJLENBQUNXLE9BQUwsSUFBZ0IsSUFBSUUsU0FBcEIsSUFBaUNBLFNBQWxDLElBQStDLEtBQUksQ0FBQ2IsS0FGdkMsRUFFOEMsQ0FGOUMsQ0FBakI7O0FBR0F1QixZQUFBQSxRQUFRLENBQUNFLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkIsZUFBM0I7QUFDQUYsWUFBQUEsUUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCO0FBQ0EsWUFBQSxLQUFJLENBQUNoQixrQkFBTCxDQUF3QmlCLFNBQXhCLEdBQW9DSCxRQUFwQzs7QUFDQSxZQUFBLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JrQixRQUF4QixDQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1QyxLQUFJLENBQUMzQixLQUE1QyxFQUFtRCxLQUFJLENBQUNDLE1BQXhEOztBQUNBO0FBQ0g7O0FBRUQsYUFBSyxVQUFMO0FBQWlCO0FBQ2IsZ0JBQU1zQixTQUFRLEdBQUcsS0FBSSxDQUFDZCxrQkFBTCxDQUF3QmUsb0JBQXhCLENBQ2IsQ0FBQyxDQUFDLElBQUksS0FBSSxDQUFDYixPQUFWLEtBQXNCLElBQUlFLFNBQTFCLElBQXVDQSxTQUF4QyxJQUFxRCxLQUFJLENBQUNiLEtBRDdDLEVBQ29ELENBRHBELEVBRWIsQ0FBQyxDQUFDLElBQUksS0FBSSxDQUFDVyxPQUFWLEtBQXNCLElBQUlFLFNBQTFCLElBQXVDQSxTQUF4QyxJQUFxRCxLQUFJLENBQUNiLEtBRjdDLEVBRW9ELENBRnBELENBQWpCOztBQUdBdUIsWUFBQUEsU0FBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBRixZQUFBQSxTQUFRLENBQUNFLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkIsZUFBM0I7O0FBQ0EsWUFBQSxLQUFJLENBQUNoQixrQkFBTCxDQUF3QmlCLFNBQXhCLEdBQW9DSCxTQUFwQzs7QUFDQSxZQUFBLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JrQixRQUF4QixDQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1QyxLQUFJLENBQUMzQixLQUE1QyxFQUFtRCxLQUFJLENBQUNDLE1BQXhEOztBQUNBO0FBQ0g7O0FBRUQsYUFBSyxVQUFMO0FBQWlCO0FBQ2IsZ0JBQU1zQixVQUFRLEdBQUcsS0FBSSxDQUFDZCxrQkFBTCxDQUF3QmUsb0JBQXhCLENBQ2IsQ0FEYSxFQUNWLENBQUMsS0FBSSxDQUFDYixPQUFMLElBQWdCLElBQUlFLFNBQXBCLElBQWlDQSxTQUFsQyxJQUErQyxLQUFJLENBQUNiLEtBRDFDLEVBRWIsQ0FGYSxFQUVWLENBQUMsS0FBSSxDQUFDVyxPQUFMLElBQWdCLElBQUlFLFNBQXBCLElBQWlDQSxTQUFsQyxJQUErQyxLQUFJLENBQUNiLEtBRjFDLENBQWpCOztBQUdBdUIsWUFBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBRixZQUFBQSxVQUFRLENBQUNFLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkIsZUFBM0I7O0FBQ0EsWUFBQSxLQUFJLENBQUNoQixrQkFBTCxDQUF3QmlCLFNBQXhCLEdBQW9DSCxVQUFwQzs7QUFDQSxZQUFBLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JrQixRQUF4QixDQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1QyxLQUFJLENBQUMzQixLQUE1QyxFQUFtRCxLQUFJLENBQUNDLE1BQXhEOztBQUNBO0FBQ0g7O0FBRUQsYUFBSyxVQUFMO0FBQWlCO0FBQ2IsZ0JBQU1zQixVQUFRLEdBQUcsS0FBSSxDQUFDZCxrQkFBTCxDQUF3QmUsb0JBQXhCLENBQ2IsQ0FEYSxFQUNWLENBQUMsQ0FBQyxJQUFJLEtBQUksQ0FBQ2IsT0FBVixLQUFzQixJQUFJRSxTQUExQixJQUF1Q0EsU0FBeEMsSUFBcUQsS0FBSSxDQUFDYixLQURoRCxFQUViLENBRmEsRUFFVixDQUFDLENBQUMsSUFBSSxLQUFJLENBQUNXLE9BQVYsS0FBc0IsSUFBSUUsU0FBMUIsSUFBdUNBLFNBQXhDLElBQXFELEtBQUksQ0FBQ2IsS0FGaEQsQ0FBakI7O0FBR0F1QixZQUFBQSxVQUFRLENBQUNFLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkIsZUFBM0I7O0FBQ0FGLFlBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQSxZQUFBLEtBQUksQ0FBQ2hCLGtCQUFMLENBQXdCaUIsU0FBeEIsR0FBb0NILFVBQXBDOztBQUNBLFlBQUEsS0FBSSxDQUFDZCxrQkFBTCxDQUF3QmtCLFFBQXhCLENBQWlDLENBQWpDLEVBQW9DLENBQXBDLEVBQXVDLEtBQUksQ0FBQzNCLEtBQTVDLEVBQW1ELEtBQUksQ0FBQ0MsTUFBeEQ7O0FBQ0E7QUFDSDs7QUFFRCxhQUFLLGdCQUFMO0FBQXVCO0FBQUM7QUFFcEIsZ0JBQU1zQixVQUFRLEdBQUcsS0FBSSxDQUFDZCxrQkFBTCxDQUF3QmUsb0JBQXhCLENBQ2IsQ0FBQyxLQUFJLENBQUNiLE9BQUwsSUFBZ0IsSUFBSUUsU0FBcEIsSUFBaUNBLFNBQWxDLElBQStDLEtBQUksQ0FBQ2IsS0FEdkMsRUFDOEMsQ0FEOUMsRUFFYixDQUFDLEtBQUksQ0FBQ1csT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBbEMsSUFBK0MsS0FBSSxDQUFDYixLQUZ2QyxFQUU4Q2EsU0FBUyxJQUFJLEtBQUksQ0FBQ2IsS0FBTCxJQUFjLEtBQUksQ0FBQ0MsTUFBTCxHQUFjLENBQTVCLENBQUosQ0FBVCxHQUErQyxLQUFJLENBQUNELEtBRmxHLENBQWpCOztBQUdBdUIsWUFBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBRixZQUFBQSxVQUFRLENBQUNFLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkIsZUFBM0I7O0FBQ0EsWUFBQSxLQUFJLENBQUNoQixrQkFBTCxDQUF3QmlCLFNBQXhCLEdBQW9DSCxVQUFwQzs7QUFDQSxZQUFBLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JrQixRQUF4QixDQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1QyxLQUFJLENBQUMzQixLQUE1QyxFQUFtRCxLQUFJLENBQUNDLE1BQXhEOztBQUVBO0FBQ0g7O0FBRUQsYUFBSyxnQkFBTDtBQUF1QjtBQUNuQixnQkFBTXNCLFVBQVEsR0FBRyxLQUFJLENBQUNkLGtCQUFMLENBQXdCZSxvQkFBeEIsQ0FDYixDQUFDLEtBQUksQ0FBQ2IsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBbEMsSUFBK0MsS0FBSSxDQUFDYixLQUR2QyxFQUM4QyxDQUQ5QyxFQUViLENBQUMsS0FBSSxDQUFDVyxPQUFMLElBQWdCLElBQUlFLFNBQXBCLElBQWlDQSxTQUFsQyxJQUErQyxLQUFJLENBQUNiLEtBQXBELEdBQTRELEtBQUksQ0FBQ0EsS0FGcEQsRUFFMkQsS0FBSSxDQUFDQyxNQUZoRSxDQUFqQjs7QUFHQXNCLFlBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsWUFBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBLFlBQUEsS0FBSSxDQUFDaEIsa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQ0gsVUFBcEM7O0FBQ0EsWUFBQSxLQUFJLENBQUNkLGtCQUFMLENBQXdCa0IsUUFBeEIsQ0FBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBSSxDQUFDM0IsS0FBNUMsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFFQTtBQUNIOztBQUVELGFBQUssWUFBTDtBQUFtQjtBQUVmLGdCQUFNMkIsUUFBUSxHQUFHLEdBQWpCLENBRmUsQ0FFTzs7QUFDdEIsZ0JBQU1DLEdBQUcsR0FBR0MsSUFBSSxDQUFDQyxFQUFMLEdBQVVILFFBQXRCO0FBQ0EsZ0JBQU1JLElBQUksR0FBRyxJQUFJSixRQUFqQixDQUplLENBTWY7O0FBQ0EsZ0JBQU1LLGVBQWUsR0FBRyxLQUFJLENBQUN0QixPQUFMLElBQWdCLElBQUlFLFNBQXBCLElBQWlDQSxTQUF6RCxDQVBlLENBU2Y7O0FBQ0EsaUJBQUssSUFBSXFCLElBQUksR0FBRyxDQUFDckIsU0FBakIsRUFBNEJxQixJQUFJLEdBQUcsSUFBSXJCLFNBQXZDLEVBQWtEcUIsSUFBSSxJQUFJRixJQUExRCxFQUFnRTtBQUU1RDtBQUNBLGtCQUFNRyxLQUFLLEdBQUdELElBQUksR0FBR0osSUFBSSxDQUFDQyxFQUExQixDQUg0RCxDQUs1RDs7QUFDQSxrQkFBTUssRUFBRSxHQUFHTixJQUFJLENBQUNPLEdBQUwsQ0FBU0YsS0FBSyxHQUFHTCxJQUFJLENBQUNDLEVBQXRCLEtBQTZCLEtBQUksQ0FBQzlCLE1BQUwsR0FBYyxDQUEzQyxJQUFnRCxLQUFJLENBQUNELEtBQUwsR0FBYSxDQUF4RTs7QUFDQSxrQkFBTXNDLEVBQUUsR0FBR1IsSUFBSSxDQUFDUyxHQUFMLENBQVNKLEtBQUssR0FBR0wsSUFBSSxDQUFDQyxFQUF0QixLQUE2QixLQUFJLENBQUM5QixNQUFMLEdBQWMsQ0FBM0MsSUFBZ0QsS0FBSSxDQUFDQSxNQUFoRTs7QUFDQSxrQkFBTXVDLEVBQUUsR0FBR1YsSUFBSSxDQUFDTyxHQUFMLENBQVNGLEtBQUssR0FBR04sR0FBUixHQUFjQyxJQUFJLENBQUNDLEVBQTVCLEtBQW1DLEtBQUksQ0FBQzlCLE1BQUwsR0FBYyxDQUFqRCxJQUFzRCxLQUFJLENBQUNELEtBQUwsR0FBYSxDQUE5RTs7QUFDQSxrQkFBTXlDLEVBQUUsR0FBR1gsSUFBSSxDQUFDUyxHQUFMLENBQVNKLEtBQUssR0FBR04sR0FBUixHQUFjQyxJQUFJLENBQUNDLEVBQTVCLEtBQW1DLEtBQUksQ0FBQzlCLE1BQUwsR0FBYyxDQUFqRCxJQUFzRCxLQUFJLENBQUNBLE1BQXRFLENBVDRELENBVzVEOzs7QUFDQSxrQkFBTXlDLEtBQUssR0FBRyxDQUFDVCxlQUFlLEdBQUdDLElBQWxCLEdBQXlCckIsU0FBMUIsSUFBdUNBLFNBQXJELENBWjRELENBYzVEOztBQUNBLGNBQUEsS0FBSSxDQUFDSixrQkFBTCxDQUF3QmtDLFNBQXhCOztBQUNBLGNBQUEsS0FBSSxDQUFDbEMsa0JBQUwsQ0FBd0JtQyxNQUF4QixDQUErQixLQUFJLENBQUM1QyxLQUFMLEdBQWEsQ0FBYixHQUFpQixDQUFoRCxFQUFtRCxLQUFJLENBQUNDLE1BQXhEOztBQUNBLGNBQUEsS0FBSSxDQUFDUSxrQkFBTCxDQUF3Qm9DLE1BQXhCLENBQStCVCxFQUEvQixFQUFtQ0UsRUFBbkM7O0FBQ0EsY0FBQSxLQUFJLENBQUM3QixrQkFBTCxDQUF3Qm9DLE1BQXhCLENBQStCTCxFQUEvQixFQUFtQ0MsRUFBbkM7O0FBQ0EsY0FBQSxLQUFJLENBQUNoQyxrQkFBTCxDQUF3Qm9DLE1BQXhCLENBQStCLEtBQUksQ0FBQzdDLEtBQUwsR0FBYSxDQUFiLEdBQWlCLENBQWhELEVBQW1ELEtBQUksQ0FBQ0MsTUFBeEQ7O0FBQ0EsY0FBQSxLQUFJLENBQUNRLGtCQUFMLENBQXdCaUIsU0FBeEIsR0FBb0MsZ0JBQWdCZ0IsS0FBaEIsR0FBd0IsR0FBNUQ7O0FBQ0EsY0FBQSxLQUFJLENBQUNqQyxrQkFBTCxDQUF3QnFDLElBQXhCO0FBQ0g7O0FBRUQ7QUFDSDs7QUFFRCxhQUFLLFlBQUw7QUFBbUI7QUFFZixnQkFBTWxCLFNBQVEsR0FBRyxHQUFqQixDQUZlLENBRU87O0FBQ3RCLGdCQUFNQyxJQUFHLEdBQUdDLElBQUksQ0FBQ0MsRUFBTCxHQUFVSCxTQUF0Qjs7QUFDQSxnQkFBTUksS0FBSSxHQUFHLElBQUlKLFNBQWpCLENBSmUsQ0FNZjs7O0FBQ0EsZ0JBQU1LLGdCQUFlLEdBQUcsS0FBSSxDQUFDdEIsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBekQsQ0FQZSxDQVNmOzs7QUFDQSxpQkFBSyxJQUFJRixPQUFPLEdBQUcsQ0FBQ0UsU0FBcEIsRUFBK0JGLE9BQU8sR0FBRyxJQUFJRSxTQUE3QyxFQUF3REYsT0FBTyxJQUFJcUIsS0FBbkUsRUFBeUU7QUFFckU7QUFDQSxrQkFBTUcsTUFBSyxHQUFHeEIsT0FBTyxHQUFHbUIsSUFBSSxDQUFDQyxFQUE3QixDQUhxRSxDQUtyRTs7O0FBQ0Esa0JBQU1LLEVBQUUsR0FBR04sSUFBSSxDQUFDTyxHQUFMLENBQVNGLE1BQUssR0FBR04sSUFBUixHQUFjLElBQUlDLElBQUksQ0FBQ0MsRUFBaEMsS0FBdUMsS0FBSSxDQUFDOUIsTUFBTCxHQUFjLENBQXJELElBQTBELEtBQUksQ0FBQ0QsS0FBTCxHQUFhLENBQWxGOztBQUNBLGtCQUFNc0MsRUFBRSxHQUFHUixJQUFJLENBQUNTLEdBQUwsQ0FBU0osTUFBSyxHQUFHTixJQUFSLEdBQWMsSUFBSUMsSUFBSSxDQUFDQyxFQUFoQyxLQUF1QyxLQUFJLENBQUM5QixNQUFMLEdBQWMsQ0FBckQsQ0FBWDs7QUFDQSxrQkFBTXVDLEdBQUUsR0FBR1YsSUFBSSxDQUFDTyxHQUFMLENBQVNGLE1BQUssR0FBRyxJQUFJTCxJQUFJLENBQUNDLEVBQTFCLEtBQWlDLEtBQUksQ0FBQzlCLE1BQUwsR0FBYyxDQUEvQyxJQUFvRCxLQUFJLENBQUNELEtBQUwsR0FBYSxDQUE1RTs7QUFDQSxrQkFBTXlDLEdBQUUsR0FBR1gsSUFBSSxDQUFDUyxHQUFMLENBQVNKLE1BQUssR0FBRyxJQUFJTCxJQUFJLENBQUNDLEVBQTFCLEtBQWlDLEtBQUksQ0FBQzlCLE1BQUwsR0FBYyxDQUEvQyxDQUFYLENBVHFFLENBWXJFOzs7QUFDQSxrQkFBTXlDLE1BQUssR0FBRyxDQUFDVCxnQkFBZSxHQUFHdEIsT0FBbEIsR0FBNEJFLFNBQTdCLElBQTBDQSxTQUF4RCxDQWJxRSxDQWVyRTs7O0FBQ0EsY0FBQSxLQUFJLENBQUNKLGtCQUFMLENBQXdCa0MsU0FBeEI7O0FBQ0EsY0FBQSxLQUFJLENBQUNsQyxrQkFBTCxDQUF3Qm1DLE1BQXhCLENBQStCLEtBQUksQ0FBQzVDLEtBQUwsR0FBYSxDQUFiLEdBQWlCLENBQWhELEVBQW1ELENBQW5EOztBQUNBLGNBQUEsS0FBSSxDQUFDUyxrQkFBTCxDQUF3Qm9DLE1BQXhCLENBQStCVCxFQUEvQixFQUFtQ0UsRUFBbkM7O0FBQ0EsY0FBQSxLQUFJLENBQUM3QixrQkFBTCxDQUF3Qm9DLE1BQXhCLENBQStCTCxHQUEvQixFQUFtQ0MsR0FBbkM7O0FBQ0EsY0FBQSxLQUFJLENBQUNoQyxrQkFBTCxDQUF3Qm9DLE1BQXhCLENBQStCLEtBQUksQ0FBQzdDLEtBQUwsR0FBYSxDQUFiLEdBQWlCLENBQWhELEVBQW1ELENBQW5EOztBQUNBLGNBQUEsS0FBSSxDQUFDUyxrQkFBTCxDQUF3QmlCLFNBQXhCLEdBQW9DLGdCQUFnQmdCLE1BQWhCLEdBQXdCLEdBQTVEOztBQUNBLGNBQUEsS0FBSSxDQUFDakMsa0JBQUwsQ0FBd0JxQyxJQUF4QjtBQUNIOztBQUVEO0FBQ0g7O0FBRUQsYUFBSyxZQUFMO0FBQ0EsYUFBSyxXQUFMO0FBQWtCO0FBQ2QsZ0JBQU1uQyxRQUFPLEdBQUcsS0FBSSxDQUFDQyxNQUFMLENBQVlVLFFBQVosS0FBeUIsV0FBekIsR0FBd0MsSUFBSSxLQUFJLENBQUNYLE9BQWpELEdBQTRELEtBQUksQ0FBQ0EsT0FBakY7O0FBQ0EsZ0JBQU1YLEtBQUssR0FBRyxHQUFkO0FBQ0EsZ0JBQU0rQyxRQUFRLEdBQUcsSUFBakI7QUFDQSxnQkFBTUMsV0FBVyxHQUFJckMsUUFBRCxHQUFZLEtBQUksQ0FBQ1YsTUFBakIsR0FBMEJELEtBQTFCLEdBQWtDLENBQWxDLEdBQXNDK0MsUUFBdEMsR0FBa0RwQyxRQUFELEdBQVksS0FBSSxDQUFDVixNQUFqQixHQUEwQkQsS0FBL0Y7QUFDQSxnQkFBTWlELFdBQVcsR0FBR3RDLFFBQU8sR0FBRyxLQUFJLENBQUNWLE1BQWYsR0FBd0JELEtBQTVDO0FBQ0E7QUFDaEI7QUFDQTs7QUFFZ0IsZ0JBQU11QixVQUFRLEdBQUcsS0FBSSxDQUFDZCxrQkFBTCxDQUF3QnlDLG9CQUF4QixDQUNiLEtBQUksQ0FBQ2xELEtBQUwsR0FBYSxDQURBLEVBRWIsS0FBSSxDQUFDQyxNQUFMLEdBQWMsQ0FGRCxFQUVJK0MsV0FGSixFQUdiLEtBQUksQ0FBQ2hELEtBQUwsR0FBYSxDQUhBLEVBSWIsS0FBSSxDQUFDQyxNQUFMLEdBQWMsQ0FKRCxFQUlJZ0QsV0FKSixDQUFqQjs7QUFLQSxnQkFBSSxLQUFJLENBQUNyQyxNQUFMLENBQVlVLFFBQVosS0FBeUIsV0FBN0IsRUFBMEM7QUFDdENDLGNBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsY0FBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCO0FBQ0gsYUFIRCxNQUdPO0FBQ0hGLGNBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsY0FBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCO0FBQ0g7O0FBQ0QsWUFBQSxLQUFJLENBQUNoQixrQkFBTCxDQUF3QmlCLFNBQXhCLEdBQW9DSCxVQUFwQzs7QUFDQSxZQUFBLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JrQixRQUF4QixDQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1QyxLQUFJLENBQUMzQixLQUE1QyxFQUFtRCxLQUFJLENBQUNDLE1BQXhEOztBQUVBO0FBQ0g7O0FBRUQ7QUFDSTtBQWhMUjs7QUFxTEEsTUFBQSxLQUFJLENBQUNRLGtCQUFMLENBQXdCMEMsd0JBQXhCLEdBQW1ELEtBQUksQ0FBQ0MsTUFBTCxDQUFZQyxPQUFaLEdBQXNCLGFBQXRCLEdBQXNDLFdBQXpGOztBQUNBLE1BQUEsS0FBSSxDQUFDQyxLQUFMLENBQVcsS0FBSSxDQUFDRixNQUFoQixFQUF3QixLQUFJLENBQUMzQyxrQkFBN0IsRUFBaUQsS0FBSSxDQUFDOEMsWUFBdEQ7O0FBRUEsTUFBQSxLQUFJLENBQUM5QyxrQkFBTCxDQUF3QitDLE9BQXhCOztBQUdBLFVBQUl2QyxPQUFPLEdBQUcsS0FBSSxDQUFDTCxNQUFMLENBQVlRLFlBQTFCLEVBQ0l2QixNQUFNLENBQUM0RCxxQkFBUCxDQUE2QixLQUFJLENBQUMxQyxNQUFsQyxFQURKLEtBRUssSUFBSSxLQUFJLENBQUNyQixJQUFMLEtBQWNKLElBQUksQ0FBQ0ssSUFBdkIsRUFDRCxJQUFJLEtBQUksQ0FBQ0MsSUFBTCxJQUFhLEtBQUksQ0FBQ1MsVUFBTCxHQUFrQixLQUFJLENBQUNDLFVBQUwsQ0FBZ0JDLE1BQWhCLEdBQXlCLENBQTVELEVBQ0ksS0FBSSxDQUFDbUQsYUFBTCxHQUFxQkMsVUFBVSxDQUFDLEtBQUksQ0FBQ0MsUUFBTixFQUFnQixLQUFJLENBQUNoRCxNQUFMLENBQVlpRCxTQUE1QixDQUEvQjtBQUNYLEtBblE2SDs7QUFDMUgsUUFBTUMsTUFBTSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FBVyxLQUFLeEUsTUFBTCxDQUFZeUUsZ0JBQVosQ0FBNkIsS0FBN0IsQ0FBWCxDQUFmO0FBQ0EsU0FBSzNELFVBQUwsR0FBa0J3RCxNQUFNLENBQUNJLEdBQVAsQ0FBVyxVQUFBQyxHQUFHLEVBQUk7QUFDaEMsVUFBTUMsTUFBTSxHQUFHRCxHQUFHLENBQUNuRSxLQUFKLEdBQVltRSxHQUFHLENBQUNsRSxNQUEvQjtBQUNBLFVBQU1tQixZQUFZLEdBQUcrQyxHQUFHLENBQUNFLFlBQUosQ0FBaUIsbUJBQWpCLElBQXdDQyxNQUFNLENBQUNILEdBQUcsQ0FBQ0ksWUFBSixDQUFpQixtQkFBakIsQ0FBRCxDQUFOLEdBQWdELElBQXhGLEdBQStGLElBQXBIO0FBQ0EsVUFBTVYsU0FBUyxHQUFHTSxHQUFHLENBQUNFLFlBQUosQ0FBaUIsZ0JBQWpCLElBQXFDQyxNQUFNLENBQUNILEdBQUcsQ0FBQ0ksWUFBSixDQUFpQixnQkFBakIsQ0FBRCxDQUFOLEdBQTZDLElBQWxGLEdBQXlGLElBQTNHO0FBQ0EsVUFBTWpELFFBQVEsR0FBRzZDLEdBQUcsQ0FBQ0UsWUFBSixDQUFpQixlQUFqQixJQUFvQ0YsR0FBRyxDQUFDSSxZQUFKLENBQWlCLGVBQWpCLENBQXBDLEdBQXdFLFVBQXpGO0FBQ0EsVUFBTTFELFNBQVMsR0FBR3NELEdBQUcsQ0FBQ0UsWUFBSixDQUFpQixnQkFBakIsSUFBcUNDLE1BQU0sQ0FBQ0gsR0FBRyxDQUFDSSxZQUFKLENBQWlCLGdCQUFqQixDQUFELENBQTNDLEdBQWtGLEVBQXBHO0FBQ0EsVUFBTXBELGVBQWUsR0FBR2dELEdBQUcsQ0FBQ0UsWUFBSixDQUFpQixjQUFqQixJQUFtQ0MsTUFBTSxDQUFDSCxHQUFHLENBQUNJLFlBQUosQ0FBaUIsY0FBakIsQ0FBRCxDQUF6QyxHQUE4RSxDQUF0RztBQUNBLFVBQU1sQixPQUFPLEdBQUdjLEdBQUcsQ0FBQ0UsWUFBSixDQUFpQixjQUFqQixDQUFoQjtBQUNBLFVBQU1HLEtBQUssR0FBR0wsR0FBRyxDQUFDRSxZQUFKLENBQWlCLFlBQWpCLElBQWlDQyxNQUFNLENBQUNILEdBQUcsQ0FBQ0ksWUFBSixDQUFpQixZQUFqQixDQUFELENBQXZDLEdBQTBFLENBQXhGO0FBRUEsVUFBTUUsVUFBVSxHQUFHO0FBQ2Z6RSxRQUFBQSxLQUFLLEVBQUVtRSxHQUFHLENBQUNuRSxLQURJO0FBRWZDLFFBQUFBLE1BQU0sRUFBRWtFLEdBQUcsQ0FBQ2xFO0FBRkcsT0FBbkI7QUFJQSxhQUFPO0FBQ0hrRSxRQUFBQSxHQUFHLEVBQUhBLEdBREc7QUFFSEMsUUFBQUEsTUFBTSxFQUFOQSxNQUZHO0FBR0hoRCxRQUFBQSxZQUFZLEVBQVpBLFlBSEc7QUFJSHlDLFFBQUFBLFNBQVMsRUFBVEEsU0FKRztBQUtIdkMsUUFBQUEsUUFBUSxFQUFSQSxRQUxHO0FBTUhULFFBQUFBLFNBQVMsRUFBVEEsU0FORztBQU9ITSxRQUFBQSxlQUFlLEVBQWZBLGVBUEc7QUFRSGtDLFFBQUFBLE9BQU8sRUFBUEEsT0FSRztBQVNIbUIsUUFBQUEsS0FBSyxFQUFMQSxLQVRHO0FBVUhDLFFBQUFBLFVBQVUsRUFBVkE7QUFWRyxPQUFQO0FBWUgsS0ExQmlCLENBQWxCO0FBNEJBLFNBQUtqRixNQUFMLENBQVlrRixXQUFaLENBQXdCLEtBQUtDLFdBQTdCO0FBQ0EsU0FBS25GLE1BQUwsQ0FBWWtGLFdBQVosQ0FBd0IsS0FBS0UsV0FBN0I7O0FBQ0EsUUFBTUMsV0FBVyxHQUFHLEtBQUtGLFdBQUwsQ0FBaUJHLFVBQWpCLENBQTRCLElBQTVCLENBQXBCOztBQUNBLFFBQU1DLFdBQVcsR0FBRyxLQUFLSCxXQUFMLENBQWlCRSxVQUFqQixDQUE0QixJQUE1QixDQUFwQjs7QUFDQSxRQUFJRCxXQUFXLEtBQUssSUFBaEIsSUFBd0JFLFdBQVcsS0FBSyxJQUE1QyxFQUFrRCxNQUFNQyxLQUFLLENBQUMsMEJBQUQsQ0FBWDtBQUNsRCxTQUFLekIsWUFBTCxHQUFvQnNCLFdBQXBCO0FBQ0EsU0FBS3BFLGtCQUFMLEdBQTBCc0UsV0FBMUI7QUFDQSxTQUFLeEIsWUFBTCxDQUFrQjBCLHFCQUFsQixHQUEwQyxLQUExQztBQUNBLFNBQUt4RSxrQkFBTCxDQUF3QndFLHFCQUF4QixHQUFnRCxLQUFoRDtBQUNBcEYsSUFBQUEsTUFBTSxDQUFDcUYsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBS0MsTUFBdkM7QUFDSDs7OztTQS9EcUM7QUFDRTtBQUNNO0FBYTlDLG1CQUFrQztBQUM5QixhQUFPLEtBQUs3RSxVQUFMLENBQWdCLEtBQUtELFVBQXJCLENBQVA7QUFDSDs7O1NBRUQsZUFBa0M7QUFDOUIsYUFBTyxLQUFLQyxVQUFMLENBQWdCLENBQUMsS0FBS0QsVUFBTCxHQUFrQixDQUFuQixJQUF3QixLQUFLQyxVQUFMLENBQWdCQyxNQUF4RCxDQUFQO0FBQ0g7OztXQXVRRCxlQUFjNkUsQ0FBZCxFQUE4QkMsR0FBOUIsRUFBNkRDLFFBQTdELEVBQWlHO0FBQzdGLFVBQUlGLENBQUMsQ0FBQy9CLE9BQU4sRUFBZTtBQUNYLFlBQU1rQyxpQkFBaUIsR0FBR0YsR0FBRyxDQUFDRyxNQUFKLENBQVd4RixLQUFYLEdBQW1CLENBQTdDO0FBQ0EsWUFBTXlGLGtCQUFrQixHQUFHSixHQUFHLENBQUNHLE1BQUosQ0FBV3ZGLE1BQVgsR0FBb0IsQ0FBL0M7QUFDQSxZQUFNeUYsQ0FBQyxHQUFHTCxHQUFHLENBQUNuQyxvQkFBSixDQUF5QnFDLGlCQUF6QixFQUE0Q0Usa0JBQTVDLEVBQWdFLENBQWhFLEVBQW1FRixpQkFBbkUsRUFBc0ZFLGtCQUF0RixFQUEwRzNELElBQUksQ0FBQzZELEdBQUwsQ0FBU0osaUJBQVQsRUFBNEJFLGtCQUE1QixDQUExRyxDQUFWO0FBQ0FDLFFBQUFBLENBQUMsQ0FBQ2pFLFlBQUYsQ0FBZSxDQUFmLEVBQWtCLFNBQWxCO0FBQ0FpRSxRQUFBQSxDQUFDLENBQUNqRSxZQUFGLENBQWUsQ0FBZixFQUFrQixTQUFsQjtBQUNBNEQsUUFBQUEsR0FBRyxDQUFDM0QsU0FBSixHQUFnQmdFLENBQWhCO0FBQ0FMLFFBQUFBLEdBQUcsQ0FBQzFELFFBQUosQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLEtBQUszQixLQUF4QixFQUErQixLQUFLQyxNQUFwQzs7QUFHQSx1QkFLSW9ELE9BQU8sQ0FBQyxLQUFLckQsS0FBTixFQUFhLEtBQUtDLE1BQWxCLEVBQTBCbUYsQ0FBQyxDQUFDakIsR0FBRixDQUFNbkUsS0FBaEMsRUFBdUNvRixDQUFDLENBQUNqQixHQUFGLENBQU1sRSxNQUE3QyxFQUFxRG1GLENBQUMsQ0FBQ1osS0FBdkQsQ0FMWDtBQUFBLFlBQ0lvQixPQURKLFlBQ0lBLE9BREo7QUFBQSxZQUVJQyxPQUZKLFlBRUlBLE9BRko7QUFBQSxZQUdJN0YsS0FISixZQUdJQSxLQUhKO0FBQUEsWUFJSUMsTUFKSixZQUlJQSxNQUpKOztBQU9Bb0YsUUFBQUEsR0FBRyxDQUFDN0UsU0FBSixDQUFjNEUsQ0FBQyxDQUFDakIsR0FBaEIsRUFBcUJ5QixPQUFyQixFQUE4QkMsT0FBOUIsRUFBdUM3RixLQUF2QyxFQUE4Q0MsTUFBOUM7QUFFSCxPQW5CRCxNQW1CTyxJQUFJLEtBQUttRSxNQUFMLEdBQWNnQixDQUFDLENBQUNoQixNQUFwQixFQUE0QjtBQUUvQmlCLFFBQUFBLEdBQUcsQ0FBQzdFLFNBQUosQ0FBYzRFLENBQUMsQ0FBQ2pCLEdBQWhCLEVBQ0ksQ0FESixFQUVJLENBQUMsS0FBS2xFLE1BQUwsR0FBYyxLQUFLRCxLQUFMLEdBQWFvRixDQUFDLENBQUNoQixNQUE5QixJQUF3QyxDQUY1QyxFQUdJLEtBQUtwRSxLQUhULEVBSUksS0FBS0EsS0FBTCxHQUFhb0YsQ0FBQyxDQUFDaEIsTUFKbkI7QUFLSCxPQVBNLE1BT0E7QUFFSGlCLFFBQUFBLEdBQUcsQ0FBQzdFLFNBQUosQ0FBYzRFLENBQUMsQ0FBQ2pCLEdBQWhCLEVBQ0ksQ0FBQyxLQUFLbkUsS0FBTCxHQUFhLEtBQUtDLE1BQUwsR0FBY21GLENBQUMsQ0FBQ2hCLE1BQTlCLElBQXdDLENBRDVDLEVBRUksQ0FGSixFQUdJLEtBQUtuRSxNQUFMLEdBQWNtRixDQUFDLENBQUNoQixNQUhwQixFQUlJLEtBQUtuRSxNQUpUO0FBS0g7QUFFSjs7O1dBRUQsa0JBQWlCO0FBRWIsV0FBS0QsS0FBTCxHQUFhSCxNQUFNLENBQUNDLFVBQXBCO0FBQ0EsV0FBS0csTUFBTCxHQUFjQyxRQUFRLENBQUM0RixlQUFULENBQXlCQyxZQUF2QyxDQUhhLENBR3dDOztBQUNyRCxXQUFLM0IsTUFBTCxHQUFjLEtBQUtwRSxLQUFMLEdBQWEsS0FBS0MsTUFBaEM7QUFFQSxXQUFLc0QsWUFBTCxDQUFrQmlDLE1BQWxCLENBQXlCeEYsS0FBekIsR0FBaUMsS0FBS0EsS0FBdEM7QUFDQSxXQUFLdUQsWUFBTCxDQUFrQmlDLE1BQWxCLENBQXlCdkYsTUFBekIsR0FBa0MsS0FBS0EsTUFBdkM7QUFFQSxXQUFLUSxrQkFBTCxDQUF3QitFLE1BQXhCLENBQStCeEYsS0FBL0IsR0FBdUMsS0FBS0EsS0FBNUM7QUFDQSxXQUFLUyxrQkFBTCxDQUF3QitFLE1BQXhCLENBQStCdkYsTUFBL0IsR0FBd0MsS0FBS0EsTUFBN0M7QUFFQSxXQUFLTyxTQUFMO0FBQ0g7OztXQUVELHFCQUFvQjtBQUNoQixVQUFJLEtBQUtJLE1BQVQsRUFBaUI7QUFDYixhQUFLMEMsS0FBTCxDQUFXLEtBQUsxQyxNQUFoQixFQUF3QixLQUFLMkMsWUFBN0IsRUFBMkMsS0FBSzlDLGtCQUFoRDtBQUNILE9BRkQsTUFFTztBQUNILGNBQU11RSxLQUFLLENBQUMsY0FBYyxLQUFLM0UsVUFBbkIsR0FBZ0MsR0FBaEMsR0FBc0MsS0FBS0MsVUFBTCxDQUFnQkMsTUFBdkQsQ0FBWDtBQUNIO0FBQ0o7OztXQUdELGlCQUFRO0FBQ0osV0FBS0YsVUFBTCxHQUFrQixDQUFDLENBQW5CO0FBQ0EsV0FBS3VELFFBQUw7QUFDQSxXQUFLdUIsTUFBTDtBQUNIOzs7V0FFRCxnQkFBTztBQUNILFdBQUt6QixhQUFMLElBQXNCc0MsWUFBWSxDQUFDLEtBQUt0QyxhQUFOLENBQWxDO0FBQ0g7OztXQUVELGdCQUFPO0FBQ0gsVUFBSSxLQUFLaEUsSUFBTCxLQUFjSixJQUFJLENBQUMyRyxhQUF2QixFQUNJLE1BQU1qQixLQUFLLENBQUMsbUNBQUQsQ0FBWDtBQUNKLFdBQUtwQixRQUFMO0FBQ0g7OztTQUdELGVBQW9CO0FBQ2hCLGFBQU8sS0FBS3RELFVBQUwsQ0FBZ0JDLE1BQXZCO0FBQ0g7Ozs7OztJQUdDMkYsWTtBQUdvQztBQUNFO0FBTXhDLHdCQUFxQjFHLE1BQXJCLEVBQW1EQyxLQUFuRCxFQUF1RTtBQUFBOztBQUFBOztBQUFBLFNBQWxERCxNQUFrRCxHQUFsREEsTUFBa0Q7QUFBQSxTQUFwQkMsS0FBb0IsR0FBcEJBLEtBQW9COztBQUFBOztBQUFBLG1DQVB2REksTUFBTSxDQUFDQyxVQU9nRDs7QUFBQSxvQ0FOdERELE1BQU0sQ0FBQ0UsV0FNK0M7O0FBQUE7O0FBQUEscUNBSHpCRyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FHeUI7O0FBQUE7O0FBQ25FLFFBQU0yRCxNQUFNLEdBQUdDLEtBQUssQ0FBQ0MsSUFBTixDQUFXLEtBQUt4RSxNQUFMLENBQVl5RSxnQkFBWixDQUE2QixLQUE3QixDQUFYLENBQWY7O0FBQ0EsUUFBSUgsTUFBTSxDQUFDdkQsTUFBUCxLQUFrQixDQUF0QixFQUF5QjtBQUNyQixZQUFNeUUsS0FBSyxDQUFDLDhDQUFELENBQVg7QUFDSDs7QUFDRCxTQUFLYixHQUFMLEdBQVdMLE1BQU0sQ0FBQyxDQUFELENBQWpCO0FBRUEsU0FBS3RFLE1BQUwsQ0FBWWtGLFdBQVosQ0FBd0IsS0FBS3lCLE9BQTdCOztBQUNBLFFBQU1DLE9BQU8sR0FBRyxLQUFLRCxPQUFMLENBQWFyQixVQUFiLENBQXdCLElBQXhCLENBQWhCOztBQUNBLFFBQUlzQixPQUFPLEtBQUssSUFBaEIsRUFBc0IsTUFBTXBCLEtBQUssQ0FBQywwQkFBRCxDQUFYO0FBQ3RCLFNBQUtxQixRQUFMLEdBQWdCRCxPQUFoQjtBQUNBLFNBQUtDLFFBQUwsQ0FBY3BCLHFCQUFkLEdBQXNDLEtBQXRDO0FBQ0EsU0FBS29CLFFBQUwsQ0FBY2xELHdCQUFkLEdBQXlDLGFBQXpDO0FBQ0EsU0FBS2dCLEdBQUwsQ0FBU2UsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0M7QUFBQSxhQUFNLE1BQUksQ0FBQ29CLElBQUwsRUFBTjtBQUFBLEtBQWxDO0FBQ0EsU0FBSzlCLEtBQUwsR0FBYSxLQUFLTCxHQUFMLENBQVVFLFlBQVYsQ0FBdUIsWUFBdkIsSUFBdUNDLE1BQU0sQ0FBQyxLQUFLSCxHQUFMLENBQVNJLFlBQVQsQ0FBc0IsWUFBdEIsQ0FBRCxDQUE3QyxHQUFxRixDQUFsRztBQUNBLFNBQUsrQixJQUFMLEdBZm1FLENBZ0JwRTtBQUNGOzs7O1dBRUQsaUJBQVE7QUFDSixXQUFLbkIsTUFBTDtBQUNIOzs7V0FDRCxnQkFBTztBQUdILFVBQU1JLGlCQUFpQixHQUFHLEtBQUtjLFFBQUwsQ0FBY2IsTUFBZCxDQUFxQnhGLEtBQXJCLEdBQTZCLENBQXZEO0FBQ0EsVUFBTXlGLGtCQUFrQixHQUFHLEtBQUtZLFFBQUwsQ0FBY2IsTUFBZCxDQUFxQnZGLE1BQXJCLEdBQThCLENBQXpEOztBQUNBLFVBQU15RixDQUFDLEdBQUcsS0FBS1csUUFBTCxDQUFjbkQsb0JBQWQsQ0FBbUNxQyxpQkFBbkMsRUFBc0RFLGtCQUF0RCxFQUEwRSxDQUExRSxFQUE2RUYsaUJBQTdFLEVBQWdHRSxrQkFBaEcsRUFBb0gzRCxJQUFJLENBQUM2RCxHQUFMLENBQVNKLGlCQUFULEVBQTRCRSxrQkFBNUIsQ0FBcEgsQ0FBVjs7QUFDQUMsTUFBQUEsQ0FBQyxDQUFDakUsWUFBRixDQUFlLENBQWYsRUFBa0IsU0FBbEI7QUFDQWlFLE1BQUFBLENBQUMsQ0FBQ2pFLFlBQUYsQ0FBZSxDQUFmLEVBQWtCLFNBQWxCOztBQUNBLFdBQUs0RSxRQUFMLENBQWNoRixJQUFkOztBQUNBLFdBQUtnRixRQUFMLENBQWMzRSxTQUFkLEdBQTBCZ0UsQ0FBMUI7O0FBQ0EsV0FBS1csUUFBTCxDQUFjMUUsUUFBZCxDQUF1QixDQUF2QixFQUEwQixDQUExQixFQUE2QixLQUFLMEUsUUFBTCxDQUFjYixNQUFkLENBQXFCeEYsS0FBbEQsRUFBeUQsS0FBS3FHLFFBQUwsQ0FBY2IsTUFBZCxDQUFxQnZGLE1BQTlFOztBQUNBLHNCQUtJb0QsT0FBTyxDQUFDLEtBQUtyRCxLQUFOLEVBQWEsS0FBS0MsTUFBbEIsRUFBMEIsS0FBS2tFLEdBQUwsQ0FBU25FLEtBQW5DLEVBQTBDLEtBQUttRSxHQUFMLENBQVNsRSxNQUFuRCxFQUEyRCxLQUFLdUUsS0FBaEUsQ0FMWDtBQUFBLFVBQ0lvQixPQURKLGFBQ0lBLE9BREo7QUFBQSxVQUVJQyxPQUZKLGFBRUlBLE9BRko7QUFBQSxVQUdJN0YsS0FISixhQUdJQSxLQUhKO0FBQUEsVUFJSUMsTUFKSixhQUlJQSxNQUpKOztBQU9BLFdBQUtvRyxRQUFMLENBQWM3RixTQUFkLENBQXdCLEtBQUsyRCxHQUE3QixFQUFrQ3lCLE9BQWxDLEVBQTJDQyxPQUEzQyxFQUFvRDdGLEtBQXBELEVBQTJEQyxNQUEzRDtBQUlIOzs7V0FFRCxrQkFBaUI7QUFFYixXQUFLRCxLQUFMLEdBQWFILE1BQU0sQ0FBQ0MsVUFBcEI7QUFDQSxXQUFLRyxNQUFMLEdBQWNDLFFBQVEsQ0FBQzRGLGVBQVQsQ0FBeUJDLFlBQXZDLENBSGEsQ0FHd0M7O0FBRXJELFdBQUtNLFFBQUwsQ0FBY2IsTUFBZCxDQUFxQnhGLEtBQXJCLEdBQTZCLEtBQUtBLEtBQWxDO0FBQ0EsV0FBS3FHLFFBQUwsQ0FBY2IsTUFBZCxDQUFxQnZGLE1BQXJCLEdBQThCLEtBQUtBLE1BQW5DO0FBR0EsV0FBS3FHLElBQUw7QUFDSDs7Ozs7O0FBS0wsQ0FBQyxZQUFZO0FBRVRwRyxFQUFBQSxRQUFRLENBQUNnRixnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBTTtBQUNoRGhGLElBQUFBLFFBQVEsQ0FBQytELGdCQUFULENBQXVDLFNBQXZDLEVBQWtEc0MsT0FBbEQsQ0FBMEQsVUFBQUMsQ0FBQyxFQUFJO0FBQzNELFVBQU05RyxJQUFVLEdBQUc4RyxDQUFDLENBQUNuQyxZQUFGLENBQWUsa0JBQWYsSUFBcUMvRSxJQUFJLENBQUMyRyxhQUExQyxHQUEwRDNHLElBQUksQ0FBQ0ssSUFBbEY7QUFDQSxVQUFNOEcsTUFBZSxHQUFHRCxDQUFDLENBQUNuQyxZQUFGLENBQWUsY0FBZixDQUF4QjtBQUNBLFVBQU01RSxLQUFLLEdBQUcrRyxDQUFDLENBQUNFLE9BQUYsQ0FBVSxTQUFWLENBQWQ7QUFDQSxVQUFJLENBQUNqSCxLQUFMLEVBQVksTUFBTXVGLEtBQUssQ0FBQyxzQ0FBRCxDQUFYO0FBQ1osVUFBTTJCLElBQUksR0FBRyxJQUFJcEgsTUFBSixDQUFXaUgsQ0FBWCxFQUFjL0csS0FBZCxFQUFxQkMsSUFBckIsRUFBMkIsQ0FBQytHLE1BQTVCLENBQWIsQ0FMMkQsQ0FNM0Q7O0FBQ0FELE1BQUFBLENBQUMsQ0FBQ0ksTUFBRixHQUFXRCxJQUFYO0FBQ0gsS0FSRDtBQVVBRSxJQUFBQSxNQUFNLENBQUMzQixnQkFBUCxDQUF3QixjQUF4QixFQUF3QyxVQUFDNEIsQ0FBRCxFQUFPO0FBQUE7O0FBQzNDLFVBQU1DLFVBQVUsdUJBQUdELENBQUMsQ0FBQ0UsYUFBTCxxREFBRyxpQkFBaUJDLGFBQWpCLENBQStCLFNBQS9CLENBQW5COztBQUNBLFVBQUlGLFVBQUosRUFBZ0I7QUFDWixZQUFNSixJQUFJLEdBQUdJLFVBQVUsQ0FBQ0gsTUFBeEI7QUFDQSxZQUFJRCxJQUFJLENBQUNqSCxJQUFMLEtBQWNKLElBQUksQ0FBQ0ssSUFBdkIsRUFDSWdILElBQUksQ0FBQ08sSUFBTCxHQURKLEtBRUs7QUFDRCxjQUFNQyxVQUFxQyxHQUFHTixNQUFNLENBQUNPLFVBQVAsQ0FBa0JULElBQUksQ0FBQ2xILEtBQXZCLENBQTlDO0FBQ0EsY0FBTTRILFlBQXVDLEdBQUdSLE1BQU0sQ0FBQ08sVUFBUCxDQUFrQk4sQ0FBQyxDQUFDUSxZQUFwQixDQUFoRDtBQUNBLGNBQU1DLFFBQVEsR0FBR1QsQ0FBQyxDQUFDUSxZQUFGLENBQWVFLE1BQWYsR0FDYkgsWUFBWSxDQUFDSSxDQUFiLElBQWtCTixVQUFVLENBQUNNLENBQVgsSUFBZ0IsQ0FBbEMsQ0FEYSxHQUViSixZQUFZLENBQUNLLENBQWIsR0FBaUJQLFVBQVUsQ0FBQ08sQ0FGaEM7QUFHQUMsVUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlMLFFBQVo7O0FBQ0EsY0FBSUEsUUFBUSxHQUFHLENBQVgsSUFBZ0JBLFFBQVEsR0FBR1osSUFBSSxDQUFDa0IsYUFBcEMsRUFBbUQ7QUFDL0NmLFlBQUFBLENBQUMsQ0FBQ1EsWUFBRixDQUFlNUMsV0FBZixDQUEyQmlDLElBQUksQ0FBQ25ILE1BQWhDO0FBQ0gsV0FGRCxNQUVPO0FBQ0htSCxZQUFBQSxJQUFJLENBQUNPLElBQUw7QUFDQVAsWUFBQUEsSUFBSSxDQUFDbEgsS0FBTCxDQUFXaUYsV0FBWCxDQUF1QmlDLElBQUksQ0FBQ25ILE1BQTVCO0FBQ0g7QUFHSjtBQUNKOztBQUNELFVBQU1zSSxVQUFVLEdBQUdoQixDQUFDLENBQUNRLFlBQUYsQ0FBZUwsYUFBZixDQUE2QixTQUE3QixDQUFuQjs7QUFDQSxVQUFJYSxVQUFKLEVBQWdCO0FBQ1osWUFBSWxCLE1BQU0sR0FBR2tCLFVBQVUsQ0FBQ2xCLE1BQXhCO0FBQ0EsWUFBSUEsTUFBTSxDQUFDbEgsSUFBUCxLQUFnQkosSUFBSSxDQUFDSyxJQUFyQixJQUE2QmlILE1BQU0sQ0FBQ25ILEtBQVAsS0FBaUJxSCxDQUFDLENBQUNRLFlBQXBELEVBQ0lWLE1BQU0sQ0FBQ21CLEtBQVAsR0FESixLQUdJbkIsTUFBTSxDQUFDb0IsSUFBUDtBQUVQO0FBQ0osS0FoQ0Q7QUFrQ0E5SCxJQUFBQSxRQUFRLENBQUMrRCxnQkFBVCxDQUF1QyxnQkFBdkMsRUFBeURzQyxPQUF6RCxDQUFpRSxVQUFBQyxDQUFDLEVBQUk7QUFDbEUsVUFBTS9HLEtBQUssR0FBRytHLENBQUMsQ0FBQ0UsT0FBRixDQUFVLFNBQVYsQ0FBZDtBQUNBLFVBQUksQ0FBQ2pILEtBQUwsRUFBWSxNQUFNdUYsS0FBSyxDQUFDLHNDQUFELENBQVg7QUFDWixVQUFNaUQsVUFBVSxHQUFHLElBQUkvQixZQUFKLENBQWlCTSxDQUFqQixFQUFvQi9HLEtBQXBCLENBQW5CO0FBQ0F3SSxNQUFBQSxVQUFVLENBQUNGLEtBQVg7QUFFSCxLQU5EO0FBT0gsR0FwREQ7QUF1REgsQ0F6REQsSSxDQTJEQTs7O0FBRUEsSUFBSSxDQUFDRyxPQUFPLENBQUNDLFNBQVIsQ0FBa0JDLE9BQXZCLEVBQWdDO0FBQzVCO0FBQ0FGLEVBQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkMsT0FBbEIsR0FBNEJGLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkUsaUJBQWxCLElBQ3hCSCxPQUFPLENBQUNDLFNBQVIsQ0FBa0JHLHFCQUR0QjtBQUVIOztBQUVELElBQUksQ0FBQ0osT0FBTyxDQUFDQyxTQUFSLENBQWtCekIsT0FBdkIsRUFBZ0M7QUFDNUI7QUFDQXdCLEVBQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQnpCLE9BQWxCLEdBQTRCLFVBQVU2QixDQUFWLEVBQWE7QUFDckMsUUFBSUMsRUFBRSxHQUFHLElBQVQ7O0FBRUEsT0FBRztBQUNDLFVBQUlOLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkMsT0FBbEIsQ0FBMEJLLElBQTFCLENBQStCRCxFQUEvQixFQUFtQ0QsQ0FBbkMsQ0FBSixFQUEyQyxPQUFPQyxFQUFQLENBRDVDLENBRUM7O0FBQ0FBLE1BQUFBLEVBQUUsR0FBR0EsRUFBRSxDQUFDRSxhQUFILElBQW9CRixFQUFFLENBQUNHLFVBQTVCO0FBQ0gsS0FKRCxRQUlTSCxFQUFFLEtBQUssSUFBUCxJQUFlQSxFQUFFLENBQUNJLFFBQUgsS0FBZ0IsQ0FKeEM7O0FBS0EsV0FBTyxJQUFQO0FBQ0gsR0FURDtBQVVIOztBQUlELElBQU12RixPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFDd0YsV0FBRCxFQUFzQkMsWUFBdEIsRUFBNENDLFFBQTVDLEVBQThEQyxTQUE5RCxFQUFvSTtBQUFBLE1BQW5EeEUsS0FBbUQsdUVBQW5DLENBQW1DO0FBQUEsTUFBakNvQixPQUFpQyx1RUFBdkIsR0FBdUI7QUFBQSxNQUFsQkMsT0FBa0IsdUVBQVIsR0FBUTtBQUNoSixNQUFNb0QsVUFBVSxHQUFHRixRQUFRLEdBQUdDLFNBQTlCO0FBQ0EsTUFBTUUsV0FBVyxHQUFHTCxXQUFXLEdBQUdDLFlBQWxDO0FBQ0EsTUFBSTlJLEtBQUssR0FBRzZJLFdBQVcsR0FBR3JFLEtBQTFCO0FBQ0EsTUFBSXZFLE1BQU0sR0FBRzZJLFlBQVksR0FBR3RFLEtBQTVCOztBQUVBLE1BQUl5RSxVQUFVLEdBQUdDLFdBQWpCLEVBQThCO0FBQzFCakosSUFBQUEsTUFBTSxHQUFHRCxLQUFLLEdBQUdpSixVQUFqQjtBQUNILEdBRkQsTUFFTztBQUNIakosSUFBQUEsS0FBSyxHQUFHQyxNQUFNLEdBQUdnSixVQUFqQjtBQUNIOztBQUVELFNBQU87QUFDSGpKLElBQUFBLEtBQUssRUFBTEEsS0FERztBQUVIQyxJQUFBQSxNQUFNLEVBQU5BLE1BRkc7QUFHSDJGLElBQUFBLE9BQU8sRUFBRSxDQUFDaUQsV0FBVyxHQUFHN0ksS0FBZixJQUF3QjRGLE9BSDlCO0FBSUhDLElBQUFBLE9BQU8sRUFBRSxDQUFDaUQsWUFBWSxHQUFHN0ksTUFBaEIsSUFBMEI0RjtBQUpoQyxHQUFQO0FBTUgsQ0FsQkQiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5TZWUgaHR0cHM6Ly9naXRodWIuY29tL0RhdmVTZWlkbWFuL1N0YXJXYXJzV2lwZVxuXG5cdFRvIERvXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRGaXggZGlhZ29uYWwgd2lwZVxuXHRmaXggcmFkaWFsIHdpcGVcblxuXG5XZWJ5YXJucyB2ZXJzaW9uOlxuLSBBZGRlZCBcImRlc3Ryb3lcIiBmbGFnIGFuZCBtZXRob2Rcbi0gQWRkZWQgc3VwcG9ydCBmb3IgYGRhdGEtc3RhcnRBdGAgdG8gc2V0IHN0YXJ0IHBlcmNlbnRhZ2Vcbi0gb24gZGVzdHJveSByZW1vdmUgY3JlYXRlZCBlbGVtZW50c1xuKi9cblxuZW51bSBNb2RlIHtcbiAgICBBVVRPLCBNVUxUSV9TRUNUSU9OXG59XG5cbmludGVyZmFjZSBJbWFnZU9iamVjdCB7XG4gICAgc3RhcnRQZXJjZW50YWdlOiBudW1iZXI7XG4gICAgZmFkZVdpZHRoOiBudW1iZXI7XG4gICAgZmFkZVR5cGU6IHN0cmluZyB8IG51bGw7XG4gICAgZmFkZURlbGF5OiBudW1iZXI7XG4gICAgZmFkZUR1cmF0aW9uOiBudW1iZXI7XG4gICAgYXNwZWN0OiBudW1iZXI7XG4gICAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xuICAgIGNvbnRhaW46IGJvb2xlYW47XG4gICAgc2NhbGU6IG51bWJlcjtcbiAgICBkaW1lbnNpb25zOiB7IFwid2lkdGhcIjogbnVtYmVyLCBcImhlaWdodFwiOiBudW1iZXIgfVxufVxuXG5jbGFzcyBTV1dpcGUge1xuXG4gICAgY3VycmVudElkeCA9IC0xO1xuICAgIHdpZHRoOiBudW1iZXIgPSB3aW5kb3cuaW5uZXJXaWR0aDtcdFx0XHRcdC8vIHdpZHRoIG9mIGNvbnRhaW5lciAoYmFubmVyKVxuICAgIGhlaWdodDogbnVtYmVyID0gd2luZG93LmlubmVySGVpZ2h0O1x0XHRcdFx0Ly8gaGVpZ2h0IG9mIGNvbnRhaW5lclxuICAgIGFzcGVjdDogbnVtYmVyID0gdGhpcy53aWR0aCAvIHRoaXMuaGVpZ2h0O1x0XHRcdFx0Ly8gYXNwZWN0IHJhdGlvIG9mIGNvbnRhaW5lclxuXG4gICAgcHJpdmF0ZSByZWFkb25seSBpbWFnZUFycmF5OiBJbWFnZU9iamVjdFtdO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2JhY2tDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfZm9yZUNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9iYWNrQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZvcmVncm91bmRDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICBwcml2YXRlIHBlcmNlbnQ6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBzdGFydFRpbWU6IERhdGUgPSBuZXcgRGF0ZTtcbiAgICBwcml2YXRlIG5leHRGYWRlVGltZXI6IE5vZGVKUy5UaW1lb3V0IHwgbnVsbCA9IG51bGw7XG5cblxuICAgIHByaXZhdGUgZ2V0IGN1ckltZygpOiBJbWFnZU9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLmltYWdlQXJyYXlbdGhpcy5jdXJyZW50SWR4XTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBueHRJbWcoKTogSW1hZ2VPYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZUFycmF5Wyh0aGlzLmN1cnJlbnRJZHggKyAxKSAlIHRoaXMuaW1hZ2VBcnJheS5sZW5ndGhdO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGJhbm5lcjogSFRNTEVsZW1lbnQsIHJlYWRvbmx5IG93bmVyOiBIVE1MRWxlbWVudCwgcmVhZG9ubHkgbW9kZTogTW9kZSA9IE1vZGUuQVVUTywgcmVhZG9ubHkgbG9vcCA9IHRydWUpIHtcbiAgICAgICAgY29uc3QgaW1hZ2VzID0gQXJyYXkuZnJvbSh0aGlzLmJhbm5lci5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpKTtcbiAgICAgICAgdGhpcy5pbWFnZUFycmF5ID0gaW1hZ2VzLm1hcChpbWcgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXNwZWN0ID0gaW1nLndpZHRoIC8gaW1nLmhlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVEdXJhdGlvbiA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZhZGVEdXJhdGlvblwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlRHVyYXRpb25cIikpICogMTAwMCA6IDEwMDA7XG4gICAgICAgICAgICBjb25zdCBmYWRlRGVsYXkgPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1mYWRlRGVsYXlcIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtZmFkZURlbGF5XCIpKSAqIDEwMDAgOiAxMDAwO1xuICAgICAgICAgICAgY29uc3QgZmFkZVR5cGUgPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1mYWRlVHlwZVwiKSA/IGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZhZGVUeXBlXCIpIDogXCJjcm9zcy1sclwiO1xuICAgICAgICAgICAgY29uc3QgZmFkZVdpZHRoID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZVdpZHRoXCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZhZGVXaWR0aFwiKSkgOiAuMTtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0UGVyY2VudGFnZSA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLXN0YXJ0QXRcIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtc3RhcnRBdFwiKSkgOiAwO1xuICAgICAgICAgICAgY29uc3QgY29udGFpbiA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWNvbnRhaW5cIik7XG4gICAgICAgICAgICBjb25zdCBzY2FsZSA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLXNjYWxlXCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNjYWxlXCIpKSA6IDE7XG5cbiAgICAgICAgICAgIGNvbnN0IGRpbWVuc2lvbnMgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IGltZy53aWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGltZy5oZWlnaHQsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgICAgICBhc3BlY3QsXG4gICAgICAgICAgICAgICAgZmFkZUR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGZhZGVEZWxheSxcbiAgICAgICAgICAgICAgICBmYWRlVHlwZSxcbiAgICAgICAgICAgICAgICBmYWRlV2lkdGgsXG4gICAgICAgICAgICAgICAgc3RhcnRQZXJjZW50YWdlLFxuICAgICAgICAgICAgICAgIGNvbnRhaW4sXG4gICAgICAgICAgICAgICAgc2NhbGUsXG4gICAgICAgICAgICAgICAgZGltZW5zaW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuYmFubmVyLmFwcGVuZENoaWxkKHRoaXMuX2JhY2tDYW52YXMpO1xuICAgICAgICB0aGlzLmJhbm5lci5hcHBlbmRDaGlsZCh0aGlzLl9mb3JlQ2FudmFzKTtcbiAgICAgICAgY29uc3QgYmFja0NvbnRleHQgPSB0aGlzLl9iYWNrQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgICAgICBjb25zdCBmb3JlQ29udGV4dCA9IHRoaXMuX2ZvcmVDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICBpZiAoYmFja0NvbnRleHQgPT09IG51bGwgfHwgZm9yZUNvbnRleHQgPT09IG51bGwpIHRocm93IEVycm9yKFwiMmQgY29udGV4dCBub3Qgc3VwcG9ydGVkXCIpXG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0ID0gYmFja0NvbnRleHQ7XG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0ID0gZm9yZUNvbnRleHQ7XG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG5leHRGYWRlID0gKCkgPT4ge1xuICAgICAgICAvLyBhZHZhbmNlIGluZGljZXNcbiAgICAgICAgdGhpcy5jdXJyZW50SWR4ID0gKyt0aGlzLmN1cnJlbnRJZHggJSB0aGlzLmltYWdlQXJyYXkubGVuZ3RoO1xuICAgICAgICB0aGlzLmRyYXdJbWFnZSgpO1xuXG4gICAgICAgIC8vIGNsZWFyIHRoZSBmb3JlZ3JvdW5kXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgLy8gc2V0dXAgYW5kIHN0YXJ0IHRoZSBmYWRlXG4gICAgICAgIHRoaXMucGVyY2VudCA9IC10aGlzLmN1ckltZy5mYWRlV2lkdGg7XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGU7XG4gICAgICAgIHRoaXMucmVkcmF3KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWRyYXcgPSAoKSA9PiB7XG4gICAgICAgIC8vIGNhbGN1bGF0ZSBwZXJjZW50IGNvbXBsZXRpb24gb2Ygd2lwZVxuICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IG5ldyBEYXRlO1xuICAgICAgICBjb25zdCBlbGFwc2VkID0gY3VycmVudFRpbWUuZ2V0VGltZSgpIC0gdGhpcy5zdGFydFRpbWUuZ2V0VGltZSgpO1xuICAgICAgICB0aGlzLnBlcmNlbnQgPSB0aGlzLmN1ckltZy5zdGFydFBlcmNlbnRhZ2UgKyBlbGFwc2VkIC8gdGhpcy5jdXJJbWcuZmFkZUR1cmF0aW9uO1xuXG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuc2F2ZSgpO1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICBjb25zdCBmYWRlV2lkdGggPSB0aGlzLmN1ckltZy5mYWRlV2lkdGhcblxuICAgICAgICBzd2l0Y2ggKHRoaXMuY3VySW1nLmZhZGVUeXBlKSB7XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1sclwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDApO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1ybFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDApO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy11ZFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgMCwgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAwLCAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1kdVwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgMCwgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAwLCAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJkaWFnb25hbC10bC1iclwiOiB7Ly8gRFM6IFRoaXMgZGlhZ29uYWwgbm90IHdvcmtpbmcgcHJvcGVybHlcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMiArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgyICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCBmYWRlV2lkdGggKiAodGhpcy53aWR0aCAvICh0aGlzLmhlaWdodCAvIDIpKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImRpYWdvbmFsLXRyLWJsXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDAsXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCArIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtYnRtXCI6IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzID0gMzAwOyAvLyB0aGUgYW1vdW50IG9mIHNlZ21lbnRzIHRvIHNwbGl0IHRoZSBzZW1pIGNpcmNsZSBpbnRvLCBEUzogYWRqdXN0IHRoaXMgZm9yIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSAxIC8gc2VnbWVudHM7XG5cbiAgICAgICAgICAgICAgICAvLyBleHBhbmQgcGVyY2VudCB0byBjb3ZlciBmYWRlV2lkdGhcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFBlcmNlbnQgPSB0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIGEgcGVyY2VudFxuICAgICAgICAgICAgICAgIGZvciAobGV0IHByY3QgPSAtZmFkZVdpZHRoOyBwcmN0IDwgMSArIGZhZGVXaWR0aDsgcHJjdCArPSBzdGVwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCBwZXJjZW50IHRvIGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gcHJjdCAqIE1hdGguUEk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGNvb3JkaW5hdGVzIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MSA9IE1hdGguY29zKGFuZ2xlICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MSA9IE1hdGguc2luKGFuZ2xlICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MiA9IE1hdGguY29zKGFuZ2xlICsgbGVuICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MiA9IE1hdGguc2luKGFuZ2xlICsgbGVuICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBhbHBoYSBmb3Igd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxwaGEgPSAoYWRqdXN0ZWRQZXJjZW50IC0gcHJjdCArIGZhZGVXaWR0aCkgLyBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZHJhdyB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubW92ZVRvKHRoaXMud2lkdGggLyAyIC0gMiwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8oeDEsIHkxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgyLCB5Mik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh0aGlzLndpZHRoIC8gMiArIDIsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsJyArIGFscGhhICsgJyknO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtdG9wXCI6IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzID0gMzAwOyAvLyB0aGUgYW1vdW50IG9mIHNlZ21lbnRzIHRvIHNwbGl0IHRoZSBzZW1pIGNpcmNsZSBpbnRvLCBEUzogYWRqdXN0IHRoaXMgZm9yIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSAxIC8gc2VnbWVudHM7XG5cbiAgICAgICAgICAgICAgICAvLyBleHBhbmQgcGVyY2VudCB0byBjb3ZlciBmYWRlV2lkdGhcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFBlcmNlbnQgPSB0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIGEgcGVyY2VudFxuICAgICAgICAgICAgICAgIGZvciAobGV0IHBlcmNlbnQgPSAtZmFkZVdpZHRoOyBwZXJjZW50IDwgMSArIGZhZGVXaWR0aDsgcGVyY2VudCArPSBzdGVwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCBwZXJjZW50IHRvIGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gcGVyY2VudCAqIE1hdGguUEk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGNvb3JkaW5hdGVzIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MSA9IE1hdGguY29zKGFuZ2xlICsgbGVuICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTEgPSBNYXRoLnNpbihhbmdsZSArIGxlbiArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MiA9IE1hdGguY29zKGFuZ2xlICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTIgPSBNYXRoLnNpbihhbmdsZSArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGFscGhhIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbHBoYSA9IChhZGp1c3RlZFBlcmNlbnQgLSBwZXJjZW50ICsgZmFkZVdpZHRoKSAvIGZhZGVXaWR0aDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBkcmF3IHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5tb3ZlVG8odGhpcy53aWR0aCAvIDIgLSAyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgxLCB5MSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh4MiwgeTIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8odGhpcy53aWR0aCAvIDIgKyAyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsJyArIGFscGhhICsgJyknO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtb3V0XCI6XG4gICAgICAgICAgICBjYXNlIFwicmFkaWFsLWluXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwZXJjZW50ID0gdGhpcy5jdXJJbWcuZmFkZVR5cGUgPT09IFwicmFkaWFsLWluXCIgPyAoMSAtIHRoaXMucGVyY2VudCkgOiB0aGlzLnBlcmNlbnRcbiAgICAgICAgICAgICAgICBjb25zdCB3aWR0aCA9IDEwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRTdGF0ZSA9IDAuMDFcbiAgICAgICAgICAgICAgICBjb25zdCBpbm5lclJhZGl1cyA9IChwZXJjZW50KSAqIHRoaXMuaGVpZ2h0IC0gd2lkdGggPCAwID8gZW5kU3RhdGUgOiAocGVyY2VudCkgKiB0aGlzLmhlaWdodCAtIHdpZHRoO1xuICAgICAgICAgICAgICAgIGNvbnN0IG91dGVyUmFkaXVzID0gcGVyY2VudCAqIHRoaXMuaGVpZ2h0ICsgd2lkdGhcbiAgICAgICAgICAgICAgICAvKmlmICh0aGlzLmN1ckltZy5mYWRlVHlwZSA9PT0gXCJyYWRpYWwtaW5cIil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUudGFibGUoe1wicGVyY2VudFwiOiBwZXJjZW50LFwiaW5uZXJSYWRpdXNcIjogaW5uZXJSYWRpdXMsIFwib3V0ZXJSYWRpdXNcIjogb3V0ZXJSYWRpdXMgfSlcbiAgICAgICAgICAgICAgICB9Ki9cblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyAyLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAvIDIsIGlubmVyUmFkaXVzLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoIC8gMixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgLyAyLCBvdXRlclJhZGl1cyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VySW1nLmZhZGVUeXBlID09PSBcInJhZGlhbC1pblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gdGhpcy5ueHRJbWcuY29udGFpbiA/IFwic291cmNlLWF0b3BcIiA6IFwic291cmNlLWluXCI7XG4gICAgICAgIHRoaXMuX2RyYXcodGhpcy5ueHRJbWcsIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LCB0aGlzLl9iYWNrQ29udGV4dClcblxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5yZXN0b3JlKCk7XG5cblxuICAgICAgICBpZiAoZWxhcHNlZCA8IHRoaXMuY3VySW1nLmZhZGVEdXJhdGlvbilcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZWRyYXcpO1xuICAgICAgICBlbHNlIGlmICh0aGlzLm1vZGUgPT09IE1vZGUuQVVUTylcbiAgICAgICAgICAgIGlmICh0aGlzLmxvb3AgfHwgdGhpcy5jdXJyZW50SWR4IDwgdGhpcy5pbWFnZUFycmF5Lmxlbmd0aCAtIDEpXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0RmFkZVRpbWVyID0gc2V0VGltZW91dCh0aGlzLm5leHRGYWRlLCB0aGlzLmN1ckltZy5mYWRlRGVsYXkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2RyYXcoaTogSW1hZ2VPYmplY3QsIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBvdGhlckN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgICAgIGlmIChpLmNvbnRhaW4pIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhc1dpZHRoTWlkZGxlID0gY3R4LmNhbnZhcy53aWR0aCAvIDI7XG4gICAgICAgICAgICBjb25zdCBjYW52YXNIZWlnaHRNaWRkbGUgPSBjdHguY2FudmFzLmhlaWdodCAvIDI7XG4gICAgICAgICAgICBjb25zdCBnID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUsIDAsIGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUsIE1hdGgubWF4KGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUpKVxuICAgICAgICAgICAgZy5hZGRDb2xvclN0b3AoMCwgXCIjNWNiOGY4XCIpXG4gICAgICAgICAgICBnLmFkZENvbG9yU3RvcCgxLCBcIiM0NjQ4NDhcIilcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBnO1xuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuXG5cbiAgICAgICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgICAgICBvZmZzZXRYLFxuICAgICAgICAgICAgICAgIG9mZnNldFksXG4gICAgICAgICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgICAgICB9ID0gY29udGFpbih0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgaS5pbWcud2lkdGgsIGkuaW1nLmhlaWdodCwgaS5zY2FsZSlcblxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpLmltZywgb2Zmc2V0WCwgb2Zmc2V0WSwgd2lkdGgsIGhlaWdodClcblxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYXNwZWN0ID4gaS5hc3BlY3QpIHtcblxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpLmltZyxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICh0aGlzLmhlaWdodCAtIHRoaXMud2lkdGggLyBpLmFzcGVjdCkgLyAyLFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIGkuYXNwZWN0KTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpLmltZyxcbiAgICAgICAgICAgICAgICAodGhpcy53aWR0aCAtIHRoaXMuaGVpZ2h0ICogaS5hc3BlY3QpIC8gMixcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICogaS5hc3BlY3QsXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2l6ZSgpIHtcblxuICAgICAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDsgLy8gRFM6IGZpeCBmb3IgaU9TIDkgYnVnXG4gICAgICAgIHRoaXMuYXNwZWN0ID0gdGhpcy53aWR0aCAvIHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0LmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5kcmF3SW1hZ2UoKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBkcmF3SW1hZ2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1ckltZykge1xuICAgICAgICAgICAgdGhpcy5fZHJhdyh0aGlzLmN1ckltZywgdGhpcy5fYmFja0NvbnRleHQsIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJubyBpbWFnZSBcIiArIHRoaXMuY3VycmVudElkeCArIFwiIFwiICsgdGhpcy5pbWFnZUFycmF5Lmxlbmd0aClcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudElkeCA9IC0xXG4gICAgICAgIHRoaXMubmV4dEZhZGUoKTtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLm5leHRGYWRlVGltZXIgJiYgY2xlYXJUaW1lb3V0KHRoaXMubmV4dEZhZGVUaW1lcilcbiAgICB9XG5cbiAgICBuZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5tb2RlICE9PSBNb2RlLk1VTFRJX1NFQ1RJT04pXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIlRoaXMgc3d3aXBlIG9wZXJhdGVzIGluIEFVVE8gbW9kZVwiKVxuICAgICAgICB0aGlzLm5leHRGYWRlKClcbiAgICB9XG5cblxuICAgIGdldCBudW1iZXJPZkZhZGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZUFycmF5Lmxlbmd0aFxuICAgIH1cbn1cblxuY2xhc3MgU1dXaXBlU3RhdGljIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGltZzogSFRNTEltYWdlRWxlbWVudDtcblxuICAgIHdpZHRoOiBudW1iZXIgPSB3aW5kb3cuaW5uZXJXaWR0aDtcdFx0XHRcdC8vIHdpZHRoIG9mIGNvbnRhaW5lciAoYmFubmVyKVxuICAgIGhlaWdodDogbnVtYmVyID0gd2luZG93LmlubmVySGVpZ2h0O1x0XHRcdFx0Ly8gaGVpZ2h0IG9mIGNvbnRhaW5lclxuXG4gICAgc2NhbGU6IG51bWJlcjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9jYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgYmFubmVyOiBIVE1MRWxlbWVudCwgcmVhZG9ubHkgb3duZXI6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGltYWdlcyA9IEFycmF5LmZyb20odGhpcy5iYW5uZXIucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKSk7XG4gICAgICAgIGlmIChpbWFnZXMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIldhcyBleHBlY3RpbmcgYSBzaW5nbGUgaW1nIGZvciBzdGF0aWMtYmFubmVyXCIpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbWcgPSBpbWFnZXNbMF1cblxuICAgICAgICB0aGlzLmJhbm5lci5hcHBlbmRDaGlsZCh0aGlzLl9jYW52YXMpO1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5fY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgICAgICBpZiAoY29udGV4dCA9PT0gbnVsbCkgdGhyb3cgRXJyb3IoXCIyZCBjb250ZXh0IG5vdCBzdXBwb3J0ZWRcIilcbiAgICAgICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMuX2NvbnRleHQuaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2VcbiAgICAgICAgdGhpcy5fY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcInNvdXJjZS1vdmVyXCI7XG4gICAgICAgIHRoaXMuaW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHRoaXMuZHJhdygpKVxuICAgICAgICB0aGlzLnNjYWxlID0gdGhpcy5pbWcgLmhhc0F0dHJpYnV0ZShcImRhdGEtc2NhbGVcIikgPyBOdW1iZXIodGhpcy5pbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1zY2FsZVwiKSkgOiAxO1xuICAgICAgICB0aGlzLmRyYXcoKTtcbiAgICAgICAvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemUpO1xuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cbiAgICBkcmF3KCkge1xuXG5cbiAgICAgICAgY29uc3QgY2FudmFzV2lkdGhNaWRkbGUgPSB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCAvIDI7XG4gICAgICAgIGNvbnN0IGNhbnZhc0hlaWdodE1pZGRsZSA9IHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCAvIDI7XG4gICAgICAgIGNvbnN0IGcgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUsIDAsIGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUsIE1hdGgubWF4KGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUpKVxuICAgICAgICBnLmFkZENvbG9yU3RvcCgwLCBcIiM1Y2I4ZjhcIilcbiAgICAgICAgZy5hZGRDb2xvclN0b3AoMSwgXCIjNDY0ODQ4XCIpXG4gICAgICAgIHRoaXMuX2NvbnRleHQuc2F2ZSgpO1xuICAgICAgICB0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IGc7XG4gICAgICAgIHRoaXMuX2NvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy5fY29udGV4dC5jYW52YXMud2lkdGgsIHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodClcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgb2Zmc2V0WCxcbiAgICAgICAgICAgIG9mZnNldFksXG4gICAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICAgIGhlaWdodFxuICAgICAgICB9ID0gY29udGFpbih0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgdGhpcy5pbWcud2lkdGgsIHRoaXMuaW1nLmhlaWdodCwgdGhpcy5zY2FsZSlcblxuICAgICAgICB0aGlzLl9jb250ZXh0LmRyYXdJbWFnZSh0aGlzLmltZywgb2Zmc2V0WCwgb2Zmc2V0WSwgd2lkdGgsIGhlaWdodClcblxuXG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2l6ZSgpIHtcblxuICAgICAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDsgLy8gRFM6IGZpeCBmb3IgaU9TIDkgYnVnXG5cbiAgICAgICAgdGhpcy5fY29udGV4dC5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuXG4gICAgICAgIHRoaXMuZHJhdygpO1xuICAgIH07XG5cblxufVxuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi5iYW5uZXJcIikuZm9yRWFjaChiID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGU6IE1vZGUgPSBiLmhhc0F0dHJpYnV0ZShcImRhdGEtbXVsdGktc3dpcGVcIikgPyBNb2RlLk1VTFRJX1NFQ1RJT04gOiBNb2RlLkFVVE9cbiAgICAgICAgICAgIGNvbnN0IG5vTG9vcDogYm9vbGVhbiA9IGIuaGFzQXR0cmlidXRlKFwiZGF0YS1uby1sb29wXCIpXG4gICAgICAgICAgICBjb25zdCBvd25lciA9IGIuY2xvc2VzdChcInNlY3Rpb25cIilcbiAgICAgICAgICAgIGlmICghb3duZXIpIHRocm93IEVycm9yKFwiYmFubmVyIGVsZW1lbnQgbm90IHBhcnQgb2YgYSBzZWN0aW9uXCIpXG4gICAgICAgICAgICBjb25zdCB3aXBlID0gbmV3IFNXV2lwZShiLCBvd25lciwgbW9kZSwgIW5vTG9vcCk7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBiLnNzd2lwZSA9IHdpcGU7XG4gICAgICAgIH0pXG5cbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoXCJzbGlkZWNoYW5nZWRcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByZXZCYW5uZXIgPSBlLnByZXZpb3VzU2xpZGU/LnF1ZXJ5U2VsZWN0b3IoXCIuYmFubmVyXCIpO1xuICAgICAgICAgICAgaWYgKHByZXZCYW5uZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB3aXBlID0gcHJldkJhbm5lci5zc3dpcGUgYXMgU1dXaXBlO1xuICAgICAgICAgICAgICAgIGlmICh3aXBlLm1vZGUgPT09IE1vZGUuQVVUTylcbiAgICAgICAgICAgICAgICAgICAgd2lwZS5zdG9wKCk7XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG93bmVySW5kZXg6IHsgaDogbnVtYmVyOyB2OiBudW1iZXI7IH0gPSBSZXZlYWwuZ2V0SW5kaWNlcyh3aXBlLm93bmVyKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50SW5kZXg6IHsgaDogbnVtYmVyOyB2OiBudW1iZXI7IH0gPSBSZXZlYWwuZ2V0SW5kaWNlcyhlLmN1cnJlbnRTbGlkZSlcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBlLmN1cnJlbnRTbGlkZS5pbmRleFYgP1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4LnYgLSAob3duZXJJbmRleC52IHx8IDApIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleC5oIC0gb3duZXJJbmRleC5oXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRpc3RhbmNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlID4gMCAmJiBkaXN0YW5jZSA8IHdpcGUubnVtYmVyT2ZGYWRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5jdXJyZW50U2xpZGUuYXBwZW5kQ2hpbGQod2lwZS5iYW5uZXIpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aXBlLnN0b3AoKVxuICAgICAgICAgICAgICAgICAgICAgICAgd2lwZS5vd25lci5hcHBlbmRDaGlsZCh3aXBlLmJhbm5lcilcbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXh0QmFubmVyID0gZS5jdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvcihcIi5iYW5uZXJcIik7XG4gICAgICAgICAgICBpZiAobmV4dEJhbm5lcikge1xuICAgICAgICAgICAgICAgIGxldCBzc3dpcGUgPSBuZXh0QmFubmVyLnNzd2lwZSBhcyBTV1dpcGU7XG4gICAgICAgICAgICAgICAgaWYgKHNzd2lwZS5tb2RlID09PSBNb2RlLkFVVE8gfHwgc3N3aXBlLm93bmVyID09PSBlLmN1cnJlbnRTbGlkZSlcbiAgICAgICAgICAgICAgICAgICAgc3N3aXBlLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBzc3dpcGUubmV4dCgpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuc3RhdGljLWJhbm5lclwiKS5mb3JFYWNoKGIgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3duZXIgPSBiLmNsb3Nlc3QoXCJzZWN0aW9uXCIpXG4gICAgICAgICAgICBpZiAoIW93bmVyKSB0aHJvdyBFcnJvcihcImJhbm5lciBlbGVtZW50IG5vdCBwYXJ0IG9mIGEgc2VjdGlvblwiKVxuICAgICAgICAgICAgY29uc3Qgc3RhdGljV2lwZSA9IG5ldyBTV1dpcGVTdGF0aWMoYiwgb3duZXIpXG4gICAgICAgICAgICBzdGF0aWNXaXBlLnN0YXJ0KClcblxuICAgICAgICB9KVxuICAgIH0pXG5cblxufSkoKVxuXG4vLyBgY2xvc2VzdGAgUG9seWZpbGwgZm9yIElFXG5cbmlmICghRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzID0gRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yO1xufVxuXG5pZiAoIUVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIGxldCBlbCA9IHRoaXM7XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgaWYgKEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMuY2FsbChlbCwgcykpIHJldHVybiBlbDtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudCB8fCBlbC5wYXJlbnROb2RlO1xuICAgICAgICB9IHdoaWxlIChlbCAhPT0gbnVsbCAmJiBlbC5ub2RlVHlwZSA9PT0gMSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG59XG5cblxuXG5jb25zdCBjb250YWluID0gKGNhbnZhc1dpZHRoOiBudW1iZXIsIGNhbnZhc0hFaWdodDogbnVtYmVyLCBpbWdXaWR0aDogbnVtYmVyLCBpbWdIZWlnaHQ6IG51bWJlciwgc2NhbGU6IG51bWJlciA9IDEsb2Zmc2V0WCA9IDAuNSwgb2Zmc2V0WSA9IDAuNSkgPT4ge1xuICAgIGNvbnN0IGNoaWxkUmF0aW8gPSBpbWdXaWR0aCAvIGltZ0hlaWdodFxuICAgIGNvbnN0IHBhcmVudFJhdGlvID0gY2FudmFzV2lkdGggLyBjYW52YXNIRWlnaHRcbiAgICBsZXQgd2lkdGggPSBjYW52YXNXaWR0aCAqIHNjYWxlXG4gICAgbGV0IGhlaWdodCA9IGNhbnZhc0hFaWdodCAqIHNjYWxlXG5cbiAgICBpZiAoY2hpbGRSYXRpbyA+IHBhcmVudFJhdGlvKSB7XG4gICAgICAgIGhlaWdodCA9IHdpZHRoIC8gY2hpbGRSYXRpb1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHdpZHRoID0gaGVpZ2h0ICogY2hpbGRSYXRpb1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICAgIG9mZnNldFg6IChjYW52YXNXaWR0aCAtIHdpZHRoKSAqIG9mZnNldFgsXG4gICAgICAgIG9mZnNldFk6IChjYW52YXNIRWlnaHQgLSBoZWlnaHQpICogb2Zmc2V0WVxuICAgIH1cbn07XG5cblxuIl19