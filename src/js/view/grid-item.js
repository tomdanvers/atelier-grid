var template = require('./grid-item.hbs');

module.exports = function(id, definition, x, y, direction) {
	// console.log('GridItem(',id, definition, x, y,')');

	var el = document.createElement('div');
	el.id = id;
	el.classList.add('grid-item');
	el.classList.add(direction === 1 ? 'is-right' : 'is-left');
	setTimeout(function() {
		el.classList.remove(direction === 1 ? 'is-right' : 'is-left');
	}, 200 + Math.random() * 200);
	el.innerHTML = template({id:id});

	var width = definition.width;
	var height = definition.height;
	var r = Math.floor(Math.random() * 255);
	var g = Math.floor(Math.random() * 255);
	var b = Math.floor(Math.random() * 255);

	function cssColour() {
		return 'rgb(' + r + ',' + g + ',' + b + ')';
	}

	return {
		el : el,
		x: x,
		y:y,
		width: width,
		height: height,
		cssColour: cssColour
	};

}