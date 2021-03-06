var loadStyle;

if (typeof document !== 'undefined') {
  loadStyle = function loadStyle(id, contents) {
    if (!contents || document.getElementById(id)) {
      return;
    }

    var style = document.createElement('style');
    style.id = id;
    style.innerText = contents;
    document.head.appendChild(style);
  };
} else {
  loadStyle = function loadStyle() {
  };
}

export {loadStyle};
