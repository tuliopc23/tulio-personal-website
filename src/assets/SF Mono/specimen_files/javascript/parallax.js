(() => {
  function elementViewportOffset(element) {
    var rect = element.getBoundingClientRect();
    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return 1 - rect.bottom / viewportHeight;
  }

  var parallaxSections = document.getElementsByClassName("l-parallax");
  var iter;
  var i;
  var section;
  var parallaxElements;
  var element;
  var offset;
  var maxTranslate;
  var initialTop;

  // Save each element's initial `top`
  for (iter = 0; iter < parallaxSections.length; iter++) {
    section = parallaxSections[iter];
    parallaxElements = section.querySelectorAll(".l-parallax_item");
    for (i = 0; i < parallaxElements.length; i++) {
      element = parallaxElements[i];
      element.setAttribute("data-initial-top", element.offsetTop);
    }
  }

  function updatePositions() {
    for (iter = 0; iter < parallaxSections.length; iter++) {
      section = parallaxSections[iter];
      offset = elementViewportOffset(section);
      if (offset > -1 && offset < 1) {
        // Is in the viewport
        parallaxElements = section.querySelectorAll(".l-parallax_item");
        for (i = 0; i < parallaxElements.length; i++) {
          element = parallaxElements[i];
          maxTranslate = +element.getAttribute("data-parallax-translate");
          initialTop = +element.getAttribute("data-initial-top");
          element.style.top = `${initialTop - maxTranslate * offset}px`;
        }
      }
    }
  }

  window.addEventListener("scroll", updatePositions);
  updatePositions();
})();
