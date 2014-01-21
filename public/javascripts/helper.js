window.scrollTo(0, 1);
var socket = io.connect('http://50.56.121.17:3334');
var SCREEN_OFFSET = 180;

var can;
var ctx;

function toHex(d){
  return ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
}
function getRandomRGBString(){
  return '#'+toHex(Math.random()*256)+toHex(Math.random()*256)+toHex(Math.random()*256);
}
var rgb = getRandomRGBString();

$(document).ready(function(){
  can = document.getElementById('can');
  ctx = can.getContext('2d');

  $(document).mousemove(function(e){
    socket.emit('mousemove', {x: e.pageX, y: e.pageY,rgb: rgb});
  });
  var oldgamma = 100;
  var oldbeta = 100;
  window.addEventListener('deviceorientation', function(e) {
    if(Math.abs(oldgamma-e.gamma) > 0.1 && Math.abs(oldbeta-e.beta) > 0.1){
      oldgamma = e.gamma;
      oldbeta = e.beta;
      socket.emit('mousemove', {x: (e.gamma+SCREEN_OFFSET)*1.3, y: (e.beta+SCREEN_OFFSET)*1.3, rgb: rgb});
    }
  },false);

  socket.on('mousemove', function(data) {
    ctx.setFillColor(data.rgb);
    ctx.fillRect(data.x-SCREEN_OFFSET/2,data.y-SCREEN_OFFSET/2,10,10);
  });
});
