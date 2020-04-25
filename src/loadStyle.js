// ========== BEGIN loadStyle INIT BLOCK ==========

var loadStyle;

if (typeof document !== 'undefined') {
  loadStyle = function loadStyle(id, contents) {
    if (!contents || document.getElementById(id)) {
      return;
    }

    var style = document.createElement('style');
    style.id = id;
    style.innerText = contents;
    setTimeout(function appendStyleToDom() {
      document.head.appendChild(style);
    });
  };
} else {
  loadStyle = function loadStyle() {
  };
}

export {loadStyle};

// ========== END loadStyle INIT BLOCK ==========
