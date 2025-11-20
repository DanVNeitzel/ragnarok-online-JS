var object = document.querySelectorAll('.draggable'),
  initX, initY, firstX, firstY;

for (var x in object) {
  object[x].onclick = function () {
    Selected(this);
  };
};

function Selected(current) {
  current.style.zIndex = current.style.zIndex + 1;
  current.addEventListener('mousedown', function (e) {

    current.style.background = "#ffffffb0";
    current.style.zIndex = current.style.zIndex + 1;
    e.preventDefault();
    initX = this.offsetLeft;
    initY = this.offsetTop;
    firstX = e.pageX;
    firstY = e.pageY;

    this.addEventListener('mousemove', dragIt, false);
    window.addEventListener('mouseup', function () {
      current.style.background = "#ffffff";
      current.removeEventListener('mousemove', dragIt, false);
    }, false);

  }, false);

  current.addEventListener('touchstart', function (e) {

    e.preventDefault();
    initX = this.offsetLeft;
    initY = this.offsetTop;
    var touch = e.touches;
    firstX = touch.pageX;
    firstY = touch.pageY;

    this.addEventListener('touchmove', swipeIt, false);

    window.addEventListener('touchend', function (e) {
      e.preventDefault();
      current.removeEventListener('touchmove', swipeIt, false);
    }, false);

  }, false);

  function dragIt(e) {
    this.style.left = initX + e.pageX - firstX + 'px';
    this.style.top = initY + e.pageY - firstY + 'px';
  }

  function swipeIt(e) {
    var contact = e.touches;
    this.style.left = initX + contact.pageX - firstX + 'px';
    this.style.top = initY + contact.pageY - firstY + 'px';
  }
}

