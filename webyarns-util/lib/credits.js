"use strict";

(function () {
  var ScrollRate = 30;
  var reachedMaxScroll = false;
  var previousScrollTop = 0;
  var scrollInterval;
  Reveal.addEventListener('slidechanged', function (e) {
    if (e.currentSlide.id === "credits") {
      var div = document.getElementById('scrollTitles');
      div.scrollTop = 0;
      scrollInterval = setInterval(scrollDiv(div), ScrollRate);
    }

    if (e.previousSlide === "credits") {
      clearInterval(scrollInterval);
    }
  });

  function scrollDiv(div) {
    return function () {
      if (!reachedMaxScroll) {
        div.scrollTop = previousScrollTop;
        previousScrollTop++;
        reachedMaxScroll = div.scrollTop >= div.scrollHeight - div.offsetHeight;
      } else {
        div.scrollTop = previousScrollTop = 0;
        reachedMaxScroll = div.scrollTop !== 0;
        div.scrollTop = previousScrollTop;
        previousScrollTop--;
      }
    };
  }
  /*
     function resumeDiv() {
        const DivElmnt = document.getElementById('scrollTitles');
        previousScrollTop = DivElmnt.scrollTop;
        ScrollInterval = setInterval('scrollDiv()', ScrollRate);
    }*/

})();