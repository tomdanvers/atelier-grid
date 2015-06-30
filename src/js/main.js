var Grid = require('./view/grid');

var imageData = [
	'/img/1.jpg',
	'/img/2.jpg',
	'/img/3.jpg',
	'/img/6.jpg'
];
var grid = new Grid(imageData);
document.body.appendChild(grid.el);