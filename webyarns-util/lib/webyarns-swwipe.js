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

      _this._foregroundContext.globalCompositeOperation = _this.nxtImg.proportional ? "source-atop" : "source-in";

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
      var proportional = img.hasAttribute("data-proportional");
      var heightScale = img.hasAttribute("data-proportional-height") ? Number(img.getAttribute("data-proportional-height")) : 1;
      var widthScale = img.hasAttribute("data-proportional-width") ? Number(img.getAttribute("data-proportional-width")) : 1;
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
        proportional: proportional,
        widthScale: widthScale,
        heightScale: heightScale,
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
      if (i.proportional) {
        var canvasWidthMiddle = ctx.canvas.width / 2;
        var canvasHeightMiddle = ctx.canvas.height / 2;
        var g = ctx.createRadialGradient(canvasWidthMiddle, canvasHeightMiddle, 0, canvasWidthMiddle, canvasHeightMiddle, Math.max(canvasWidthMiddle, canvasHeightMiddle));
        g.addColorStop(0, "#5cb8f8");
        g.addColorStop(1, "#464848");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, this.width, this.height);
        var hr = .98;
        var wr = .333;
        var h = this.height * i.heightScale;
        var w = this.width * i.widthScale;
        var r = 1;
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

    _defineProperty(this, "heightScale", void 0);

    _defineProperty(this, "widthScale", void 0);

    _defineProperty(this, "width", window.innerWidth);

    _defineProperty(this, "height", window.innerHeight);

    _defineProperty(this, "_canvas", document.createElement('canvas'));

    _defineProperty(this, "_context", void 0);

    var images = Array.from(this.banner.querySelectorAll("img"));

    if (images.length !== 1) {
      throw Error("Was expecting a single img for static-banner");
    }

    this.img = images[0];
    this.heightScale = images[0].hasAttribute("data-proportional-height") ? Number(this.img.getAttribute("data-proportional-height")) : 1;
    this.widthScale = images[0].hasAttribute("data-proportional-width") ? Number(this.img.getAttribute("data-proportional-width")) : 1;
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

      var h = this.height * this.heightScale;
      var w = this.width * this.widthScale;

      this._context.restore();

      this._context.drawImage(this.img, this.width / 2 - w / 2, this.height / 2 - h / 2, w, h);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy1zd3dpcGUudHMiXSwibmFtZXMiOlsiTW9kZSIsIlNXV2lwZSIsImltYWdlQXJyYXkiLCJjdXJyZW50SWR4IiwibGVuZ3RoIiwiYmFubmVyIiwib3duZXIiLCJtb2RlIiwiQVVUTyIsImxvb3AiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJ3aWR0aCIsImhlaWdodCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIkRhdGUiLCJkcmF3SW1hZ2UiLCJfZm9yZWdyb3VuZENvbnRleHQiLCJjbGVhclJlY3QiLCJwZXJjZW50IiwiY3VySW1nIiwiZmFkZVdpZHRoIiwic3RhcnRUaW1lIiwicmVkcmF3IiwiY3VycmVudFRpbWUiLCJlbGFwc2VkIiwiZ2V0VGltZSIsInN0YXJ0UGVyY2VudGFnZSIsImZhZGVEdXJhdGlvbiIsInNhdmUiLCJmYWRlVHlwZSIsImdyYWRpZW50IiwiY3JlYXRlTGluZWFyR3JhZGllbnQiLCJhZGRDb2xvclN0b3AiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsInNlZ21lbnRzIiwibGVuIiwiTWF0aCIsIlBJIiwic3RlcCIsImFkanVzdGVkUGVyY2VudCIsInByY3QiLCJhbmdsZSIsIngxIiwiY29zIiwieTEiLCJzaW4iLCJ4MiIsInkyIiwiYWxwaGEiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJmaWxsIiwiZW5kU3RhdGUiLCJpbm5lclJhZGl1cyIsIm91dGVyUmFkaXVzIiwiY3JlYXRlUmFkaWFsR3JhZGllbnQiLCJnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24iLCJueHRJbWciLCJwcm9wb3J0aW9uYWwiLCJfZHJhdyIsIl9iYWNrQ29udGV4dCIsInJlc3RvcmUiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJuZXh0RmFkZVRpbWVyIiwic2V0VGltZW91dCIsIm5leHRGYWRlIiwiZmFkZURlbGF5IiwiaW1hZ2VzIiwiQXJyYXkiLCJmcm9tIiwicXVlcnlTZWxlY3RvckFsbCIsIm1hcCIsImltZyIsImFzcGVjdCIsImhhc0F0dHJpYnV0ZSIsIk51bWJlciIsImdldEF0dHJpYnV0ZSIsImhlaWdodFNjYWxlIiwid2lkdGhTY2FsZSIsImRpbWVuc2lvbnMiLCJhcHBlbmRDaGlsZCIsIl9iYWNrQ2FudmFzIiwiX2ZvcmVDYW52YXMiLCJiYWNrQ29udGV4dCIsImdldENvbnRleHQiLCJmb3JlQ29udGV4dCIsIkVycm9yIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlc2l6ZSIsImkiLCJjdHgiLCJvdGhlckN0eCIsImNhbnZhc1dpZHRoTWlkZGxlIiwiY2FudmFzIiwiY2FudmFzSGVpZ2h0TWlkZGxlIiwiZyIsIm1heCIsImhyIiwid3IiLCJoIiwidyIsInIiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRIZWlnaHQiLCJjbGVhclRpbWVvdXQiLCJNVUxUSV9TRUNUSU9OIiwiU1dXaXBlU3RhdGljIiwiX2NhbnZhcyIsImNvbnRleHQiLCJfY29udGV4dCIsImltYWdlU21vb3RoaW5nRW5hYmxlZCIsImRyYXciLCJmb3JFYWNoIiwiYiIsIm5vTG9vcCIsImNsb3Nlc3QiLCJ3aXBlIiwic3N3aXBlIiwiUmV2ZWFsIiwiZSIsInByZXZCYW5uZXIiLCJwcmV2aW91c1NsaWRlIiwicXVlcnlTZWxlY3RvciIsInN0b3AiLCJvd25lckluZGV4IiwiZ2V0SW5kaWNlcyIsImN1cnJlbnRJbmRleCIsImN1cnJlbnRTbGlkZSIsImRpc3RhbmNlIiwiaW5kZXhWIiwidiIsImNvbnNvbGUiLCJsb2ciLCJudW1iZXJPZkZhZGVzIiwibmV4dEJhbm5lciIsInN0YXJ0IiwibmV4dCIsInN0YXRpY1dpcGUiLCJFbGVtZW50IiwicHJvdG90eXBlIiwibWF0Y2hlcyIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwid2Via2l0TWF0Y2hlc1NlbGVjdG9yIiwicyIsImVsIiwiY2FsbCIsInBhcmVudEVsZW1lbnQiLCJwYXJlbnROb2RlIiwibm9kZVR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7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U2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZlU2VpZG1hbi9TdGFyV2Fyc1dpcGVcblxuXHRUbyBEb1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Rml4IGRpYWdvbmFsIHdpcGVcblx0Zml4IHJhZGlhbCB3aXBlXG5cblxuV2VieWFybnMgdmVyc2lvbjpcbi0gQWRkZWQgXCJkZXN0cm95XCIgZmxhZyBhbmQgbWV0aG9kXG4tIEFkZGVkIHN1cHBvcnQgZm9yIGBkYXRhLXN0YXJ0QXRgIHRvIHNldCBzdGFydCBwZXJjZW50YWdlXG4tIG9uIGRlc3Ryb3kgcmVtb3ZlIGNyZWF0ZWQgZWxlbWVudHNcbiovXG5cbmVudW0gTW9kZSB7XG4gICAgQVVUTywgTVVMVElfU0VDVElPTlxufVxuXG5pbnRlcmZhY2UgSW1hZ2VPYmplY3Qge1xuICAgIHN0YXJ0UGVyY2VudGFnZTogbnVtYmVyO1xuICAgIGZhZGVXaWR0aDogbnVtYmVyO1xuICAgIGZhZGVUeXBlOiBzdHJpbmcgfCBudWxsO1xuICAgIGZhZGVEZWxheTogbnVtYmVyO1xuICAgIGZhZGVEdXJhdGlvbjogbnVtYmVyO1xuICAgIGFzcGVjdDogbnVtYmVyO1xuICAgIGltZzogSFRNTEltYWdlRWxlbWVudDtcbiAgICBwcm9wb3J0aW9uYWw6IGJvb2xlYW47XG4gICAgd2lkdGhTY2FsZTogbnVtYmVyO1xuICAgIGhlaWdodFNjYWxlOiBudW1iZXI7XG4gICAgZGltZW5zaW9uczogeyBcIndpZHRoXCI6IG51bWJlciwgXCJoZWlnaHRcIjogbnVtYmVyIH1cbn1cblxuY2xhc3MgU1dXaXBlIHtcblxuICAgIGN1cnJlbnRJZHggPSAtMTtcbiAgICB3aWR0aDogbnVtYmVyID0gd2luZG93LmlubmVyV2lkdGg7XHRcdFx0XHQvLyB3aWR0aCBvZiBjb250YWluZXIgKGJhbm5lcilcbiAgICBoZWlnaHQ6IG51bWJlciA9IHdpbmRvdy5pbm5lckhlaWdodDtcdFx0XHRcdC8vIGhlaWdodCBvZiBjb250YWluZXJcbiAgICBhc3BlY3Q6IG51bWJlciA9IHRoaXMud2lkdGggLyB0aGlzLmhlaWdodDtcdFx0XHRcdC8vIGFzcGVjdCByYXRpbyBvZiBjb250YWluZXJcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgaW1hZ2VBcnJheTogSW1hZ2VPYmplY3RbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9iYWNrQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZvcmVDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfYmFja0NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9mb3JlZ3JvdW5kQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgcHJpdmF0ZSBwZXJjZW50OiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgc3RhcnRUaW1lOiBEYXRlID0gbmV3IERhdGU7XG4gICAgcHJpdmF0ZSBuZXh0RmFkZVRpbWVyOiBOb2RlSlMuVGltZW91dCB8IG51bGwgPSBudWxsO1xuXG5cbiAgICBwcml2YXRlIGdldCBjdXJJbWcoKTogSW1hZ2VPYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZUFycmF5W3RoaXMuY3VycmVudElkeF07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgbnh0SW1nKCk6IEltYWdlT2JqZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VBcnJheVsodGhpcy5jdXJyZW50SWR4ICsgMSkgJSB0aGlzLmltYWdlQXJyYXkubGVuZ3RoXTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBiYW5uZXI6IEhUTUxFbGVtZW50LCByZWFkb25seSBvd25lcjogSFRNTEVsZW1lbnQsIHJlYWRvbmx5IG1vZGU6IE1vZGUgPSBNb2RlLkFVVE8sIHJlYWRvbmx5IGxvb3AgPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGltYWdlcyA9IEFycmF5LmZyb20odGhpcy5iYW5uZXIucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKSk7XG4gICAgICAgIHRoaXMuaW1hZ2VBcnJheSA9IGltYWdlcy5tYXAoaW1nID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFzcGVjdCA9IGltZy53aWR0aCAvIGltZy5oZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBmYWRlRHVyYXRpb24gPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1mYWRlRHVyYXRpb25cIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtZmFkZUR1cmF0aW9uXCIpKSAqIDEwMDAgOiAxMDAwO1xuICAgICAgICAgICAgY29uc3QgZmFkZURlbGF5ID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZURlbGF5XCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZhZGVEZWxheVwiKSkgKiAxMDAwIDogMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVUeXBlID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZVR5cGVcIikgPyBpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlVHlwZVwiKSA6IFwiY3Jvc3MtbHJcIjtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVXaWR0aCA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZhZGVXaWR0aFwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlV2lkdGhcIikpIDogLjE7XG4gICAgICAgICAgICBjb25zdCBzdGFydFBlcmNlbnRhZ2UgPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1zdGFydEF0XCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0YXJ0QXRcIikpIDogMDtcbiAgICAgICAgICAgIGNvbnN0IHByb3BvcnRpb25hbCA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLXByb3BvcnRpb25hbFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGhlaWdodFNjYWxlID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtcHJvcG9ydGlvbmFsLWhlaWdodFwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1wcm9wb3J0aW9uYWwtaGVpZ2h0XCIpKSA6IDE7XG4gICAgICAgICAgICBjb25zdCB3aWR0aFNjYWxlID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtcHJvcG9ydGlvbmFsLXdpZHRoXCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXByb3BvcnRpb25hbC13aWR0aFwiKSkgOiAxO1xuXG4gICAgICAgICAgICBjb25zdCBkaW1lbnNpb25zID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiBpbWcud2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBpbWcuaGVpZ2h0LFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgYXNwZWN0LFxuICAgICAgICAgICAgICAgIGZhZGVEdXJhdGlvbixcbiAgICAgICAgICAgICAgICBmYWRlRGVsYXksXG4gICAgICAgICAgICAgICAgZmFkZVR5cGUsXG4gICAgICAgICAgICAgICAgZmFkZVdpZHRoLFxuICAgICAgICAgICAgICAgIHN0YXJ0UGVyY2VudGFnZSxcbiAgICAgICAgICAgICAgICBwcm9wb3J0aW9uYWwsXG4gICAgICAgICAgICAgICAgd2lkdGhTY2FsZSxcbiAgICAgICAgICAgICAgICBoZWlnaHRTY2FsZSxcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5iYW5uZXIuYXBwZW5kQ2hpbGQodGhpcy5fYmFja0NhbnZhcyk7XG4gICAgICAgIHRoaXMuYmFubmVyLmFwcGVuZENoaWxkKHRoaXMuX2ZvcmVDYW52YXMpO1xuICAgICAgICBjb25zdCBiYWNrQ29udGV4dCA9IHRoaXMuX2JhY2tDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgICAgIGNvbnN0IGZvcmVDb250ZXh0ID0gdGhpcy5fZm9yZUNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIGlmIChiYWNrQ29udGV4dCA9PT0gbnVsbCB8fCBmb3JlQ29udGV4dCA9PT0gbnVsbCkgdGhyb3cgRXJyb3IoXCIyZCBjb250ZXh0IG5vdCBzdXBwb3J0ZWRcIilcbiAgICAgICAgdGhpcy5fYmFja0NvbnRleHQgPSBiYWNrQ29udGV4dDtcbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQgPSBmb3JlQ29udGV4dDtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbmV4dEZhZGUgPSAoKSA9PiB7XG4gICAgICAgIC8vIGFkdmFuY2UgaW5kaWNlc1xuICAgICAgICB0aGlzLmN1cnJlbnRJZHggPSArK3RoaXMuY3VycmVudElkeCAlIHRoaXMuaW1hZ2VBcnJheS5sZW5ndGg7XG4gICAgICAgIHRoaXMuZHJhd0ltYWdlKCk7XG5cbiAgICAgICAgLy8gY2xlYXIgdGhlIGZvcmVncm91bmRcbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAvLyBzZXR1cCBhbmQgc3RhcnQgdGhlIGZhZGVcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gLXRoaXMuY3VySW1nLmZhZGVXaWR0aDtcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZTtcbiAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZHJhdyA9ICgpID0+IHtcbiAgICAgICAgLy8gY2FsY3VsYXRlIHBlcmNlbnQgY29tcGxldGlvbiBvZiB3aXBlXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gbmV3IERhdGU7XG4gICAgICAgIGNvbnN0IGVsYXBzZWQgPSBjdXJyZW50VGltZS5nZXRUaW1lKCkgLSB0aGlzLnN0YXJ0VGltZS5nZXRUaW1lKCk7XG4gICAgICAgIHRoaXMucGVyY2VudCA9IHRoaXMuY3VySW1nLnN0YXJ0UGVyY2VudGFnZSArIGVsYXBzZWQgLyB0aGlzLmN1ckltZy5mYWRlRHVyYXRpb247XG5cblxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5zYXZlKCk7XG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgIGNvbnN0IGZhZGVXaWR0aCA9IHRoaXMuY3VySW1nLmZhZGVXaWR0aFxuXG4gICAgICAgIHN3aXRjaCAodGhpcy5jdXJJbWcuZmFkZVR5cGUpIHtcblxuICAgICAgICAgICAgY2FzZSBcImNyb3NzLWxyXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDAsXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImNyb3NzLXJsXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDAsXG4gICAgICAgICAgICAgICAgICAgICgoMSAtIHRoaXMucGVyY2VudCkgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImNyb3NzLXVkXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAwLCAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIDAsICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImNyb3NzLWR1XCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAwLCAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIDAsICgoMSAtIHRoaXMucGVyY2VudCkgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImRpYWdvbmFsLXRsLWJyXCI6IHsvLyBEUzogVGhpcyBkaWFnb25hbCBub3Qgd29ya2luZyBwcm9wZXJseVxuXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgyICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDIgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIGZhZGVXaWR0aCAqICh0aGlzLndpZHRoIC8gKHRoaXMuaGVpZ2h0IC8gMikpICogdGhpcy53aWR0aCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwiZGlhZ29uYWwtdHItYmxcIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoICsgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcInJhZGlhbC1idG1cIjoge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudHMgPSAzMDA7IC8vIHRoZSBhbW91bnQgb2Ygc2VnbWVudHMgdG8gc3BsaXQgdGhlIHNlbWkgY2lyY2xlIGludG8sIERTOiBhZGp1c3QgdGhpcyBmb3IgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgICAgICBjb25zdCBsZW4gPSBNYXRoLlBJIC8gc2VnbWVudHM7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RlcCA9IDEgLyBzZWdtZW50cztcblxuICAgICAgICAgICAgICAgIC8vIGV4cGFuZCBwZXJjZW50IHRvIGNvdmVyIGZhZGVXaWR0aFxuICAgICAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkUGVyY2VudCA9IHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aDtcblxuICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGUgYSBwZXJjZW50XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcHJjdCA9IC1mYWRlV2lkdGg7IHByY3QgPCAxICsgZmFkZVdpZHRoOyBwcmN0ICs9IHN0ZXApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IHBlcmNlbnQgdG8gYW5nbGVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBwcmN0ICogTWF0aC5QSTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgY29vcmRpbmF0ZXMgZm9yIHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHgxID0gTWF0aC5jb3MoYW5nbGUgKyBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHkxID0gTWF0aC5zaW4oYW5nbGUgKyBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHgyID0gTWF0aC5jb3MoYW5nbGUgKyBsZW4gKyBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHkyID0gTWF0aC5zaW4oYW5nbGUgKyBsZW4gKyBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGFscGhhIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbHBoYSA9IChhZGp1c3RlZFBlcmNlbnQgLSBwcmN0ICsgZmFkZVdpZHRoKSAvIGZhZGVXaWR0aDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBkcmF3IHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5tb3ZlVG8odGhpcy53aWR0aCAvIDIgLSAyLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh4MSwgeTEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8oeDIsIHkyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHRoaXMud2lkdGggLyAyICsgMiwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwnICsgYWxwaGEgKyAnKSc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGwoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcInJhZGlhbC10b3BcIjoge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudHMgPSAzMDA7IC8vIHRoZSBhbW91bnQgb2Ygc2VnbWVudHMgdG8gc3BsaXQgdGhlIHNlbWkgY2lyY2xlIGludG8sIERTOiBhZGp1c3QgdGhpcyBmb3IgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgICAgICBjb25zdCBsZW4gPSBNYXRoLlBJIC8gc2VnbWVudHM7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RlcCA9IDEgLyBzZWdtZW50cztcblxuICAgICAgICAgICAgICAgIC8vIGV4cGFuZCBwZXJjZW50IHRvIGNvdmVyIGZhZGVXaWR0aFxuICAgICAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkUGVyY2VudCA9IHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aDtcblxuICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGUgYSBwZXJjZW50XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcGVyY2VudCA9IC1mYWRlV2lkdGg7IHBlcmNlbnQgPCAxICsgZmFkZVdpZHRoOyBwZXJjZW50ICs9IHN0ZXApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IHBlcmNlbnQgdG8gYW5nbGVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBwZXJjZW50ICogTWF0aC5QSTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgY29vcmRpbmF0ZXMgZm9yIHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHgxID0gTWF0aC5jb3MoYW5nbGUgKyBsZW4gKyAyICogTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MSA9IE1hdGguc2luKGFuZ2xlICsgbGVuICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHgyID0gTWF0aC5jb3MoYW5nbGUgKyAyICogTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MiA9IE1hdGguc2luKGFuZ2xlICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMik7XG5cblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgYWxwaGEgZm9yIHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFscGhhID0gKGFkanVzdGVkUGVyY2VudCAtIHBlcmNlbnQgKyBmYWRlV2lkdGgpIC8gZmFkZVdpZHRoO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGRyYXcgd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0Lm1vdmVUbyh0aGlzLndpZHRoIC8gMiAtIDIsIDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8oeDEsIHkxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgyLCB5Mik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh0aGlzLndpZHRoIC8gMiArIDIsIDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwnICsgYWxwaGEgKyAnKSc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGwoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcInJhZGlhbC1vdXRcIjpcbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtaW5cIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBlcmNlbnQgPSB0aGlzLmN1ckltZy5mYWRlVHlwZSA9PT0gXCJyYWRpYWwtaW5cIiA/ICgxIC0gdGhpcy5wZXJjZW50KSA6IHRoaXMucGVyY2VudFxuICAgICAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gMTAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZFN0YXRlID0gMC4wMVxuICAgICAgICAgICAgICAgIGNvbnN0IGlubmVyUmFkaXVzID0gKHBlcmNlbnQpICogdGhpcy5oZWlnaHQgLSB3aWR0aCA8IDAgPyBlbmRTdGF0ZSA6IChwZXJjZW50KSAqIHRoaXMuaGVpZ2h0IC0gd2lkdGg7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0ZXJSYWRpdXMgPSBwZXJjZW50ICogdGhpcy5oZWlnaHQgKyB3aWR0aFxuICAgICAgICAgICAgICAgIC8qaWYgKHRoaXMuY3VySW1nLmZhZGVUeXBlID09PSBcInJhZGlhbC1pblwiKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS50YWJsZSh7XCJwZXJjZW50XCI6IHBlcmNlbnQsXCJpbm5lclJhZGl1c1wiOiBpbm5lclJhZGl1cywgXCJvdXRlclJhZGl1c1wiOiBvdXRlclJhZGl1cyB9KVxuICAgICAgICAgICAgICAgIH0qL1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIDIsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0IC8gMiwgaW5uZXJSYWRpdXMsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyAyLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAvIDIsIG91dGVyUmFkaXVzKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJJbWcuZmFkZVR5cGUgPT09IFwicmFkaWFsLWluXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICB9XG5cblxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSB0aGlzLm54dEltZy5wcm9wb3J0aW9uYWwgPyBcInNvdXJjZS1hdG9wXCIgOiBcInNvdXJjZS1pblwiO1xuICAgICAgICB0aGlzLl9kcmF3KHRoaXMubnh0SW1nLCB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dCwgdGhpcy5fYmFja0NvbnRleHQpXG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQucmVzdG9yZSgpO1xuXG5cbiAgICAgICAgaWYgKGVsYXBzZWQgPCB0aGlzLmN1ckltZy5mYWRlRHVyYXRpb24pXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVkcmF3KTtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5tb2RlID09PSBNb2RlLkFVVE8pXG4gICAgICAgICAgICBpZiAodGhpcy5sb29wIHx8IHRoaXMuY3VycmVudElkeCA8IHRoaXMuaW1hZ2VBcnJheS5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICAgIHRoaXMubmV4dEZhZGVUaW1lciA9IHNldFRpbWVvdXQodGhpcy5uZXh0RmFkZSwgdGhpcy5jdXJJbWcuZmFkZURlbGF5KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9kcmF3KGk6IEltYWdlT2JqZWN0LCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgb3RoZXJDdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgICAgICBpZiAoaS5wcm9wb3J0aW9uYWwpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhc1dpZHRoTWlkZGxlID0gY3R4LmNhbnZhcy53aWR0aCAvIDI7XG4gICAgICAgICAgICBjb25zdCBjYW52YXNIZWlnaHRNaWRkbGUgPSBjdHguY2FudmFzLmhlaWdodCAvIDI7XG4gICAgICAgICAgICBjb25zdCBnID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUsIDAsIGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUsIE1hdGgubWF4KGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUpKVxuICAgICAgICAgICAgZy5hZGRDb2xvclN0b3AoMCwgXCIjNWNiOGY4XCIpXG4gICAgICAgICAgICBnLmFkZENvbG9yU3RvcCgxLCBcIiM0NjQ4NDhcIilcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBnO1xuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgY29uc3QgaHIgPSAuOTg7XG4gICAgICAgICAgICBjb25zdCB3ciA9IC4zMzM7XG4gICAgICAgICAgICBjb25zdCBoID0gdGhpcy5oZWlnaHQgKiBpLmhlaWdodFNjYWxlXG4gICAgICAgICAgICBjb25zdCB3ID0gdGhpcy53aWR0aCAqIGkud2lkdGhTY2FsZVxuICAgICAgICAgICAgY29uc3QgciA9IDFcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoXG4gICAgICAgICAgICAgICAgaS5pbWcsXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIDIgLSB3IC8gMixcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAvIDIgLSBoIC8gMixcbiAgICAgICAgICAgICAgICB3LCBoKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYXNwZWN0ID4gaS5hc3BlY3QpIHtcblxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpLmltZyxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICh0aGlzLmhlaWdodCAtIHRoaXMud2lkdGggLyBpLmFzcGVjdCkgLyAyLFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIGkuYXNwZWN0KTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpLmltZyxcbiAgICAgICAgICAgICAgICAodGhpcy53aWR0aCAtIHRoaXMuaGVpZ2h0ICogaS5hc3BlY3QpIC8gMixcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICogaS5hc3BlY3QsXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2l6ZSgpIHtcblxuICAgICAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDsgLy8gRFM6IGZpeCBmb3IgaU9TIDkgYnVnXG4gICAgICAgIHRoaXMuYXNwZWN0ID0gdGhpcy53aWR0aCAvIHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0LmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5kcmF3SW1hZ2UoKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBkcmF3SW1hZ2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1ckltZykge1xuICAgICAgICAgICAgdGhpcy5fZHJhdyh0aGlzLmN1ckltZywgdGhpcy5fYmFja0NvbnRleHQsIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJubyBpbWFnZSBcIiArIHRoaXMuY3VycmVudElkeCArIFwiIFwiICsgdGhpcy5pbWFnZUFycmF5Lmxlbmd0aClcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudElkeCA9IC0xXG4gICAgICAgIHRoaXMubmV4dEZhZGUoKTtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLm5leHRGYWRlVGltZXIgJiYgY2xlYXJUaW1lb3V0KHRoaXMubmV4dEZhZGVUaW1lcilcbiAgICB9XG5cbiAgICBuZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5tb2RlICE9PSBNb2RlLk1VTFRJX1NFQ1RJT04pXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIlRoaXMgc3d3aXBlIG9wZXJhdGVzIGluIEFVVE8gbW9kZVwiKVxuICAgICAgICB0aGlzLm5leHRGYWRlKClcbiAgICB9XG5cblxuICAgIGdldCBudW1iZXJPZkZhZGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZUFycmF5Lmxlbmd0aFxuICAgIH1cbn1cblxuY2xhc3MgU1dXaXBlU3RhdGljIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGltZzogSFRNTEltYWdlRWxlbWVudDtcbiAgICBwcml2YXRlIGhlaWdodFNjYWxlOiBudW1iZXI7XG4gICAgcHJpdmF0ZSB3aWR0aFNjYWxlOiBudW1iZXI7XG5cbiAgICB3aWR0aDogbnVtYmVyID0gd2luZG93LmlubmVyV2lkdGg7XHRcdFx0XHQvLyB3aWR0aCBvZiBjb250YWluZXIgKGJhbm5lcilcbiAgICBoZWlnaHQ6IG51bWJlciA9IHdpbmRvdy5pbm5lckhlaWdodDtcdFx0XHRcdC8vIGhlaWdodCBvZiBjb250YWluZXJcblxuXG4gICAgcHJpdmF0ZSByZWFkb25seSBfY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGJhbm5lcjogSFRNTEVsZW1lbnQsIHJlYWRvbmx5IG93bmVyOiBIVE1MRWxlbWVudCkge1xuICAgICAgICBjb25zdCBpbWFnZXMgPSBBcnJheS5mcm9tKHRoaXMuYmFubmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIikpO1xuICAgICAgICBpZiAoaW1hZ2VzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJXYXMgZXhwZWN0aW5nIGEgc2luZ2xlIGltZyBmb3Igc3RhdGljLWJhbm5lclwiKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW1nID0gaW1hZ2VzWzBdXG4gICAgICAgIHRoaXMuaGVpZ2h0U2NhbGUgPSBpbWFnZXNbMF0uaGFzQXR0cmlidXRlKFwiZGF0YS1wcm9wb3J0aW9uYWwtaGVpZ2h0XCIpID8gTnVtYmVyKHRoaXMuaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtcHJvcG9ydGlvbmFsLWhlaWdodFwiKSkgOiAxO1xuICAgICAgICB0aGlzLndpZHRoU2NhbGUgPSBpbWFnZXNbMF0uaGFzQXR0cmlidXRlKFwiZGF0YS1wcm9wb3J0aW9uYWwtd2lkdGhcIikgPyBOdW1iZXIodGhpcy5pbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1wcm9wb3J0aW9uYWwtd2lkdGhcIikpIDogMTtcblxuICAgICAgICB0aGlzLmJhbm5lci5hcHBlbmRDaGlsZCh0aGlzLl9jYW52YXMpO1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5fY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgICAgICBpZiAoY29udGV4dCA9PT0gbnVsbCkgdGhyb3cgRXJyb3IoXCIyZCBjb250ZXh0IG5vdCBzdXBwb3J0ZWRcIilcbiAgICAgICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMuX2NvbnRleHQuaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2VcbiAgICAgICAgdGhpcy5fY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcInNvdXJjZS1vdmVyXCI7XG4gICAgICAgIHRoaXMuaW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHRoaXMuZHJhdygpKVxuICAgICAgICB0aGlzLmRyYXcoKTtcbiAgICAgICAvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemUpO1xuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cbiAgICBkcmF3KCkge1xuXG5cbiAgICAgICAgY29uc3QgY2FudmFzV2lkdGhNaWRkbGUgPSB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCAvIDI7XG4gICAgICAgIGNvbnN0IGNhbnZhc0hlaWdodE1pZGRsZSA9IHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCAvIDI7XG4gICAgICAgIGNvbnN0IGcgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUsIDAsIGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUsIE1hdGgubWF4KGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUpKVxuICAgICAgICBnLmFkZENvbG9yU3RvcCgwLCBcIiM1Y2I4ZjhcIilcbiAgICAgICAgZy5hZGRDb2xvclN0b3AoMSwgXCIjNDY0ODQ4XCIpXG4gICAgICAgIHRoaXMuX2NvbnRleHQuc2F2ZSgpO1xuICAgICAgICB0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IGc7XG4gICAgICAgIHRoaXMuX2NvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy5fY29udGV4dC5jYW52YXMud2lkdGgsIHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodClcbiAgICAgICAgY29uc3QgaCA9IHRoaXMuaGVpZ2h0ICogdGhpcy5oZWlnaHRTY2FsZVxuICAgICAgICBjb25zdCB3ID0gdGhpcy53aWR0aCAqIHRoaXMud2lkdGhTY2FsZVxuICAgICAgICB0aGlzLl9jb250ZXh0LnJlc3RvcmUoKTtcbiAgICAgICAgdGhpcy5fY29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICAgICAgICB0aGlzLmltZyxcbiAgICAgICAgICAgIHRoaXMud2lkdGggLyAyIC0gdyAvIDIsXG4gICAgICAgICAgICB0aGlzLmhlaWdodCAvIDIgLSBoIC8gMixcbiAgICAgICAgICAgIHcsIGgpXG5cblxuICAgIH1cblxuICAgIHByaXZhdGUgcmVzaXplKCkge1xuXG4gICAgICAgIHRoaXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyAvLyBEUzogZml4IGZvciBpT1MgOSBidWdcblxuICAgICAgICB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG5cbiAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgfTtcblxuXG59XG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmJhbm5lclwiKS5mb3JFYWNoKGIgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZTogTW9kZSA9IGIuaGFzQXR0cmlidXRlKFwiZGF0YS1tdWx0aS1zd2lwZVwiKSA/IE1vZGUuTVVMVElfU0VDVElPTiA6IE1vZGUuQVVUT1xuICAgICAgICAgICAgY29uc3Qgbm9Mb29wOiBib29sZWFuID0gYi5oYXNBdHRyaWJ1dGUoXCJkYXRhLW5vLWxvb3BcIilcbiAgICAgICAgICAgIGNvbnN0IG93bmVyID0gYi5jbG9zZXN0KFwic2VjdGlvblwiKVxuICAgICAgICAgICAgaWYgKCFvd25lcikgdGhyb3cgRXJyb3IoXCJiYW5uZXIgZWxlbWVudCBub3QgcGFydCBvZiBhIHNlY3Rpb25cIilcbiAgICAgICAgICAgIGNvbnN0IHdpcGUgPSBuZXcgU1dXaXBlKGIsIG93bmVyLCBtb2RlLCAhbm9Mb29wKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGIuc3N3aXBlID0gd2lwZTtcbiAgICAgICAgfSlcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihcInNsaWRlY2hhbmdlZFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJldkJhbm5lciA9IGUucHJldmlvdXNTbGlkZT8ucXVlcnlTZWxlY3RvcihcIi5iYW5uZXJcIik7XG4gICAgICAgICAgICBpZiAocHJldkJhbm5lcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdpcGUgPSBwcmV2QmFubmVyLnNzd2lwZSBhcyBTV1dpcGU7XG4gICAgICAgICAgICAgICAgaWYgKHdpcGUubW9kZSA9PT0gTW9kZS5BVVRPKVxuICAgICAgICAgICAgICAgICAgICB3aXBlLnN0b3AoKTtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3duZXJJbmRleDogeyBoOiBudW1iZXI7IHY6IG51bWJlcjsgfSA9IFJldmVhbC5nZXRJbmRpY2VzKHdpcGUub3duZXIpXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleDogeyBoOiBudW1iZXI7IHY6IG51bWJlcjsgfSA9IFJldmVhbC5nZXRJbmRpY2VzKGUuY3VycmVudFNsaWRlKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IGUuY3VycmVudFNsaWRlLmluZGV4ViA/XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXgudiAtIChvd25lckluZGV4LnYgfHwgMCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4LmggLSBvd25lckluZGV4LmhcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPiAwICYmIGRpc3RhbmNlIDwgd2lwZS5udW1iZXJPZkZhZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLmN1cnJlbnRTbGlkZS5hcHBlbmRDaGlsZCh3aXBlLmJhbm5lcilcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpcGUuc3RvcCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB3aXBlLm93bmVyLmFwcGVuZENoaWxkKHdpcGUuYmFubmVyKVxuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5leHRCYW5uZXIgPSBlLmN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yKFwiLmJhbm5lclwiKTtcbiAgICAgICAgICAgIGlmIChuZXh0QmFubmVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNzd2lwZSA9IG5leHRCYW5uZXIuc3N3aXBlIGFzIFNXV2lwZTtcbiAgICAgICAgICAgICAgICBpZiAoc3N3aXBlLm1vZGUgPT09IE1vZGUuQVVUTyB8fCBzc3dpcGUub3duZXIgPT09IGUuY3VycmVudFNsaWRlKVxuICAgICAgICAgICAgICAgICAgICBzc3dpcGUuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHNzd2lwZS5uZXh0KCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi5zdGF0aWMtYmFubmVyXCIpLmZvckVhY2goYiA9PiB7XG4gICAgICAgICAgICBjb25zdCBvd25lciA9IGIuY2xvc2VzdChcInNlY3Rpb25cIilcbiAgICAgICAgICAgIGlmICghb3duZXIpIHRocm93IEVycm9yKFwiYmFubmVyIGVsZW1lbnQgbm90IHBhcnQgb2YgYSBzZWN0aW9uXCIpXG4gICAgICAgICAgICBjb25zdCBzdGF0aWNXaXBlID0gbmV3IFNXV2lwZVN0YXRpYyhiLCBvd25lcilcbiAgICAgICAgICAgIHN0YXRpY1dpcGUuc3RhcnQoKVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuXG59KSgpXG5cbi8vIGBjbG9zZXN0YCBQb2x5ZmlsbCBmb3IgSUVcblxuaWYgKCFFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgPSBFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS53ZWJraXRNYXRjaGVzU2VsZWN0b3I7XG59XG5cbmlmICghRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCkge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0ID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgbGV0IGVsID0gdGhpcztcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBpZiAoRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcy5jYWxsKGVsLCBzKSkgcmV0dXJuIGVsO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50IHx8IGVsLnBhcmVudE5vZGU7XG4gICAgICAgIH0gd2hpbGUgKGVsICE9PSBudWxsICYmIGVsLm5vZGVUeXBlID09PSAxKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbn1cblxuXG5cbiJdfQ==