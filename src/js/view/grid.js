var raf = require('raf');
var GridItem = require('./grid-item');
var GridImages = require('./grid-images');

module.exports = function(imageData, imagePadding) {
	
	console.log('Grid()');

	var itemDefinitions = [
		{
			width: 2,
			height: 1,
			id: 'landscape-small'	
		},
		// {
		// 	width: 5,
		// 	height: 2,
		// 	id: 'landscape-medium'	
		// },
		// {
		// 	width: 1,
		// 	height: 1,
		// 	id: 'portrait-small'	
		// },
		{
			width: 2,
			height: 2,
			id: 'portrait-medium'	
		},
		{
			width: 3,
			height: 3,
			id: 'portrait-large'	
		}
	];

	var images = new GridImages(imageData, itemDefinitions)
		.onProgress(function(value) {

		})
		.onLoaded(function() {

			raf(animate);
			
			window.addEventListener('resize', resize);
			resize();
			
		});

	var el = document.createElement('div');
	el.classList.add('grid');

	var itemsEl = document.createElement('div');
	itemsEl.classList.add('grid-items');

	el.appendChild(itemsEl);

	// Cells

	var cellWidthBase = 130;
	var cellHeightBase = 180;
	var cellWidthAdjusted = 0;
	var cellHeightAdjusted = 0;

	var viewportHeightCells = 0;
	var viewportWidthCells = 0;

	var vieportWidth;
	var viewportHeight;

	var originIndex;

	var columnIndexMax = 0;
	var columnIndexMin = 0;

	
	var idCount;
	
	var columns;
	var currentColumnLeft;
	var currentColumnRight;

	function resize() {

		var isChanged = window.innerHeight - 1 !== viewportHeight;

		viewportWidth = window.innerWidth;
		viewportHeight = window.innerHeight - 1;

		viewportHeightCells = Math.floor(viewportHeight / cellHeightBase);

		cellHeightAdjusted = viewportHeight / viewportHeightCells;
		cellWidthAdjusted = cellHeightAdjusted / cellHeightBase * cellWidthBase;

		viewportWidthCells = Math.ceil(viewportWidth / cellWidthAdjusted);

		if (isChanged) {

			images.resample(cellWidthAdjusted, cellHeightAdjusted, imagePadding)

			regenerate();

		} 
	}


	function regenerate() {

		idCount = 0;

		originIndex = 0;

		columns = [];
		// currentColumnIndex = 0;
		currentColumnLeft = currentColumnRight = createColumn(0, 1);

		itemsEl.innerHTML = '';

		xPosCell = 0;
		xPosScreen = 0;
		xVelocityScreenTarget = 0;
		xVelocityScreenCurrent = 0;

		// update();

	}

	function update(direction) {
		
		var currentColumn = direction === -1 ? currentColumnLeft : currentColumnRight;

		if (currentColumn.full) {

			nextColumn(direction);

		} else {

			for (var i = 0; i < viewportHeightCells; i++) {
				
				if (currentColumn[i].item === null) {

					// Select a grid item definition that fits vertically in the available space
					var definition = getDefinition(i, currentColumn);

					// Add a grid item based on the selected definition
					addGridItem(definition, direction === 1 ? currentColumn.index : currentColumn.index - definition.width + 1, i, direction);

				}
			}

		}
		
		// render();

	}

	function getDefinition(originY, currentColumn) {
		
		var definition = null;
		var searching = true;
		while (searching) {
			definition = itemDefinitions[Math.floor(Math.random() * itemDefinitions.length)];
			searching = false;
			for (var i = originY; i < originY + definition.height; i++) {
				if(i >= viewportHeightCells || currentColumn[i].item !== null) {
					searching = true;
				}
			}

		}
		return definition;

	}

	function addGridItem(definition, xOrigin, yOrigin, direction) {

		var item = new GridItem(idCount ++, definition, xOrigin, yOrigin, direction);
		item.addImage(images.getRandom(definition));
		
		item.el.style.width = item.width * cellWidthAdjusted + 'px';
		item.el.style.height = item.height * cellHeightAdjusted + 'px';
		item.el.style.left = item.x * cellWidthAdjusted + 'px';
		item.el.style.top = item.y * cellHeightAdjusted + 'px';
		item.el.style.padding = imagePadding + 'px';

		itemsEl.appendChild(item.el);


		if (direction === 1) {

			for (var x = xOrigin; x < xOrigin + item.width; x++) {
				
				if (columns[x + originIndex] === undefined || columns[x + originIndex].index !== x) {
					createColumn(x, direction);
				}	

				for (var y = yOrigin; y < yOrigin + item.height; y++) {
					columns[x + originIndex][y].item = item;
				}	
			}
			
		} else {

			for (var x = xOrigin + item.width - 1; x >= xOrigin; x--) {
				
				if (columns[x + originIndex] === undefined || columns[x + originIndex].index !== x) {
					createColumn(x, direction);
				}	

				for (var y = yOrigin; y < yOrigin + item.height; y++) {
					columns[x + originIndex][y].item = item;
				}	
			}

		}



		// Check if column is full

		var currentColumn = direction === 1 ? currentColumnRight : currentColumnLeft;
		
		if (filledCount(currentColumn) === viewportHeightCells) {
			currentColumn.full = true;
			if (direction === 1) {
				columnIndexMax = currentColumn.index;
			} else {
				columnIndexMin = currentColumn.index;
			}
			nextColumn(direction);
		}

	}

	function filledCount(column) {
		var filledCount = 0;
		for (var i = 0; i < column.length; i++) {
			if (column[i].item !== null) {
				filledCount ++;
			}
		}
		return filledCount;
	}

	function nextColumn(direction) {
		var currentColumn = direction === 1 ? currentColumnRight : currentColumnLeft;
		
		var next;
		if (columns[currentColumn.index + originIndex + direction] === undefined || columns[currentColumn.index + originIndex + direction].index !== currentColumn.index + direction) {
			next = createColumn(currentColumn.index + direction, direction);
		} else {
			next = columns[currentColumn.index + originIndex + direction];
		}

		if (direction === 1) {
			currentColumnRight = next;
		} else {
			currentColumnLeft = next;
		}

		if (filledCount(next) === viewportHeightCells) {
			next.full = true;
			nextColumn(direction);
		}
	}

	function createColumn(index, side) {

		// console.log('Grid.createColumn(',index, side,')');

		var column = [];
		for (var i = 0; i < viewportHeightCells; i++) {
			column.push({
				item: null,
				x: index,
				y: i
			});
		}

		if (side === -1) {
			originIndex ++;
			columns.unshift(column);
		} else if (side === 1) {
			columns.push(column);
		}

		column.full = false;
		column.index = index;

		return column;
	}


	// Interaction
	var xPosCell = 0;
	var xPosScreen = 0;
	var xVelocityScreenTarget = 0;
	var xVelocityScreenCurrent = 0;

	window.addEventListener('mousemove', function(event) {
		
		var x = event.clientX;
		var margin = viewportWidth*.1;

		if (x < margin) {
			xVelocityScreenTarget = 1 - x / margin;
		} else if(x > viewportWidth - margin) {
			xVelocityScreenTarget = - ( 1 - (viewportWidth - x) / margin);
		} else {
			xVelocityScreenTarget = 0;
		}

		xVelocityScreenTarget *= 4;
		
	});

	// Animation

	var timePrevious = 0;
	var deltaTimeValueTarget = 1000/60;

	function animate(time) {

		var deltaTimeValue = (time - timePrevious) / deltaTimeValueTarget;

		xVelocityScreenCurrent += (xVelocityScreenTarget - xVelocityScreenCurrent) * .2;

		xPosScreen += xVelocityScreenCurrent * deltaTimeValue;

		var newXPosCell = xPosScreen / cellWidthAdjusted;

		if (xVelocityScreenCurrent > 0) {
			var leftCell = Math.floor(newXPosCell);
			if (-leftCell < columnIndexMin + 1) {
				update(-1);
			}
		} else if(xVelocityScreenCurrent < 0) {
			var rightCell = - Math.floor(newXPosCell) + viewportWidthCells;
			if(rightCell > columnIndexMax + 1) {
				update(1);
			}
		} else if(currentColumnRight.index < viewportWidthCells) {
			update(1);
		}

		itemsEl.style.left = Math.round(xPosScreen) + 'px';

		timePrevious = time;

		raf(animate);
	}

	return {
		el : el
	};

}