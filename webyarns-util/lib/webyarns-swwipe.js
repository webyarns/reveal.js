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

      _this._foregroundContext.globalCompositeOperation = _this.nxtImg.cover ? "source-atop" : "source-in";

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
      var cover = img.hasAttribute("data-cover");
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
        cover: cover,
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
      if (i.cover) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy1zd3dpcGUudHMiXSwibmFtZXMiOlsiTW9kZSIsIlNXV2lwZSIsImltYWdlQXJyYXkiLCJjdXJyZW50SWR4IiwibGVuZ3RoIiwiYmFubmVyIiwib3duZXIiLCJtb2RlIiwiQVVUTyIsImxvb3AiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJ3aWR0aCIsImhlaWdodCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIkRhdGUiLCJkcmF3SW1hZ2UiLCJfZm9yZWdyb3VuZENvbnRleHQiLCJjbGVhclJlY3QiLCJwZXJjZW50IiwiY3VySW1nIiwiZmFkZVdpZHRoIiwic3RhcnRUaW1lIiwicmVkcmF3IiwiY3VycmVudFRpbWUiLCJlbGFwc2VkIiwiZ2V0VGltZSIsInN0YXJ0UGVyY2VudGFnZSIsImZhZGVEdXJhdGlvbiIsInNhdmUiLCJmYWRlVHlwZSIsImdyYWRpZW50IiwiY3JlYXRlTGluZWFyR3JhZGllbnQiLCJhZGRDb2xvclN0b3AiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsInNlZ21lbnRzIiwibGVuIiwiTWF0aCIsIlBJIiwic3RlcCIsImFkanVzdGVkUGVyY2VudCIsInByY3QiLCJhbmdsZSIsIngxIiwiY29zIiwieTEiLCJzaW4iLCJ4MiIsInkyIiwiYWxwaGEiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJmaWxsIiwiZW5kU3RhdGUiLCJpbm5lclJhZGl1cyIsIm91dGVyUmFkaXVzIiwiY3JlYXRlUmFkaWFsR3JhZGllbnQiLCJnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24iLCJueHRJbWciLCJjb3ZlciIsIl9kcmF3IiwiX2JhY2tDb250ZXh0IiwicmVzdG9yZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm5leHRGYWRlVGltZXIiLCJzZXRUaW1lb3V0IiwibmV4dEZhZGUiLCJmYWRlRGVsYXkiLCJpbWFnZXMiLCJBcnJheSIsImZyb20iLCJxdWVyeVNlbGVjdG9yQWxsIiwibWFwIiwiaW1nIiwiYXNwZWN0IiwiaGFzQXR0cmlidXRlIiwiTnVtYmVyIiwiZ2V0QXR0cmlidXRlIiwiZGltZW5zaW9ucyIsImFwcGVuZENoaWxkIiwiX2JhY2tDYW52YXMiLCJfZm9yZUNhbnZhcyIsImJhY2tDb250ZXh0IiwiZ2V0Q29udGV4dCIsImZvcmVDb250ZXh0IiwiRXJyb3IiLCJpbWFnZVNtb290aGluZ0VuYWJsZWQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVzaXplIiwiaSIsImN0eCIsIm90aGVyQ3R4IiwiY2FudmFzV2lkdGhNaWRkbGUiLCJjYW52YXMiLCJjYW52YXNIZWlnaHRNaWRkbGUiLCJnIiwibWF4IiwiY29udGFpbiIsIm9mZnNldFgiLCJvZmZzZXRZIiwiZG9jdW1lbnRFbGVtZW50IiwiY2xpZW50SGVpZ2h0IiwiY2xlYXJUaW1lb3V0IiwiTVVMVElfU0VDVElPTiIsIlNXV2lwZVN0YXRpYyIsIl9jYW52YXMiLCJjb250ZXh0IiwiX2NvbnRleHQiLCJkcmF3IiwiZm9yRWFjaCIsImIiLCJub0xvb3AiLCJjbG9zZXN0Iiwid2lwZSIsInNzd2lwZSIsIlJldmVhbCIsImUiLCJwcmV2QmFubmVyIiwicHJldmlvdXNTbGlkZSIsInF1ZXJ5U2VsZWN0b3IiLCJzdG9wIiwib3duZXJJbmRleCIsImdldEluZGljZXMiLCJjdXJyZW50SW5kZXgiLCJjdXJyZW50U2xpZGUiLCJkaXN0YW5jZSIsImluZGV4ViIsInYiLCJoIiwiY29uc29sZSIsImxvZyIsIm51bWJlck9mRmFkZXMiLCJuZXh0QmFubmVyIiwic3RhcnQiLCJuZXh0Iiwic3RhdGljV2lwZSIsIkVsZW1lbnQiLCJwcm90b3R5cGUiLCJtYXRjaGVzIiwibXNNYXRjaGVzU2VsZWN0b3IiLCJ3ZWJraXRNYXRjaGVzU2VsZWN0b3IiLCJzIiwiZWwiLCJjYWxsIiwicGFyZW50RWxlbWVudCIsInBhcmVudE5vZGUiLCJub2RlVHlwZSIsImNhbnZhc1dpZHRoIiwiY2FudmFzSEVpZ2h0IiwiaW1nV2lkdGgiLCJpbWdIZWlnaHQiLCJjaGls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QUFBLE1BQU0sRUFBTkEsTUFGRztBQUdId0YsSUFBQUEsT0FBTyxFQUFFLENBQUNpRCxXQUFXLEdBQUcxSSxLQUFmLElBQXdCeUYsT0FIOUI7QUFJSEMsSUFBQUEsT0FBTyxFQUFFLENBQUNpRCxZQUFZLEdBQUcxSSxNQUFoQixJQUEwQnlGO0FBSmhDLEdBQVA7QUFNSCxDQWxCRCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cblNlZSBodHRwczovL2dpdGh1Yi5jb20vRGF2ZVNlaWRtYW4vU3RhcldhcnNXaXBlXG5cblx0VG8gRG9cblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdEZpeCBkaWFnb25hbCB3aXBlXG5cdGZpeCByYWRpYWwgd2lwZVxuXG5cbldlYnlhcm5zIHZlcnNpb246XG4tIEFkZGVkIFwiZGVzdHJveVwiIGZsYWcgYW5kIG1ldGhvZFxuLSBBZGRlZCBzdXBwb3J0IGZvciBgZGF0YS1zdGFydEF0YCB0byBzZXQgc3RhcnQgcGVyY2VudGFnZVxuLSBvbiBkZXN0cm95IHJlbW92ZSBjcmVhdGVkIGVsZW1lbnRzXG4qL1xuXG5lbnVtIE1vZGUge1xuICAgIEFVVE8sIE1VTFRJX1NFQ1RJT05cbn1cblxuaW50ZXJmYWNlIEltYWdlT2JqZWN0IHtcbiAgICBzdGFydFBlcmNlbnRhZ2U6IG51bWJlcjtcbiAgICBmYWRlV2lkdGg6IG51bWJlcjtcbiAgICBmYWRlVHlwZTogc3RyaW5nIHwgbnVsbDtcbiAgICBmYWRlRGVsYXk6IG51bWJlcjtcbiAgICBmYWRlRHVyYXRpb246IG51bWJlcjtcbiAgICBhc3BlY3Q6IG51bWJlcjtcbiAgICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgY292ZXI6IGJvb2xlYW47XG4gICAgZGltZW5zaW9uczogeyBcIndpZHRoXCI6IG51bWJlciwgXCJoZWlnaHRcIjogbnVtYmVyIH1cbn1cblxuY2xhc3MgU1dXaXBlIHtcblxuICAgIGN1cnJlbnRJZHggPSAtMTtcbiAgICB3aWR0aDogbnVtYmVyID0gd2luZG93LmlubmVyV2lkdGg7XHRcdFx0XHQvLyB3aWR0aCBvZiBjb250YWluZXIgKGJhbm5lcilcbiAgICBoZWlnaHQ6IG51bWJlciA9IHdpbmRvdy5pbm5lckhlaWdodDtcdFx0XHRcdC8vIGhlaWdodCBvZiBjb250YWluZXJcbiAgICBhc3BlY3Q6IG51bWJlciA9IHRoaXMud2lkdGggLyB0aGlzLmhlaWdodDtcdFx0XHRcdC8vIGFzcGVjdCByYXRpbyBvZiBjb250YWluZXJcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgaW1hZ2VBcnJheTogSW1hZ2VPYmplY3RbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9iYWNrQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZvcmVDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfYmFja0NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9mb3JlZ3JvdW5kQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgcHJpdmF0ZSBwZXJjZW50OiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgc3RhcnRUaW1lOiBEYXRlID0gbmV3IERhdGU7XG4gICAgcHJpdmF0ZSBuZXh0RmFkZVRpbWVyOiBOb2RlSlMuVGltZW91dCB8IG51bGwgPSBudWxsO1xuXG5cbiAgICBwcml2YXRlIGdldCBjdXJJbWcoKTogSW1hZ2VPYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZUFycmF5W3RoaXMuY3VycmVudElkeF07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgbnh0SW1nKCk6IEltYWdlT2JqZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VBcnJheVsodGhpcy5jdXJyZW50SWR4ICsgMSkgJSB0aGlzLmltYWdlQXJyYXkubGVuZ3RoXTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBiYW5uZXI6IEhUTUxFbGVtZW50LCByZWFkb25seSBvd25lcjogSFRNTEVsZW1lbnQsIHJlYWRvbmx5IG1vZGU6IE1vZGUgPSBNb2RlLkFVVE8sIHJlYWRvbmx5IGxvb3AgPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGltYWdlcyA9IEFycmF5LmZyb20odGhpcy5iYW5uZXIucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKSk7XG4gICAgICAgIHRoaXMuaW1hZ2VBcnJheSA9IGltYWdlcy5tYXAoaW1nID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFzcGVjdCA9IGltZy53aWR0aCAvIGltZy5oZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBmYWRlRHVyYXRpb24gPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1mYWRlRHVyYXRpb25cIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtZmFkZUR1cmF0aW9uXCIpKSAqIDEwMDAgOiAxMDAwO1xuICAgICAgICAgICAgY29uc3QgZmFkZURlbGF5ID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZURlbGF5XCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZhZGVEZWxheVwiKSkgKiAxMDAwIDogMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVUeXBlID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZVR5cGVcIikgPyBpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlVHlwZVwiKSA6IFwiY3Jvc3MtbHJcIjtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVXaWR0aCA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZhZGVXaWR0aFwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlV2lkdGhcIikpIDogLjE7XG4gICAgICAgICAgICBjb25zdCBzdGFydFBlcmNlbnRhZ2UgPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1zdGFydEF0XCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0YXJ0QXRcIikpIDogMDtcbiAgICAgICAgICAgIGNvbnN0IGNvdmVyID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtY292ZXJcIik7XG5cbiAgICAgICAgICAgIGNvbnN0IGRpbWVuc2lvbnMgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IGltZy53aWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGltZy5oZWlnaHQsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgICAgICBhc3BlY3QsXG4gICAgICAgICAgICAgICAgZmFkZUR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGZhZGVEZWxheSxcbiAgICAgICAgICAgICAgICBmYWRlVHlwZSxcbiAgICAgICAgICAgICAgICBmYWRlV2lkdGgsXG4gICAgICAgICAgICAgICAgc3RhcnRQZXJjZW50YWdlLFxuICAgICAgICAgICAgICAgIGNvdmVyLFxuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmJhbm5lci5hcHBlbmRDaGlsZCh0aGlzLl9iYWNrQ2FudmFzKTtcbiAgICAgICAgdGhpcy5iYW5uZXIuYXBwZW5kQ2hpbGQodGhpcy5fZm9yZUNhbnZhcyk7XG4gICAgICAgIGNvbnN0IGJhY2tDb250ZXh0ID0gdGhpcy5fYmFja0NhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICAgICAgY29uc3QgZm9yZUNvbnRleHQgPSB0aGlzLl9mb3JlQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgaWYgKGJhY2tDb250ZXh0ID09PSBudWxsIHx8IGZvcmVDb250ZXh0ID09PSBudWxsKSB0aHJvdyBFcnJvcihcIjJkIGNvbnRleHQgbm90IHN1cHBvcnRlZFwiKVxuICAgICAgICB0aGlzLl9iYWNrQ29udGV4dCA9IGJhY2tDb250ZXh0O1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dCA9IGZvcmVDb250ZXh0O1xuICAgICAgICB0aGlzLl9iYWNrQ29udGV4dC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBuZXh0RmFkZSA9ICgpID0+IHtcbiAgICAgICAgLy8gYWR2YW5jZSBpbmRpY2VzXG4gICAgICAgIHRoaXMuY3VycmVudElkeCA9ICsrdGhpcy5jdXJyZW50SWR4ICUgdGhpcy5pbWFnZUFycmF5Lmxlbmd0aDtcbiAgICAgICAgdGhpcy5kcmF3SW1hZ2UoKTtcblxuICAgICAgICAvLyBjbGVhciB0aGUgZm9yZWdyb3VuZFxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgIC8vIHNldHVwIGFuZCBzdGFydCB0aGUgZmFkZVxuICAgICAgICB0aGlzLnBlcmNlbnQgPSAtdGhpcy5jdXJJbWcuZmFkZVdpZHRoO1xuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IG5ldyBEYXRlO1xuICAgICAgICB0aGlzLnJlZHJhdygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVkcmF3ID0gKCkgPT4ge1xuICAgICAgICAvLyBjYWxjdWxhdGUgcGVyY2VudCBjb21wbGV0aW9uIG9mIHdpcGVcbiAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBuZXcgRGF0ZTtcbiAgICAgICAgY29uc3QgZWxhcHNlZCA9IGN1cnJlbnRUaW1lLmdldFRpbWUoKSAtIHRoaXMuc3RhcnRUaW1lLmdldFRpbWUoKTtcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gdGhpcy5jdXJJbWcuc3RhcnRQZXJjZW50YWdlICsgZWxhcHNlZCAvIHRoaXMuY3VySW1nLmZhZGVEdXJhdGlvbjtcblxuXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LnNhdmUoKTtcbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgY29uc3QgZmFkZVdpZHRoID0gdGhpcy5jdXJJbWcuZmFkZVdpZHRoXG5cbiAgICAgICAgc3dpdGNoICh0aGlzLmN1ckltZy5mYWRlVHlwZSkge1xuXG4gICAgICAgICAgICBjYXNlIFwiY3Jvc3MtbHJcIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwiY3Jvc3MtcmxcIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICgoMSAtIHRoaXMucGVyY2VudCkgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCxcbiAgICAgICAgICAgICAgICAgICAgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwiY3Jvc3MtdWRcIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgIDAsICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgMCwgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwiY3Jvc3MtZHVcIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgIDAsICgoMSAtIHRoaXMucGVyY2VudCkgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgMCwgKCgxIC0gdGhpcy5wZXJjZW50KSAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwiZGlhZ29uYWwtdGwtYnJcIjogey8vIERTOiBUaGlzIGRpYWdvbmFsIG5vdCB3b3JraW5nIHByb3Blcmx5XG5cbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDIgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDAsXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMiArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgZmFkZVdpZHRoICogKHRoaXMud2lkdGggLyAodGhpcy5oZWlnaHQgLyAyKSkgKiB0aGlzLndpZHRoKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJkaWFnb25hbC10ci1ibFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGggKyB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwicmFkaWFsLWJ0bVwiOiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50cyA9IDMwMDsgLy8gdGhlIGFtb3VudCBvZiBzZWdtZW50cyB0byBzcGxpdCB0aGUgc2VtaSBjaXJjbGUgaW50bywgRFM6IGFkanVzdCB0aGlzIGZvciBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgICAgIGNvbnN0IGxlbiA9IE1hdGguUEkgLyBzZWdtZW50cztcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwID0gMSAvIHNlZ21lbnRzO1xuXG4gICAgICAgICAgICAgICAgLy8gZXhwYW5kIHBlcmNlbnQgdG8gY292ZXIgZmFkZVdpZHRoXG4gICAgICAgICAgICAgICAgY29uc3QgYWRqdXN0ZWRQZXJjZW50ID0gdGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoO1xuXG4gICAgICAgICAgICAgICAgLy8gaXRlcmF0ZSBhIHBlcmNlbnRcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwcmN0ID0gLWZhZGVXaWR0aDsgcHJjdCA8IDEgKyBmYWRlV2lkdGg7IHByY3QgKz0gc3RlcCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgcGVyY2VudCB0byBhbmdsZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IHByY3QgKiBNYXRoLlBJO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBjb29yZGluYXRlcyBmb3Igd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeDEgPSBNYXRoLmNvcyhhbmdsZSArIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTEgPSBNYXRoLnNpbihhbmdsZSArIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeDIgPSBNYXRoLmNvcyhhbmdsZSArIGxlbiArIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTIgPSBNYXRoLnNpbihhbmdsZSArIGxlbiArIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMikgKyB0aGlzLmhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgYWxwaGEgZm9yIHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFscGhhID0gKGFkanVzdGVkUGVyY2VudCAtIHByY3QgKyBmYWRlV2lkdGgpIC8gZmFkZVdpZHRoO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGRyYXcgd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0Lm1vdmVUbyh0aGlzLndpZHRoIC8gMiAtIDIsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgxLCB5MSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh4MiwgeTIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8odGhpcy53aWR0aCAvIDIgKyAyLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsMCwwLCcgKyBhbHBoYSArICcpJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwicmFkaWFsLXRvcFwiOiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50cyA9IDMwMDsgLy8gdGhlIGFtb3VudCBvZiBzZWdtZW50cyB0byBzcGxpdCB0aGUgc2VtaSBjaXJjbGUgaW50bywgRFM6IGFkanVzdCB0aGlzIGZvciBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgICAgIGNvbnN0IGxlbiA9IE1hdGguUEkgLyBzZWdtZW50cztcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwID0gMSAvIHNlZ21lbnRzO1xuXG4gICAgICAgICAgICAgICAgLy8gZXhwYW5kIHBlcmNlbnQgdG8gY292ZXIgZmFkZVdpZHRoXG4gICAgICAgICAgICAgICAgY29uc3QgYWRqdXN0ZWRQZXJjZW50ID0gdGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoO1xuXG4gICAgICAgICAgICAgICAgLy8gaXRlcmF0ZSBhIHBlcmNlbnRcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwZXJjZW50ID0gLWZhZGVXaWR0aDsgcGVyY2VudCA8IDEgKyBmYWRlV2lkdGg7IHBlcmNlbnQgKz0gc3RlcCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgcGVyY2VudCB0byBhbmdsZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IHBlcmNlbnQgKiBNYXRoLlBJO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBjb29yZGluYXRlcyBmb3Igd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeDEgPSBNYXRoLmNvcyhhbmdsZSArIGxlbiArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHkxID0gTWF0aC5zaW4oYW5nbGUgKyBsZW4gKyAyICogTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeDIgPSBNYXRoLmNvcyhhbmdsZSArIDIgKiBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHkyID0gTWF0aC5zaW4oYW5nbGUgKyAyICogTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKTtcblxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBhbHBoYSBmb3Igd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxwaGEgPSAoYWRqdXN0ZWRQZXJjZW50IC0gcGVyY2VudCArIGZhZGVXaWR0aCkgLyBmYWRlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZHJhdyB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubW92ZVRvKHRoaXMud2lkdGggLyAyIC0gMiwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh4MSwgeTEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8oeDIsIHkyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHRoaXMud2lkdGggLyAyICsgMiwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsMCwwLCcgKyBhbHBoYSArICcpJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuZmlsbCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwicmFkaWFsLW91dFwiOlxuICAgICAgICAgICAgY2FzZSBcInJhZGlhbC1pblwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGVyY2VudCA9IHRoaXMuY3VySW1nLmZhZGVUeXBlID09PSBcInJhZGlhbC1pblwiID8gKDEgLSB0aGlzLnBlcmNlbnQpIDogdGhpcy5wZXJjZW50XG4gICAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSAxMDA7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kU3RhdGUgPSAwLjAxXG4gICAgICAgICAgICAgICAgY29uc3QgaW5uZXJSYWRpdXMgPSAocGVyY2VudCkgKiB0aGlzLmhlaWdodCAtIHdpZHRoIDwgMCA/IGVuZFN0YXRlIDogKHBlcmNlbnQpICogdGhpcy5oZWlnaHQgLSB3aWR0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBvdXRlclJhZGl1cyA9IHBlcmNlbnQgKiB0aGlzLmhlaWdodCArIHdpZHRoXG4gICAgICAgICAgICAgICAgLyppZiAodGhpcy5jdXJJbWcuZmFkZVR5cGUgPT09IFwicmFkaWFsLWluXCIpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLnRhYmxlKHtcInBlcmNlbnRcIjogcGVyY2VudCxcImlubmVyUmFkaXVzXCI6IGlubmVyUmFkaXVzLCBcIm91dGVyUmFkaXVzXCI6IG91dGVyUmFkaXVzIH0pXG4gICAgICAgICAgICAgICAgfSovXG5cbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoIC8gMixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgLyAyLCBpbm5lclJhZGl1cyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIDIsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0IC8gMiwgb3V0ZXJSYWRpdXMpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1ckltZy5mYWRlVHlwZSA9PT0gXCJyYWRpYWwtaW5cIikge1xuICAgICAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLjAsICdyZ2JhKDAsMCwwLDApJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IHRoaXMubnh0SW1nLmNvdmVyID8gXCJzb3VyY2UtYXRvcFwiIDogXCJzb3VyY2UtaW5cIjtcbiAgICAgICAgdGhpcy5fZHJhdyh0aGlzLm54dEltZywgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQsIHRoaXMuX2JhY2tDb250ZXh0KVxuXG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LnJlc3RvcmUoKTtcblxuXG4gICAgICAgIGlmIChlbGFwc2VkIDwgdGhpcy5jdXJJbWcuZmFkZUR1cmF0aW9uKVxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlZHJhdyk7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMubW9kZSA9PT0gTW9kZS5BVVRPKVxuICAgICAgICAgICAgaWYgKHRoaXMubG9vcCB8fCB0aGlzLmN1cnJlbnRJZHggPCB0aGlzLmltYWdlQXJyYXkubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRGYWRlVGltZXIgPSBzZXRUaW1lb3V0KHRoaXMubmV4dEZhZGUsIHRoaXMuY3VySW1nLmZhZGVEZWxheSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZHJhdyhpOiBJbWFnZU9iamVjdCwgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG90aGVyQ3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICAgICAgaWYgKGkuY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhc1dpZHRoTWlkZGxlID0gY3R4LmNhbnZhcy53aWR0aCAvIDI7XG4gICAgICAgICAgICBjb25zdCBjYW52YXNIZWlnaHRNaWRkbGUgPSBjdHguY2FudmFzLmhlaWdodCAvIDI7XG4gICAgICAgICAgICBjb25zdCBnID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUsIDAsIGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUsIE1hdGgubWF4KGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUpKVxuICAgICAgICAgICAgZy5hZGRDb2xvclN0b3AoMCwgXCIjNWNiOGY4XCIpXG4gICAgICAgICAgICBnLmFkZENvbG9yU3RvcCgxLCBcIiM0NjQ4NDhcIilcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBnO1xuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuXG5cbiAgICAgICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgICAgICBvZmZzZXRYLFxuICAgICAgICAgICAgICAgIG9mZnNldFksXG4gICAgICAgICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgICAgICB9ID0gY29udGFpbih0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgaS5pbWcud2lkdGgsIGkuaW1nLmhlaWdodClcblxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpLmltZywgb2Zmc2V0WCwgb2Zmc2V0WSwgd2lkdGgsIGhlaWdodClcblxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYXNwZWN0ID4gaS5hc3BlY3QpIHtcblxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpLmltZyxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICh0aGlzLmhlaWdodCAtIHRoaXMud2lkdGggLyBpLmFzcGVjdCkgLyAyLFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIGkuYXNwZWN0KTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpLmltZyxcbiAgICAgICAgICAgICAgICAodGhpcy53aWR0aCAtIHRoaXMuaGVpZ2h0ICogaS5hc3BlY3QpIC8gMixcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICogaS5hc3BlY3QsXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2l6ZSgpIHtcblxuICAgICAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDsgLy8gRFM6IGZpeCBmb3IgaU9TIDkgYnVnXG4gICAgICAgIHRoaXMuYXNwZWN0ID0gdGhpcy53aWR0aCAvIHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0LmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuX2JhY2tDb250ZXh0LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5kcmF3SW1hZ2UoKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBkcmF3SW1hZ2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1ckltZykge1xuICAgICAgICAgICAgdGhpcy5fZHJhdyh0aGlzLmN1ckltZywgdGhpcy5fYmFja0NvbnRleHQsIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJubyBpbWFnZSBcIiArIHRoaXMuY3VycmVudElkeCArIFwiIFwiICsgdGhpcy5pbWFnZUFycmF5Lmxlbmd0aClcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudElkeCA9IC0xXG4gICAgICAgIHRoaXMubmV4dEZhZGUoKTtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLm5leHRGYWRlVGltZXIgJiYgY2xlYXJUaW1lb3V0KHRoaXMubmV4dEZhZGVUaW1lcilcbiAgICB9XG5cbiAgICBuZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5tb2RlICE9PSBNb2RlLk1VTFRJX1NFQ1RJT04pXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIlRoaXMgc3d3aXBlIG9wZXJhdGVzIGluIEFVVE8gbW9kZVwiKVxuICAgICAgICB0aGlzLm5leHRGYWRlKClcbiAgICB9XG5cblxuICAgIGdldCBudW1iZXJPZkZhZGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZUFycmF5Lmxlbmd0aFxuICAgIH1cbn1cblxuY2xhc3MgU1dXaXBlU3RhdGljIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGltZzogSFRNTEltYWdlRWxlbWVudDtcblxuICAgIHdpZHRoOiBudW1iZXIgPSB3aW5kb3cuaW5uZXJXaWR0aDtcdFx0XHRcdC8vIHdpZHRoIG9mIGNvbnRhaW5lciAoYmFubmVyKVxuICAgIGhlaWdodDogbnVtYmVyID0gd2luZG93LmlubmVySGVpZ2h0O1x0XHRcdFx0Ly8gaGVpZ2h0IG9mIGNvbnRhaW5lclxuXG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IF9jYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgYmFubmVyOiBIVE1MRWxlbWVudCwgcmVhZG9ubHkgb3duZXI6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGltYWdlcyA9IEFycmF5LmZyb20odGhpcy5iYW5uZXIucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKSk7XG4gICAgICAgIGlmIChpbWFnZXMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIldhcyBleHBlY3RpbmcgYSBzaW5nbGUgaW1nIGZvciBzdGF0aWMtYmFubmVyXCIpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbWcgPSBpbWFnZXNbMF1cblxuICAgICAgICB0aGlzLmJhbm5lci5hcHBlbmRDaGlsZCh0aGlzLl9jYW52YXMpO1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5fY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgICAgICBpZiAoY29udGV4dCA9PT0gbnVsbCkgdGhyb3cgRXJyb3IoXCIyZCBjb250ZXh0IG5vdCBzdXBwb3J0ZWRcIilcbiAgICAgICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMuX2NvbnRleHQuaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2VcbiAgICAgICAgdGhpcy5fY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcInNvdXJjZS1vdmVyXCI7XG4gICAgICAgIHRoaXMuaW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHRoaXMuZHJhdygpKVxuICAgICAgICB0aGlzLmRyYXcoKTtcbiAgICAgICAvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemUpO1xuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cbiAgICBkcmF3KCkge1xuXG5cbiAgICAgICAgY29uc3QgY2FudmFzV2lkdGhNaWRkbGUgPSB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCAvIDI7XG4gICAgICAgIGNvbnN0IGNhbnZhc0hlaWdodE1pZGRsZSA9IHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCAvIDI7XG4gICAgICAgIGNvbnN0IGcgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUsIDAsIGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUsIE1hdGgubWF4KGNhbnZhc1dpZHRoTWlkZGxlLCBjYW52YXNIZWlnaHRNaWRkbGUpKVxuICAgICAgICBnLmFkZENvbG9yU3RvcCgwLCBcIiM1Y2I4ZjhcIilcbiAgICAgICAgZy5hZGRDb2xvclN0b3AoMSwgXCIjNDY0ODQ4XCIpXG4gICAgICAgIHRoaXMuX2NvbnRleHQuc2F2ZSgpO1xuICAgICAgICB0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IGc7XG4gICAgICAgIHRoaXMuX2NvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy5fY29udGV4dC5jYW52YXMud2lkdGgsIHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodClcblxuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBvZmZzZXRYLFxuICAgICAgICAgICAgb2Zmc2V0WSxcbiAgICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgIH0gPSBjb250YWluKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCB0aGlzLmltZy53aWR0aCwgdGhpcy5pbWcuaGVpZ2h0KVxuXG4gICAgICAgIHRoaXMuX2NvbnRleHQuZHJhd0ltYWdlKHRoaXMuaW1nLCBvZmZzZXRYLCBvZmZzZXRZLCB3aWR0aCwgaGVpZ2h0KVxuXG5cblxuICAgIH1cblxuICAgIHByaXZhdGUgcmVzaXplKCkge1xuXG4gICAgICAgIHRoaXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyAvLyBEUzogZml4IGZvciBpT1MgOSBidWdcblxuICAgICAgICB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG5cbiAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgfTtcblxuXG59XG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmJhbm5lclwiKS5mb3JFYWNoKGIgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZTogTW9kZSA9IGIuaGFzQXR0cmlidXRlKFwiZGF0YS1tdWx0aS1zd2lwZVwiKSA/IE1vZGUuTVVMVElfU0VDVElPTiA6IE1vZGUuQVVUT1xuICAgICAgICAgICAgY29uc3Qgbm9Mb29wOiBib29sZWFuID0gYi5oYXNBdHRyaWJ1dGUoXCJkYXRhLW5vLWxvb3BcIilcbiAgICAgICAgICAgIGNvbnN0IG93bmVyID0gYi5jbG9zZXN0KFwic2VjdGlvblwiKVxuICAgICAgICAgICAgaWYgKCFvd25lcikgdGhyb3cgRXJyb3IoXCJiYW5uZXIgZWxlbWVudCBub3QgcGFydCBvZiBhIHNlY3Rpb25cIilcbiAgICAgICAgICAgIGNvbnN0IHdpcGUgPSBuZXcgU1dXaXBlKGIsIG93bmVyLCBtb2RlLCAhbm9Mb29wKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGIuc3N3aXBlID0gd2lwZTtcbiAgICAgICAgfSlcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihcInNsaWRlY2hhbmdlZFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJldkJhbm5lciA9IGUucHJldmlvdXNTbGlkZT8ucXVlcnlTZWxlY3RvcihcIi5iYW5uZXJcIik7XG4gICAgICAgICAgICBpZiAocHJldkJhbm5lcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdpcGUgPSBwcmV2QmFubmVyLnNzd2lwZSBhcyBTV1dpcGU7XG4gICAgICAgICAgICAgICAgaWYgKHdpcGUubW9kZSA9PT0gTW9kZS5BVVRPKVxuICAgICAgICAgICAgICAgICAgICB3aXBlLnN0b3AoKTtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3duZXJJbmRleDogeyBoOiBudW1iZXI7IHY6IG51bWJlcjsgfSA9IFJldmVhbC5nZXRJbmRpY2VzKHdpcGUub3duZXIpXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleDogeyBoOiBudW1iZXI7IHY6IG51bWJlcjsgfSA9IFJldmVhbC5nZXRJbmRpY2VzKGUuY3VycmVudFNsaWRlKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IGUuY3VycmVudFNsaWRlLmluZGV4ViA/XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXgudiAtIChvd25lckluZGV4LnYgfHwgMCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4LmggLSBvd25lckluZGV4LmhcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPiAwICYmIGRpc3RhbmNlIDwgd2lwZS5udW1iZXJPZkZhZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLmN1cnJlbnRTbGlkZS5hcHBlbmRDaGlsZCh3aXBlLmJhbm5lcilcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpcGUuc3RvcCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB3aXBlLm93bmVyLmFwcGVuZENoaWxkKHdpcGUuYmFubmVyKVxuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5leHRCYW5uZXIgPSBlLmN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yKFwiLmJhbm5lclwiKTtcbiAgICAgICAgICAgIGlmIChuZXh0QmFubmVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNzd2lwZSA9IG5leHRCYW5uZXIuc3N3aXBlIGFzIFNXV2lwZTtcbiAgICAgICAgICAgICAgICBpZiAoc3N3aXBlLm1vZGUgPT09IE1vZGUuQVVUTyB8fCBzc3dpcGUub3duZXIgPT09IGUuY3VycmVudFNsaWRlKVxuICAgICAgICAgICAgICAgICAgICBzc3dpcGUuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHNzd2lwZS5uZXh0KCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi5zdGF0aWMtYmFubmVyXCIpLmZvckVhY2goYiA9PiB7XG4gICAgICAgICAgICBjb25zdCBvd25lciA9IGIuY2xvc2VzdChcInNlY3Rpb25cIilcbiAgICAgICAgICAgIGlmICghb3duZXIpIHRocm93IEVycm9yKFwiYmFubmVyIGVsZW1lbnQgbm90IHBhcnQgb2YgYSBzZWN0aW9uXCIpXG4gICAgICAgICAgICBjb25zdCBzdGF0aWNXaXBlID0gbmV3IFNXV2lwZVN0YXRpYyhiLCBvd25lcilcbiAgICAgICAgICAgIHN0YXRpY1dpcGUuc3RhcnQoKVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuXG59KSgpXG5cbi8vIGBjbG9zZXN0YCBQb2x5ZmlsbCBmb3IgSUVcblxuaWYgKCFFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgPSBFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS53ZWJraXRNYXRjaGVzU2VsZWN0b3I7XG59XG5cbmlmICghRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCkge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0ID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgbGV0IGVsID0gdGhpcztcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBpZiAoRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcy5jYWxsKGVsLCBzKSkgcmV0dXJuIGVsO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50IHx8IGVsLnBhcmVudE5vZGU7XG4gICAgICAgIH0gd2hpbGUgKGVsICE9PSBudWxsICYmIGVsLm5vZGVUeXBlID09PSAxKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbn1cblxuXG5cbmNvbnN0IGNvbnRhaW4gPSAoY2FudmFzV2lkdGg6IG51bWJlciwgY2FudmFzSEVpZ2h0OiBudW1iZXIsIGltZ1dpZHRoOiBudW1iZXIsIGltZ0hlaWdodDogbnVtYmVyLCBvZmZzZXRYID0gMC41LCBvZmZzZXRZID0gMC41KSA9PiB7XG4gICAgY29uc3QgY2hpbGRSYXRpbyA9IGltZ1dpZHRoIC8gaW1nSGVpZ2h0XG4gICAgY29uc3QgcGFyZW50UmF0aW8gPSBjYW52YXNXaWR0aCAvIGNhbnZhc0hFaWdodFxuICAgIGxldCB3aWR0aCA9IGNhbnZhc1dpZHRoXG4gICAgbGV0IGhlaWdodCA9IGNhbnZhc0hFaWdodFxuXG4gICAgaWYgKGNoaWxkUmF0aW8gPiBwYXJlbnRSYXRpbykge1xuICAgICAgICBoZWlnaHQgPSB3aWR0aCAvIGNoaWxkUmF0aW9cbiAgICB9IGVsc2Uge1xuICAgICAgICB3aWR0aCA9IGhlaWdodCAqIGNoaWxkUmF0aW9cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgICBvZmZzZXRYOiAoY2FudmFzV2lkdGggLSB3aWR0aCkgKiBvZmZzZXRYLFxuICAgICAgICBvZmZzZXRZOiAoY2FudmFzSEVpZ2h0IC0gaGVpZ2h0KSAqIG9mZnNldFlcbiAgICB9XG59O1xuXG5cbiJdfQ==