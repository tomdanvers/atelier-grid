var GridItem = require('./grid-item');

module.exports = function() {
	console.log('Grid');

	var el = document.createElement('div');
	el.classList.add('grid');

	var elItems = document.createElement('div');
	elItems.classList.add('grid-items');

	el.appendChild(elItems);
	
	var canvas = document.createElement('canvas');	
	var ctx = canvas.getContext('2d');
	var scaleX = 16;
	var scaleY = 24;
	
	function render() {
		canvas.width = colCount*scaleX;
		canvas.height = rowCount*scaleY;
		
		for (var x = 0; x < columns.length; x++) {
			
			for (var y = 0; y < rowCount; y++) {
				var space = columns[x][y];
				var item = space.item;
				if(item){
					ctx.fillStyle = item.cssColour();
					ctx.fillRect(x*scaleX, y*scaleY, scaleX, scaleY);
				}
			}	
		}

		canvas.classList.add('grid-debug');
		el.appendChild(canvas)
	}

	

	





	// Cells

	var cellWidthBase = 60;
	var cellHeightBase = 90;
	var cellWidthAdjusted = 0;
	var cellHeightAdjusted = 0;

	var rowCount = 0;
	var colCount = 0;

	var vieportWidth;
	var viewportHeight;

	var itemDefinitions = [
		{
			width: 2,
			height: 1,
			label: 'landscape-small'	
		},
		{
			width: 1,
			height: 1,
			label: 'portrait-small'	
		},
		{
			width: 2,
			height: 2,
			label: 'portrait-medium'	
		},
		{
			width: 3,
			height: 3,
			label: 'portrait-large'	
		}
	];
	
	var idCount;
	
	var columns;
	var currentColumn;

	window.addEventListener('resize', resize);
	resize();

	function resize() {

		viewportWidth = window.innerWidth;
		viewportHeight = window.innerHeight;

		rowCount = Math.floor(viewportHeight / cellHeightBase);

		cellHeightAdjusted = Math.ceil(viewportHeight / rowCount);
		cellWidthAdjusted = cellHeightAdjusted / cellHeightBase * cellWidthBase;

		colCount = Math.ceil(viewportWidth / cellWidthAdjusted);		

		console.log('COLS:', colCount, 'ROWS:', rowCount)

		regenerate();

	}


	function regenerate() {

		idCount = 0;

		columns = [];
		// currentColumnIndex = 0;
		currentColumn = createColumn(0, 1);

		elItems.innerHTML = '';

		update();

	}

	function update() {

		if (currentColumn.full) {

			nextColumn();

		} else {

			for (var i = 0; i < rowCount; i++) {
				
				if (currentColumn[i].item === null) {

					// Select a grid item definition that fits vertically in the available space
					var definition = getDefinition(i);

					// Add a grid item based on the selected definition
					addGridItem(definition, currentColumn.index, i);

				}
			}

		}
		
		render();
			
		if(currentColumn.index < colCount) {
			setTimeout(update, 100);
		} else {
			console.log(columns)

		}

	}

	function getDefinition(originY) {
		
		var definition = null;
		var searching = true;
		while (searching) {
			definition = itemDefinitions[Math.floor(Math.random() * itemDefinitions.length)];
			searching = false;
			for (var i = originY; i < originY + definition.height; i++) {
				if(i >= rowCount || currentColumn[i].item !== null) {
					searching = true;
				}
			}

		}
		return definition;

	}

	function addGridItem(definition, xOrigin, yOrigin) {

		var item = new GridItem(idCount ++, definition, xOrigin, yOrigin);
		
		item.el.style.width = item.width * cellWidthAdjusted + 'px';
		item.el.style.height = item.height * cellHeightAdjusted + 'px';
		item.el.style.left = item.x * cellWidthAdjusted + 'px';
		item.el.style.top = item.y * cellHeightAdjusted + 'px';

		elItems.appendChild(item.el);

		for (var x = xOrigin; x < xOrigin + item.width; x++) {
			
			if (columns[x] === undefined) {
				createColumn(x, 1);
			}	

			for (var y = yOrigin; y < yOrigin + item.height; y++) {
				columns[x][y].item = item;
			}	
		}

		// Check if column is full
		
		if (filledCount() === rowCount) {
			currentColumn.full = true;
			
			nextColumn();
		}

	}

	function filledCount() {
		var filledCount = 0;
		for (var i = 0; i < currentColumn.length; i++) {
			if (currentColumn[i].item !== null) {
				filledCount ++;
			}
		}
		return filledCount;
	}

	function nextColumn() {
		// console.log('nextColumn', 'OLD', currentColumn.index, currentColumn);
		if (columns[currentColumn.index + 1] === undefined) {
			currentColumn = createColumn(currentColumn.index + 1, 1);
		} else {
			currentColumn = columns[currentColumn.index + 1];
		}

		currentIndex = currentColumn.index;

		
		// console.log('nextColumn', 'NEW',currentColumn.index, currentColumn);
		if (filledCount() === rowCount) {
			currentColumn.full = true;
			nextColumn();
		}
	}

	function createColumn(index, side) {

		var column = [];
		for (var i = 0; i < rowCount; i++) {
			column.push({
				item: null,
				x: index,
				y: i
			});
		}

		// if (side === -1) {
		// 	columns.unshift(column);
		// } else if (side === 1) {
			columns.push(column);
		// }

		column.full = false;
		column.index = index;

		return column;
	}


	// Interaction

	el.addEventListener('mousemove', function(event) {
		
		var x = event.clientX;
		var margin = viewportWidth*.1;

		if (x < margin) {
			xVelocity = x / margin;
		} else if(x > margin * 5) {
			xVelocity = (x - margin*5) / (margin*5)
		}
		var xVelocity = x/margin
		
	});








	return {
		el : el
	};

}