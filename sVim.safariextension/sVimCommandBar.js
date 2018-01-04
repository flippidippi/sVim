// Create command bar object
var sVimCommandBar = {};

sVimCommandBar.start = function() {
  sVimTab.mode = "insert";
  input = document.createElement('input');
  input.style.all = 'inherit';
  input.value = '';
  sVimTab.commandDiv.innerHTML = '';
  sVimTab.commandDiv.appendChild(input);

  input.onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
      // Enter pressed
      evaluate(input.value)
      close();
      return;
    }
    if (keyCode == '27'){
      // Esc pressed
      close();
      return;
    }
    // close command bar when input is empty
    //if (input.value == '') {
    //  close();
    //  return;
    //}
  };

  sVimTab.commandDiv.style.display = "block";
  input.focus();

  // Evaluate user command
  function evaluate(c) {
    var googleSearch = "https://www.google.com/search?q="
    var url = googleSearch + escape(c)
    sVimTab.commands.newTabBackground(url);
  };

  // close command bar
  function close() {
    sVimTab.mode = "normal";
    sVimTab.commandDiv.innerHTML = "-- NORMAL --";
    sVimTab.commandDiv.style.display = "none";
  };
};
