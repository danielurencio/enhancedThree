this.onmessage = function(e) {
  this.postMessage({ r: e.data + " !"  });
};
