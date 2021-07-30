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
      var heightScale = img.hasAttribute("data-height-scale") ? Number(img.getAttribute("data-height-scale")) : 1;
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
      if (i.noResize) {
        ctx.save();
        var canvasWidthMiddle = ctx.canvas.width / 2;
        var canvasHeightMiddle = ctx.canvas.height / 2;
        var g = ctx.createRadialGradient(canvasWidthMiddle, canvasHeightMiddle, 0, canvasWidthMiddle, canvasHeightMiddle, Math.max(canvasWidthMiddle, canvasHeightMiddle));
        g.addColorStop(0, "#5cb8f8");
        g.addColorStop(1, "#464848");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, this.width, this.height);
        var h = i.dimensions.height;
        var w = i.dimensions.width;
        var r = i.heightScale;

        var _contain = contain(ctx.canvas.width, ctx.canvas.height * r, w, h),
            offsetX = _contain.offsetX,
            offsetY = _contain.offsetY,
            width = _contain.width,
            height = _contain.height;

        ctx.save();
        ctx.drawImage(i.img, offsetX, offsetY - (r - 1) * (ctx.canvas.height / 2), width, height);
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

var contain = fit(true);
var cover = fit(false);

function fit(contains) {
  return function (parentWidth, parentHeight, childWidth, childHeight) {
    var scale = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
    var offsetX = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.5;
    var offsetY = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0.5;
    var childRatio = childWidth / childHeight;
    var parentRatio = parentWidth / parentHeight;
    var width = parentWidth * scale;
    var height = parentHeight * scale;

    if (contains ? childRatio > parentRatio : childRatio < parentRatio) {
      height = width / childRatio;
    } else {
      width = height * childRatio;
    }

    return {
      width: width,
      height: height,
      offsetX: (parentWidth - width) * offsetX,
      offsetY: (parentHeight - height) * offsetY
    };
  };
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJ5YXJucy1zd3dpcGUudHMiXSwibmFtZXMiOlsiTW9kZSIsIlNXV2lwZSIsImltYWdlQXJyYXkiLCJjdXJyZW50SWR4IiwibGVuZ3RoIiwiYmFubmVyIiwib3duZXIiLCJtb2RlIiwiQVVUTyIsImxvb3AiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJ3aWR0aCIsImhlaWdodCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIkRhdGUiLCJkcmF3SW1hZ2UiLCJfZm9yZWdyb3VuZENvbnRleHQiLCJjbGVhclJlY3QiLCJwZXJjZW50IiwiY3VySW1nIiwiZmFkZVdpZHRoIiwic3RhcnRUaW1lIiwicmVkcmF3IiwiY3VycmVudFRpbWUiLCJlbGFwc2VkIiwiZ2V0VGltZSIsInN0YXJ0UGVyY2VudGFnZSIsImZhZGVEdXJhdGlvbiIsInNhdmUiLCJmYWRlVHlwZSIsImdyYWRpZW50IiwiY3JlYXRlTGluZWFyR3JhZGllbnQiLCJhZGRDb2xvclN0b3AiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsInNlZ21lbnRzIiwibGVuIiwiTWF0aCIsIlBJIiwic3RlcCIsImFkanVzdGVkUGVyY2VudCIsInByY3QiLCJhbmdsZSIsIngxIiwiY29zIiwieTEiLCJzaW4iLCJ4MiIsInkyIiwiYWxwaGEiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJmaWxsIiwiZW5kU3RhdGUiLCJpbm5lclJhZGl1cyIsIm91dGVyUmFkaXVzIiwiY3JlYXRlUmFkaWFsR3JhZGllbnQiLCJnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24iLCJueHRJbWciLCJub1Jlc2l6ZSIsIl9kcmF3IiwiX2JhY2tDb250ZXh0IiwicmVzdG9yZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm5leHRGYWRlVGltZXIiLCJzZXRUaW1lb3V0IiwibmV4dEZhZGUiLCJmYWRlRGVsYXkiLCJpbWFnZXMiLCJBcnJheSIsImZyb20iLCJxdWVyeVNlbGVjdG9yQWxsIiwibWFwIiwiaW1nIiwiYXNwZWN0IiwiaGFzQXR0cmlidXRlIiwiTnVtYmVyIiwiZ2V0QXR0cmlidXRlIiwiaGVpZ2h0U2NhbGUiLCJkaW1lbnNpb25zIiwiYXBwZW5kQ2hpbGQiLCJfYmFja0NhbnZhcyIsIl9mb3JlQ2FudmFzIiwiYmFja0NvbnRleHQiLCJnZXRDb250ZXh0IiwiZm9yZUNvbnRleHQiLCJFcnJvciIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZXNpemUiLCJpIiwiY3R4Iiwib3RoZXJDdHgiLCJjYW52YXNXaWR0aE1pZGRsZSIsImNhbnZhcyIsImNhbnZhc0hlaWdodE1pZGRsZSIsImciLCJtYXgiLCJoIiwidyIsInIiLCJjb250YWluIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRIZWlnaHQiLCJjbGVhclRpbWVvdXQiLCJNVUxUSV9TRUNUSU9OIiwiZml0IiwiY292ZXIiLCJjb250YWlucyIsInBhcmVudFdpZHRoIiwicGFyZW50SGVpZ2h0IiwiY2hpbGRXaWR0aCIsImNoaWxkSGVpZ2h0Iiwic2NhbGUiLCJjaGlsZFJhdGlvIiwicGFyZW50UmF0aW8iLCJmb3JFYWNoIiwiYiIsIm5vTG9vcCIsImNsb3Nlc3QiLCJ3aXBlIiwic3N3aXBlIiwiUmV2ZWFsIiwiZSIsInByZXZCYW5uZXIiLCJwcmV2aW91c1NsaWRlIiwicXVlcnlTZWxlY3RvciIsInN0b3AiLCJvd25lckluZGV4IiwiZ2V0SW5kaWNlcyIsImN1cnJlbnRJbmRleCIsImN1cnJlbnRTbGlkZSIsImRpc3RhbmNlIiwiaW5kZXhWIiwidiIsImNvbnNvbGUiLCJsb2ciLCJudW1iZXJPZkZhZGVzIiwibmV4dEJhbm5lciIsInN0YXJ0IiwibmV4dCIsIkVsZW1lbnQiLCJwcm90b3R5cGUiLCJtYXRjaGVzIiwibXNNYXRjaGVzU2VsZWN0b3IiLCJ3ZWJraXRNYXRjaGVzU2VsZWN0b3IiLCJzIiwiZWwiLCJjYWxsIiwicGFyZW50RWxlbWVudCIsInBhcmVudE5vZGUiLCJub2RlVHlwZSJdLCJtYXBw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Qzs7QUFLQSxXQUFPLElBQVA7QUFDSCxHQVREO0FBVUgiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5TZWUgaHR0cHM6Ly9naXRodWIuY29tL0RhdmVTZWlkbWFuL1N0YXJXYXJzV2lwZVxuXG5cdFRvIERvXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRGaXggZGlhZ29uYWwgd2lwZVxuXHRmaXggcmFkaWFsIHdpcGVcblxuXG5XZWJ5YXJucyB2ZXJzaW9uOlxuLSBBZGRlZCBcImRlc3Ryb3lcIiBmbGFnIGFuZCBtZXRob2Rcbi0gQWRkZWQgc3VwcG9ydCBmb3IgYGRhdGEtc3RhcnRBdGAgdG8gc2V0IHN0YXJ0IHBlcmNlbnRhZ2Vcbi0gb24gZGVzdHJveSByZW1vdmUgY3JlYXRlZCBlbGVtZW50c1xuKi9cblxuZW51bSBNb2RlIHtcbiAgICBBVVRPLCBNVUxUSV9TRUNUSU9OXG59XG5cbmludGVyZmFjZSBJbWFnZU9iamVjdCB7XG4gICAgc3RhcnRQZXJjZW50YWdlOiBudW1iZXI7XG4gICAgZmFkZVdpZHRoOiBudW1iZXI7XG4gICAgZmFkZVR5cGU6IHN0cmluZyB8IG51bGw7XG4gICAgZmFkZURlbGF5OiBudW1iZXI7XG4gICAgZmFkZUR1cmF0aW9uOiBudW1iZXI7XG4gICAgYXNwZWN0OiBudW1iZXI7XG4gICAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xuICAgIG5vUmVzaXplOiBib29sZWFuO1xuICAgIGhlaWdodFNjYWxlOiBudW1iZXI7XG4gICAgZGltZW5zaW9uczogeyBcIndpZHRoXCI6IG51bWJlciwgXCJoZWlnaHRcIjogbnVtYmVyIH1cbn1cblxuY2xhc3MgU1dXaXBlIHtcblxuICAgIGN1cnJlbnRJZHggPSAtMTtcbiAgICB3aWR0aDogbnVtYmVyID0gd2luZG93LmlubmVyV2lkdGg7XHRcdFx0XHQvLyB3aWR0aCBvZiBjb250YWluZXIgKGJhbm5lcilcbiAgICBoZWlnaHQ6IG51bWJlciA9IHdpbmRvdy5pbm5lckhlaWdodDtcdFx0XHRcdC8vIGhlaWdodCBvZiBjb250YWluZXJcbiAgICBhc3BlY3Q6IG51bWJlciA9IHRoaXMud2lkdGggLyB0aGlzLmhlaWdodDtcdFx0XHRcdC8vIGFzcGVjdCByYXRpbyBvZiBjb250YWluZXJcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgaW1hZ2VBcnJheTogSW1hZ2VPYmplY3RbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9iYWNrQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZvcmVDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfYmFja0NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9mb3JlZ3JvdW5kQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgcHJpdmF0ZSBwZXJjZW50OiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgc3RhcnRUaW1lOiBEYXRlID0gbmV3IERhdGU7XG4gICAgcHJpdmF0ZSBuZXh0RmFkZVRpbWVyOiBOb2RlSlMuVGltZW91dCB8IG51bGwgPSBudWxsO1xuXG5cbiAgICBwcml2YXRlIGdldCBjdXJJbWcoKTogSW1hZ2VPYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZUFycmF5W3RoaXMuY3VycmVudElkeF07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgbnh0SW1nKCk6IEltYWdlT2JqZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VBcnJheVsodGhpcy5jdXJyZW50SWR4ICsgMSkgJSB0aGlzLmltYWdlQXJyYXkubGVuZ3RoXTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBiYW5uZXI6IEhUTUxFbGVtZW50LCByZWFkb25seSBvd25lcjogSFRNTEVsZW1lbnQsIHJlYWRvbmx5IG1vZGU6IE1vZGUgPSBNb2RlLkFVVE8sIHJlYWRvbmx5IGxvb3AgPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGltYWdlcyA9IEFycmF5LmZyb20odGhpcy5iYW5uZXIucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKSk7XG4gICAgICAgIHRoaXMuaW1hZ2VBcnJheSA9IGltYWdlcy5tYXAoaW1nID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFzcGVjdCA9IGltZy53aWR0aCAvIGltZy5oZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBmYWRlRHVyYXRpb24gPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1mYWRlRHVyYXRpb25cIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtZmFkZUR1cmF0aW9uXCIpKSAqIDEwMDAgOiAxMDAwO1xuICAgICAgICAgICAgY29uc3QgZmFkZURlbGF5ID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZURlbGF5XCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZhZGVEZWxheVwiKSkgKiAxMDAwIDogMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVUeXBlID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtZmFkZVR5cGVcIikgPyBpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlVHlwZVwiKSA6IFwiY3Jvc3MtbHJcIjtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVXaWR0aCA9IGltZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZhZGVXaWR0aFwiKSA/IE51bWJlcihpbWcuZ2V0QXR0cmlidXRlKFwiZGF0YS1mYWRlV2lkdGhcIikpIDogLjE7XG4gICAgICAgICAgICBjb25zdCBzdGFydFBlcmNlbnRhZ2UgPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1zdGFydEF0XCIpID8gTnVtYmVyKGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0YXJ0QXRcIikpIDogMDtcbiAgICAgICAgICAgIGNvbnN0IG5vUmVzaXplID0gaW1nLmhhc0F0dHJpYnV0ZShcImRhdGEtbm8tcmVzaXplXCIpO1xuICAgICAgICAgICAgY29uc3QgaGVpZ2h0U2NhbGUgPSBpbWcuaGFzQXR0cmlidXRlKFwiZGF0YS1oZWlnaHQtc2NhbGVcIikgPyBOdW1iZXIoaW1nLmdldEF0dHJpYnV0ZShcImRhdGEtaGVpZ2h0LXNjYWxlXCIpKSA6IDE7XG4gICAgICAgICAgICBjb25zdCBkaW1lbnNpb25zID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiBpbWcud2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBpbWcuaGVpZ2h0LFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgYXNwZWN0LFxuICAgICAgICAgICAgICAgIGZhZGVEdXJhdGlvbixcbiAgICAgICAgICAgICAgICBmYWRlRGVsYXksXG4gICAgICAgICAgICAgICAgZmFkZVR5cGUsXG4gICAgICAgICAgICAgICAgZmFkZVdpZHRoLFxuICAgICAgICAgICAgICAgIHN0YXJ0UGVyY2VudGFnZSxcbiAgICAgICAgICAgICAgICBub1Jlc2l6ZSxcbiAgICAgICAgICAgICAgICBoZWlnaHRTY2FsZSxcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5iYW5uZXIuYXBwZW5kQ2hpbGQodGhpcy5fYmFja0NhbnZhcyk7XG4gICAgICAgIHRoaXMuYmFubmVyLmFwcGVuZENoaWxkKHRoaXMuX2ZvcmVDYW52YXMpO1xuICAgICAgICBjb25zdCBiYWNrQ29udGV4dCA9IHRoaXMuX2JhY2tDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgICAgIGNvbnN0IGZvcmVDb250ZXh0ID0gdGhpcy5fZm9yZUNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIGlmIChiYWNrQ29udGV4dCA9PT0gbnVsbCB8fCBmb3JlQ29udGV4dCA9PT0gbnVsbCkgdGhyb3cgRXJyb3IoXCIyZCBjb250ZXh0IG5vdCBzdXBwb3J0ZWRcIilcbiAgICAgICAgdGhpcy5fYmFja0NvbnRleHQgPSBiYWNrQ29udGV4dDtcbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQgPSBmb3JlQ29udGV4dDtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbmV4dEZhZGUgPSAoKSA9PiB7XG4gICAgICAgIC8vIGFkdmFuY2UgaW5kaWNlc1xuICAgICAgICB0aGlzLmN1cnJlbnRJZHggPSArK3RoaXMuY3VycmVudElkeCAlIHRoaXMuaW1hZ2VBcnJheS5sZW5ndGg7XG4gICAgICAgIHRoaXMuZHJhd0ltYWdlKCk7XG5cbiAgICAgICAgLy8gY2xlYXIgdGhlIGZvcmVncm91bmRcbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAvLyBzZXR1cCBhbmQgc3RhcnQgdGhlIGZhZGVcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gLXRoaXMuY3VySW1nLmZhZGVXaWR0aDtcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZTtcbiAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZHJhdyA9ICgpID0+IHtcbiAgICAgICAgLy8gY2FsY3VsYXRlIHBlcmNlbnQgY29tcGxldGlvbiBvZiB3aXBlXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gbmV3IERhdGU7XG4gICAgICAgIGNvbnN0IGVsYXBzZWQgPSBjdXJyZW50VGltZS5nZXRUaW1lKCkgLSB0aGlzLnN0YXJ0VGltZS5nZXRUaW1lKCk7XG4gICAgICAgIHRoaXMucGVyY2VudCA9IHRoaXMuY3VySW1nLnN0YXJ0UGVyY2VudGFnZSArIGVsYXBzZWQgLyB0aGlzLmN1ckltZy5mYWRlRHVyYXRpb247XG5cblxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5zYXZlKCk7XG4gICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgIGNvbnN0IGZhZGVXaWR0aCA9IHRoaXMuY3VySW1nLmZhZGVXaWR0aFxuXG4gICAgICAgIHN3aXRjaCAodGhpcy5jdXJJbWcuZmFkZVR5cGUpIHtcblxuICAgICAgICAgICAgY2FzZSBcImNyb3NzLWxyXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDAsXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImNyb3NzLXJsXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIDAsXG4gICAgICAgICAgICAgICAgICAgICgoMSAtIHRoaXMucGVyY2VudCkgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImNyb3NzLXVkXCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAwLCAodGhpcy5wZXJjZW50ICogKDEgKyBmYWRlV2lkdGgpIC0gZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIDAsICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgKyBmYWRlV2lkdGgpICogdGhpcy53aWR0aCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImNyb3NzLWR1XCI6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KFxuICAgICAgICAgICAgICAgICAgICAwLCAoKDEgLSB0aGlzLnBlcmNlbnQpICogKDEgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIDAsICgoMSAtIHRoaXMucGVyY2VudCkgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcImRpYWdvbmFsLXRsLWJyXCI6IHsvLyBEUzogVGhpcyBkaWFnb25hbCBub3Qgd29ya2luZyBwcm9wZXJseVxuXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgyICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoLCAwLFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wZXJjZW50ICogKDIgKyBmYWRlV2lkdGgpICsgZmFkZVdpZHRoKSAqIHRoaXMud2lkdGgsIGZhZGVXaWR0aCAqICh0aGlzLndpZHRoIC8gKHRoaXMuaGVpZ2h0IC8gMikpICogdGhpcy53aWR0aCk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwiZGlhZ29uYWwtdHItYmxcIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnBlcmNlbnQgKiAoMSArIGZhZGVXaWR0aCkgLSBmYWRlV2lkdGgpICogdGhpcy53aWR0aCwgMCxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSArIGZhZGVXaWR0aCkgKiB0aGlzLndpZHRoICsgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjAsICdyZ2JhKDAsMCwwLDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcInJhZGlhbC1idG1cIjoge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudHMgPSAzMDA7IC8vIHRoZSBhbW91bnQgb2Ygc2VnbWVudHMgdG8gc3BsaXQgdGhlIHNlbWkgY2lyY2xlIGludG8sIERTOiBhZGp1c3QgdGhpcyBmb3IgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgICAgICBjb25zdCBsZW4gPSBNYXRoLlBJIC8gc2VnbWVudHM7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RlcCA9IDEgLyBzZWdtZW50cztcblxuICAgICAgICAgICAgICAgIC8vIGV4cGFuZCBwZXJjZW50IHRvIGNvdmVyIGZhZGVXaWR0aFxuICAgICAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkUGVyY2VudCA9IHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aDtcblxuICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGUgYSBwZXJjZW50XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcHJjdCA9IC1mYWRlV2lkdGg7IHByY3QgPCAxICsgZmFkZVdpZHRoOyBwcmN0ICs9IHN0ZXApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IHBlcmNlbnQgdG8gYW5nbGVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBwcmN0ICogTWF0aC5QSTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgY29vcmRpbmF0ZXMgZm9yIHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHgxID0gTWF0aC5jb3MoYW5nbGUgKyBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHkxID0gTWF0aC5zaW4oYW5nbGUgKyBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHgyID0gTWF0aC5jb3MoYW5nbGUgKyBsZW4gKyBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHkyID0gTWF0aC5zaW4oYW5nbGUgKyBsZW4gKyBNYXRoLlBJKSAqICh0aGlzLmhlaWdodCAqIDIpICsgdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGFscGhhIGZvciB3ZWRnZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbHBoYSA9IChhZGp1c3RlZFBlcmNlbnQgLSBwcmN0ICsgZmFkZVdpZHRoKSAvIGZhZGVXaWR0aDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBkcmF3IHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5tb3ZlVG8odGhpcy53aWR0aCAvIDIgLSAyLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh4MSwgeTEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8oeDIsIHkyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHRoaXMud2lkdGggLyAyICsgMiwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwnICsgYWxwaGEgKyAnKSc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGwoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcInJhZGlhbC10b3BcIjoge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudHMgPSAzMDA7IC8vIHRoZSBhbW91bnQgb2Ygc2VnbWVudHMgdG8gc3BsaXQgdGhlIHNlbWkgY2lyY2xlIGludG8sIERTOiBhZGp1c3QgdGhpcyBmb3IgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgICAgICBjb25zdCBsZW4gPSBNYXRoLlBJIC8gc2VnbWVudHM7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RlcCA9IDEgLyBzZWdtZW50cztcblxuICAgICAgICAgICAgICAgIC8vIGV4cGFuZCBwZXJjZW50IHRvIGNvdmVyIGZhZGVXaWR0aFxuICAgICAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkUGVyY2VudCA9IHRoaXMucGVyY2VudCAqICgxICsgZmFkZVdpZHRoKSAtIGZhZGVXaWR0aDtcblxuICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGUgYSBwZXJjZW50XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcGVyY2VudCA9IC1mYWRlV2lkdGg7IHBlcmNlbnQgPCAxICsgZmFkZVdpZHRoOyBwZXJjZW50ICs9IHN0ZXApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IHBlcmNlbnQgdG8gYW5nbGVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBwZXJjZW50ICogTWF0aC5QSTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgY29vcmRpbmF0ZXMgZm9yIHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHgxID0gTWF0aC5jb3MoYW5nbGUgKyBsZW4gKyAyICogTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MSA9IE1hdGguc2luKGFuZ2xlICsgbGVuICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHgyID0gTWF0aC5jb3MoYW5nbGUgKyAyICogTWF0aC5QSSkgKiAodGhpcy5oZWlnaHQgKiAyKSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MiA9IE1hdGguc2luKGFuZ2xlICsgMiAqIE1hdGguUEkpICogKHRoaXMuaGVpZ2h0ICogMik7XG5cblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgYWxwaGEgZm9yIHdlZGdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFscGhhID0gKGFkanVzdGVkUGVyY2VudCAtIHBlcmNlbnQgKyBmYWRlV2lkdGgpIC8gZmFkZVdpZHRoO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGRyYXcgd2VkZ2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0Lm1vdmVUbyh0aGlzLndpZHRoIC8gMiAtIDIsIDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5saW5lVG8oeDEsIHkxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQubGluZVRvKHgyLCB5Mik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmxpbmVUbyh0aGlzLndpZHRoIC8gMiArIDIsIDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwnICsgYWxwaGEgKyAnKSc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LmZpbGwoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBcInJhZGlhbC1vdXRcIjpcbiAgICAgICAgICAgIGNhc2UgXCJyYWRpYWwtaW5cIjoge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBlcmNlbnQgPSB0aGlzLmN1ckltZy5mYWRlVHlwZSA9PT0gXCJyYWRpYWwtaW5cIiA/ICgxIC0gdGhpcy5wZXJjZW50KSA6IHRoaXMucGVyY2VudFxuICAgICAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gMTAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZFN0YXRlID0gMC4wMVxuICAgICAgICAgICAgICAgIGNvbnN0IGlubmVyUmFkaXVzID0gKHBlcmNlbnQpICogdGhpcy5oZWlnaHQgLSB3aWR0aCA8IDAgPyBlbmRTdGF0ZSA6IChwZXJjZW50KSAqIHRoaXMuaGVpZ2h0IC0gd2lkdGg7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0ZXJSYWRpdXMgPSBwZXJjZW50ICogdGhpcy5oZWlnaHQgKyB3aWR0aFxuICAgICAgICAgICAgICAgIC8qaWYgKHRoaXMuY3VySW1nLmZhZGVUeXBlID09PSBcInJhZGlhbC1pblwiKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS50YWJsZSh7XCJwZXJjZW50XCI6IHBlcmNlbnQsXCJpbm5lclJhZGl1c1wiOiBpbm5lclJhZGl1cywgXCJvdXRlclJhZGl1c1wiOiBvdXRlclJhZGl1cyB9KVxuICAgICAgICAgICAgICAgIH0qL1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIDIsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0IC8gMiwgaW5uZXJSYWRpdXMsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyAyLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAvIDIsIG91dGVyUmFkaXVzKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJJbWcuZmFkZVR5cGUgPT09IFwicmFkaWFsLWluXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMCwgJ3JnYmEoMCwwLDAsMCknKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC4wLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMS4wLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICB9XG5cblxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSB0aGlzLm54dEltZy5ub1Jlc2l6ZSA/IFwic291cmNlLWF0b3BcIiA6IFwic291cmNlLWluXCI7XG4gICAgICAgIHRoaXMuX2RyYXcodGhpcy5ueHRJbWcsIHRoaXMuX2ZvcmVncm91bmRDb250ZXh0LCB0aGlzLl9iYWNrQ29udGV4dClcblxuICAgICAgICB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dC5yZXN0b3JlKCk7XG5cblxuICAgICAgICBpZiAoZWxhcHNlZCA8IHRoaXMuY3VySW1nLmZhZGVEdXJhdGlvbilcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZWRyYXcpO1xuICAgICAgICBlbHNlIGlmICh0aGlzLm1vZGUgPT09IE1vZGUuQVVUTylcbiAgICAgICAgICAgIGlmICh0aGlzLmxvb3AgfHwgdGhpcy5jdXJyZW50SWR4IDwgdGhpcy5pbWFnZUFycmF5Lmxlbmd0aCAtIDEpXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0RmFkZVRpbWVyID0gc2V0VGltZW91dCh0aGlzLm5leHRGYWRlLCB0aGlzLmN1ckltZy5mYWRlRGVsYXkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2RyYXcoaTogSW1hZ2VPYmplY3QsIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBvdGhlckN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgICAgIGlmIChpLm5vUmVzaXplKSB7XG4gICAgICAgICAgICBjdHguc2F2ZSgpXG4gICAgICAgICAgICBjb25zdCBjYW52YXNXaWR0aE1pZGRsZSA9IGN0eC5jYW52YXMud2lkdGggLyAyO1xuICAgICAgICAgICAgY29uc3QgY2FudmFzSGVpZ2h0TWlkZGxlID0gY3R4LmNhbnZhcy5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgY29uc3QgZyA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudChjYW52YXNXaWR0aE1pZGRsZSwgY2FudmFzSGVpZ2h0TWlkZGxlLCAwLCBjYW52YXNXaWR0aE1pZGRsZSwgY2FudmFzSGVpZ2h0TWlkZGxlLCBNYXRoLm1heChjYW52YXNXaWR0aE1pZGRsZSwgY2FudmFzSGVpZ2h0TWlkZGxlKSlcbiAgICAgICAgICAgIGcuYWRkQ29sb3JTdG9wKDAsIFwiIzVjYjhmOFwiKVxuICAgICAgICAgICAgZy5hZGRDb2xvclN0b3AoMSwgXCIjNDY0ODQ4XCIpXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZztcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcblxuICAgICAgICAgICAgY29uc3QgaCA9IGkuZGltZW5zaW9ucy5oZWlnaHRcbiAgICAgICAgICAgIGNvbnN0IHcgPSBpLmRpbWVuc2lvbnMud2lkdGhcbiAgICAgICAgICAgIGNvbnN0IHIgPSBpLmhlaWdodFNjYWxlXG4gICAgICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0WCxcbiAgICAgICAgICAgICAgICBvZmZzZXRZLFxuICAgICAgICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgfSA9IGNvbnRhaW4oY3R4LmNhbnZhcy53aWR0aCwgY3R4LmNhbnZhcy5oZWlnaHQqciwgdywgaClcbiAgICAgICAgICAgIGN0eC5zYXZlKClcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaS5pbWcsIG9mZnNldFgsIG9mZnNldFktKChyLTEpICogKGN0eC5jYW52YXMuaGVpZ2h0LzIpKSwgd2lkdGgsIGhlaWdodClcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKClcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFzcGVjdCA+IGkuYXNwZWN0KSB7XG5cbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaS5pbWcsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAodGhpcy5oZWlnaHQgLSB0aGlzLndpZHRoIC8gaS5hc3BlY3QpIC8gMixcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyBpLmFzcGVjdCk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaS5pbWcsXG4gICAgICAgICAgICAgICAgKHRoaXMud2lkdGggLSB0aGlzLmhlaWdodCAqIGkuYXNwZWN0KSAvIDIsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAqIGkuYXNwZWN0LFxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNpemUoKSB7XG5cbiAgICAgICAgdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7IC8vIERTOiBmaXggZm9yIGlPUyA5IGJ1Z1xuICAgICAgICB0aGlzLmFzcGVjdCA9IHRoaXMud2lkdGggLyB0aGlzLmhlaWdodDtcblxuICAgICAgICB0aGlzLl9iYWNrQ29udGV4dC5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLl9iYWNrQ29udGV4dC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5fZm9yZWdyb3VuZENvbnRleHQuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgIHRoaXMuZHJhd0ltYWdlKCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgZHJhd0ltYWdlKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJJbWcpIHtcbiAgICAgICAgICAgIHRoaXMuX2RyYXcodGhpcy5jdXJJbWcsIHRoaXMuX2JhY2tDb250ZXh0LCB0aGlzLl9mb3JlZ3JvdW5kQ29udGV4dClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwibm8gaW1hZ2UgXCIgKyB0aGlzLmN1cnJlbnRJZHggKyBcIiBcIiArIHRoaXMuaW1hZ2VBcnJheS5sZW5ndGgpXG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRJZHggPSAtMVxuICAgICAgICB0aGlzLm5leHRGYWRlKCk7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5uZXh0RmFkZVRpbWVyICYmIGNsZWFyVGltZW91dCh0aGlzLm5leHRGYWRlVGltZXIpXG4gICAgfVxuXG4gICAgbmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMubW9kZSAhPT0gTW9kZS5NVUxUSV9TRUNUSU9OKVxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJUaGlzIHN3d2lwZSBvcGVyYXRlcyBpbiBBVVRPIG1vZGVcIilcbiAgICAgICAgdGhpcy5uZXh0RmFkZSgpXG4gICAgfVxuXG5cbiAgICBnZXQgbnVtYmVyT2ZGYWRlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VBcnJheS5sZW5ndGhcbiAgICB9XG59XG5cbmNvbnN0IGNvbnRhaW4gPSBmaXQodHJ1ZSlcbmNvbnN0IGNvdmVyID0gZml0KGZhbHNlKVxuXG5mdW5jdGlvbiBmaXQoY29udGFpbnM6IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gKHBhcmVudFdpZHRoOiBudW1iZXIsIHBhcmVudEhlaWdodDogbnVtYmVyLCBjaGlsZFdpZHRoOiBudW1iZXIsIGNoaWxkSGVpZ2h0OiBudW1iZXIsIHNjYWxlID0gMSwgb2Zmc2V0WCA9IDAuNSwgb2Zmc2V0WSA9IDAuNSkgPT4ge1xuICAgICAgICBjb25zdCBjaGlsZFJhdGlvID0gY2hpbGRXaWR0aCAvIGNoaWxkSGVpZ2h0XG4gICAgICAgIGNvbnN0IHBhcmVudFJhdGlvID0gcGFyZW50V2lkdGggLyBwYXJlbnRIZWlnaHRcbiAgICAgICAgbGV0IHdpZHRoID0gcGFyZW50V2lkdGggKiBzY2FsZVxuICAgICAgICBsZXQgaGVpZ2h0ID0gcGFyZW50SGVpZ2h0ICogc2NhbGVcblxuICAgICAgICBpZiAoY29udGFpbnMgPyAoY2hpbGRSYXRpbyA+IHBhcmVudFJhdGlvKSA6IChjaGlsZFJhdGlvIDwgcGFyZW50UmF0aW8pKSB7XG4gICAgICAgICAgICBoZWlnaHQgPSB3aWR0aCAvIGNoaWxkUmF0aW9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpZHRoID0gaGVpZ2h0ICogY2hpbGRSYXRpb1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgICAgb2Zmc2V0WDogKHBhcmVudFdpZHRoIC0gd2lkdGgpICogb2Zmc2V0WCxcbiAgICAgICAgICAgIG9mZnNldFk6IChwYXJlbnRIZWlnaHQgLSBoZWlnaHQpICogb2Zmc2V0WVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmJhbm5lclwiKS5mb3JFYWNoKGIgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZTogTW9kZSA9IGIuaGFzQXR0cmlidXRlKFwiZGF0YS1tdWx0aS1zd2lwZVwiKSA/IE1vZGUuTVVMVElfU0VDVElPTiA6IE1vZGUuQVVUT1xuICAgICAgICAgICAgY29uc3Qgbm9Mb29wOiBib29sZWFuID0gYi5oYXNBdHRyaWJ1dGUoXCJkYXRhLW5vLWxvb3BcIilcbiAgICAgICAgICAgIGNvbnN0IG93bmVyID0gYi5jbG9zZXN0KFwic2VjdGlvblwiKVxuICAgICAgICAgICAgaWYgKCFvd25lcikgdGhyb3cgRXJyb3IoXCJiYW5uZXIgZWxlbWVudCBub3QgcGFydCBvZiBhIHNlY3Rpb25cIilcbiAgICAgICAgICAgIGNvbnN0IHdpcGUgPSBuZXcgU1dXaXBlKGIsIG93bmVyLCBtb2RlLCAhbm9Mb29wKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGIuc3N3aXBlID0gd2lwZTtcbiAgICAgICAgfSlcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihcInNsaWRlY2hhbmdlZFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJldkJhbm5lciA9IGUucHJldmlvdXNTbGlkZT8ucXVlcnlTZWxlY3RvcihcIi5iYW5uZXJcIik7XG4gICAgICAgICAgICBpZiAocHJldkJhbm5lcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdpcGUgPSBwcmV2QmFubmVyLnNzd2lwZSBhcyBTV1dpcGU7XG4gICAgICAgICAgICAgICAgaWYgKHdpcGUubW9kZSA9PT0gTW9kZS5BVVRPKVxuICAgICAgICAgICAgICAgICAgICB3aXBlLnN0b3AoKTtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3duZXJJbmRleDogeyBoOiBudW1iZXI7IHY6IG51bWJlcjsgfSA9IFJldmVhbC5nZXRJbmRpY2VzKHdpcGUub3duZXIpXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleDogeyBoOiBudW1iZXI7IHY6IG51bWJlcjsgfSA9IFJldmVhbC5nZXRJbmRpY2VzKGUuY3VycmVudFNsaWRlKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IGUuY3VycmVudFNsaWRlLmluZGV4ViA/XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXgudiAtIChvd25lckluZGV4LnYgfHwgMCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4LmggLSBvd25lckluZGV4LmhcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPiAwICYmIGRpc3RhbmNlIDwgd2lwZS5udW1iZXJPZkZhZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLmN1cnJlbnRTbGlkZS5hcHBlbmRDaGlsZCh3aXBlLmJhbm5lcilcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpcGUuc3RvcCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB3aXBlLm93bmVyLmFwcGVuZENoaWxkKHdpcGUuYmFubmVyKVxuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5leHRCYW5uZXIgPSBlLmN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yKFwiLmJhbm5lclwiKTtcbiAgICAgICAgICAgIGlmIChuZXh0QmFubmVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNzd2lwZSA9IG5leHRCYW5uZXIuc3N3aXBlIGFzIFNXV2lwZTtcbiAgICAgICAgICAgICAgICBpZiAoc3N3aXBlLm1vZGUgPT09IE1vZGUuQVVUTyB8fCBzc3dpcGUub3duZXIgPT09IGUuY3VycmVudFNsaWRlKVxuICAgICAgICAgICAgICAgICAgICBzc3dpcGUuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHNzd2lwZS5uZXh0KCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9KVxuXG5cbn0pKClcblxuLy8gYGNsb3Nlc3RgIFBvbHlmaWxsIGZvciBJRVxuXG5pZiAoIUVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcyA9IEVsZW1lbnQucHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3Rvcjtcbn1cblxuaWYgKCFFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0KSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIEVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QgPSBmdW5jdGlvbiAocykge1xuICAgICAgICBsZXQgZWwgPSB0aGlzO1xuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGlmIChFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzLmNhbGwoZWwsIHMpKSByZXR1cm4gZWw7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQgfHwgZWwucGFyZW50Tm9kZTtcbiAgICAgICAgfSB3aGlsZSAoZWwgIT09IG51bGwgJiYgZWwubm9kZVR5cGUgPT09IDEpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xufVxuXG4iXX0=