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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy1zd3dpcGUudHMiXSwibmFtZXMiOlsiTW9kZSIsIlNXV2lwZSIsImltYWdlQXJyYXkiLCJjdXJyZW50SWR4IiwibGVuZ3RoIiwiYmFubmVyIiwib3duZXIiLCJtb2RlIiwiQVVUTyIsImxvb3AiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJ3aWR0aCIsImhlaWdodCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIkRhdGUiLCJkcmF3SW1hZ2UiLCJfZm9yZWdyb3VuZENvbnRleHQiLCJjbGVhclJlY3QiLCJwZXJjZW50IiwiY3VySW1nIiwiZmFkZVdpZHRoIiwic3RhcnRUaW1lIiwicmVkcmF3IiwiY3VycmVudFRpbWUiLCJlbGFwc2VkIiwiZ2V0VGltZSIsInN0YXJ0UGVyY2VudGFnZSIsImZhZGVEdXJhdGlvbiIsInNhdmUiLCJmYWRlVHlwZSIsImdyYWRpZW50IiwiY3JlYXRlTGluZWFyR3JhZGllbnQiLCJhZGRDb2xvclN0b3AiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsInNlZ21lbnRzIiwibGVuIiwiTWF0aCIsIlBJIiwic3RlcCIsImFkanVzdGVkUGVyY2VudCIsInByY3QiLCJhbmdsZSIsIngxIiwiY29zIiwieTEiLCJzaW4iLCJ4MiIsInkyIiwiYWxwaGEiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJmaWxsIiwiZW5kU3RhdGUiLCJpbm5lclJhZGl1cyIsIm91dGVyUmFkaXVzIiwiY3JlYXRlUmFkaWFsR3JhZGllbnQiLCJnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24iLCJueHRJbWciLCJwcm9wb3J0aW9uYWwiLCJfZHJhdyIsIl9iYWNrQ29udGV4dCIsInJlc3RvcmUiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJuZXh0RmFkZVRpbWVyIiwic2V0VGltZW91dCIsIm5leHRGYWRlIiwiZmFkZURlbGF5IiwiaW1hZ2VzIiwiQXJyYXkiLCJmcm9tIiwicXVlcnlTZWxlY3RvckFsbCIsIm1hcCIsImltZyIsImFzcGVjdCIsImhhc0F0dHJpYnV0ZSIsIk51bWJlciIsImdldEF0dHJpYnV0ZSIsImhlaWdodFNjYWxlIiwid2lkdGhTY2FsZSIsImRpbWVuc2lvbnMiLCJhcHBlbmRDaGlsZCIsIl9iYWNrQ2FudmFzIiwiX2ZvcmVDYW52YXMiLCJiYWNrQ29udGV4dCIsImdldENvbnRleHQiLCJmb3JlQ29udGV4dCIsIkVycm9yIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlc2l6ZSIsImkiLCJjdHgiLCJvdGhlckN0eCIsImNhbnZhc1dpZHRoTWlkZGxlIiwiY2FudmFzIiwiY2FudmFzSGVpZ2h0TWlkZGxlIiwiZyIsIm1heCIsImhyIiwid3IiLCJoIiwidyIsInIiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRIZWlnaHQiLCJjbGVhclRpbWVvdXQiLCJNVUxUSV9TRUNUSU9OIiwiU1dXaXBlU3RhdGljIiwiX2NhbnZhcyIsImNvbnRleHQiLCJfY29udGV4dCIsImRyYXciLCJmb3JFYWNoIiwiYiIsIm5vTG9vcCIsImNsb3Nlc3QiLCJ3aXBlIiwic3N3aXBlIiwiUmV2ZWFsIiwiZSIsInByZXZCYW5uZXIiLCJwcmV2aW91c1NsaWRlIiwicXVlcnlTZWxlY3RvciIsInN0b3AiLCJvd25lckluZGV4IiwiZ2V0SW5kaWNlcyIsImN1cnJlbnRJbmRleCIsImN1cnJlbnRTbGlkZSIsImRpc3RhbmNlIiwiaW5kZXhWIiwidiIsImNvbnNvbGUiLCJsb2ciLCJudW1iZXJPZkZhZGVzIiwibmV4dEJhbm5lciIsInN0YXJ0IiwibmV4dCIsInN0YXRpY1dpcGUiLCJFbGVtZW50IiwicHJvdG90eXBlIiwibWF0Y2hlcyIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwid2Via2l0TWF0Y2hlc1NlbGVjdG9yIiwicyIsImVsIiwiY2FsbCIsInBhcmVudEVsZW1lbnQiLCJwYXJlbnROb2RlIiwibm9kZVR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0lBZ0JLQSxJOztXQUFBQSxJO0FBQUFBLEVBQUFBLEksQ0FBQUEsSTtBQUFBQSxFQUFBQSxJLENBQUFBLEk7R0FBQUEsSSxLQUFBQSxJOztJQWtCQ0MsTTs7Ozs7QUFHb0M7QUFDRTtBQUNNO3dCQWFaO0FBQzlCLGFBQU8sS0FBS0MsVUFBTCxDQUFnQixLQUFLQyxVQUFyQixDQUFQO0FBQ0g7Ozt3QkFFaUM7QUFDOUIsYUFBTyxLQUFLRCxVQUFMLENBQWdCLENBQUMsS0FBS0MsVUFBTCxHQUFrQixDQUFuQixJQUF3QixLQUFLRCxVQUFMLENBQWdCRSxNQUF4RCxDQUFQO0FBQ0g7OztBQUVELGtCQUFxQkMsTUFBckIsRUFBbURDLEtBQW5ELEVBQThIO0FBQUE7O0FBQUEsUUFBOUNDLElBQThDLHVFQUFqQ1AsSUFBSSxDQUFDUSxJQUE0QjtBQUFBLFFBQWJDLElBQWEsdUVBQU4sSUFBTTs7QUFBQTs7QUFBQSxTQUF6R0osTUFBeUcsR0FBekdBLE1BQXlHO0FBQUEsU0FBM0VDLEtBQTJFLEdBQTNFQSxLQUEyRTtBQUFBLFNBQTlDQyxJQUE4QyxHQUE5Q0EsSUFBOEM7QUFBQSxTQUFiRSxJQUFhLEdBQWJBLElBQWE7O0FBQUEsd0NBeEJqSCxDQUFDLENBd0JnSDs7QUFBQSxtQ0F2QjlHQyxNQUFNLENBQUNDLFVBdUJ1Rzs7QUFBQSxvQ0F0QjdHRCxNQUFNLENBQUNFLFdBc0JzRzs7QUFBQSxvQ0FyQjdHLEtBQUtDLEtBQUwsR0FBYSxLQUFLQyxNQXFCMkY7O0FBQUE7O0FBQUEseUNBbEI1RUMsUUFBUSxDQUFDQyxhQUFULENBQXVCLFFBQXZCLENBa0I0RTs7QUFBQSx5Q0FqQjVFRCxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FpQjRFOztBQUFBOztBQUFBOztBQUFBLHFDQWJwRyxDQWFvRzs7QUFBQSx1Q0FacEcsSUFBSUMsSUFBSixFQVlvRzs7QUFBQSwyQ0FYL0UsSUFXK0U7O0FBQUEsc0NBMkMzRyxZQUFNO0FBQ3JCO0FBQ0EsTUFBQSxLQUFJLENBQUNkLFVBQUwsR0FBa0IsRUFBRSxLQUFJLENBQUNBLFVBQVAsR0FBb0IsS0FBSSxDQUFDRCxVQUFMLENBQWdCRSxNQUF0RDs7QUFDQSxNQUFBLEtBQUksQ0FBQ2MsU0FBTCxHQUhxQixDQUtyQjs7O0FBQ0EsTUFBQSxLQUFJLENBQUNDLGtCQUFMLENBQXdCQyxTQUF4QixDQUFrQyxDQUFsQyxFQUFxQyxDQUFyQyxFQUF3QyxLQUFJLENBQUNQLEtBQTdDLEVBQW9ELEtBQUksQ0FBQ0MsTUFBekQsRUFOcUIsQ0FRckI7OztBQUNBLE1BQUEsS0FBSSxDQUFDTyxPQUFMLEdBQWUsQ0FBQyxLQUFJLENBQUNDLE1BQUwsQ0FBWUMsU0FBNUI7QUFDQSxNQUFBLEtBQUksQ0FBQ0MsU0FBTCxHQUFpQixJQUFJUCxJQUFKLEVBQWpCOztBQUNBLE1BQUEsS0FBSSxDQUFDUSxNQUFMO0FBQ0gsS0F2RDZIOztBQUFBLG9DQXlEN0csWUFBTTtBQUNuQjtBQUNBLFVBQU1DLFdBQVcsR0FBRyxJQUFJVCxJQUFKLEVBQXBCOztBQUNBLFVBQU1VLE9BQU8sR0FBR0QsV0FBVyxDQUFDRSxPQUFaLEtBQXdCLEtBQUksQ0FBQ0osU0FBTCxDQUFlSSxPQUFmLEVBQXhDOztBQUNBLE1BQUEsS0FBSSxDQUFDUCxPQUFMLEdBQWUsS0FBSSxDQUFDQyxNQUFMLENBQVlPLGVBQVosR0FBOEJGLE9BQU8sR0FBRyxLQUFJLENBQUNMLE1BQUwsQ0FBWVEsWUFBbkU7O0FBR0EsTUFBQSxLQUFJLENBQUNYLGtCQUFMLENBQXdCWSxJQUF4Qjs7QUFDQSxNQUFBLEtBQUksQ0FBQ1osa0JBQUwsQ0FBd0JDLFNBQXhCLENBQWtDLENBQWxDLEVBQXFDLENBQXJDLEVBQXdDLEtBQUksQ0FBQ1AsS0FBN0MsRUFBb0QsS0FBSSxDQUFDQyxNQUF6RDs7QUFDQSxVQUFNUyxTQUFTLEdBQUcsS0FBSSxDQUFDRCxNQUFMLENBQVlDLFNBQTlCOztBQUVBLGNBQVEsS0FBSSxDQUFDRCxNQUFMLENBQVlVLFFBQXBCO0FBRUksYUFBSyxVQUFMO0FBQWlCO0FBQ2IsZ0JBQU1DLFFBQVEsR0FBRyxLQUFJLENBQUNkLGtCQUFMLENBQXdCZSxvQkFBeEIsQ0FDYixDQUFDLEtBQUksQ0FBQ2IsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBbEMsSUFBK0MsS0FBSSxDQUFDVixLQUR2QyxFQUM4QyxDQUQ5QyxFQUViLENBQUMsS0FBSSxDQUFDUSxPQUFMLElBQWdCLElBQUlFLFNBQXBCLElBQWlDQSxTQUFsQyxJQUErQyxLQUFJLENBQUNWLEtBRnZDLEVBRThDLENBRjlDLENBQWpCOztBQUdBb0IsWUFBQUEsUUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCO0FBQ0FGLFlBQUFBLFFBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjtBQUNBLFlBQUEsS0FBSSxDQUFDaEIsa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQ0gsUUFBcEM7O0FBQ0EsWUFBQSxLQUFJLENBQUNkLGtCQUFMLENBQXdCa0IsUUFBeEIsQ0FBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBSSxDQUFDeEIsS0FBNUMsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFDQTtBQUNIOztBQUVELGFBQUssVUFBTDtBQUFpQjtBQUNiLGdCQUFNbUIsU0FBUSxHQUFHLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JlLG9CQUF4QixDQUNiLENBQUMsQ0FBQyxJQUFJLEtBQUksQ0FBQ2IsT0FBVixLQUFzQixJQUFJRSxTQUExQixJQUF1Q0EsU0FBeEMsSUFBcUQsS0FBSSxDQUFDVixLQUQ3QyxFQUNvRCxDQURwRCxFQUViLENBQUMsQ0FBQyxJQUFJLEtBQUksQ0FBQ1EsT0FBVixLQUFzQixJQUFJRSxTQUExQixJQUF1Q0EsU0FBeEMsSUFBcUQsS0FBSSxDQUFDVixLQUY3QyxFQUVvRCxDQUZwRCxDQUFqQjs7QUFHQW9CLFlBQUFBLFNBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsWUFBQUEsU0FBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBLFlBQUEsS0FBSSxDQUFDaEIsa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQ0gsU0FBcEM7O0FBQ0EsWUFBQSxLQUFJLENBQUNkLGtCQUFMLENBQXdCa0IsUUFBeEIsQ0FBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBSSxDQUFDeEIsS0FBNUMsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFDQTtBQUNIOztBQUVELGFBQUssVUFBTDtBQUFpQjtBQUNiLGdCQUFNbUIsVUFBUSxHQUFHLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JlLG9CQUF4QixDQUNiLENBRGEsRUFDVixDQUFDLEtBQUksQ0FBQ2IsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBbEMsSUFBK0MsS0FBSSxDQUFDVixLQUQxQyxFQUViLENBRmEsRUFFVixDQUFDLEtBQUksQ0FBQ1EsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBbEMsSUFBK0MsS0FBSSxDQUFDVixLQUYxQyxDQUFqQjs7QUFHQW9CLFlBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsWUFBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBLFlBQUEsS0FBSSxDQUFDaEIsa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQ0gsVUFBcEM7O0FBQ0EsWUFBQSxLQUFJLENBQUNkLGtCQUFMLENBQXdCa0IsUUFBeEIsQ0FBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBSSxDQUFDeEIsS0FBNUMsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFDQTtBQUNIOztBQUVELGFBQUssVUFBTDtBQUFpQjtBQUNiLGdCQUFNbUIsVUFBUSxHQUFHLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JlLG9CQUF4QixDQUNiLENBRGEsRUFDVixDQUFDLENBQUMsSUFBSSxLQUFJLENBQUNiLE9BQVYsS0FBc0IsSUFBSUUsU0FBMUIsSUFBdUNBLFNBQXhDLElBQXFELEtBQUksQ0FBQ1YsS0FEaEQsRUFFYixDQUZhLEVBRVYsQ0FBQyxDQUFDLElBQUksS0FBSSxDQUFDUSxPQUFWLEtBQXNCLElBQUlFLFNBQTFCLElBQXVDQSxTQUF4QyxJQUFxRCxLQUFJLENBQUNWLEtBRmhELENBQWpCOztBQUdBb0IsWUFBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBRixZQUFBQSxVQUFRLENBQUNFLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkIsZUFBM0I7O0FBQ0EsWUFBQSxLQUFJLENBQUNoQixrQkFBTCxDQUF3QmlCLFNBQXhCLEdBQW9DSCxVQUFwQzs7QUFDQSxZQUFBLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JrQixRQUF4QixDQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1QyxLQUFJLENBQUN4QixLQUE1QyxFQUFtRCxLQUFJLENBQUNDLE1BQXhEOztBQUNBO0FBQ0g7O0FBRUQsYUFBSyxnQkFBTDtBQUF1QjtBQUFDO0FBRXBCLGdCQUFNbUIsVUFBUSxHQUFHLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JlLG9CQUF4QixDQUNiLENBQUMsS0FBSSxDQUFDYixPQUFMLElBQWdCLElBQUlFLFNBQXBCLElBQWlDQSxTQUFsQyxJQUErQyxLQUFJLENBQUNWLEtBRHZDLEVBQzhDLENBRDlDLEVBRWIsQ0FBQyxLQUFJLENBQUNRLE9BQUwsSUFBZ0IsSUFBSUUsU0FBcEIsSUFBaUNBLFNBQWxDLElBQStDLEtBQUksQ0FBQ1YsS0FGdkMsRUFFOENVLFNBQVMsSUFBSSxLQUFJLENBQUNWLEtBQUwsSUFBYyxLQUFJLENBQUNDLE1BQUwsR0FBYyxDQUE1QixDQUFKLENBQVQsR0FBK0MsS0FBSSxDQUFDRCxLQUZsRyxDQUFqQjs7QUFHQW9CLFlBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsWUFBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCOztBQUNBLFlBQUEsS0FBSSxDQUFDaEIsa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQ0gsVUFBcEM7O0FBQ0EsWUFBQSxLQUFJLENBQUNkLGtCQUFMLENBQXdCa0IsUUFBeEIsQ0FBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBSSxDQUFDeEIsS0FBNUMsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFFQTtBQUNIOztBQUVELGFBQUssZ0JBQUw7QUFBdUI7QUFDbkIsZ0JBQU1tQixVQUFRLEdBQUcsS0FBSSxDQUFDZCxrQkFBTCxDQUF3QmUsb0JBQXhCLENBQ2IsQ0FBQyxLQUFJLENBQUNiLE9BQUwsSUFBZ0IsSUFBSUUsU0FBcEIsSUFBaUNBLFNBQWxDLElBQStDLEtBQUksQ0FBQ1YsS0FEdkMsRUFDOEMsQ0FEOUMsRUFFYixDQUFDLEtBQUksQ0FBQ1EsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBbEMsSUFBK0MsS0FBSSxDQUFDVixLQUFwRCxHQUE0RCxLQUFJLENBQUNBLEtBRnBELEVBRTJELEtBQUksQ0FBQ0MsTUFGaEUsQ0FBakI7O0FBR0FtQixZQUFBQSxVQUFRLENBQUNFLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkIsZUFBM0I7O0FBQ0FGLFlBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQSxZQUFBLEtBQUksQ0FBQ2hCLGtCQUFMLENBQXdCaUIsU0FBeEIsR0FBb0NILFVBQXBDOztBQUNBLFlBQUEsS0FBSSxDQUFDZCxrQkFBTCxDQUF3QmtCLFFBQXhCLENBQWlDLENBQWpDLEVBQW9DLENBQXBDLEVBQXVDLEtBQUksQ0FBQ3hCLEtBQTVDLEVBQW1ELEtBQUksQ0FBQ0MsTUFBeEQ7O0FBRUE7QUFDSDs7QUFFRCxhQUFLLFlBQUw7QUFBbUI7QUFFZixnQkFBTXdCLFFBQVEsR0FBRyxHQUFqQixDQUZlLENBRU87O0FBQ3RCLGdCQUFNQyxHQUFHLEdBQUdDLElBQUksQ0FBQ0MsRUFBTCxHQUFVSCxRQUF0QjtBQUNBLGdCQUFNSSxJQUFJLEdBQUcsSUFBSUosUUFBakIsQ0FKZSxDQU1mOztBQUNBLGdCQUFNSyxlQUFlLEdBQUcsS0FBSSxDQUFDdEIsT0FBTCxJQUFnQixJQUFJRSxTQUFwQixJQUFpQ0EsU0FBekQsQ0FQZSxDQVNmOztBQUNBLGlCQUFLLElBQUlxQixJQUFJLEdBQUcsQ0FBQ3JCLFNBQWpCLEVBQTRCcUIsSUFBSSxHQUFHLElBQUlyQixTQUF2QyxFQUFrRHFCLElBQUksSUFBSUYsSUFBMUQsRUFBZ0U7QUFFNUQ7QUFDQSxrQkFBTUcsS0FBSyxHQUFHRCxJQUFJLEdBQUdKLElBQUksQ0FBQ0MsRUFBMUIsQ0FINEQsQ0FLNUQ7O0FBQ0Esa0JBQU1LLEVBQUUsR0FBR04sSUFBSSxDQUFDTyxHQUFMLENBQVNGLEtBQUssR0FBR0wsSUFBSSxDQUFDQyxFQUF0QixLQUE2QixLQUFJLENBQUMzQixNQUFMLEdBQWMsQ0FBM0MsSUFBZ0QsS0FBSSxDQUFDRCxLQUFMLEdBQWEsQ0FBeEU7O0FBQ0Esa0JBQU1tQyxFQUFFLEdBQUdSLElBQUksQ0FBQ1MsR0FBTCxDQUFTSixLQUFLLEdBQUdMLElBQUksQ0FBQ0MsRUFBdEIsS0FBNkIsS0FBSSxDQUFDM0IsTUFBTCxHQUFjLENBQTNDLElBQWdELEtBQUksQ0FBQ0EsTUFBaEU7O0FBQ0Esa0JBQU1vQyxFQUFFLEdBQUdWLElBQUksQ0FBQ08sR0FBTCxDQUFTRixLQUFLLEdBQUdOLEdBQVIsR0FBY0MsSUFBSSxDQUFDQyxFQUE1QixLQUFtQyxLQUFJLENBQUMzQixNQUFMLEdBQWMsQ0FBakQsSUFBc0QsS0FBSSxDQUFDRCxLQUFMLEdBQWEsQ0FBOUU7O0FBQ0Esa0JBQU1zQyxFQUFFLEdBQUdYLElBQUksQ0FBQ1MsR0FBTCxDQUFTSixLQUFLLEdBQUdOLEdBQVIsR0FBY0MsSUFBSSxDQUFDQyxFQUE1QixLQUFtQyxLQUFJLENBQUMzQixNQUFMLEdBQWMsQ0FBakQsSUFBc0QsS0FBSSxDQUFDQSxNQUF0RSxDQVQ0RCxDQVc1RDs7O0FBQ0Esa0JBQU1zQyxLQUFLLEdBQUcsQ0FBQ1QsZUFBZSxHQUFHQyxJQUFsQixHQUF5QnJCLFNBQTFCLElBQXVDQSxTQUFyRCxDQVo0RCxDQWM1RDs7QUFDQSxjQUFBLEtBQUksQ0FBQ0osa0JBQUwsQ0FBd0JrQyxTQUF4Qjs7QUFDQSxjQUFBLEtBQUksQ0FBQ2xDLGtCQUFMLENBQXdCbUMsTUFBeEIsQ0FBK0IsS0FBSSxDQUFDekMsS0FBTCxHQUFhLENBQWIsR0FBaUIsQ0FBaEQsRUFBbUQsS0FBSSxDQUFDQyxNQUF4RDs7QUFDQSxjQUFBLEtBQUksQ0FBQ0ssa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQlQsRUFBL0IsRUFBbUNFLEVBQW5DOztBQUNBLGNBQUEsS0FBSSxDQUFDN0Isa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQkwsRUFBL0IsRUFBbUNDLEVBQW5DOztBQUNBLGNBQUEsS0FBSSxDQUFDaEMsa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQixLQUFJLENBQUMxQyxLQUFMLEdBQWEsQ0FBYixHQUFpQixDQUFoRCxFQUFtRCxLQUFJLENBQUNDLE1BQXhEOztBQUNBLGNBQUEsS0FBSSxDQUFDSyxrQkFBTCxDQUF3QmlCLFNBQXhCLEdBQW9DLGdCQUFnQmdCLEtBQWhCLEdBQXdCLEdBQTVEOztBQUNBLGNBQUEsS0FBSSxDQUFDakMsa0JBQUwsQ0FBd0JxQyxJQUF4QjtBQUNIOztBQUVEO0FBQ0g7O0FBRUQsYUFBSyxZQUFMO0FBQW1CO0FBRWYsZ0JBQU1sQixTQUFRLEdBQUcsR0FBakIsQ0FGZSxDQUVPOztBQUN0QixnQkFBTUMsSUFBRyxHQUFHQyxJQUFJLENBQUNDLEVBQUwsR0FBVUgsU0FBdEI7O0FBQ0EsZ0JBQU1JLEtBQUksR0FBRyxJQUFJSixTQUFqQixDQUplLENBTWY7OztBQUNBLGdCQUFNSyxnQkFBZSxHQUFHLEtBQUksQ0FBQ3RCLE9BQUwsSUFBZ0IsSUFBSUUsU0FBcEIsSUFBaUNBLFNBQXpELENBUGUsQ0FTZjs7O0FBQ0EsaUJBQUssSUFBSUYsT0FBTyxHQUFHLENBQUNFLFNBQXBCLEVBQStCRixPQUFPLEdBQUcsSUFBSUUsU0FBN0MsRUFBd0RGLE9BQU8sSUFBSXFCLEtBQW5FLEVBQXlFO0FBRXJFO0FBQ0Esa0JBQU1HLE1BQUssR0FBR3hCLE9BQU8sR0FBR21CLElBQUksQ0FBQ0MsRUFBN0IsQ0FIcUUsQ0FLckU7OztBQUNBLGtCQUFNSyxFQUFFLEdBQUdOLElBQUksQ0FBQ08sR0FBTCxDQUFTRixNQUFLLEdBQUdOLElBQVIsR0FBYyxJQUFJQyxJQUFJLENBQUNDLEVBQWhDLEtBQXVDLEtBQUksQ0FBQzNCLE1BQUwsR0FBYyxDQUFyRCxJQUEwRCxLQUFJLENBQUNELEtBQUwsR0FBYSxDQUFsRjs7QUFDQSxrQkFBTW1DLEVBQUUsR0FBR1IsSUFBSSxDQUFDUyxHQUFMLENBQVNKLE1BQUssR0FBR04sSUFBUixHQUFjLElBQUlDLElBQUksQ0FBQ0MsRUFBaEMsS0FBdUMsS0FBSSxDQUFDM0IsTUFBTCxHQUFjLENBQXJELENBQVg7O0FBQ0Esa0JBQU1vQyxHQUFFLEdBQUdWLElBQUksQ0FBQ08sR0FBTCxDQUFTRixNQUFLLEdBQUcsSUFBSUwsSUFBSSxDQUFDQyxFQUExQixLQUFpQyxLQUFJLENBQUMzQixNQUFMLEdBQWMsQ0FBL0MsSUFBb0QsS0FBSSxDQUFDRCxLQUFMLEdBQWEsQ0FBNUU7O0FBQ0Esa0JBQU1zQyxHQUFFLEdBQUdYLElBQUksQ0FBQ1MsR0FBTCxDQUFTSixNQUFLLEdBQUcsSUFBSUwsSUFBSSxDQUFDQyxFQUExQixLQUFpQyxLQUFJLENBQUMzQixNQUFMLEdBQWMsQ0FBL0MsQ0FBWCxDQVRxRSxDQVlyRTs7O0FBQ0Esa0JBQU1zQyxNQUFLLEdBQUcsQ0FBQ1QsZ0JBQWUsR0FBR3RCLE9BQWxCLEdBQTRCRSxTQUE3QixJQUEwQ0EsU0FBeEQsQ0FicUUsQ0FlckU7OztBQUNBLGNBQUEsS0FBSSxDQUFDSixrQkFBTCxDQUF3QmtDLFNBQXhCOztBQUNBLGNBQUEsS0FBSSxDQUFDbEMsa0JBQUwsQ0FBd0JtQyxNQUF4QixDQUErQixLQUFJLENBQUN6QyxLQUFMLEdBQWEsQ0FBYixHQUFpQixDQUFoRCxFQUFtRCxDQUFuRDs7QUFDQSxjQUFBLEtBQUksQ0FBQ00sa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQlQsRUFBL0IsRUFBbUNFLEVBQW5DOztBQUNBLGNBQUEsS0FBSSxDQUFDN0Isa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQkwsR0FBL0IsRUFBbUNDLEdBQW5DOztBQUNBLGNBQUEsS0FBSSxDQUFDaEMsa0JBQUwsQ0FBd0JvQyxNQUF4QixDQUErQixLQUFJLENBQUMxQyxLQUFMLEdBQWEsQ0FBYixHQUFpQixDQUFoRCxFQUFtRCxDQUFuRDs7QUFDQSxjQUFBLEtBQUksQ0FBQ00sa0JBQUwsQ0FBd0JpQixTQUF4QixHQUFvQyxnQkFBZ0JnQixNQUFoQixHQUF3QixHQUE1RDs7QUFDQSxjQUFBLEtBQUksQ0FBQ2pDLGtCQUFMLENBQXdCcUMsSUFBeEI7QUFDSDs7QUFFRDtBQUNIOztBQUVELGFBQUssWUFBTDtBQUNBLGFBQUssV0FBTDtBQUFrQjtBQUNkLGdCQUFNbkMsUUFBTyxHQUFHLEtBQUksQ0FBQ0MsTUFBTCxDQUFZVSxRQUFaLEtBQXlCLFdBQXpCLEdBQXdDLElBQUksS0FBSSxDQUFDWCxPQUFqRCxHQUE0RCxLQUFJLENBQUNBLE9BQWpGOztBQUNBLGdCQUFNUixLQUFLLEdBQUcsR0FBZDtBQUNBLGdCQUFNNEMsUUFBUSxHQUFHLElBQWpCO0FBQ0EsZ0JBQU1DLFdBQVcsR0FBSXJDLFFBQUQsR0FBWSxLQUFJLENBQUNQLE1BQWpCLEdBQTBCRCxLQUExQixHQUFrQyxDQUFsQyxHQUFzQzRDLFFBQXRDLEdBQWtEcEMsUUFBRCxHQUFZLEtBQUksQ0FBQ1AsTUFBakIsR0FBMEJELEtBQS9GO0FBQ0EsZ0JBQU04QyxXQUFXLEdBQUd0QyxRQUFPLEdBQUcsS0FBSSxDQUFDUCxNQUFmLEdBQXdCRCxLQUE1QztBQUNBOzs7O0FBSUEsZ0JBQU1vQixVQUFRLEdBQUcsS0FBSSxDQUFDZCxrQkFBTCxDQUF3QnlDLG9CQUF4QixDQUNiLEtBQUksQ0FBQy9DLEtBQUwsR0FBYSxDQURBLEVBRWIsS0FBSSxDQUFDQyxNQUFMLEdBQWMsQ0FGRCxFQUVJNEMsV0FGSixFQUdiLEtBQUksQ0FBQzdDLEtBQUwsR0FBYSxDQUhBLEVBSWIsS0FBSSxDQUFDQyxNQUFMLEdBQWMsQ0FKRCxFQUlJNkMsV0FKSixDQUFqQjs7QUFLQSxnQkFBSSxLQUFJLENBQUNyQyxNQUFMLENBQVlVLFFBQVosS0FBeUIsV0FBN0IsRUFBMEM7QUFDdENDLGNBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsY0FBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCO0FBQ0gsYUFIRCxNQUdPO0FBQ0hGLGNBQUFBLFVBQVEsQ0FBQ0UsWUFBVCxDQUFzQixHQUF0QixFQUEyQixlQUEzQjs7QUFDQUYsY0FBQUEsVUFBUSxDQUFDRSxZQUFULENBQXNCLEdBQXRCLEVBQTJCLGVBQTNCO0FBQ0g7O0FBQ0QsWUFBQSxLQUFJLENBQUNoQixrQkFBTCxDQUF3QmlCLFNBQXhCLEdBQW9DSCxVQUFwQzs7QUFDQSxZQUFBLEtBQUksQ0FBQ2Qsa0JBQUwsQ0FBd0JrQixRQUF4QixDQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1QyxLQUFJLENBQUN4QixLQUE1QyxFQUFtRCxLQUFJLENBQUNDLE1BQXhEOztBQUVBO0FBQ0g7O0FBRUQ7QUFDSTtBQWhMUjs7QUFxTEEsTUFBQSxLQUFJLENBQUNLLGtCQUFMLENBQXdCMEMsd0JBQXhCLEdBQW1ELEtBQUksQ0FBQ0MsTUFBTCxDQUFZQyxZQUFaLEdBQTJCLGFBQTNCLEdBQTJDLFdBQTlGOztBQUNBLE1BQUEsS0FBSSxDQUFDQyxLQUFMLENBQVcsS0FBSSxDQUFDRixNQUFoQixFQUF3QixLQUFJLENBQUMzQyxrQkFBN0IsRUFBaUQsS0FBSSxDQUFDOEMsWUFBdEQ7O0FBRUEsTUFBQSxLQUFJLENBQUM5QyxrQkFBTCxDQUF3QitDLE9BQXhCOztBQUdBLFVBQUl2QyxPQUFPLEdBQUcsS0FBSSxDQUFDTCxNQUFMLENBQVlRLFlBQTFCLEVBQ0lwQixNQUFNLENBQUN5RCxxQkFBUCxDQUE2QixLQUFJLENBQUMxQyxNQUFsQyxFQURKLEtBRUssSUFBSSxLQUFJLENBQUNsQixJQUFMLEtBQWNQLElBQUksQ0FBQ1EsSUFBdkIsRUFDRCxJQUFJLEtBQUksQ0FBQ0MsSUFBTCxJQUFhLEtBQUksQ0FBQ04sVUFBTCxHQUFrQixLQUFJLENBQUNELFVBQUwsQ0FBZ0JFLE1BQWhCLEdBQXlCLENBQTVELEVBQ0ksS0FBSSxDQUFDZ0UsYUFBTCxHQUFxQkMsVUFBVSxDQUFDLEtBQUksQ0FBQ0MsUUFBTixFQUFnQixLQUFJLENBQUNoRCxNQUFMLENBQVlpRCxTQUE1QixDQUEvQjtBQUNYLEtBcFE2SDs7QUFDMUgsUUFBTUMsTUFBTSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FBVyxLQUFLckUsTUFBTCxDQUFZc0UsZ0JBQVosQ0FBNkIsS0FBN0IsQ0FBWCxDQUFmO0FBQ0EsU0FBS3pFLFVBQUwsR0FBa0JzRSxNQUFNLENBQUNJLEdBQVAsQ0FBVyxVQUFBQyxHQUFHLEVBQUk7QUFDaEMsVUFBTUMsTUFBTSxHQUFHRCxHQUFHLENBQUNoRSxLQUFKLEdBQVlnRSxHQUFHLENBQUMvRCxNQUEvQjtBQUNBLFVBQU1nQixZQUFZLEdBQUcrQyxHQUFHLENBQUNFLFlBQUosQ0FBaUIsbUJBQWpCLElBQXdDQyxNQUFNLENBQUNILEdBQUcsQ0FBQ0ksWUFBSixDQUFpQixtQkFBakIsQ0FBRCxDQUFOLEdBQWdELElBQXhGLEdBQStGLElBQXBIO0FBQ0EsVUFBTVYsU0FBUyxHQUFHTSxHQUFHLENBQUNFLFlBQUosQ0FBaUIsZ0JBQWpCLElBQXFDQyxNQUFNLENBQUNILEdBQUcsQ0FBQ0ksWUFBSixDQUFpQixnQkFBakIsQ0FBRCxDQUFOLEdBQTZDLElBQWxGLEdBQXlGLElBQTNHO0FBQ0EsVUFBTWpELFFBQVEsR0FBRzZDLEdBQUcsQ0FBQ0UsWUFBSixDQUFpQixlQUFqQixJQUFvQ0YsR0FBRyxDQUFDSSxZQUFKLENBQWlCLGVBQWpCLENBQXBDLEdBQXdFLFVBQXpGO0FBQ0EsVUFBTTFELFNBQVMsR0FBR3NELEdBQUcsQ0FBQ0UsWUFBSixDQUFpQixnQkFBakIsSUFBcUNDLE1BQU0sQ0FBQ0gsR0FBRyxDQUFDSSxZQUFKLENBQWlCLGdCQUFqQixDQUFELENBQTNDLEdBQWtGLEVBQXBHO0FBQ0EsVUFBTXBELGVBQWUsR0FBR2dELEdBQUcsQ0FBQ0UsWUFBSixDQUFpQixjQUFqQixJQUFtQ0MsTUFBTSxDQUFDSCxHQUFHLENBQUNJLFlBQUosQ0FBaUIsY0FBakIsQ0FBRCxDQUF6QyxHQUE4RSxDQUF0RztBQUNBLFVBQU1sQixZQUFZLEdBQUdjLEdBQUcsQ0FBQ0UsWUFBSixDQUFpQixtQkFBakIsQ0FBckI7QUFDQSxVQUFNRyxXQUFXLEdBQUdMLEdBQUcsQ0FBQ0UsWUFBSixDQUFpQiwwQkFBakIsSUFBK0NDLE1BQU0sQ0FBQ0gsR0FBRyxDQUFDSSxZQUFKLENBQWlCLDBCQUFqQixDQUFELENBQXJELEdBQXNHLENBQTFIO0FBQ0EsVUFBTUUsVUFBVSxHQUFHTixHQUFHLENBQUNFLFlBQUosQ0FBaUIseUJBQWpCLElBQThDQyxNQUFNLENBQUNILEdBQUcsQ0FBQ0ksWUFBSixDQUFpQix5QkFBakIsQ0FBRCxDQUFwRCxHQUFvRyxDQUF2SDtBQUVBLFVBQU1HLFVBQVUsR0FBRztBQUNmdkUsUUFBQUEsS0FBSyxFQUFFZ0UsR0FBRyxDQUFDaEUsS0FESTtBQUVmQyxRQUFBQSxNQUFNLEVBQUUrRCxHQUFHLENBQUMvRDtBQUZHLE9BQW5CO0FBSUEsYUFBTztBQUNIK0QsUUFBQUEsR0FBRyxFQUFIQSxHQURHO0FBRUhDLFFBQUFBLE1BQU0sRUFBTkEsTUFGRztBQUdIaEQsUUFBQUEsWUFBWSxFQUFaQSxZQUhHO0FBSUh5QyxRQUFBQSxTQUFTLEVBQVRBLFNBSkc7QUFLSHZDLFFBQUFBLFFBQVEsRUFBUkEsUUFMRztBQU1IVCxRQUFBQSxTQUFTLEVBQVRBLFNBTkc7QUFPSE0sUUFBQUEsZUFBZSxFQUFmQSxlQVBHO0FBUUhrQyxRQUFBQSxZQUFZLEVBQVpBLFlBUkc7QUFTSG9CLFFBQUFBLFVBQVUsRUFBVkEsVUFURztBQVVIRCxRQUFBQSxXQUFXLEVBQVhBLFdBVkc7QUFXSEUsUUFBQUEsVUFBVSxFQUFWQTtBQVhHLE9BQVA7QUFhSCxLQTVCaUIsQ0FBbEI7QUE4QkEsU0FBSy9FLE1BQUwsQ0FBWWdGLFdBQVosQ0FBd0IsS0FBS0MsV0FBN0I7QUFDQSxTQUFLakYsTUFBTCxDQUFZZ0YsV0FBWixDQUF3QixLQUFLRSxXQUE3Qjs7QUFDQSxRQUFNQyxXQUFXLEdBQUcsS0FBS0YsV0FBTCxDQUFpQkcsVUFBakIsQ0FBNEIsSUFBNUIsQ0FBcEI7O0FBQ0EsUUFBTUMsV0FBVyxHQUFHLEtBQUtILFdBQUwsQ0FBaUJFLFVBQWpCLENBQTRCLElBQTVCLENBQXBCOztBQUNBLFFBQUlELFdBQVcsS0FBSyxJQUFoQixJQUF3QkUsV0FBVyxLQUFLLElBQTVDLEVBQWtELE1BQU1DLEtBQUssQ0FBQywwQkFBRCxDQUFYO0FBQ2xELFNBQUsxQixZQUFMLEdBQW9CdUIsV0FBcEI7QUFDQSxTQUFLckUsa0JBQUwsR0FBMEJ1RSxXQUExQjtBQUVBaEYsSUFBQUEsTUFBTSxDQUFDa0YsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBS0MsTUFBdkM7QUFDSDs7OzswQkE2TmFDLEMsRUFBZ0JDLEcsRUFBK0JDLFEsRUFBb0M7QUFDN0YsVUFBSUYsQ0FBQyxDQUFDL0IsWUFBTixFQUFvQjtBQUNoQixZQUFNa0MsaUJBQWlCLEdBQUdGLEdBQUcsQ0FBQ0csTUFBSixDQUFXckYsS0FBWCxHQUFtQixDQUE3QztBQUNBLFlBQU1zRixrQkFBa0IsR0FBR0osR0FBRyxDQUFDRyxNQUFKLENBQVdwRixNQUFYLEdBQW9CLENBQS9DO0FBQ0EsWUFBTXNGLENBQUMsR0FBR0wsR0FBRyxDQUFDbkMsb0JBQUosQ0FBeUJxQyxpQkFBekIsRUFBNENFLGtCQUE1QyxFQUFnRSxDQUFoRSxFQUFtRUYsaUJBQW5FLEVBQXNGRSxrQkFBdEYsRUFBMEczRCxJQUFJLENBQUM2RCxHQUFMLENBQVNKLGlCQUFULEVBQTRCRSxrQkFBNUIsQ0FBMUcsQ0FBVjtBQUNBQyxRQUFBQSxDQUFDLENBQUNqRSxZQUFGLENBQWUsQ0FBZixFQUFrQixTQUFsQjtBQUNBaUUsUUFBQUEsQ0FBQyxDQUFDakUsWUFBRixDQUFlLENBQWYsRUFBa0IsU0FBbEI7QUFDQTRELFFBQUFBLEdBQUcsQ0FBQzNELFNBQUosR0FBZ0JnRSxDQUFoQjtBQUNBTCxRQUFBQSxHQUFHLENBQUMxRCxRQUFKLENBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixLQUFLeEIsS0FBeEIsRUFBK0IsS0FBS0MsTUFBcEM7QUFDQSxZQUFNd0YsRUFBRSxHQUFHLEdBQVg7QUFDQSxZQUFNQyxFQUFFLEdBQUcsSUFBWDtBQUNBLFlBQU1DLENBQUMsR0FBRyxLQUFLMUYsTUFBTCxHQUFjZ0YsQ0FBQyxDQUFDWixXQUExQjtBQUNBLFlBQU11QixDQUFDLEdBQUcsS0FBSzVGLEtBQUwsR0FBYWlGLENBQUMsQ0FBQ1gsVUFBekI7QUFDQSxZQUFNdUIsQ0FBQyxHQUFHLENBQVY7QUFDQVgsUUFBQUEsR0FBRyxDQUFDN0UsU0FBSixDQUNJNEUsQ0FBQyxDQUFDakIsR0FETixFQUVJLEtBQUtoRSxLQUFMLEdBQWEsQ0FBYixHQUFpQjRGLENBQUMsR0FBRyxDQUZ6QixFQUdJLEtBQUszRixNQUFMLEdBQWMsQ0FBZCxHQUFrQjBGLENBQUMsR0FBRyxDQUgxQixFQUlJQyxDQUpKLEVBSU9ELENBSlA7QUFLSCxPQWxCRCxNQWtCTyxJQUFJLEtBQUsxQixNQUFMLEdBQWNnQixDQUFDLENBQUNoQixNQUFwQixFQUE0QjtBQUUvQmlCLFFBQUFBLEdBQUcsQ0FBQzdFLFNBQUosQ0FBYzRFLENBQUMsQ0FBQ2pCLEdBQWhCLEVBQ0ksQ0FESixFQUVJLENBQUMsS0FBSy9ELE1BQUwsR0FBYyxLQUFLRCxLQUFMLEdBQWFpRixDQUFDLENBQUNoQixNQUE5QixJQUF3QyxDQUY1QyxFQUdJLEtBQUtqRSxLQUhULEVBSUksS0FBS0EsS0FBTCxHQUFhaUYsQ0FBQyxDQUFDaEIsTUFKbkI7QUFLSCxPQVBNLE1BT0E7QUFFSGlCLFFBQUFBLEdBQUcsQ0FBQzdFLFNBQUosQ0FBYzRFLENBQUMsQ0FBQ2pCLEdBQWhCLEVBQ0ksQ0FBQyxLQUFLaEUsS0FBTCxHQUFhLEtBQUtDLE1BQUwsR0FBY2dGLENBQUMsQ0FBQ2hCLE1BQTlCLElBQXdDLENBRDVDLEVBRUksQ0FGSixFQUdJLEtBQUtoRSxNQUFMLEdBQWNnRixDQUFDLENBQUNoQixNQUhwQixFQUlJLEtBQUtoRSxNQUpUO0FBS0g7QUFFSjs7OzZCQUVnQjtBQUViLFdBQUtELEtBQUwsR0FBYUgsTUFBTSxDQUFDQyxVQUFwQjtBQUNBLFdBQUtHLE1BQUwsR0FBY0MsUUFBUSxDQUFDNEYsZUFBVCxDQUF5QkMsWUFBdkMsQ0FIYSxDQUd3Qzs7QUFDckQsV0FBSzlCLE1BQUwsR0FBYyxLQUFLakUsS0FBTCxHQUFhLEtBQUtDLE1BQWhDO0FBRUEsV0FBS21ELFlBQUwsQ0FBa0JpQyxNQUFsQixDQUF5QnJGLEtBQXpCLEdBQWlDLEtBQUtBLEtBQXRDO0FBQ0EsV0FBS29ELFlBQUwsQ0FBa0JpQyxNQUFsQixDQUF5QnBGLE1BQXpCLEdBQWtDLEtBQUtBLE1BQXZDO0FBRUEsV0FBS0ssa0JBQUwsQ0FBd0IrRSxNQUF4QixDQUErQnJGLEtBQS9CLEdBQXVDLEtBQUtBLEtBQTVDO0FBQ0EsV0FBS00sa0JBQUwsQ0FBd0IrRSxNQUF4QixDQUErQnBGLE1BQS9CLEdBQXdDLEtBQUtBLE1BQTdDO0FBRUEsV0FBS0ksU0FBTDtBQUNIOzs7Z0NBRW1CO0FBQ2hCLFVBQUksS0FBS0ksTUFBVCxFQUFpQjtBQUNiLGFBQUswQyxLQUFMLENBQVcsS0FBSzFDLE1BQWhCLEVBQXdCLEtBQUsyQyxZQUE3QixFQUEyQyxLQUFLOUMsa0JBQWhEO0FBQ0gsT0FGRCxNQUVPO0FBQ0gsY0FBTXdFLEtBQUssQ0FBQyxjQUFjLEtBQUt4RixVQUFuQixHQUFnQyxHQUFoQyxHQUFzQyxLQUFLRCxVQUFMLENBQWdCRSxNQUF2RCxDQUFYO0FBQ0g7QUFDSjs7OzRCQUdPO0FBQ0osV0FBS0QsVUFBTCxHQUFrQixDQUFDLENBQW5CO0FBQ0EsV0FBS21FLFFBQUw7QUFDQSxXQUFLdUIsTUFBTDtBQUNIOzs7MkJBRU07QUFDSCxXQUFLekIsYUFBTCxJQUFzQnlDLFlBQVksQ0FBQyxLQUFLekMsYUFBTixDQUFsQztBQUNIOzs7MkJBRU07QUFDSCxVQUFJLEtBQUs3RCxJQUFMLEtBQWNQLElBQUksQ0FBQzhHLGFBQXZCLEVBQ0ksTUFBTW5CLEtBQUssQ0FBQyxtQ0FBRCxDQUFYO0FBQ0osV0FBS3JCLFFBQUw7QUFDSDs7O3dCQUdtQjtBQUNoQixhQUFPLEtBQUtwRSxVQUFMLENBQWdCRSxNQUF2QjtBQUNIOzs7Ozs7SUFHQzJHLFk7OztBQUtvQztBQUNFO0FBTXhDLHdCQUFxQjFHLE1BQXJCLEVBQW1EQyxLQUFuRCxFQUF1RTtBQUFBOztBQUFBOztBQUFBLFNBQWxERCxNQUFrRCxHQUFsREEsTUFBa0Q7QUFBQSxTQUFwQkMsS0FBb0IsR0FBcEJBLEtBQW9COztBQUFBOztBQUFBOztBQUFBOztBQUFBLG1DQVB2REksTUFBTSxDQUFDQyxVQU9nRDs7QUFBQSxvQ0FOdERELE1BQU0sQ0FBQ0UsV0FNK0M7O0FBQUEscUNBSHpCRyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FHeUI7O0FBQUE7O0FBQ25FLFFBQU13RCxNQUFNLEdBQUdDLEtBQUssQ0FBQ0MsSUFBTixDQUFXLEtBQUtyRSxNQUFMLENBQVlzRSxnQkFBWixDQUE2QixLQUE3QixDQUFYLENBQWY7O0FBQ0EsUUFBSUgsTUFBTSxDQUFDcEUsTUFBUCxLQUFrQixDQUF0QixFQUF5QjtBQUNyQixZQUFNdUYsS0FBSyxDQUFDLDhDQUFELENBQVg7QUFDSDs7QUFDRCxTQUFLZCxHQUFMLEdBQVdMLE1BQU0sQ0FBQyxDQUFELENBQWpCO0FBQ0EsU0FBS1UsV0FBTCxHQUFtQlYsTUFBTSxDQUFDLENBQUQsQ0FBTixDQUFVTyxZQUFWLENBQXVCLDBCQUF2QixJQUFxREMsTUFBTSxDQUFDLEtBQUtILEdBQUwsQ0FBU0ksWUFBVCxDQUFzQiwwQkFBdEIsQ0FBRCxDQUEzRCxHQUFpSCxDQUFwSTtBQUNBLFNBQUtFLFVBQUwsR0FBa0JYLE1BQU0sQ0FBQyxDQUFELENBQU4sQ0FBVU8sWUFBVixDQUF1Qix5QkFBdkIsSUFBb0RDLE1BQU0sQ0FBQyxLQUFLSCxHQUFMLENBQVNJLFlBQVQsQ0FBc0IseUJBQXRCLENBQUQsQ0FBMUQsR0FBK0csQ0FBakk7QUFFQSxTQUFLNUUsTUFBTCxDQUFZZ0YsV0FBWixDQUF3QixLQUFLMkIsT0FBN0I7O0FBQ0EsUUFBTUMsT0FBTyxHQUFHLEtBQUtELE9BQUwsQ0FBYXZCLFVBQWIsQ0FBd0IsSUFBeEIsQ0FBaEI7O0FBQ0EsUUFBSXdCLE9BQU8sS0FBSyxJQUFoQixFQUFzQixNQUFNdEIsS0FBSyxDQUFDLDBCQUFELENBQVg7QUFDdEIsU0FBS3VCLFFBQUwsR0FBZ0JELE9BQWhCO0FBQ0YsU0FBS0MsUUFBTCxDQUFjckQsd0JBQWQsR0FBeUMsYUFBekM7QUFDRSxTQUFLZ0IsR0FBTCxDQUFTZSxnQkFBVCxDQUEwQixNQUExQixFQUFpQztBQUFBLGFBQUssTUFBSSxDQUFDdUIsSUFBTCxFQUFMO0FBQUEsS0FBakM7QUFDQSxTQUFLQSxJQUFMLEdBZm1FLENBZ0JwRTtBQUNGOzs7OzRCQUVPO0FBQ0osV0FBS3RCLE1BQUw7QUFDSDs7OzJCQUNNO0FBR0gsVUFBTUksaUJBQWlCLEdBQUcsS0FBS2lCLFFBQUwsQ0FBY2hCLE1BQWQsQ0FBcUJyRixLQUFyQixHQUE2QixDQUF2RDtBQUNBLFVBQU1zRixrQkFBa0IsR0FBRyxLQUFLZSxRQUFMLENBQWNoQixNQUFkLENBQXFCcEYsTUFBckIsR0FBOEIsQ0FBekQ7O0FBQ0EsVUFBTXNGLENBQUMsR0FBRyxLQUFLYyxRQUFMLENBQWN0RCxvQkFBZCxDQUFtQ3FDLGlCQUFuQyxFQUFzREUsa0JBQXRELEVBQTBFLENBQTFFLEVBQTZFRixpQkFBN0UsRUFBZ0dFLGtCQUFoRyxFQUFvSDNELElBQUksQ0FBQzZELEdBQUwsQ0FBU0osaUJBQVQsRUFBNEJFLGtCQUE1QixDQUFwSCxDQUFWOztBQUNBQyxNQUFBQSxDQUFDLENBQUNqRSxZQUFGLENBQWUsQ0FBZixFQUFrQixTQUFsQjtBQUNBaUUsTUFBQUEsQ0FBQyxDQUFDakUsWUFBRixDQUFlLENBQWYsRUFBa0IsU0FBbEI7O0FBQ0EsV0FBSytFLFFBQUwsQ0FBY25GLElBQWQ7O0FBQ0EsV0FBS21GLFFBQUwsQ0FBYzlFLFNBQWQsR0FBMEJnRSxDQUExQjs7QUFDQSxXQUFLYyxRQUFMLENBQWM3RSxRQUFkLENBQXVCLENBQXZCLEVBQTBCLENBQTFCLEVBQTZCLEtBQUs2RSxRQUFMLENBQWNoQixNQUFkLENBQXFCckYsS0FBbEQsRUFBeUQsS0FBS3FHLFFBQUwsQ0FBY2hCLE1BQWQsQ0FBcUJwRixNQUE5RTs7QUFDQSxVQUFNMEYsQ0FBQyxHQUFHLEtBQUsxRixNQUFMLEdBQWMsS0FBS29FLFdBQTdCO0FBQ0EsVUFBTXVCLENBQUMsR0FBRyxLQUFLNUYsS0FBTCxHQUFhLEtBQUtzRSxVQUE1Qjs7QUFDQSxXQUFLK0IsUUFBTCxDQUFjaEQsT0FBZDs7QUFDQSxXQUFLZ0QsUUFBTCxDQUFjaEcsU0FBZCxDQUNJLEtBQUsyRCxHQURULEVBRUksS0FBS2hFLEtBQUwsR0FBYSxDQUFiLEdBQWlCNEYsQ0FBQyxHQUFHLENBRnpCLEVBR0ksS0FBSzNGLE1BQUwsR0FBYyxDQUFkLEdBQWtCMEYsQ0FBQyxHQUFHLENBSDFCLEVBSUlDLENBSkosRUFJT0QsQ0FKUDtBQU9IOzs7NkJBRWdCO0FBRWIsV0FBSzNGLEtBQUwsR0FBYUgsTUFBTSxDQUFDQyxVQUFwQjtBQUNBLFdBQUtHLE1BQUwsR0FBY0MsUUFBUSxDQUFDNEYsZUFBVCxDQUF5QkMsWUFBdkMsQ0FIYSxDQUd3Qzs7QUFFckQsV0FBS00sUUFBTCxDQUFjaEIsTUFBZCxDQUFxQnJGLEtBQXJCLEdBQTZCLEtBQUtBLEtBQWxDO0FBQ0EsV0FBS3FHLFFBQUwsQ0FBY2hCLE1BQWQsQ0FBcUJwRixNQUFyQixHQUE4QixLQUFLQSxNQUFuQztBQUdBLFdBQUtxRyxJQUFMO0FBQ0g7Ozs7OztBQU1MLENBQUMsWUFBWTtBQUVUcEcsRUFBQUEsUUFBUSxDQUFDNkUsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQU07QUFDaEQ3RSxJQUFBQSxRQUFRLENBQUM0RCxnQkFBVCxDQUF1QyxTQUF2QyxFQUFrRHlDLE9BQWxELENBQTBELFVBQUFDLENBQUMsRUFBSTtBQUMzRCxVQUFNOUcsSUFBVSxHQUFHOEcsQ0FBQyxDQUFDdEMsWUFBRixDQUFlLGtCQUFmLElBQXFDL0UsSUFBSSxDQUFDOEcsYUFBMUMsR0FBMEQ5RyxJQUFJLENBQUNRLElBQWxGO0FBQ0EsVUFBTThHLE1BQWUsR0FBR0QsQ0FBQyxDQUFDdEMsWUFBRixDQUFlLGNBQWYsQ0FBeEI7QUFDQSxVQUFNekUsS0FBSyxHQUFHK0csQ0FBQyxDQUFDRSxPQUFGLENBQVUsU0FBVixDQUFkO0FBQ0EsVUFBSSxDQUFDakgsS0FBTCxFQUFZLE1BQU1xRixLQUFLLENBQUMsc0NBQUQsQ0FBWDtBQUNaLFVBQU02QixJQUFJLEdBQUcsSUFBSXZILE1BQUosQ0FBV29ILENBQVgsRUFBYy9HLEtBQWQsRUFBcUJDLElBQXJCLEVBQTJCLENBQUMrRyxNQUE1QixDQUFiLENBTDJELENBTTNEOztBQUNBRCxNQUFBQSxDQUFDLENBQUNJLE1BQUYsR0FBV0QsSUFBWDtBQUNILEtBUkQ7QUFVQUUsSUFBQUEsTUFBTSxDQUFDOUIsZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsVUFBQytCLENBQUQsRUFBTztBQUFBOztBQUMzQyxVQUFNQyxVQUFVLHVCQUFHRCxDQUFDLENBQUNFLGFBQUwscURBQUcsaUJBQWlCQyxhQUFqQixDQUErQixTQUEvQixDQUFuQjs7QUFDQSxVQUFJRixVQUFKLEVBQWdCO0FBQ1osWUFBTUosSUFBSSxHQUFHSSxVQUFVLENBQUNILE1BQXhCO0FBQ0EsWUFBSUQsSUFBSSxDQUFDakgsSUFBTCxLQUFjUCxJQUFJLENBQUNRLElBQXZCLEVBQ0lnSCxJQUFJLENBQUNPLElBQUwsR0FESixLQUVLO0FBQ0QsY0FBTUMsVUFBcUMsR0FBR04sTUFBTSxDQUFDTyxVQUFQLENBQWtCVCxJQUFJLENBQUNsSCxLQUF2QixDQUE5QztBQUNBLGNBQU00SCxZQUF1QyxHQUFHUixNQUFNLENBQUNPLFVBQVAsQ0FBa0JOLENBQUMsQ0FBQ1EsWUFBcEIsQ0FBaEQ7QUFDQSxjQUFNQyxRQUFRLEdBQUdULENBQUMsQ0FBQ1EsWUFBRixDQUFlRSxNQUFmLEdBQ2JILFlBQVksQ0FBQ0ksQ0FBYixJQUFrQk4sVUFBVSxDQUFDTSxDQUFYLElBQWdCLENBQWxDLENBRGEsR0FFYkosWUFBWSxDQUFDMUIsQ0FBYixHQUFpQndCLFVBQVUsQ0FBQ3hCLENBRmhDO0FBR0ErQixVQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUosUUFBWjs7QUFDQSxjQUFJQSxRQUFRLEdBQUcsQ0FBWCxJQUFnQkEsUUFBUSxHQUFHWixJQUFJLENBQUNpQixhQUFwQyxFQUFtRDtBQUMvQ2QsWUFBQUEsQ0FBQyxDQUFDUSxZQUFGLENBQWU5QyxXQUFmLENBQTJCbUMsSUFBSSxDQUFDbkgsTUFBaEM7QUFDSCxXQUZELE1BRU87QUFDSG1ILFlBQUFBLElBQUksQ0FBQ08sSUFBTDtBQUNBUCxZQUFBQSxJQUFJLENBQUNsSCxLQUFMLENBQVcrRSxXQUFYLENBQXVCbUMsSUFBSSxDQUFDbkgsTUFBNUI7QUFDSDtBQUdKO0FBQ0o7O0FBQ0QsVUFBTXFJLFVBQVUsR0FBR2YsQ0FBQyxDQUFDUSxZQUFGLENBQWVMLGFBQWYsQ0FBNkIsU0FBN0IsQ0FBbkI7O0FBQ0EsVUFBSVksVUFBSixFQUFnQjtBQUNaLFlBQUlqQixNQUFNLEdBQUdpQixVQUFVLENBQUNqQixNQUF4QjtBQUNBLFlBQUlBLE1BQU0sQ0FBQ2xILElBQVAsS0FBZ0JQLElBQUksQ0FBQ1EsSUFBckIsSUFBNkJpSCxNQUFNLENBQUNuSCxLQUFQLEtBQWlCcUgsQ0FBQyxDQUFDUSxZQUFwRCxFQUNJVixNQUFNLENBQUNrQixLQUFQLEdBREosS0FHSWxCLE1BQU0sQ0FBQ21CLElBQVA7QUFFUDtBQUNKLEtBaENEO0FBa0NBN0gsSUFBQUEsUUFBUSxDQUFDNEQsZ0JBQVQsQ0FBdUMsZ0JBQXZDLEVBQXlEeUMsT0FBekQsQ0FBaUUsVUFBQUMsQ0FBQyxFQUFJO0FBQ2xFLFVBQU0vRyxLQUFLLEdBQUcrRyxDQUFDLENBQUNFLE9BQUYsQ0FBVSxTQUFWLENBQWQ7QUFDQSxVQUFJLENBQUNqSCxLQUFMLEVBQVksTUFBTXFGLEtBQUssQ0FBQyxzQ0FBRCxDQUFYO0FBQ1osVUFBTWtELFVBQVUsR0FBRyxJQUFJOUIsWUFBSixDQUFpQk0sQ0FBakIsRUFBb0IvRyxLQUFwQixDQUFuQjtBQUNBdUksTUFBQUEsVUFBVSxDQUFDRixLQUFYO0FBRUgsS0FORDtBQU9ILEdBcEREO0FBdURILENBekRELEksQ0EyREE7OztBQUVBLElBQUksQ0FBQ0csT0FBTyxDQUFDQyxTQUFSLENBQWtCQyxPQUF2QixFQUFnQztBQUM1QjtBQUNBRixFQUFBQSxPQUFPLENBQUNDLFNBQVIsQ0FBa0JDLE9BQWxCLEdBQTRCRixPQUFPLENBQUNDLFNBQVIsQ0FBa0JFLGlCQUFsQixJQUN4QkgsT0FBTyxDQUFDQyxTQUFSLENBQWtCRyxxQkFEdEI7QUFFSDs7QUFFRCxJQUFJLENBQUNKLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQnhCLE9BQXZCLEVBQWdDO0FBQzVCO0FBQ0F1QixFQUFBQSxPQUFPLENBQUNDLFNBQVIsQ0FBa0J4QixPQUFsQixHQUE0QixVQUFVNEIsQ0FBVixFQUFhO0FBQ3JDLFFBQUlDLEVBQUUsR0FBRyxJQUFUOztBQUVBLE9BQUc7QUFDQyxVQUFJTixPQUFPLENBQUNDLFNBQVIsQ0FBa0JDLE9BQWxCLENBQTBCSyxJQUExQixDQUErQkQsRUFBL0IsRUFBbUNELENBQW5DLENBQUosRUFBMkMsT0FBT0MsRUFBUCxDQUQ1QyxDQUVDOztBQUNBQSxNQUFBQSxFQUFFLEdBQUdBLEVBQUUsQ0FBQ0UsYUFBSCxJQUFvQkYsRUFBRSxDQUFDRyxVQUE1QjtBQUNILEtBSkQsUUFJU0gsRUFBRSxLQUFLLElBQVAsSUFBZUEsRUFBRSxDQUFDSSxRQUFILEtBQWdCLENBSnhDOztBQUtBLFdBQU8sSUFBUDtBQUNILEdBVEQ7QUFVSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cblNlZSBodHRwczovL2dpdGh1Yi5jb20vRGF2ZVNlaWRtYW4vU3RhcldhcnNXaXBlXG5cblx0VG8gRG9cblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdEZpeCBkaWFnb25hbCB3aXBlXG5cdGZpeCByYWRpYWwgd2lwZVxuXG5cbldlYnlhcm5zIHZlcnNpb246XG4tIEFkZGVkIFwiZGVzdHJveVwiIGZsYWcgYW5kIG1ldGhvZFxuLSBBZGRlZCBzdXBwb3J0IGZvciBgZGF0YS1zdGFydEF0YCB0byBzZXQgc3RhcnQgcGVyY2VudGFnZVxuLSBvbiBkZXN0cm95IHJlbW92ZSBjcmVhdGVkIGVsZW1lbnRzXG4qL1xuXG5lbnVtIE1vZGUge1xuICAgIEFVVE8sIE1VTFRJX1NFQ1RJT05cbn1cblxuaW50ZXJmYWNlIEltYWdlT2JqZWN0IHtcbiAgICBzdGFydFBlcmNlbnRhZ2U6IG51bWJlcjtcbiAgICBmYWRlV2lkdGg6IG51bWJlcjtcbiAgICBmYWRlVHlwZTogc3RyaW5nIHwgbnVsbDtcbiAgICBmYWRlRGVsYXk6IG51bWJlcjtcbiAgICBmYWRlRHVyYXRpb246IG51bWJlcjtcbiAgICBhc3BlY3Q6IG51bWJlcjtcbiAgICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgcHJvcG9ydGlvbmFsOiBib29sZWFuO1xuICAgIHdpZHRoU2NhbGU6IG51bWJlcjtcbiAgICBoZWlnaHRTY2FsZTogbnVtYmVyO1xuICAgIGRpbWVuc2lvbnM6IHsgXCJ3aWR0aFwiOiBudW1iZXIsIFwiaGVpZ2h0XCI6IG51bWJlciB9XG59XG5cbmNsYXNzIFNXV2lwZSB7XG5cbiAgICBjdXJyZW50SWR4ID0gLTE7XG4gICAgd2lkdGg6IG51bWJlciA9IHdpbmRvdy5pbm5lcldpZHRoO1x0XHRcdFx0Ly8gd2lkdGggb2YgY29udGFpbmVyIChiYW5uZXIpXG4gICAgaGVpZ2h0OiBudW1iZXIgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHRcdFx0XHQvLyBoZWlnaHQgb2YgY29udGFpbmVyXG4gICAgYXNwZWN0OiBudW1iZXIgPSB0aGlzLndpZHRoIC8gdGhpcy5oZWlnaHQ7XHRcdFx0XHQvLyBhc3BlY3QgcmF0aW8gb2YgY29udGFpbmVyXG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IGltYWdlQXJyYXk6IEltYWdlT2JqZWN0W107XG4gICAgcHJpdmF0ZSByZWFkb25seSBfYmFja0NhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9mb3JlQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2JhY2tDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfZm9yZWdyb3VuZENvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIHByaXZhdGUgcGVyY2VudDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIHN0YXJ0VGltZTogRGF0ZSA9IG5ldyBEYXRlO1xuICAgIHByaXZhdGUgbmV4dEZhZGVUaW1lcjogTm9kZUpTLlRpbWVvdXQgfCBudWxsID0gbnVsbDtcblxuXG4gICAgcHJpdmF0ZSBnZXQgY3VySW1nKCk6IEltYWdlT2JqZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VBcnJheVt0aGlzLmN1cnJlbnRJZHhdO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IG54dEltZygpOiBJbWFnZU9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLmltYWdlQXJyYXlbKHRoaXMuY3VycmVudElkeCArIDEpICUgdGhpcy5pbWFnZUFycmF5Lmxlbmd0aF07XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgYmFubmVyOiBIVE1MRWxlbWVudCwgcmVhZG9ubHkgb3duZXI6IEhUTUxFbGVtZW50LCByZWFkb25seSBtb2RlOiBNb2RlID0gTW9kZS5BVVRPLCByZWFkb25seSBsb29wID0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBpbWFnZXMgPSBBcnJheS5mcm9tKHRoaXMuYmFubmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIikpO1xuICAgICAgICB0aGlzLmltYWdlQXJyYXkgPSBpbWFnZXMubWFwKGltZyA9PiB7XG4gICAgICAgICAgICBjb25zdCBhc3BlY3QgPSBpbWcud2lkdGggLyBpbWcuaGVpZ2h0O1xuICAgICAgICAgICAgY29uc3QgZmFkZUR1cmF0aW9uID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZUR1cmF0aW9uXCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZhZGVEdXJhdGlvblwiKSkgKiAxMDAwIDogMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVEZWxheSA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZhZGVEZWxheVwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlRGVsYXlcIikpICogMTAwMCA6IDEwMDA7XG4gICAgICAgICAgICBjb25zdCBmYWRlVHlwZSA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZhZGVUeXBlXCIpID8gaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtZmFkZVR5cGVcIikgOiBcImNyb3NzLWxyXCI7XG4gICAgICAgICAgICBjb25zdCBmYWRlV2lkdGggPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1mYWRlV2lkdGhcIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtZmFkZVdpZHRoXCIpKSA6IC4xO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRQZXJjZW50YWdlID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtc3RhcnRBdFwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdGFydEF0XCIpKSA6IDA7XG4gICAgICAgICAgICBjb25zdCBwcm9wb3J0aW9uYWwgPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1wcm9wb3J0aW9uYWxcIik7XG4gICAgICAgICAgICBjb25zdCBoZWlnaHRTY2FsZSA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLXByb3BvcnRpb25hbC1oZWlnaHRcIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtcHJvcG9ydGlvbmFsLWhlaWdodFwiKSkgOiAxO1xuICAgICAgICAgICAgY29uc3Qgd2lkdGhTY2FsZSA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLXByb3BvcnRpb25hbC13aWR0aFwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1wcm9wb3J0aW9uYWwtd2lkdGhcIikpIDogMTtcblxuICAgICAgICAgICAgY29uc3QgZGltZW5zaW9ucyA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogaW1nLndpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogaW1nLmhlaWdodCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaW1nLFxuICAgICAgICAgICAgICAgIGFzcGVjdCxcbiAgICAgICAgICAgICAgICBmYWRlRHVyYXRpb24sXG4gICAgICAgICAgICAgICAgZmFkZURlbGF5LFxuICAgICAgICAgICAgICAgIGZhZGVUeXBlLFxuICAgICAgICAgICAgICAgIGZhZGVXaWR0aCxcbiAgICAgICAgICAgICAgICBzdGFydFBlcmNlbnRhZ2UsXG4gICAgICAgICAgICAgICAgcHJvcG9ydGlvbmFsLFxuICAgICAgICAgICAgICAgIHdpZHRoU2NhbGUsXG4gICAgICAgICAgICAgICAgaGVpZ2h0U2NhbGUsXG4gICAgICAgICAgICAgICAgZGltZW5zaW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuYmFubmVyLmFwcGVuZENoaWxkKHRoaXMuX2JhY2tDYW52YXMpO1xuICAgICAgICB0aGlzLmJhbm5lci5hcHBlbmRDaGlsZCh0aGlzLl9mb3JlQ2FudmFzKTtcbiAgICAgICAgY29uc3QgYmFja0NvbnRleHQgPSB0aGlzLl9iYWNrQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgICAgICBjb25zdCBmb3JlQ29udGV4dCA9IHRoaXMuX2ZvcmVDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICBpZiAoYmFja0NvbnRleHQgPT09IG51bGwgfHwgZm9yZUNvbnRleHQgPT09IG51bGwpIHRocm93IEVycm9yKFwiMmQgY29udGV4dCBub3Qgc3VwcG9ydGVkXCIpXG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0ID0gYmFja0NvbnRleHQ7XG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0ID0gZm9yZUNvbnRleHQ7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG5leHRGYWRlID0gKCkgPT4ge1xuICAgICAgICAvLyBhZHZhbmNlIGluZGljZXNcbiAgICAgICAgdGhpcy5jdXJyZW50SWR4ID0gKyt0aGlzLmN1cnJlbnRJZHggJSB0aGlzLmltYWdlQXJyYXkubGVuZ3RoO1xuICAgICAgICB0aGlzLmRyYXdJbWFnZSgpO1xuXG4gICAgICAgIC8vIGNsZWFyIHRoZSBmb3JlZ3JvdW5kXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgLy8gc2V0dXAgYW5kIHN0YXJ0IHRoZSBmYWRlXG4gICAgICAgIHRoaXMucGVyY2VudCA9IC10aGlzLmN1ckltZy5mYWRlV2lkdGg7XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGU7XG4gICAgICAgIHRoaXMucmVkcmF3KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWRyYXcgPSAoKSA9PiB7XG4gICAgICAgIC8vIGNhbGN1bGF0ZSBwZXJjZW50IGNvbXBsZXRpb24gb2Ygd2lwZVxuICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IG5ldyBEYXRlO1xuICAgICAgICBjb25zdCBlbGFwc2VkID0gY3VycmVudFRpbWUuZ2V0VGltZSgpIC0gdGhpcy5zdGFydFRpbWUuZ2V0VGltZSgpO1xuICAgICAgICB0aGlzLnBlcmNlbnQgPSB0aGlzLmN1ckltZy5zdGFydFBlcmNlbnRhZ2UgKyBlbGFwc2VkIC8gdGhpcy5jdXJJbWcuZmFkZUR1cmF0aW9uO1xuXG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuc2F2ZSgpO1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICBjb25zdCBmYWRlV2lkdGggPSB0aGlzLmN1ckltZy5mYWRlV2lkdGhcblxuICAgICAgICBzd2l0Y2ggKHRoaXMuY3VySW1nLmZhZGVUeXBlKSB7XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1sclwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDApO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1ybFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDApO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy11ZFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgMCwgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAwLCAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJjcm9zcy1kdVwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgMCwgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAwLCAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJkaWFnb25hbC10bC1iclwiOiB7Ly8gRFM6IFRoaXMgZGlhZ29uYWwgbm90IHdvcmtpbmcgcHJvcGVybHlcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMiArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgyICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCBmYWRlV2lkdGggKiAodGhpcy53aWR0aCAvICh0aGlzLmhlaWdodCAvIDIpKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImRpYWdvbmFsLXRyLWJsXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDAsXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCArIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtYnRtXCI6IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzID0gMzAwOyAvLyB0aGUgYW1vdW50IG9mIHNlZ21lbnRzIHRvIHNwbGl0IHRoZSBzZW1pIGNpcmNsZSBpbnRvLCBEUzogYWRqdXN0IHRoaXMgZm9yIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSAxIC8gc2VnbWVudHM7XG5cbiAgICAgICAgICAgICAgICAvLyBleHBhbmQgcGVyY2VudCB0byBjb3ZlciBmYWRlV2lkdGhcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFBlcmNlbnQgPSB0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIGEgcGVyY2VudFxuICAgICAgICAgICAgICAgIGZvciAobGV0IHByY3QgPSAtZmFkZVdpZHRoOyBwcmN0IDwgMSArIGZhZGVXaWR0aDsgcHJjdCArPSBzdGVwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCBwZXJjZW50IHRvIGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gcHJjdCAqIE1hdGguUEk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGNvb3JkaW5hdGVzIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MSA9IE1hdGguY29zKGFuZ2xlICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MSA9IE1hdGguc2luKGFuZ2xlICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MiA9IE1hdGguY29zKGFuZ2xlICsgbGVuICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MiA9IE1hdGguc2luKGFuZ2xlICsgbGVuICsgTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBhbHBoYSBmb3Igd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxwaGEgPSAoYWRqdXN0ZWRQZXJjZW50IC0gcHJjdCArIGZhZGVXaWR0aCkgLyBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZHJhdyB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubW92ZVRvKHRoaXMud2lkdGggLyAyIC0gMiwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8oeDEsIHkxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgyLCB5Mik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh0aGlzLndpZHRoIC8gMiArIDIsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsJyArIGFscGhhICsgJyknO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtdG9wXCI6IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzID0gMzAwOyAvLyB0aGUgYW1vdW50IG9mIHNlZ21lbnRzIHRvIHNwbGl0IHRoZSBzZW1pIGNpcmNsZSBpbnRvLCBEUzogYWRqdXN0IHRoaXMgZm9yIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSAxIC8gc2VnbWVudHM7XG5cbiAgICAgICAgICAgICAgICAvLyBleHBhbmQgcGVyY2VudCB0byBjb3ZlciBmYWRlV2lkdGhcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZFBlcmNlbnQgPSB0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIGEgcGVyY2VudFxuICAgICAgICAgICAgICAgIGZvciAobGV0IHBlcmNlbnQgPSAtZmFkZVdpZHRoOyBwZXJjZW50IDwgMSArIGZhZGVXaWR0aDsgcGVyY2VudCArPSBzdGVwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCBwZXJjZW50IHRvIGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gcGVyY2VudCAqIE1hdGguUEk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGNvb3JkaW5hdGVzIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MSA9IE1hdGguY29zKGFuZ2xlICsgbGVuICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTEgPSBNYXRoLnNpbihhbmdsZSArIGxlbiArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MiA9IE1hdGguY29zKGFuZ2xlICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTIgPSBNYXRoLnNpbihhbmdsZSArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGFscGhhIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbHBoYSA9IChhZGp1c3RlZFBlcmNlbnQgLSBwZXJjZW50ICsgZmFkZVdpZHRoKSAvIGZhZGVXaWR0aDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBkcmF3IHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5tb3ZlVG8odGhpcy53aWR0aCAvIDIgLSAyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgxLCB5MSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh4MiwgeTIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8odGhpcy53aWR0aCAvIDIgKyAyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsJyArIGFscGhhICsgJyknO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtb3V0XCI6XG4gICAgICAgICAgICBjYXNlIFwicmFkaWFsLWluXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwZXJjZW50ID0gdGhpcy5jdXJJbWcuZmFkZVR5cGUgPT09IFwicmFkaWFsLWluXCIgPyAoMSAtIHRoaXMucGVyY2VudCkgOiB0aGlzLnBlcmNlbnRcbiAgICAgICAgICAgICAgICBjb25zdCB3aWR0aCA9IDEwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRTdGF0ZSA9IDAuMDFcbiAgICAgICAgICAgICAgICBjb25zdCBpbm5lclJhZGl1cyA9IChwZXJjZW50KSAqIHRoaXMuaGVpZ2h0IC0gd2lkdGggPCAwID8gZW5kU3RhdGUgOiAocGVyY2VudCkgKiB0aGlzLmhlaWdodCAtIHdpZHRoO1xuICAgICAgICAgICAgICAgIGNvbnN0IG91dGVyUmFkaXVzID0gcGVyY2VudCAqIHRoaXMuaGVpZ2h0ICsgd2lkdGhcbiAgICAgICAgICAgICAgICAvKmlmICh0aGlzLmN1ckltZy5mYWRlVHlwZSA9PT0gXCJyYWRpYWwtaW5cIil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUudGFibGUoe1wicGVyY2VudFwiOiBwZXJjZW50LFwiaW5uZXJSYWRpdXNcIjogaW5uZXJSYWRpdXMsIFwib3V0ZXJSYWRpdXNcIjogb3V0ZXJSYWRpdXMgfSlcbiAgICAgICAgICAgICAgICB9Ki9cblxuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyAyLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAvIDIsIGlubmVyUmFkaXVzLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoIC8gMixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgLyAyLCBvdXRlclJhZGl1cyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VySW1nLmZhZGVUeXBlID09PSBcInJhZGlhbC1pblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gdGhpcy5ueHRJbWcucHJvcG9ydGlvbmFsID8gXCJzb3VyY2UtYXRvcFwiIDogXCJzb3VyY2UtaW5cIjtcbiAgICAgICAgdGhpcy5fZHJhdyh0aGlzLm54dEltZywgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQsIHRoaXMuX2JhY2tDb250ZXh0KVxuXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LnJlc3RvcmUoKTtcblxuXG4gICAgICAgIGlmIChlbGFwc2VkIDwgdGhpcy5jdXJJbWcuZmFkZUR1cmF0aW9uKVxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlZHJhdyk7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMubW9kZSA9PT0gTW9kZS5BVVRPKVxuICAgICAgICAgICAgaWYgKHRoaXMubG9vcCB8fCB0aGlzLmN1cnJlbnRJZHggPCB0aGlzLmltYWdlQXJyYXkubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRGYWRlVGltZXIgPSBzZXRUaW1lb3V0KHRoaXMubmV4dEZhZGUsIHRoaXMuY3VySW1nLmZhZGVEZWxheSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZHJhdyhpOiBJbWFnZU9iamVjdCwgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG90aGVyQ3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICAgICAgaWYgKGkucHJvcG9ydGlvbmFsKSB7XG4gICAgICAgICAgICBjb25zdCBjYW52YXNXaWR0aE1pZGRsZSA9IGN0eC5jYW52YXMud2lkdGggLyAyO1xuICAgICAgICAgICAgY29uc3QgY2FudmFzSGVpZ2h0TWlkZGxlID0gY3R4LmNhbnZhcy5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgY29uc3QgZyA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudChjYW52YXNXaWR0aE1pZGRsZSwgY2FudmFzSGVpZ2h0TWlkZGxlLCAwLCBjYW52YXNXaWR0aE1pZGRsZSwgY2FudmFzSGVpZ2h0TWlkZGxlLCBNYXRoLm1heChjYW52YXNXaWR0aE1pZGRsZSwgY2FudmFzSGVpZ2h0TWlkZGxlKSlcbiAgICAgICAgICAgIGcuYWRkQ29sb3JTdG9wKDAsIFwiIzVjYjhmOFwiKVxuICAgICAgICAgICAgZy5hZGRDb2xvclN0b3AoMSwgXCIjNDY0ODQ4XCIpXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZztcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIGNvbnN0IGhyID0gLjk4O1xuICAgICAgICAgICAgY29uc3Qgd3IgPSAuMzMzO1xuICAgICAgICAgICAgY29uc3QgaCA9IHRoaXMuaGVpZ2h0ICogaS5oZWlnaHRTY2FsZVxuICAgICAgICAgICAgY29uc3QgdyA9IHRoaXMud2lkdGggKiBpLndpZHRoU2NhbGVcbiAgICAgICAgICAgIGNvbnN0IHIgPSAxXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKFxuICAgICAgICAgICAgICAgIGkuaW1nLFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyAyIC0gdyAvIDIsXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgLyAyIC0gaCAvIDIsXG4gICAgICAgICAgICAgICAgdywgaClcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFzcGVjdCA+IGkuYXNwZWN0KSB7XG5cbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaS5pbWcsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAodGhpcy5oZWlnaHQgLSB0aGlzLndpZHRoIC8gaS5hc3BlY3QpIC8gMixcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyBpLmFzcGVjdCk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaS5pbWcsXG4gICAgICAgICAgICAgICAgKHRoaXMud2lkdGggLSB0aGlzLmhlaWdodCAqIGkuYXNwZWN0KSAvIDIsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAqIGkuYXNwZWN0LFxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNpemUoKSB7XG5cbiAgICAgICAgdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7IC8vIERTOiBmaXggZm9yIGlPUyA5IGJ1Z1xuICAgICAgICB0aGlzLmFzcGVjdCA9IHRoaXMud2lkdGggLyB0aGlzLmhlaWdodDtcblxuICAgICAgICB0aGlzLl9iYWNrQ29udGV4dC5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLl9iYWNrQ29udGV4dC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgIHRoaXMuZHJhd0ltYWdlKCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgZHJhd0ltYWdlKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJJbWcpIHtcbiAgICAgICAgICAgIHRoaXMuX2RyYXcodGhpcy5jdXJJbWcsIHRoaXMuX2JhY2tDb250ZXh0LCB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwibm8gaW1hZ2UgXCIgKyB0aGlzLmN1cnJlbnRJZHggKyBcIiBcIiArIHRoaXMuaW1hZ2VBcnJheS5sZW5ndGgpXG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRJZHggPSAtMVxuICAgICAgICB0aGlzLm5leHRGYWRlKCk7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5uZXh0RmFkZVRpbWVyICYmIGNsZWFyVGltZW91dCh0aGlzLm5leHRGYWRlVGltZXIpXG4gICAgfVxuXG4gICAgbmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMubW9kZSAhPT0gTW9kZS5NVUxUSV9TRUNUSU9OKVxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJUaGlzIHN3d2lwZSBvcGVyYXRlcyBpbiBBVVRPIG1vZGVcIilcbiAgICAgICAgdGhpcy5uZXh0RmFkZSgpXG4gICAgfVxuXG5cbiAgICBnZXQgbnVtYmVyT2ZGYWRlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VBcnJheS5sZW5ndGhcbiAgICB9XG59XG5cbmNsYXNzIFNXV2lwZVN0YXRpYyB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBoZWlnaHRTY2FsZTogbnVtYmVyO1xuICAgIHByaXZhdGUgd2lkdGhTY2FsZTogbnVtYmVyO1xuXG4gICAgd2lkdGg6IG51bWJlciA9IHdpbmRvdy5pbm5lcldpZHRoO1x0XHRcdFx0Ly8gd2lkdGggb2YgY29udGFpbmVyIChiYW5uZXIpXG4gICAgaGVpZ2h0OiBudW1iZXIgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHRcdFx0XHQvLyBoZWlnaHQgb2YgY29udGFpbmVyXG5cblxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2NhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9jb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBiYW5uZXI6IEhUTUxFbGVtZW50LCByZWFkb25seSBvd25lcjogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgaW1hZ2VzID0gQXJyYXkuZnJvbSh0aGlzLmJhbm5lci5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpKTtcbiAgICAgICAgaWYgKGltYWdlcy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiV2FzIGV4cGVjdGluZyBhIHNpbmdsZSBpbWcgZm9yIHN0YXRpYy1iYW5uZXJcIilcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmltZyA9IGltYWdlc1swXVxuICAgICAgICB0aGlzLmhlaWdodFNjYWxlID0gaW1hZ2VzWzBdLmhhc0F0dHJpYnV0ZShcImRhdGEtcHJvcG9ydGlvbmFsLWhlaWdodFwiKSA/IE51bWJlcih0aGlzLmltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXByb3BvcnRpb25hbC1oZWlnaHRcIikpIDogMTtcbiAgICAgICAgdGhpcy53aWR0aFNjYWxlID0gaW1hZ2VzWzBdLmhhc0F0dHJpYnV0ZShcImRhdGEtcHJvcG9ydGlvbmFsLXdpZHRoXCIpID8gTnVtYmVyKHRoaXMuaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtcHJvcG9ydGlvbmFsLXdpZHRoXCIpKSA6IDE7XG5cbiAgICAgICAgdGhpcy5iYW5uZXIuYXBwZW5kQ2hpbGQodGhpcy5fY2FudmFzKTtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXMuX2NhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICAgICAgaWYgKGNvbnRleHQgPT09IG51bGwpIHRocm93IEVycm9yKFwiMmQgY29udGV4dCBub3Qgc3VwcG9ydGVkXCIpXG4gICAgICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuICAgICAgdGhpcy5fY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcInNvdXJjZS1vdmVyXCI7XG4gICAgICAgIHRoaXMuaW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsKCk9PiB0aGlzLmRyYXcoKSlcbiAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICAgLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplKTtcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICB9XG4gICAgZHJhdygpIHtcblxuXG4gICAgICAgIGNvbnN0IGNhbnZhc1dpZHRoTWlkZGxlID0gdGhpcy5fY29udGV4dC5jYW52YXMud2lkdGggLyAyO1xuICAgICAgICBjb25zdCBjYW52YXNIZWlnaHRNaWRkbGUgPSB0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQgLyAyO1xuICAgICAgICBjb25zdCBnID0gdGhpcy5fY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudChjYW52YXNXaWR0aE1pZGRsZSwgY2FudmFzSGVpZ2h0TWlkZGxlLCAwLCBjYW52YXNXaWR0aE1pZGRsZSwgY2FudmFzSGVpZ2h0TWlkZGxlLCBNYXRoLm1heChjYW52YXNXaWR0aE1pZGRsZSwgY2FudmFzSGVpZ2h0TWlkZGxlKSlcbiAgICAgICAgZy5hZGRDb2xvclN0b3AoMCwgXCIjNWNiOGY4XCIpXG4gICAgICAgIGcuYWRkQ29sb3JTdG9wKDEsIFwiIzQ2NDg0OFwiKVxuICAgICAgICB0aGlzLl9jb250ZXh0LnNhdmUoKTtcbiAgICAgICAgdGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBnO1xuICAgICAgICB0aGlzLl9jb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoLCB0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQpXG4gICAgICAgIGNvbnN0IGggPSB0aGlzLmhlaWdodCAqIHRoaXMuaGVpZ2h0U2NhbGVcbiAgICAgICAgY29uc3QgdyA9IHRoaXMud2lkdGggKiB0aGlzLndpZHRoU2NhbGVcbiAgICAgICAgdGhpcy5fY29udGV4dC5yZXN0b3JlKCk7XG4gICAgICAgIHRoaXMuX2NvbnRleHQuZHJhd0ltYWdlKFxuICAgICAgICAgICAgdGhpcy5pbWcsXG4gICAgICAgICAgICB0aGlzLndpZHRoIC8gMiAtIHcgLyAyLFxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgLyAyIC0gaCAvIDIsXG4gICAgICAgICAgICB3LCBoKVxuXG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2l6ZSgpIHtcblxuICAgICAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDsgLy8gRFM6IGZpeCBmb3IgaU9TIDkgYnVnXG5cbiAgICAgICAgdGhpcy5fY29udGV4dC5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuXG4gICAgICAgIHRoaXMuZHJhdygpO1xuICAgIH07XG5cblxuXG59XG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmJhbm5lclwiKS5mb3JFYWNoKGIgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZTogTW9kZSA9IGIuaGFzQXR0cmlidXRlKFwiZGF0YS1tdWx0aS1zd2lwZVwiKSA/IE1vZGUuTVVMVElfU0VDVElPTiA6IE1vZGUuQVVUT1xuICAgICAgICAgICAgY29uc3Qgbm9Mb29wOiBib29sZWFuID0gYi5oYXNBdHRyaWJ1dGUoXCJkYXRhLW5vLWxvb3BcIilcbiAgICAgICAgICAgIGNvbnN0IG93bmVyID0gYi5jbG9zZXN0KFwic2VjdGlvblwiKVxuICAgICAgICAgICAgaWYgKCFvd25lcikgdGhyb3cgRXJyb3IoXCJiYW5uZXIgZWxlbWVudCBub3QgcGFydCBvZiBhIHNlY3Rpb25cIilcbiAgICAgICAgICAgIGNvbnN0IHdpcGUgPSBuZXcgU1dXaXBlKGIsIG93bmVyLCBtb2RlLCAhbm9Mb29wKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGIuc3N3aXBlID0gd2lwZTtcbiAgICAgICAgfSlcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihcInNsaWRlY2hhbmdlZFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJldkJhbm5lciA9IGUucHJldmlvdXNTbGlkZT8ucXVlcnlTZWxlY3RvcihcIi5iYW5uZXJcIik7XG4gICAgICAgICAgICBpZiAocHJldkJhbm5lcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdpcGUgPSBwcmV2QmFubmVyLnNzd2lwZSBhcyBTV1dpcGU7XG4gICAgICAgICAgICAgICAgaWYgKHdpcGUubW9kZSA9PT0gTW9kZS5BVVRPKVxuICAgICAgICAgICAgICAgICAgICB3aXBlLnN0b3AoKTtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3duZXJJbmRleDogeyBoOiBudW1iZXI7IHY6IG51bWJlcjsgfSA9IFJldmVhbC5nZXRJbmRpY2VzKHdpcGUub3duZXIpXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleDogeyBoOiBudW1iZXI7IHY6IG51bWJlcjsgfSA9IFJldmVhbC5nZXRJbmRpY2VzKGUuY3VycmVudFNsaWRlKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IGUuY3VycmVudFNsaWRlLmluZGV4ViA/XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXgudiAtIChvd25lckluZGV4LnYgfHwgMCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4LmggLSBvd25lckluZGV4LmhcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPiAwICYmIGRpc3RhbmNlIDwgd2lwZS5udW1iZXJPZkZhZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLmN1cnJlbnRTbGlkZS5hcHBlbmRDaGlsZCh3aXBlLmJhbm5lcilcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpcGUuc3RvcCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB3aXBlLm93bmVyLmFwcGVuZENoaWxkKHdpcGUuYmFubmVyKVxuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5leHRCYW5uZXIgPSBlLmN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yKFwiLmJhbm5lclwiKTtcbiAgICAgICAgICAgIGlmIChuZXh0QmFubmVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNzd2lwZSA9IG5leHRCYW5uZXIuc3N3aXBlIGFzIFNXV2lwZTtcbiAgICAgICAgICAgICAgICBpZiAoc3N3aXBlLm1vZGUgPT09IE1vZGUuQVVUTyB8fCBzc3dpcGUub3duZXIgPT09IGUuY3VycmVudFNsaWRlKVxuICAgICAgICAgICAgICAgICAgICBzc3dpcGUuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHNzd2lwZS5uZXh0KCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi5zdGF0aWMtYmFubmVyXCIpLmZvckVhY2goYiA9PiB7XG4gICAgICAgICAgICBjb25zdCBvd25lciA9IGIuY2xvc2VzdChcInNlY3Rpb25cIilcbiAgICAgICAgICAgIGlmICghb3duZXIpIHRocm93IEVycm9yKFwiYmFubmVyIGVsZW1lbnQgbm90IHBhcnQgb2YgYSBzZWN0aW9uXCIpXG4gICAgICAgICAgICBjb25zdCBzdGF0aWNXaXBlID0gbmV3IFNXV2lwZVN0YXRpYyhiLCBvd25lcilcbiAgICAgICAgICAgIHN0YXRpY1dpcGUuc3RhcnQoKVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuXG59KSgpXG5cbi8vIGBjbG9zZXN0YCBQb2x5ZmlsbCBmb3IgSUVcblxuaWYgKCFFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgPSBFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS53ZWJraXRNYXRjaGVzU2VsZWN0b3I7XG59XG5cbmlmICghRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCkge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0ID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgbGV0IGVsID0gdGhpcztcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBpZiAoRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcy5jYWxsKGVsLCBzKSkgcmV0dXJuIGVsO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50IHx8IGVsLnBhcmVudE5vZGU7XG4gICAgICAgIH0gd2hpbGUgKGVsICE9PSBudWxsICYmIGVsLm5vZGVUeXBlID09PSAxKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbn1cblxuXG5cbiJdfQ==