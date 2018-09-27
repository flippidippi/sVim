// Create hint object
var sVimHint = {};

// Start hint
sVimHint.start = function(newTab) {
  var hintKeys = new String(sVimTab.settings.hintcharacters).toUpperCase();
  /**Given a HTML element, we use following criteria to decide if to generate
   * hint for it.
   * 1. we check if it has invalid style. If so, return false.
   * 2. we check if it has invalid attributes. If so, return false.
   * 3. we check if it is the tag we want. If so, return true.
   * 4. we check if it has some style we want. If so, return true.
   * 5. return false.
   */
  var invalidStyle = {
    'display': 'none',
    'visibility': 'hidden'
  }
  var invalidAttr = {
    'type': 'hidden',
    'hidden': true,
    'disabled': true
  };
  var validTagNames = {
    'a': true,
    'input': true,
    'textarea': true,
    'select': true,
    'img':{'onclick':true},
    'button': true,
    'div': {'role':'button'},
    'summary': true,
    'iframe': true
  };
  var validStyle = {
    'cursor': 'pointer'
  }
  var keyMap = {"8": "Bkspc", "46": "Delete", "32": "Space", "13":"Enter", "16": "Shift", "17": "Ctrl", "18": "Alt"};

  var hintKeysLength;
  var hintContainerId = "hintContainer";
  var hintElements = {};
  var inputKey = "";
  var lastMatchHint = null;
  var hintStrings = [];

  function getAbsolutePosition(elem, html, body, inWidth, inHeight){
    var style = getComputedStyle(elem,null);
    if(style.visibility === "hidden" || style.opacity === "0" ) return false;
    var rect = elem.getBoundingClientRect();
    // Check if the element is visible on the view.
    if( rect && (rect.top+rect.bottom+rect.left+rect.right >0) && rect.right - rect.left >= 0 && rect.bottom-rect.top>=0 && rect.left >= 0 && rect.top >= -5 && rect.top <= inHeight + 5 && rect.left <= inWidth ){
      return {
        top: (body.scrollTop || html.scrollTop) - html.clientTop + rect.top,
        left: (body.scrollLeft || html.scrollLeft ) - html.clientLeft + rect.left
      }
    }
    return false;

  }

  function numberToHintString(number, characterSet, numHintDigits) {
    var base = characterSet.length;
    var hintString = [];
    var remainder = 0;
    while (number > 0) {
      remainder = number % base;
      hintString.unshift(characterSet[remainder]);
      number -= remainder;
      number /= Math.floor(base);
    }

    // Pad the hint string we're returning so that it matches numHintDigits.
    // Note: the loop body changes hintString.length, so the original length must be cached!
    var hintStringLength = hintString.length;
    for (var i = 0; i < numHintDigits - hintStringLength; i++) {
      hintString.unshift(characterSet[0]);
    }

    return hintString.join("");
  }

  function buildHintStrings(elemCount)
  {
    var digitsNeeded = Math.ceil(Math.log(elemCount+1) / Math.log(hintKeysLength));
    var shortHintCount = Math.floor((Math.pow(hintKeysLength, digitsNeeded) - elemCount) / hintKeysLength);
    var longHintCount = elemCount - shortHintCount;

    if (digitsNeeded > 1) {
      for (var i = 0; i < shortHintCount; i++) {
        hintStrings.push(numberToHintString(i, hintKeys, digitsNeeded - 1));
      }
    }

    var start = shortHintCount * hintKeysLength;
    for (var i = start; i < start + longHintCount; i++) {
      hintStrings.push(numberToHintString(i, hintKeys, digitsNeeded));
    }

    hintStrings = shuffleHints(hintStrings, hintKeysLength);
  }

  function shuffleHints(hints, characterSetLength) {
    var buckets = [];
    for (var i = 0; i < characterSetLength; i++) {
      buckets.push([]);
    }
    for (var i = 0; i < hints.length; i++) {
      buckets[i % buckets.length].push(hints[i]);
    }
    var result = [];
    for (var i = 0; i < buckets.length; i++) {
      result = result.concat(buckets[i]);
    }
    return result;
  }

  function createText(num, elemCount){
    if (hintStrings.length == 0) {
      buildHintStrings(elemCount);
    }
    return hintStrings[num];
  }

  // A Depth First Search to iterate through all HTML elements from body. We
  // ignore the its children when we find an element meeting our criteria. In
  // this way, we avoid generating duplicated hints.
  function getValidElements(win) {
    var body = win.document.body
    var toProcess = [body];
    var result = [];
    while (toProcess.length > 0){
      var elem = toProcess.pop();
      if(isValidStyle(elem) && isValidAttr(elem)){
        if(isValidTag(elem)) result.push(elem);
        else {
          var children = elem.children;
          for(i=0;i<children.length;i++){
            toProcess.push(children[i]);
          }
        }
      }
    }
    return result;
  }
  function isValidStyle(elem){
    for(s in invalidStyle){
      if(getComputedStyle(elem)[s] == invalidStyle[s]) return false;
    }
    return true;
  }
  function isValidAttr(elem){
    for(attr in invalidAttr){
      if(elem.getAttribute(attr) == invalidAttr[attr]) return false;
    }
    return true;
  }
  function isValidTag(elem) {
    var tagValid = validTagNames[elem.tagName.toLowerCase()]
    if(tagValid) {
      for(attr in tagValid) {
        if(elem.getAttribute(attr) != tagValid[attr]) return false;
      }
      return true;
    } else {
      for(s in validStyle) {
        if(getComputedStyle(elem)[s] == validStyle[s]) return true;
      }
      return false;
    }
  }

  function getElemPositions(win) {
    var html = win.document.documentElement;
    var body = win.document.body;
    var inWidth = win.innerWidth;
    var inHeight = win.innerHeight

    var elems = getValidElements(win);
    var elemPositions = [];
    elems.forEach(function(elem){
      var pos = getAbsolutePosition(elem, html, body, inWidth, inHeight );
      if( pos == false ) return;
      elemPositions.push({"elem":elem, "pos":pos});
    }, this);
    return elemPositions;
  }

  function start(win){
    var df = document.createDocumentFragment();
    var div = df.appendChild(document.createElement("div"));
    div.id = hintContainerId;
    div.style.position = "static";

    var spanStyle = {
      "position" : "fixed",
      "zIndex" : "214783647",
      "margin": "0px"
    };

    var elemPositions = getElemPositions(win);
    var k = 0;
    var elemCount = elemPositions.length;
    elemPositions.forEach(function(elemPosition){
      var elem = elemPosition.elem;
      var pos = elemPosition.pos;
      var hint = createText(k, elemCount);
      var span = win.document.createElement("span");
      span.appendChild(document.createTextNode(hint));
      span.className = "sVim-hint";
      var st = span.style;
      for( key in spanStyle ){
        st[key] = spanStyle[key];
      }
      if (elem.hasAttribute("href") !== true) {
        span.classList.add("sVim-hint-form");
      }
      st.left = Math.max(0,pos.left-4) + "px";
      st.top = Math.max(0,pos.top-4) + "px";
      hintElements[hint] = span;
      span.element = elem;
      div.appendChild(span);
      k++;
    },this);
    win.document.addEventListener("keydown", handle, true );
    win.document.body.appendChild(df);
  }

  function fireEvent(element,event) {
     if (document.createEvent) {
         // dispatch for firefox + others
         var evt = document.createEvent("HTMLEvents");
         evt.initEvent(event, true, true ); // event type,bubbling,cancelable
         return !element.dispatchEvent(evt);
     } else {
         // dispatch for IE
         var evt = document.createEventObject();
         return element.fireEvent('on'+event,evt)
     }
  }

  function handle(event){
    var key = event.keyCode || event.charCode;
    if( key in keyMap === false ){
      removeHints();
      return;
    }
    var onkey = keyMap[key];
    switch(onkey){
      case "Enter":
      case "Shift":
      case "Ctrl":
      case "Alt":
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    switch(onkey){
      case "Bkspc":
      case "Delete":
        if (!inputKey){
          removeHints();
          return;
        }
        inputKey = inputKey.slice(0, -1)
        setFocused();
        return;
      case "Space":
        removeHints();
        return;
      default:
        inputKey += onkey;
    }
    setFocused();

    lastMatchHint = hintElements[inputKey];
    if (lastMatchHint) {
      var lastElement = lastMatchHint.element;
      event.preventDefault();
      event.stopPropagation();
      resetInput();
      removeHints();
      lastElement.focus();
      if (newTab && /https?:\/\//.test(lastElement.href)) {
        newTab(lastElement.href);
      }
      else {
        fireEvent(lastElement, 'click');
      }
    }
  }

  function setFocused() {
    for (var key in hintElements) {
      if (inputKey !== "" && key.indexOf(inputKey) === 0) {
        hintElements[key].classList.add("sVim-hint-focused");
      }
      else if (key.indexOf(inputKey) !== 0) {
        hintElements[key].classList.add("sVim-hint-hidden"); 
      }
      else {
        hintElements[key].classList.remove("sVim-hint-focused");
        hintElements[key].classList.remove("sVim-hint-hidden"); 
      }
    }
  }

  function removeHints(){
    var frame = window.frames;
    if( !document.getElementsByTagName("frameset")[0]){
      end(window);
    }else {
      Array.prototype.forEach.call(frame, function(elem){
        try{
          end(elem);
        }catch(e){ }
      }, this);
    }
  }

  function resetInput(){
    inputKey = "";
    lastMatchHint = null;
  }

  function end(win){
    var div = win.document.getElementById(hintContainerId);
    win.document.removeEventListener("keydown", handle, true);
    if(div){
      win.document.body.removeChild(div);
    }
    sVimTab.mode = "normal";
  }

  function hahInit(){
    hintKeysLength = hintKeys.length;
    hintKeys.split("").forEach(function(l){ keyMap[l.charCodeAt(0)] = l;  }, this);
  }

  function hahDraw(){

    var frame = window.frames;
    if(!document.getElementsByTagName("frameset")[0]){
      start(window);
    }else{
      Array.prototype.forEach.call(frame, function(elem){
        try{
          start(elem);
        }catch(e){
        }
      },this);
    }
  }

  sVimTab.mode = "hint";
  hahInit();
  hahDraw();
};
