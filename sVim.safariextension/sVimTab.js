// Create tab object
var sVimTab = {};
//setTimeout(function(){
// Settings passed in from global
sVimTab.settings = {};
// Indicates the tab mode
sVimTab.mode = "normal";
// Indicates if window is top
sVimTab.topWindow = (window.top === window);
// Indicates the top domain
sVimTab.topDomain = (!sVimTab.topWindow && window.location.ancestorOrigins) ? window.location.ancestorOrigins[0].match(/:\/\/(.*)/)[1] : window.location.hostname;
// Indicates the top url
sVimTab.topUrl = (!sVimTab.topWindow && document.referrer) ? document.referrer : window.location.href;
// Define commands that can be run
sVimTab.commands = {
  // Scroll down
  scrollDown: function() {
    sVimTab.scrollBy(0, sVimTab.settings.scrollstep);
  },

  // Scroll up
  scrollUp: function() {
    sVimTab.scrollBy(0, -sVimTab.settings.scrollstep);
  },

  // Scroll left
  scrollLeft: function() {
    sVimTab.scrollBy(-sVimTab.settings.scrollstep, 0);
  },

  // Scroll right
  scrollRight: function() {
    sVimTab.scrollBy(sVimTab.settings.scrollstep, 0);
  },

  // Scroll half-page down
  scrollPageDown: function() {
    sVimTab.scrollBy(0, window.innerHeight / 2);
  },

  // Scroll half-page up
  scrollPageUp: function() {
    sVimTab.scrollBy(0, -window.innerHeight / 2);
  },

  // Scroll full-page down
  scrollFullPageDown: function() {
    sVimTab.scrollBy(0, window.innerHeight * (sVimTab.settings.fullpagescrollpercent / 100));
  },

  // Scroll full-page up
  scrollFullPageUp: function() {
    sVimTab.scrollBy(0, -window.innerHeight * (sVimTab.settings.fullpagescrollpercent / 100));
  },

  // Scroll to bottom of the page
  scrollToBottom: function() {
    sVimTab.scrollBy(0, (document.body.scrollHeight - window.pageYOffset - window.innerHeight) * 1.1);
  },

  // Scroll to top of the page
  scrollToTop: function() {
    sVimTab.scrollBy(0, -window.pageYOffset * 1.1);
  },

  // Scroll to the left of the page
  scrollToLeft: function() {
    sVimTab.scrollBy(-window.pageXOffset - 30, 0);
  },

  // Scroll to the right of the page
  scrollToRight: function() {
    sVimTab.scrollBy(document.body.scrollWidth - window.pageXOffset - window.innerWidth + 30, 0);
  },

  // Go to the first input box
  goToInput: function() {
    var inputs = document.querySelectorAll("input,textarea");
    for (var i = 0; i < inputs.length; i++) {
      if (!inputs[i].readonly != undefined && inputs[i].type != "hidden" && inputs[i].disabled != true && inputs[i].style.display != "none") {
        inputs[i].focus();
        return;
      }
    }

    return false;
  },

  // Reload the current tab
  reloadTab: function() {
    location.reload();
  },

  // Zoom page in
  zoomPageIn: function() {
    document.body.style.zoom = (+document.body.style.zoom ? parseFloat(document.body.style.zoom) : 1) + (sVimTab.settings.zoomstep / 100);
  },

  // Zoom page out
  zoomPageOut: function() {
    document.body.style.zoom = (+document.body.style.zoom ? parseFloat(document.body.style.zoom) : 1) - (sVimTab.settings.zoomstep / 100);
  },

  // Zoom page to original size
  zoomOrig: function() {
    document.body.style.zoom = "1";
  },

  // Open Safari reader if possible
  openReader: function() {
    safari.self.tab.dispatchMessage("openReader");
  },

  // Show sVimrc page
  showsVimrc: function() {
    safari.self.tab.dispatchMessage("showsVimrc");
  },

  // Open help page in new tab
  help: function() {
    safari.self.tab.dispatchMessage("help");
  },

  // Navigate to the next tab
  nextTab: function() {
    safari.self.tab.dispatchMessage("nextTab");
  },

  // Navigate to the previous tab
  previousTab: function() {
    safari.self.tab.dispatchMessage("previousTab");
  },

  // Go to the first tab
  firstTab: function() {
    safari.self.tab.dispatchMessage("firstTab");
  },

  // Go to the last tab
  lastTab: function() {
    safari.self.tab.dispatchMessage("lastTab");
  },

  // Go to the last active tab that's still open
  lastActiveTab: function() {
    safari.self.tab.dispatchMessage("lastActiveTab");
  },

  // Close the current tab
  quit: function() {
    safari.self.tab.dispatchMessage("quit");
  },

  // Close the tab to the left of the current tab
  closeTabLeft: function() {
    safari.self.tab.dispatchMessage("closeTabLeft");
  },

  // Close the tab to the right of the current tab
  closeTabRight: function() {
    safari.self.tab.dispatchMessage("closeTabRight");
  },

  // Close all tabs to the left of the current tab
  closeTabsToLeft: function() {
    safari.self.tab.dispatchMessage("closeTabsToLeft");
  },

  // Close all tabs to the right of the current tab
  closeTabsToRight: function() {
    safari.self.tab.dispatchMessage("closeTabsToRight");
  },

  // Open the last closed tab
  lastClosedTab: function() {
    safari.self.tab.dispatchMessage("lastClosedTab");
  },

  // Open the last closed tab in background
  lastClosedTabBackground: function() {
    safari.self.tab.dispatchMessage("lastClosedTabBackground");
  },

  // Open new tab
  newTab: function(url) {
    safari.self.tab.dispatchMessage("newTab", url);
  },

  // Open new tab in background
  newTabBackground: function(url) {
    safari.self.tab.dispatchMessage("newTabBackground", url);
  },

  // Go back in history
  goBack: function() {
    history.back();
  },

  // Go forward in history
  goForward: function() {
    history.forward();
  },

  // Move current tab left
  moveTabLeft: function() {
    safari.self.tab.dispatchMessage("moveTabLeft");
  },

  // Move current tab right
  moveTabRight: function() {
    safari.self.tab.dispatchMessage("moveTabRight");
  },

  // Navigate to parent directory
  parentDirectory: function() {
    if (/:\/\/.*?\/./.test(sVimTab.topUrl)) {
      window.top.location.assign(sVimTab.topUrl.match(/(.*)./)[1].match(/.*\//));
    }
  },

  // Navigate to top directory
  topDirectory: function() {
    if (/:\/\/.*?\/./.test(sVimTab.topUrl)) {
      window.top.location.assign("http://" + sVimTab.topDomain);
    }
  },

  // Navigate to parent domain
  parentDomain: function() {
    var host = sVimTab.topDomain.replace(/^(?:www\d*\.)?.*?\./, "");
    var domains = host.split(".").length;
    if (domains == 2) {
      window.top.location.assign("http://www." + host);
    }
    else if (domains > 2) {
      window.top.location.assign("http://" + host);
    }
  },

  // Navigate to home page
  homePage: function() {
    window.location.assign(sVimTab.settings.homeurl);
  },

  // Open new window
  newWindow: function() {
    safari.self.tab.dispatchMessage("newWindow");
  },

  // Navigate to the next window
  nextWindow: function() {
    safari.self.tab.dispatchMessage("nextWindow");
  },

  // Navigate to the previous window
  previousWindow: function() {
    safari.self.tab.dispatchMessage("previousWindow");
  },

  // Enter normal mode
  normalMode: function() {
    var element = document.activeElement;
    if (element != null) {
      element.blur();
    }
    sVimTab.mode = "normal";
  },

  // Enter insert mode
  insertMode: function() {
    sVimTab.mode = "insert";
  },

  // Open link in current tab
  createHint: function() {
    sVimHint.start(true);
  },

  // Open link in new background tab
  createTabbedHint: function() {
    sVimHint.start(false);
  }
};

// Bind shortcuts
sVimTab.bind = function() {
  // Unbind current shortcuts and propagation
  Mousetrap.reset();
  document.removeEventListener("keydown", sVimTab.stopPropagation);

  // Check blacklist and return if on the blacklist
  if (sVimTab.checkBlacklist()) {
    return;
  }

  // Stop keydown propagation
  document.addEventListener("keydown", sVimTab.stopPropagation(), true);

  // Bind shortcuts to commands
  for (var shortcut in sVimTab.settings.shortcuts) {
    var command = sVimTab.settings.shortcuts[shortcut];
    // Replace <Leader>
    shortcut = shortcut.replace(/<[lL]eader>/g, sVimTab.settings.mapleader);
    // Bind going into normal mode even in textboxes
    if (command == "normalMode") {
      Mousetrap.bindGlobal(shortcut, sVimTab.runCommand(command), "keydown");
    }
    else {
      Mousetrap.bind(shortcut, sVimTab.runCommand(command), "keydown");
    }
  }
};

// Prevent propagation for all keydown events if in normal mode, non-escape key is pressed or active element is input
sVimTab.stopPropagation = function() {
  return function(e) {
    var element = document.activeElement;
    if (sVimTab.mode == "normal" && e.keyCode != 27
        && !(element != null && (element.tagName == "INPUT" || element.tagName == "SELECT" || element.tagName == "TEXTAREA" || (element.contentEditable && element.contentEditable == "true")))) {
      e.stopPropagation();
    }
  };
};

// Run the command pressed, if possible in current mode
sVimTab.runCommand = function(command) {
  return function() {
    var element = document.activeElement;
    // Only run command if in normal mode or command is normalMode, and if active element is not insert mode of a vim editor
    if ((sVimTab.mode == "normal" || command == "normalMode") &&
      !(element != null && element.parentNode.className.indexOf("ace_editor") != -1 && element.parentNode.className.indexOf("insert-mode") != -1)) {
      // FIXX WHEN ":" implemented
      sVimTab.commands[command]();
      return command == "normalMode";
    }
  };
};

// Check if page is on blacklist
sVimTab.checkBlacklist = function() {
  var blacklists = sVimTab.settings.blacklists;
  for (var i = 0; i < blacklists.length; i++) {
    var blacklist = blacklists[i].trim().split(/\s+/g);
    if (!blacklist.length) {
      continue;
    }
    if (sVimTab.matchLocation(document.location, blacklist[0])) {
      return true;
    }
  }

  return false;
};

// Checks if location @matches the pattern (https://github.com/1995eaton/chromium-vim/blob/master/content_scripts/utils.js)
sVimTab.matchLocation = function(location, pattern) {
  if (typeof pattern !== "string" || !pattern.trim()) {
    return false;
  }

  var protocol = (pattern.match(/.*:\/\//) || [""])[0].slice(0, -2);
  var hostname;
  var path;
  var pathMatch;
  var hostMatch;

  if (/\*\*/.test(pattern)) {
    console.error("sVim - Invalid pattern: " + pattern);
    return false;
  }

  if (!protocol.length) {
    console.error("sVim - Invalid protocol in pattern: ", pattern);
    return false;
  }

  pattern = pattern.replace(/.*:\/\//, "");
  if (protocol !== "*:" && location.protocol !== protocol) {
    return false;
  }

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

  if (pattern.length) {
    path = pattern.replace(/([.&\\\/\(\)\[\]!?])/g, "\\$1").replace(/\*/g, ".*");
    pathMatch = location.pathname.match(new RegExp(path));
    if (!pathMatch || pathMatch[0].length !== location.pathname.length) {
      return false;
    }
  }

  return true;
};

// Scroll by, smooth or not
sVimTab.scrollBy = function(x, y) {
  // If smooth scroll is off then use regular scroll
  if (!sVimTab.settings.smoothscroll) {
    scrollBy(x, y);
    return;
  }

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
      window.requestAnimationFrame(animLoop);
    }

    delta = easeOutExpo(i, 0, (x || y), sVimTab.settings.scrollduration);
    i += 1;
  }

  // Start scroll
  animLoop();
};

// Init sVimTab
safari.self.tab.dispatchMessage("sendSettings");

// Catch commands from global
safari.self.addEventListener("message", function(event) {
  if (event.name === "settings") {
    sVimTab.settings = event.message;
    sVimTab.bind();
  }
}, false);
