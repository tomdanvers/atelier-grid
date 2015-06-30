module.exports = function(data) {
	console.log('GridImages(',data,')');

	var api = {
		onLoaded: onLoaded,
		resample: resample
	};

	var totalCount = data.length;
	var loadedCount = 0;

	var onLoadedCallback = null;

	var sourceImages = [];

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

		if (loadedCount ++ === totalCount) {
			loadComplete();
		}
	}

	function onImageLoaded(event) {

		sourceImages.push(event.target);
		
		if (loadedCount ++ === totalCount) {
			loadComplete();
		}
	}

	function loadComplete() {

		totalCount = sourceImages.length;

		if (onLoadedCallback) {
			onLoadedCallback();
		}
	}

	function onLoaded(callback) {
		onLoadedCallback = callback;

		return api;
	}

	function resample() {
		
	}

	return api;
}