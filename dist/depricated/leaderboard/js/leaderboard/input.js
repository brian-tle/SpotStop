var keyList = [];
var leftClick = false; rightClick = false;

function onMouseDown(event) {
  if (event.which == 1) { leftClick = true; }
  if (event.which == 3) { rightClick = true; }

  //console.log(leftClick + ":" + rightClick);
}

function onMouseUp(event) {
  if (event.which == 1 && leftClick == true) { leftClick = false; }
  if (event.which == 3 && rightClick == true) { rightClick = false; }

  //console.log(leftClick + ":" + rightClick);
}

function onKeyDown(key) {
  if (keyList.indexOf(key.keyCode) == -1) {
    keyList.push(key.keyCode);
    // console.log(key.keyCode);
  }

  //keyList.forEach(function (item, index, array) { console.log(item, index); });
}

function onKeyUp(key) {
  if (keyList.indexOf(key.keyCode) != -1) {
    keyList.splice(keyList.indexOf(key.keyCode), 1);
  }
}