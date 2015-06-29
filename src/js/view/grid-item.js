var template = require('./grid-item.hbs');

module.exports = function(id, definition, x, y) {
	// console.log('GridItem(',id, definition, x, y,')');

	var el = document.createElement('div');
	el.id = id;
	el.classList.add('grid-item');
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