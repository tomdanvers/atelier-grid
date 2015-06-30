module.exports = function(data, definitions) {
	console.log('GridImages(',data,')');

	var api = {
		onProgress: onProgress,
		onLoaded: onLoaded,
		resample: resample,
		getRandom: getRandom
	};

	var totalCount = data.length;
	var loadedCount = 0;

	var onLoadProgressCallback = null;
	var onLoadedCallback = null;

	var sourceImages = [];

	var resampledImages = [];
	var resampledImageMap = {};

	var currentCellWidth;
	var currentCellHeight;

	loadStart();

	function loadStart() {
		
		var img;
		for (var i = 0; i < data.length; i++) {
			img = document.createElement('img');
			img.src = data[i];
			img.addEventListener('error', onImageError);
			img.addEventListener('load', onImageLoaded);

		}
	}

	function onImageError(event) {

		console.warn('Could not load image from', event.target.src);

		incrementLoaded();
	}

	function onImageLoaded(event) {

		sourceImages.push(event.target);
		
		incrementLoaded();
		
	}

	function incrementLoaded() {
		if (++ loadedCount === totalCount) {
			loadComplete();
		} else {
			loadProgress(loadedCount/totalCount);
		}
	}

	function loadProgress(value) {

		console.log('GridImages.loadProgress(',value,')');

		if (onLoadProgressCallback) {
			onLoadProgressCallback(value);
		}

	}

	function loadComplete() {

		totalCount = sourceImages.length;

		console.log('GridImages.loadComplete()');

		if (onLoadedCallback) {
			onLoadedCallback();
		}

	}

	function onProgress(callback) {

		onLoadProgressCallback = callback;

		return api;
	}

	function onLoaded(callback) {
		
		onLoadedCallback = callback;

		return api;
	}

	function resample(cellWidth, cellHeight, padding) {
		
		if (cellWidth !== currentCellWidth || cellHeight !== currentCellHeight) {

			resampledImages = [];
			resampledImageMap = {};

			var definition;
			var resampled;
			var source;
			var canvas;
			var ctx;
			
			for (var i = 0; i < definitions.length; i++) {
				
				definition = definitions[i];

				resampled = [];

				for (var j = 0; j < sourceImages.length; j++) {

					source = sourceImages[j];
					
					if ((definition.width > definition.height && source.width > source.height) || (definition.width <= definition.height && source.width < source.height)) {
					
						canvas = document.createElement('canvas');
						canvas.width = Math.round(cellWidth * definition.width) - padding * 2;
						canvas.height = Math.round(cellHeight * definition.height) - padding * 2;

						ctx = canvas.getContext('2d');
						ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

						resampled.push(canvas);

					}

				}

				resampledImages.push(resampled);
				resampledImageMap[definition.id] = resampled;

			}

		}

		currentCellWidth = cellWidth;
		currentCellHeight = cellHeight;

	}

	function getRandom(definition) {

		if (definition === undefined) {
			console.warn('Can\'t get a random image without specifying a definition.')
		} else {
			var images = resampledImageMap[definition.id];
			var image = images[Math.floor(Math.random() * images.length)];
			var clone = document.createElement('canvas');
			clone.width = image.width;
			clone.height = image.height;
			clone.getContext('2d').drawImage(image, 0, 0)
			return clone;
		}
	}

	return api;
}