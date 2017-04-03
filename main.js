Object.prototype.hasOwnProperties = function(arr) {
  var me = this;
  return arr.every(function(prop){
    return me.hasOwnProperty(prop);
  });
}

HTMLSelectElement.prototype.addOption = function(text) {
  if (this.type === 'select-one') {
    var option = document.createElement('option');
    var txt = document.createTextNode(text);
    option.appendChild(txt);
    this.appendChild(option);
  }
}

var fontSize = 20;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var filters = {};

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
      if (!filters.hasOwnProperty(key))
        filters[key] = [];
      if (filters[key].indexOf(val) === -1)
        filters[key].push(val)
    }
    console.log(name);
    console.log(obj);
    if (obj.hasOwnProperties(['x', 'y', 'width', 'height'])) {
      ctx.strokeStyle = 'gray';
      ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
    }

    if (obj.hasOwnProperties(['x', 'y', 'text'])) {
      ctx.font = fontSize + 'px sans-serif';
      ctx.strokeStyle = 'white';
      ctx.fillStyle = 'darkslategray';
      ctx.fillText(obj.text, obj.x + 5, obj.y + fontSize);
    }

    if (obj.hasOwnProperties(['x', 'y', 'res-name'])) {
      ctx.fillStyle = 'thistle';
      ctx.font = fontSize*0.7 + 'px monospace';
      ctx.fillText(obj['res-name'], obj.x, obj.y - 5);
    }
  }
  console.log('Filters:');
  console.log(filters);
  var sidebar = document.getElementById('filters');
  sidebar.innerHtml = '';
  for (var filter in filters) {
    var dropdown = document.createElement('select');
    dropdown.className = 'dropdown';
    dropdown.addOption('any');
    var options = filters[filter];
    for (var i = 0; i < options.length; i++) {
      dropdown.addOption(options[i]);
    }
    var name = document.createTextNode(filter);
    sidebar.appendChild(name);
    sidebar.appendChild(document.createElement('br'));
    sidebar.appendChild(dropdown);
    sidebar.appendChild(document.createElement('br'));
  }
}
