function submit() {
  var nodeRegex = /\+-*>.+}/g
  var nameRegex = /\+-*>(.+){/
  var contentRegex = /{(.+)}/

  var dump = document.getElementById('dump').value;
  var matches;
  var maxMatches = 100;

  while (maxMatches-- > 0 && (matches = nodeRegex.exec(dump)) !== null) {
    var node = matches[0];
    var name = nameRegex.exec(node)[1];
    var content = contentRegex.exec(node)[1];
    var props = content.split(', ');
    var obj = {};
    for (var i = 0; i < props.length; i++) {
      var keyVal = props[i].split('=');
      var key = keyVal[0];
      var val = keyVal[1];
      try {
        val = eval(val);
      } catch (ReferenceError) {
        // Do nothing
      }
      obj[key] = val;
    }
    console.log(name);
    console.log(obj);
    if (['x', 'y', 'width', 'height'].every(function(prop){
      return obj.hasOwnProperty(prop);
    })) {
      var canvas = document.getElementById("myCanvas");
      var ctx = canvas.getContext("2d");
      ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
    }
  }
}
