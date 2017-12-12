// Create helper object
var sVimHelper = {};

var animationFrame

// Determines if the element given is an input type
sVimHelper.isElementInput = function(element) {
  return (
    (element.localName === "textarea" || element.localName === "input" || element.getAttribute("contenteditable") === "true")
    && !element.disabled
    && !/button|radio|file|image|checkbox|submit/i.test(element.getAttribute("type"))
  );
};

// Determines if the element given is visible
sVimHelper.isElementVisible = function(element) {
  return (
    element.offsetParent
    && !element.disabled
    && element.getAttribute("type") !== "hidden"
    && getComputedStyle(element).visibility !== "hidden"
    && element.getAttribute("display") !== "none"
  );
}

// Determines if the element given is in the viewport
sVimHelper.isElementInView = function(element) {
  var rect = element.getClientRects()[0];
  return (
    rect.top + rect.height >= 0
    && rect.left + rect.width >= 0
    && rect.right - rect.width <= window.innerWidth
    && rect.top < window.innerHeight
  );
};

// Scroll by, smooth or not
sVimHelper.scrollBy = function(x, y) {
  // If smooth scroll is off then use regular scroll
  if (!sVimTab.settings.smoothscroll) {
    scrollBy(x, y);
    return;
  }
  window.cancelAnimationFrame(animationFrame)

  // Smooth scroll
  var i = 0;
  var delta = 0;

  // Ease function
  function easeOutExpo(t, b, c, d) {
    return c * (-Math.pow(2, -10 * t / d ) + 1 ) + b;
  }

  // Animate the scroll
  function animLoop() {
    if (y) {
      window.scrollBy(0, Math.round(easeOutExpo(i, 0, y, sVimTab.settings.scrollduration) - delta));
    } else {
      window.scrollBy(Math.round(easeOutExpo(i, 0, x, sVimTab.settings.scrollduration) - delta), 0);
    }

    if (i < sVimTab.settings.scrollduration) {
      animationFrame = window.requestAnimationFrame(animLoop);
    }

    delta = easeOutExpo(i, 0, (x || y), sVimTab.settings.scrollduration);
    i += 1;
  }

  // Start scroll
  animLoop();
};

// Checks if location @matches the pattern (https://github.com/1995eaton/chromium-vim/blob/master/content_scripts/utils.js)
sVimHelper.matchLocation = function(location, pattern) {
  // Check pattern is non-empty string
  if (typeof pattern !== "string" || !pattern.trim()) {
    return false;
  }

  var protocol = (pattern.match(/.*:\/\//) || [""])[0].slice(0, -2);
  var hostname;
  var path;
  var pathMatch;
  var hostMatch;

  // Check the pattern is a pattern
  if (/\*\*/.test(pattern)) {
    console.error("sVim - Invalid pattern: " + pattern);
    return false;
  }
  // Check protocol is in pattern
  if (!protocol.length) {
    console.error("sVim - Invalid protocol in pattern: ", pattern);
    return false;
  }
  // Check protocol mismatch
  if (protocol !== "*:" && location.protocol !== protocol) {
    return false;
  }
  // Check host mismatch
  pattern = pattern.replace(/.*:\/\//, "");
  if (location.protocol !== "file:") {
    hostname = pattern.match(/^[^\/]+\//g);
    if (!hostname) {
      console.error("sVim - Invalid host in pattern: ", pattern);
      return false;
    }
    var origHostname = hostname;
    hostname = hostname[0].slice(0, -1).replace(/([.])/g, "\\$1").replace(/\*/g, ".*");
    hostMatch = location.hostname.match(new RegExp(hostname, "i"));
    if (!hostMatch || hostMatch[0].length !== location.hostname.length) {
      return false;
    }
    pattern = "/" + pattern.slice(origHostname[0].length);
  }
  // Check path mismatch
  if (pattern.length) {
    path = pattern.replace(/([.&\\\/\(\)\[\]!?])/g, "\\$1").replace(/\*/g, ".*");
    pathMatch = location.pathname.match(new RegExp(path));
    if (!pathMatch || pathMatch[0].length !== location.pathname.length) {
      return false;
    }
  }

  return true;
};
