// Create hint object
var sVimHint = {};

// Start hint
sVimHint.start = function(newTab) {
  var hintKeys = new String(sVimTab.settings.hintcharacters).toUpperCase();
  var xpath = "//a[@href]|//input[not(@type=\x22hidden\x22)]|//textarea|//select|//img[@onclick]|//button";
  var hintColor = "\x23ffff00";
  var hintColorForm = "\x2300ffff";
  var hintColorFocused= "\x23ff00ff";
  var keyMap = {"8": "Bkspc", "46": "Delete", "32": "Space", "13":"Enter", "16": "Shift", "17": "Ctrl", "18": "Alt"};

  var hintKeysLength;
  var hintContainerId = "hintContainer";
  var hintElements = [];
  var inputKey = "";
  var lastMatchHint = null;
  var k=0;
  var hintStrings = [];
  var elemCount = 0;
  var hintClass = "sVimLinkHint";
  var hintStyleId = "sVimLinkHintStyle";

  function getAbsolutePosition( elem, html, body, inWidth, inHeight ){
    var style = getComputedStyle(elem,null);
    if(style.visibility === "hidden" || style.opacity === "0" ) return false;
    //var rect = rectFixForOpera( elem, getComputedStyle(elem,null)) || elem.getClientRects()[0];
    var rect = elem.getClientRects()[0];
    if( rect && rect.right - rect.left >=0 && rect.left >= 0 && rect.top >= -5 && rect.bottom <= inHeight + 5 && rect.right <= inWidth ){
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

  function buildHintStrings()
  {
    var digitsNeeded = Math.ceil(Math.log(elemCount) / Math.log(hintKeysLength));
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

  function createText(num){
    if (hintStrings.length == 0) {
      buildHintStrings();
    }
    return hintStrings[num];
  }

  function getXPathElements(win){
    function resolv(p){ if (p == "xhtml") return "http://www.w3.org/1999/xhtml"; }
      var result = win.document.evaluate(xpath, win.document, resolv, 7, null);
    for (var i = 0, arr = [], len = result.snapshotLength; i < len; i++){
      arr[i] = result.snapshotItem(i);
    }
    return arr;
  }

  function countElements(win)
  {
    var html = win.document.documentElement;
    var body = win.document.body;
    var inWidth = win.innerWidth;
    var inHeight = win.innerHeight
    var elems = getXPathElements(win);
    elems.forEach(function(elem) {
      var pos = getAbsolutePosition(elem, html, body, inWidth, inHeight );
      if( pos == false ) return;
      elemCount++;
    });

  function injectCSS(doc, css)
  {
    var style = doc.getElementById(hintStyleId);
    if (style) {
      style.innerHTML = css;
    }
    else {
      style = doc.createElement('style');
      style.type = 'text/css';
      style.id = hintStyleId;
      style.innerHTML = css;
      doc.getElementsByTagName('head')[0].appendChild(style);
    }
  }

  function start(win){
    var html = win.document.documentElement;
    var body = win.document.body;
    var inWidth = win.innerWidth;
    var inHeight = win.innerHeight

    var df = document.createDocumentFragment();
    var div = df.appendChild(document.createElement("div"));
    div.id = hintContainerId;

    var spanStyle = {
      "position" : "absolute",
      "zIndex" : "214783647",
    };

    injectCSS(win.document, sVimTab.sVimrc.css);

    var elems = getXPathElements(win);
    elems.forEach(function(elem){
      var pos = getAbsolutePosition(elem, html, body, inWidth, inHeight );
      if( pos == false ) return;
      var hint = createText(k);
      var span = win.document.createElement("span");
      span.appendChild(document.createTextNode(hint));
      span.className = hintClass;
      var st = span.style;
      for( key in spanStyle ){
        st[key] = spanStyle[key];
      }
      st.backgroundColor = elem.hasAttribute("href") === true ? hintColor : hintColorForm;
      st.left = Math.max(0,pos.left-8) + "px";
      st.top = Math.max(0,pos.top-8) + "px";
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
        if( !inputKey ){
          removeHints();
          return;
        }
        resetInput();
        return;
      case "Space":
        removeHints();
        return;
      default:
        inputKey += onkey;
    }
    blurHint();
    if( inputKey in hintElements === false ){
      resetInput();
      inputKey += onkey;
    }
    lastMatchHint = hintElements[inputKey];
    if (lastMatchHint)
    {
      lastMatchHint.style.backgroundColor = hintColorFocused;
      var lastElement = lastMatchHint.element;
      event.preventDefault();
      event.stopPropagation();
      resetInput();
      removeHints();
      lastElement.focus();
      if (!newTab && /https?:\/\//.test(lastElement.href)) {
        sVimTab.commands.newTabBackground(lastElement.href);
      }
      else {
        fireEvent(lastElement, 'click');
      }
    }
  }

  function removeHints(){
    var frame = top.frames;
    if( !document.getElementsByTagName("frameset")[0]){
      end(top);
    }
    Array.prototype.forEach.call(frame, function(elem){
      try{
        end(elem);
      }catch(e){ }
    }, this);
  }

  function blurHint(){
    if(lastMatchHint){
      lastMatchHint.style.backgroundColor  = lastMatchHint.element.hasAttribute("href")===true?hintColor:hintColorForm;
    }
  }

  function resetInput(){
    inputKey = "";
    blurHint();
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
      countElements(window);
      start(window);
    }else{
      Array.prototype.forEach.call(frame, function(elem){
        try{
          countElements(window);
        }catch(e){
        }
      },this);
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
