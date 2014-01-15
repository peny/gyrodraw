window.scrollTo(0, 1);
var socket = io.connect('http://50.56.121.17:3334');
var can;
var ctx;
function toHex(d){
  return ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
}
var rgb = '#'+toHex(Math.random()*256)+toHex(Math.random()*256)+toHex(Math.random()*256);

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
      socket.emit('mousemove', {x: (e.gamma+180)*1.3, y: (e.beta+180)*1.3, rgb: rgb});
    }
  },false);

  socket.on('mousemove', function(data) {
    ctx.setFillColor(data.rgb);
    ctx.fillRect(data.x-60,data.y-60,10,10);
  });
});
