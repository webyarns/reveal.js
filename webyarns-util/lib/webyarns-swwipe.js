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

        var _contain = contain(this.width, this.height, i.img.width, i.img.height),
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

var SWWipeStatic =
/*#__PURE__*/
function () {
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

      var _contain2 = contain(this.width, this.height, this.img.width, this.img.height),
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
  var offsetX = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.5;
  var offsetY = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.5;
  var childRatio = imgWidth / imgHeight;
  var parentRatio = canvasWidth / canvasHEight;
  var width = canvasWidth;
  var height = canvasHEight;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy1zd3dpcGUudHMiXSwibmFtZXMiOlsiTW9kZSIsIlNXV2lwZSIsImltYWdlQXJyYXkiLCJjdXJyZW50SWR4IiwibGVuZ3RoIiwiYmFubmVyIiwib3duZXIiLCJtb2RlIiwiQVVUTyIsImxvb3AiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJ3aWR0aCIsImhlaWdodCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIkRhdGUiLCJkcmF3SW1hZ2UiLCJfZm9yZWdyb3VuZENvbnRleHQiLCJjbGVhclJlY3QiLCJwZXJjZW50IiwiY3VySW1nIiwiZmFkZVdpZHRoIiwic3RhcnRUaW1lIiwicmVkcmF3IiwiY3VycmVudFRpbWUiLCJlbGFwc2VkIiwiZ2V0VGltZSIsInN0YXJ0UGVyY2VudGFnZSIsImZhZGVEdXJhdGlvbiIsInNhdmUiLCJmYWRlVHlwZSIsImdyYWRpZW50IiwiY3JlYXRlTGluZWFyR3JhZGllbnQiLCJhZGRDb2xvclN0b3AiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsInNlZ21lbnRzIiwibGVuIiwiTWF0aCIsIlBJIiwic3RlcCIsImFkanVzdGVkUGVyY2VudCIsInByY3QiLCJhbmdsZSIsIngxIiwiY29zIiwieTEiLCJzaW4iLCJ4MiIsInkyIiwiYWxwaGEiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJmaWxsIiwiZW5kU3RhdGUiLCJpbm5lclJhZGl1cyIsIm91dGVyUmFkaXVzIiwiY3JlYXRlUmFkaWFsR3JhZGllbnQiLCJnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24iLCJueHRJbWciLCJjb250YWluIiwiX2RyYXciLCJfYmFja0NvbnRleHQiLCJyZXN0b3JlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibmV4dEZhZGVUaW1lciIsInNldFRpbWVvdXQiLCJuZXh0RmFkZSIsImZhZGVEZWxheSIsImltYWdlcyIsIkFycmF5IiwiZnJvbSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJtYXAiLCJpbWciLCJhc3BlY3QiLCJoYXNBdHRyaWJ1dGUiLCJOdW1iZXIiLCJnZXRBdHRyaWJ1dGUiLCJkaW1lbnNpb25zIiwiYXBwZW5kQ2hpbGQiLCJfYmFja0NhbnZhcyIsIl9mb3JlQ2FudmFzIiwiYmFja0NvbnRleHQiLCJnZXRDb250ZXh0IiwiZm9yZUNvbnRleHQiLCJFcnJvciIsImltYWdlU21vb3RoaW5nRW5hYmxlZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZXNpemUiLCJpIiwiY3R4Iiwib3RoZXJDdHgiLCJjYW52YXNXaWR0aE1pZGRsZSIsImNhbnZhcyIsImNhbnZhc0hlaWdodE1pZGRsZSIsImciLCJtYXgiLCJvZmZzZXRYIiwib2Zmc2V0WSIsImRvY3VtZW50RWxlbWVudCIsImNsaWVudEhlaWdodCIsImNsZWFyVGltZW91dCIsIk1VTFRJX1NFQ1RJT04iLCJTV1dpcGVTdGF0aWMiLCJfY2FudmFzIiwiY29udGV4dCIsIl9jb250ZXh0IiwiZHJhdyIsImZvckVhY2giLCJiIiwibm9Mb29wIiwiY2xvc2VzdCIsIndpcGUiLCJzc3dpcGUiLCJSZXZlYWwiLCJlIiwicHJldkJhbm5lciIsInByZXZpb3VzU2xpZGUiLCJxdWVyeVNlbGVjdG9yIiwic3RvcCIsIm93bmVySW5kZXgiLCJnZXRJbmRpY2VzIiwiY3VycmVudEluZGV4IiwiY3VycmVudFNsaWRlIiwiZGlzdGFuY2UiLCJpbmRleFYiLCJ2IiwiaCIsImNvbnNvbGUiLCJsb2ciLCJudW1iZXJPZkZhZGVzIiwibmV4dEJhbm5lciIsInN0YXJ0IiwibmV4dCIsInN0YXRpY1dpcGUiLCJFbGVtZW50IiwicHJvdG90eXBlIiwibWF0Y2hlcyIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwid2Via2l0TWF0Y2hlc1NlbGVjdG9yIiwicyIsImVsIiwiY2FsbCIsInBhcmVudEVsZW1lbnQiLCJwYXJlbnROb2RlIiwibm9kZVR5cGUiLCJjYW52YXNXaWR0aCIsImNhbnZhc0hFaWdodCIsImltZ1dpZHRoIiwiaW1nSGVpZ2h0IiwiY2hpbGRSYXRpbyIs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TSxFQUFOQSxNQUZHO0FBR0h1RixJQUFBQSxPQUFPLEVBQUUsQ0FBQ2lELFdBQVcsR0FBR3pJLEtBQWYsSUFBd0J3RixPQUg5QjtBQUlIQyxJQUFBQSxPQUFPLEVBQUUsQ0FBQ2lELFlBQVksR0FBR3pJLE1BQWhCLElBQTBCd0Y7QUFKaEMsR0FBUDtBQU1ILENBbEJEIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZlU2VpZG1hbi9TdGFyV2Fyc1dpcGVcblxuXHRUbyBEb1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Rml4IGRpYWdvbmFsIHdpcGVcblx0Zml4IHJhZGlhbCB3aXBlXG5cblxuV2VieWFybnMgdmVyc2lvbjpcbi0gQWRkZWQgXCJkZXN0cm95XCIgZmxhZyBhbmQgbWV0aG9kXG4tIEFkZGVkIHN1cHBvcnQgZm9yIGBkYXRhLXN0YXJ0QXRgIHRvIHNldCBzdGFydCBwZXJjZW50YWdlXG4tIG9uIGRlc3Ryb3kgcmVtb3ZlIGNyZWF0ZWQgZWxlbWVudHNcbiovXG5cbmVudW0gTW9kZSB7XG4gICAgQVVUTywgTVVMVElfU0VDVElPTlxufVxuXG5pbnRlcmZhY2UgSW1hZ2VPYmplY3Qge1xuICAgIHN0YXJ0UGVyY2VudGFnZTogbnVtYmVyO1xuICAgIGZhZGVXaWR0aDogbnVtYmVyO1xuICAgIGZhZGVUeXBlOiBzdHJpbmcgfCBudWxsO1xuICAgIGZhZGVEZWxheTogbnVtYmVyO1xuICAgIGZhZGVEdXJhdGlvbjogbnVtYmVyO1xuICAgIGFzcGVjdDogbnVtYmVyO1xuICAgIGltZzogSFRNTEltYWdlRWxlbWVudDtcbiAgICBjb250YWluOiBib29sZWFuO1xuICAgIGRpbWVuc2lvbnM6IHsgXCJ3aWR0aFwiOiBudW1iZXIsIFwiaGVpZ2h0XCI6IG51bWJlciB9XG59XG5cbmNsYXNzIFNXV2lwZSB7XG5cbiAgICBjdXJyZW50SWR4ID0gLTE7XG4gICAgd2lkdGg6IG51bWJlciA9IHdpbmRvdy5pbm5lcldpZHRoO1x0XHRcdFx0Ly8gd2lkdGggb2YgY29udGFpbmVyIChiYW5uZXIpXG4gICAgaGVpZ2h0OiBudW1iZXIgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHRcdFx0XHQvLyBoZWlnaHQgb2YgY29udGFpbmVyXG4gICAgYXNwZWN0OiBudW1iZXIgPSB0aGlzLndpZHRoIC8gdGhpcy5oZWlnaHQ7XHRcdFx0XHQvLyBhc3BlY3QgcmF0aW8gb2YgY29udGFpbmVyXG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IGltYWdlQXJyYXk6IEltYWdlT2JqZWN0W107XG4gICAgcHJpdmF0ZSByZWFkb25seSBfYmFja0NhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9mb3JlQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2JhY2tDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfZm9yZWdyb3VuZENvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIHByaXZhdGUgcGVyY2VudDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIHN0YXJ0VGltZTogRGF0ZSA9IG5ldyBEYXRlO1xuICAgIHByaXZhdGUgbmV4dEZhZGVUaW1lcjogTm9kZUpTLlRpbWVvdXQgfCBudWxsID0gbnVsbDtcblxuXG4gICAgcHJpdmF0ZSBnZXQgY3VySW1nKCk6IEltYWdlT2JqZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VBcnJheVt0aGlzLmN1cnJlbnRJZHhdO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IG54dEltZygpOiBJbWFnZU9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLmltYWdlQXJyYXlbKHRoaXMuY3VycmVudElkeCArIDEpICUgdGhpcy5pbWFnZUFycmF5Lmxlbmd0aF07XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgYmFubmVyOiBIVE1MRWxlbWVudCwgcmVhZG9ubHkgb3duZXI6IEhUTUxFbGVtZW50LCByZWFkb25seSBtb2RlOiBNb2RlID0gTW9kZS5BVVRPLCByZWFkb25seSBsb29wID0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBpbWFnZXMgPSBBcnJheS5mcm9tKHRoaXMuYmFubmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIikpO1xuICAgICAgICB0aGlzLmltYWdlQXJyYXkgPSBpbWFnZXMubWFwKGltZyA9PiB7XG4gICAgICAgICAgICBjb25zdCBhc3BlY3QgPSBpbWcud2lkdGggLyBpbWcuaGVpZ2h0O1xuICAgICAgICAgICAgY29uc3QgZmFkZUR1cmF0aW9uID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZUR1cmF0aW9uXCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZhZGVEdXJhdGlvblwiKSkgKiAxMDAwIDogMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVEZWxheSA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZhZGVEZWxheVwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlRGVsYXlcIikpICogMTAwMCA6IDEwMDA7XG4gICAgICAgICAgICBjb25zdCBmYWRlVHlwZSA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZhZGVUeXBlXCIpID8gaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtZmFkZVR5cGVcIikgOiBcImNyb3NzLWxyXCI7XG4gICAgICAgICAgICBjb25zdCBmYWRlV2lkdGggPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1mYWRlV2lkdGhcIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtZmFkZVdpZHRoXCIpKSA6IC4xO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRQZXJjZW50YWdlID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtc3RhcnRBdFwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdGFydEF0XCIpKSA6IDA7XG4gICAgICAgICAgICBjb25zdCBjb250YWluID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtY29udGFpblwiKTtcblxuICAgICAgICAgICAgY29uc3QgZGltZW5zaW9ucyA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogaW1nLndpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogaW1nLmhlaWdodCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaW1nLFxuICAgICAgICAgICAgICAgIGFzcGVjdCxcbiAgICAgICAgICAgICAgICBmYWRlRHVyYXRpb24sXG4gICAgICAgICAgICAgICAgZmFkZURlbGF5LFxuICAgICAgICAgICAgICAgIGZhZGVUeXBlLFxuICAgICAgICAgICAgICAgIGZhZGVXaWR0aCxcbiAgICAgICAgICAgICAgICBzdGFydFBlcmNlbnRhZ2UsXG4gICAgICAgICAgICAgICAgY29udGFpbixcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5iYW5uZXIuYXBwZW5kQ2hpbGQodGhpcy5fYmFja0NhbnZhcyk7XG4gICAgICAgIHRoaXMuYmFubmVyLmFwcGVuZENoaWxkKHRoaXMuX2ZvcmVDYW52YXMpO1xuICAgICAgICBjb25zdCBiYWNrQ29udGV4dCA9IHRoaXMuX2JhY2tDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgICAgIGNvbnN0IGZvcmVDb250ZXh0ID0gdGhpcy5fZm9yZUNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIGlmIChiYWNrQ29udGV4dCA9PT0gbnVsbCB8fCBmb3JlQ29udGV4dCA9PT0gbnVsbCkgdGhyb3cgRXJyb3IoXCIyZCBjb250ZXh0IG5vdCBzdXBwb3J0ZWRcIilcbiAgICAgICAgdGhpcy5fYmFja0NvbnRleHQgPSBiYWNrQ29udGV4dDtcbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQgPSBmb3JlQ29udGV4dDtcbiAgICAgICAgdGhpcy5fYmFja0NvbnRleHQuaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbmV4dEZhZGUgPSAoKSA9PiB7XG4gICAgICAgIC8vIGFkdmFuY2UgaW5kaWNlc1xuICAgICAgICB0aGlzLmN1cnJlbnRJZHggPSArK3RoaXMuY3VycmVudElkeCAlIHRoaXMuaW1hZ2VBcnJheS5sZW5ndGg7XG4gICAgICAgIHRoaXMuZHJhd0ltYWdlKCk7XG5cbiAgICAgICAgLy8gY2xlYXIgdGhlIGZvcmVncm91bmRcbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAvLyBzZXR1cCBhbmQgc3RhcnQgdGhlIGZhZGVcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gLXRoaXMuY3VySW1nLmZhZGVXaWR0aDtcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZTtcbiAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZHJhdyA9ICgpID0+IHtcbiAgICAgICAgLy8gY2FsY3VsYXRlIHBlcmNlbnQgY29tcGxldGlvbiBvZiB3aXBlXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gbmV3IERhdGU7XG4gICAgICAgIGNvbnN0IGVsYXBzZWQgPSBjdXJyZW50VGltZS5nZXRUaW1lKCkgLSB0aGlzLnN0YXJ0VGltZS5nZXRUaW1lKCk7XG4gICAgICAgIHRoaXMucGVyY2VudCA9IHRoaXMuY3VySW1nLnN0YXJ0UGVyY2VudGFnZSArIGVsYXBzZWQgLyB0aGlzLmN1ckltZy5mYWRlRHVyYXRpb247XG5cblxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5zYXZlKCk7XG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgIGNvbnN0IGZhZGVXaWR0aCA9IHRoaXMuY3VySW1nLmZhZGVXaWR0aFxuXG4gICAgICAgIHN3aXRjaCAodGhpcy5jdXJJbWcuZmFkZVR5cGUpIHtcblxuICAgICAgICAgICAgY2FzZSBcImNyb3NzLWxyXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDAsXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImNyb3NzLXJsXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDAsXG4gICAgICAgICAgICAgICAgICAgICgoMSAtIHRoaXMucGVyY2VudCkgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImNyb3NzLXVkXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAwLCAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIDAsICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImNyb3NzLWR1XCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAwLCAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIDAsICgoMSAtIHRoaXMucGVyY2VudCkgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImRpYWdvbmFsLXRsLWJyXCI6IHsvLyBEUzogVGhpcyBkaWFnb25hbCBub3Qgd29ya2luZyBwcm9wZXJseVxuXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgyICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDIgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIGZhZGVXaWR0aCAqICh0aGlzLndpZHRoIC8gKHRoaXMuaGVpZ2h0IC8gMikpICogdGhpcy53aWR0aCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwiZGlhZ29uYWwtdHItYmxcIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoICsgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcInJhZGlhbC1idG1cIjoge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudHMgPSAzMDA7IC8vIHRoZSBhbW91bnQgb2Ygc2VnbWVudHMgdG8gc3BsaXQgdGhlIHNlbWkgY2lyY2xlIGludG8sIERTOiBhZGp1c3QgdGhpcyBmb3IgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgICAgICBjb25zdCBsZW4gPSBNYXRoLlBJIC8gc2VnbWVudHM7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RlcCA9IDEgLyBzZWdtZW50cztcblxuICAgICAgICAgICAgICAgIC8vIGV4cGFuZCBwZXJjZW50IHRvIGNvdmVyIGZhZGVXaWR0aFxuICAgICAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkUGVyY2VudCA9IHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aDtcblxuICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGUgYSBwZXJjZW50XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcHJjdCA9IC1mYWRlV2lkdGg7IHByY3QgPCAxICsgZmFkZVdpZHRoOyBwcmN0ICs9IHN0ZXApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IHBlcmNlbnQgdG8gYW5nbGVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBwcmN0ICogTWF0aC5QSTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgY29vcmRpbmF0ZXMgZm9yIHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHgxID0gTWF0aC5jb3MoYW5nbGUgKyBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHkxID0gTWF0aC5zaW4oYW5nbGUgKyBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHgyID0gTWF0aC5jb3MoYW5nbGUgKyBsZW4gKyBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHkyID0gTWF0aC5zaW4oYW5nbGUgKyBsZW4gKyBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGFscGhhIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbHBoYSA9IChhZGp1c3RlZFBlcmNlbnQgLSBwcmN0ICsgZmFkZVdpZHRoKSAvIGZhZGVXaWR0aDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBkcmF3IHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5tb3ZlVG8odGhpcy53aWR0aCAvIDIgLSAyLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh4MSwgeTEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8oeDIsIHkyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHRoaXMud2lkdGggLyAyICsgMiwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwnICsgYWxwaGEgKyAnKSc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGwoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcInJhZGlhbC10b3BcIjoge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudHMgPSAzMDA7IC8vIHRoZSBhbW91bnQgb2Ygc2VnbWVudHMgdG8gc3BsaXQgdGhlIHNlbWkgY2lyY2xlIGludG8sIERTOiBhZGp1c3QgdGhpcyBmb3IgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgICAgICBjb25zdCBsZW4gPSBNYXRoLlBJIC8gc2VnbWVudHM7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RlcCA9IDEgLyBzZWdtZW50cztcblxuICAgICAgICAgICAgICAgIC8vIGV4cGFuZCBwZXJjZW50IHRvIGNvdmVyIGZhZGVXaWR0aFxuICAgICAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkUGVyY2VudCA9IHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aDtcblxuICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGUgYSBwZXJjZW50XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcGVyY2VudCA9IC1mYWRlV2lkdGg7IHBlcmNlbnQgPCAxICsgZmFkZVdpZHRoOyBwZXJjZW50ICs9IHN0ZXApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IHBlcmNlbnQgdG8gYW5nbGVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBwZXJjZW50ICogTWF0aC5QSTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgY29vcmRpbmF0ZXMgZm9yIHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHgxID0gTWF0aC5jb3MoYW5nbGUgKyBsZW4gKyAyICogTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MSA9IE1hdGguc2luKGFuZ2xlICsgbGVuICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHgyID0gTWF0aC5jb3MoYW5nbGUgKyAyICogTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MiA9IE1hdGguc2luKGFuZ2xlICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMik7XG5cblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgYWxwaGEgZm9yIHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFscGhhID0gKGFkanVzdGVkUGVyY2VudCAtIHBlcmNlbnQgKyBmYWRlV2lkdGgpIC8gZmFkZVdpZHRoO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGRyYXcgd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0Lm1vdmVUbyh0aGlzLndpZHRoIC8gMiAtIDIsIDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8oeDEsIHkxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgyLCB5Mik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh0aGlzLndpZHRoIC8gMiArIDIsIDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwnICsgYWxwaGEgKyAnKSc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGwoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcInJhZGlhbC1vdXRcIjpcbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtaW5cIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBlcmNlbnQgPSB0aGlzLmN1ckltZy5mYWRlVHlwZSA9PT0gXCJyYWRpYWwtaW5cIiA/ICgxIC0gdGhpcy5wZXJjZW50KSA6IHRoaXMucGVyY2VudFxuICAgICAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gMTAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZFN0YXRlID0gMC4wMVxuICAgICAgICAgICAgICAgIGNvbnN0IGlubmVyUmFkaXVzID0gKHBlcmNlbnQpICogdGhpcy5oZWlnaHQgLSB3aWR0aCA8IDAgPyBlbmRTdGF0ZSA6IChwZXJjZW50KSAqIHRoaXMuaGVpZ2h0IC0gd2lkdGg7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0ZXJSYWRpdXMgPSBwZXJjZW50ICogdGhpcy5oZWlnaHQgKyB3aWR0aFxuICAgICAgICAgICAgICAgIC8qaWYgKHRoaXMuY3VySW1nLmZhZGVUeXBlID09PSBcInJhZGlhbC1pblwiKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS50YWJsZSh7XCJwZXJjZW50XCI6IHBlcmNlbnQsXCJpbm5lclJhZGl1c1wiOiBpbm5lclJhZGl1cywgXCJvdXRlclJhZGl1c1wiOiBvdXRlclJhZGl1cyB9KVxuICAgICAgICAgICAgICAgIH0qL1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIDIsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0IC8gMiwgaW5uZXJSYWRpdXMsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyAyLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAvIDIsIG91dGVyUmFkaXVzKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJJbWcuZmFkZVR5cGUgPT09IFwicmFkaWFsLWluXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICB9XG5cblxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSB0aGlzLm54dEltZy5jb250YWluID8gXCJzb3VyY2UtYXRvcFwiIDogXCJzb3VyY2UtaW5cIjtcbiAgICAgICAgdGhpcy5fZHJhdyh0aGlzLm54dEltZywgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQsIHRoaXMuX2JhY2tDb250ZXh0KVxuXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LnJlc3RvcmUoKTtcblxuXG4gICAgICAgIGlmIChlbGFwc2VkIDwgdGhpcy5jdXJJbWcuZmFkZUR1cmF0aW9uKVxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlZHJhdyk7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMubW9kZSA9PT0gTW9kZS5BVVRPKVxuICAgICAgICAgICAgaWYgKHRoaXMubG9vcCB8fCB0aGlzLmN1cnJlbnRJZHggPCB0aGlzLmltYWdlQXJyYXkubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRGYWRlVGltZXIgPSBzZXRUaW1lb3V0KHRoaXMubmV4dEZhZGUsIHRoaXMuY3VySW1nLmZhZGVEZWxheSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZHJhdyhpOiBJbWFnZU9iamVjdCwgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG90aGVyQ3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICAgICAgaWYgKGkuY29udGFpbikge1xuICAgICAgICAgICAgY29uc3QgY2FudmFzV2lkdGhNaWRkbGUgPSBjdHguY2FudmFzLndpZHRoIC8gMjtcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhc0hlaWdodE1pZGRsZSA9IGN0eC5jYW52YXMuaGVpZ2h0IC8gMjtcbiAgICAgICAgICAgIGNvbnN0IGcgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoY2FudmFzV2lkdGhNaWRkbGUsIGNhbnZhc0hlaWdodE1pZGRsZSwgMCwgY2FudmFzV2lkdGhNaWRkbGUsIGNhbnZhc0hlaWdodE1pZGRsZSwgTWF0aC5tYXgoY2FudmFzV2lkdGhNaWRkbGUsIGNhbnZhc0hlaWdodE1pZGRsZSkpXG4gICAgICAgICAgICBnLmFkZENvbG9yU3RvcCgwLCBcIiM1Y2I4ZjhcIilcbiAgICAgICAgICAgIGcuYWRkQ29sb3JTdG9wKDEsIFwiIzQ2NDg0OFwiKVxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGc7XG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG5cblxuICAgICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgICAgIG9mZnNldFgsXG4gICAgICAgICAgICAgICAgb2Zmc2V0WSxcbiAgICAgICAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHRcbiAgICAgICAgICAgIH0gPSBjb250YWluKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCBpLmltZy53aWR0aCwgaS5pbWcuaGVpZ2h0KVxuXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKGkuaW1nLCBvZmZzZXRYLCBvZmZzZXRZLCB3aWR0aCwgaGVpZ2h0KVxuXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hc3BlY3QgPiBpLmFzcGVjdCkge1xuXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKGkuaW1nLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgKHRoaXMuaGVpZ2h0IC0gdGhpcy53aWR0aCAvIGkuYXNwZWN0KSAvIDIsXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoIC8gaS5hc3BlY3QpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKGkuaW1nLFxuICAgICAgICAgICAgICAgICh0aGlzLndpZHRoIC0gdGhpcy5oZWlnaHQgKiBpLmFzcGVjdCkgLyAyLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgKiBpLmFzcGVjdCxcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByaXZhdGUgcmVzaXplKCkge1xuXG4gICAgICAgIHRoaXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyAvLyBEUzogZml4IGZvciBpT1MgOSBidWdcbiAgICAgICAgdGhpcy5hc3BlY3QgPSB0aGlzLndpZHRoIC8gdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5fYmFja0NvbnRleHQuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5fYmFja0NvbnRleHQuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuICAgICAgICB0aGlzLmRyYXdJbWFnZSgpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGRyYXdJbWFnZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VySW1nKSB7XG4gICAgICAgICAgICB0aGlzLl9kcmF3KHRoaXMuY3VySW1nLCB0aGlzLl9iYWNrQ29udGV4dCwgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIm5vIGltYWdlIFwiICsgdGhpcy5jdXJyZW50SWR4ICsgXCIgXCIgKyB0aGlzLmltYWdlQXJyYXkubGVuZ3RoKVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50SWR4ID0gLTFcbiAgICAgICAgdGhpcy5uZXh0RmFkZSgpO1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMubmV4dEZhZGVUaW1lciAmJiBjbGVhclRpbWVvdXQodGhpcy5uZXh0RmFkZVRpbWVyKVxuICAgIH1cblxuICAgIG5leHQoKSB7XG4gICAgICAgIGlmICh0aGlzLm1vZGUgIT09IE1vZGUuTVVMVElfU0VDVElPTilcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiVGhpcyBzd3dpcGUgb3BlcmF0ZXMgaW4gQVVUTyBtb2RlXCIpXG4gICAgICAgIHRoaXMubmV4dEZhZGUoKVxuICAgIH1cblxuXG4gICAgZ2V0IG51bWJlck9mRmFkZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmltYWdlQXJyYXkubGVuZ3RoXG4gICAgfVxufVxuXG5jbGFzcyBTV1dpcGVTdGF0aWMge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xuXG4gICAgd2lkdGg6IG51bWJlciA9IHdpbmRvdy5pbm5lcldpZHRoO1x0XHRcdFx0Ly8gd2lkdGggb2YgY29udGFpbmVyIChiYW5uZXIpXG4gICAgaGVpZ2h0OiBudW1iZXIgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHRcdFx0XHQvLyBoZWlnaHQgb2YgY29udGFpbmVyXG5cblxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2NhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9jb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBiYW5uZXI6IEhUTUxFbGVtZW50LCByZWFkb25seSBvd25lcjogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgaW1hZ2VzID0gQXJyYXkuZnJvbSh0aGlzLmJhbm5lci5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpKTtcbiAgICAgICAgaWYgKGltYWdlcy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiV2FzIGV4cGVjdGluZyBhIHNpbmdsZSBpbWcgZm9yIHN0YXRpYy1iYW5uZXJcIilcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmltZyA9IGltYWdlc1swXVxuXG4gICAgICAgIHRoaXMuYmFubmVyLmFwcGVuZENoaWxkKHRoaXMuX2NhbnZhcyk7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLl9jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgICAgIGlmIChjb250ZXh0ID09PSBudWxsKSB0aHJvdyBFcnJvcihcIjJkIGNvbnRleHQgbm90IHN1cHBvcnRlZFwiKVxuICAgICAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5fY29udGV4dC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZVxuICAgICAgICB0aGlzLl9jb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwic291cmNlLW92ZXJcIjtcbiAgICAgICAgdGhpcy5pbWcuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4gdGhpcy5kcmF3KCkpXG4gICAgICAgIHRoaXMuZHJhdygpO1xuICAgICAgIC8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZSk7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgfVxuICAgIGRyYXcoKSB7XG5cblxuICAgICAgICBjb25zdCBjYW52YXNXaWR0aE1pZGRsZSA9IHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoIC8gMjtcbiAgICAgICAgY29uc3QgY2FudmFzSGVpZ2h0TWlkZGxlID0gdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0IC8gMjtcbiAgICAgICAgY29uc3QgZyA9IHRoaXMuX2NvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQoY2FudmFzV2lkdGhNaWRkbGUsIGNhbnZhc0hlaWdodE1pZGRsZSwgMCwgY2FudmFzV2lkdGhNaWRkbGUsIGNhbnZhc0hlaWdodE1pZGRsZSwgTWF0aC5tYXgoY2FudmFzV2lkdGhNaWRkbGUsIGNhbnZhc0hlaWdodE1pZGRsZSkpXG4gICAgICAgIGcuYWRkQ29sb3JTdG9wKDAsIFwiIzVjYjhmOFwiKVxuICAgICAgICBnLmFkZENvbG9yU3RvcCgxLCBcIiM0NjQ4NDhcIilcbiAgICAgICAgdGhpcy5fY29udGV4dC5zYXZlKCk7XG4gICAgICAgIHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gZztcbiAgICAgICAgdGhpcy5fY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCwgdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0KVxuXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIG9mZnNldFgsXG4gICAgICAgICAgICBvZmZzZXRZLFxuICAgICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgICBoZWlnaHRcbiAgICAgICAgfSA9IGNvbnRhaW4odGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIHRoaXMuaW1nLndpZHRoLCB0aGlzLmltZy5oZWlnaHQpXG5cbiAgICAgICAgdGhpcy5fY29udGV4dC5kcmF3SW1hZ2UodGhpcy5pbWcsIG9mZnNldFgsIG9mZnNldFksIHdpZHRoLCBoZWlnaHQpXG5cblxuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNpemUoKSB7XG5cbiAgICAgICAgdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7IC8vIERTOiBmaXggZm9yIGlPUyA5IGJ1Z1xuXG4gICAgICAgIHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cblxuICAgICAgICB0aGlzLmRyYXcoKTtcbiAgICB9O1xuXG5cbn1cblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuYmFubmVyXCIpLmZvckVhY2goYiA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlOiBNb2RlID0gYi5oYXNBdHRyaWJ1dGUoXCJkYXRhLW11bHRpLXN3aXBlXCIpID8gTW9kZS5NVUxUSV9TRUNUSU9OIDogTW9kZS5BVVRPXG4gICAgICAgICAgICBjb25zdCBub0xvb3A6IGJvb2xlYW4gPSBiLmhhc0F0dHJpYnV0ZShcImRhdGEtbm8tbG9vcFwiKVxuICAgICAgICAgICAgY29uc3Qgb3duZXIgPSBiLmNsb3Nlc3QoXCJzZWN0aW9uXCIpXG4gICAgICAgICAgICBpZiAoIW93bmVyKSB0aHJvdyBFcnJvcihcImJhbm5lciBlbGVtZW50IG5vdCBwYXJ0IG9mIGEgc2VjdGlvblwiKVxuICAgICAgICAgICAgY29uc3Qgd2lwZSA9IG5ldyBTV1dpcGUoYiwgb3duZXIsIG1vZGUsICFub0xvb3ApO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgYi5zc3dpcGUgPSB3aXBlO1xuICAgICAgICB9KVxuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKFwic2xpZGVjaGFuZ2VkXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcmV2QmFubmVyID0gZS5wcmV2aW91c1NsaWRlPy5xdWVyeVNlbGVjdG9yKFwiLmJhbm5lclwiKTtcbiAgICAgICAgICAgIGlmIChwcmV2QmFubmVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2lwZSA9IHByZXZCYW5uZXIuc3N3aXBlIGFzIFNXV2lwZTtcbiAgICAgICAgICAgICAgICBpZiAod2lwZS5tb2RlID09PSBNb2RlLkFVVE8pXG4gICAgICAgICAgICAgICAgICAgIHdpcGUuc3RvcCgpO1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvd25lckluZGV4OiB7IGg6IG51bWJlcjsgdjogbnVtYmVyOyB9ID0gUmV2ZWFsLmdldEluZGljZXMod2lwZS5vd25lcilcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEluZGV4OiB7IGg6IG51bWJlcjsgdjogbnVtYmVyOyB9ID0gUmV2ZWFsLmdldEluZGljZXMoZS5jdXJyZW50U2xpZGUpXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gZS5jdXJyZW50U2xpZGUuaW5kZXhWID9cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleC52IC0gKG93bmVySW5kZXgudiB8fCAwKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXguaCAtIG93bmVySW5kZXguaFxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkaXN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA+IDAgJiYgZGlzdGFuY2UgPCB3aXBlLm51bWJlck9mRmFkZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY3VycmVudFNsaWRlLmFwcGVuZENoaWxkKHdpcGUuYmFubmVyKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lwZS5zdG9wKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpcGUub3duZXIuYXBwZW5kQ2hpbGQod2lwZS5iYW5uZXIpXG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV4dEJhbm5lciA9IGUuY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3IoXCIuYmFubmVyXCIpO1xuICAgICAgICAgICAgaWYgKG5leHRCYW5uZXIpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3N3aXBlID0gbmV4dEJhbm5lci5zc3dpcGUgYXMgU1dXaXBlO1xuICAgICAgICAgICAgICAgIGlmIChzc3dpcGUubW9kZSA9PT0gTW9kZS5BVVRPIHx8IHNzd2lwZS5vd25lciA9PT0gZS5jdXJyZW50U2xpZGUpXG4gICAgICAgICAgICAgICAgICAgIHNzd2lwZS5zdGFydCgpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgc3N3aXBlLm5leHQoKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLnN0YXRpYy1iYW5uZXJcIikuZm9yRWFjaChiID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG93bmVyID0gYi5jbG9zZXN0KFwic2VjdGlvblwiKVxuICAgICAgICAgICAgaWYgKCFvd25lcikgdGhyb3cgRXJyb3IoXCJiYW5uZXIgZWxlbWVudCBub3QgcGFydCBvZiBhIHNlY3Rpb25cIilcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpY1dpcGUgPSBuZXcgU1dXaXBlU3RhdGljKGIsIG93bmVyKVxuICAgICAgICAgICAgc3RhdGljV2lwZS5zdGFydCgpXG5cbiAgICAgICAgfSlcbiAgICB9KVxuXG5cbn0pKClcblxuLy8gYGNsb3Nlc3RgIFBvbHlmaWxsIGZvciBJRVxuXG5pZiAoIUVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcyA9IEVsZW1lbnQucHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3Rvcjtcbn1cblxuaWYgKCFFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0KSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIEVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QgPSBmdW5jdGlvbiAocykge1xuICAgICAgICBsZXQgZWwgPSB0aGlzO1xuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGlmIChFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzLmNhbGwoZWwsIHMpKSByZXR1cm4gZWw7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQgfHwgZWwucGFyZW50Tm9kZTtcbiAgICAgICAgfSB3aGlsZSAoZWwgIT09IG51bGwgJiYgZWwubm9kZVR5cGUgPT09IDEpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xufVxuXG5cblxuY29uc3QgY29udGFpbiA9IChjYW52YXNXaWR0aDogbnVtYmVyLCBjYW52YXNIRWlnaHQ6IG51bWJlciwgaW1nV2lkdGg6IG51bWJlciwgaW1nSGVpZ2h0OiBudW1iZXIsIG9mZnNldFggPSAwLjUsIG9mZnNldFkgPSAwLjUpID0+IHtcbiAgICBjb25zdCBjaGlsZFJhdGlvID0gaW1nV2lkdGggLyBpbWdIZWlnaHRcbiAgICBjb25zdCBwYXJlbnRSYXRpbyA9IGNhbnZhc1dpZHRoIC8gY2FudmFzSEVpZ2h0XG4gICAgbGV0IHdpZHRoID0gY2FudmFzV2lkdGhcbiAgICBsZXQgaGVpZ2h0ID0gY2FudmFzSEVpZ2h0XG5cbiAgICBpZiAoY2hpbGRSYXRpbyA+IHBhcmVudFJhdGlvKSB7XG4gICAgICAgIGhlaWdodCA9IHdpZHRoIC8gY2hpbGRSYXRpb1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHdpZHRoID0gaGVpZ2h0ICogY2hpbGRSYXRpb1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICAgIG9mZnNldFg6IChjYW52YXNXaWR0aCAtIHdpZHRoKSAqIG9mZnNldFgsXG4gICAgICAgIG9mZnNldFk6IChjYW52YXNIRWlnaHQgLSBoZWlnaHQpICogb2Zmc2V0WVxuICAgIH1cbn07XG5cblxuIl19